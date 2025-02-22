

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import axios from "./api/axiosInstance";
import Navbar from "./components/shared/Navbar";
import TaskBoard from "./components/TaskBoard";
import TaskForm from "./components/TaskForm";
import { useAuth } from "./AuthProvider";

function App() {
  const queryClient = useQueryClient();
  const { user } = useAuth(); 

  // WebSocket setup for real-time updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.on("tasksUpdated", () => {
      queryClient.invalidateQueries(["tasks", user?.uid]);
    });
    return () => socket.disconnect();
  }, [queryClient, user]);

  // Fetch tasks for the current user
  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks", user?.uid], 
    queryFn: async () => {
      if (!user) return []; 
      const response = await axios.get("/tasks");
      return response.data;
    },
    enabled: !!user, 
  });

  // Mutations for CRUD operations
  const addTaskMutation = useMutation({
    mutationFn: (newTask) =>
      axios.post("/tasks", newTask).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user?.uid]),
  });

  const editTaskMutation = useMutation({
    mutationFn: ({ taskId, updatedTask }) =>
      axios.put(`/tasks/${taskId}`, updatedTask).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user?.uid]),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => axios.delete(`/tasks/${taskId}`),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user?.uid]),
  });

  const handleTaskSubmit = (newTask) => {
    addTaskMutation.mutate(newTask, {
      onSuccess: (data) => {
        queryClient.setQueryData(["tasks", user?.uid], (old) => [...old, data]);
      },
    });
  };

  const handleTaskEdit = (taskId, updatedTask) => {
    editTaskMutation.mutate({ taskId, updatedTask });
  };

  const handleTaskDelete = (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;
    const updatedTasks = [...tasks];

    if (sourceCategory === destCategory) {
      const categoryTasks = updatedTasks
        .filter((t) => t.category === sourceCategory)
        .sort((a, b) => a.order - b.order);
      const [movedTask] = categoryTasks.splice(source.index, 1);
      categoryTasks.splice(destination.index, 0, movedTask);
      categoryTasks.forEach((task, index) => (task.order = index));

      updatedTasks.forEach((task) => {
        const updatedTask = categoryTasks.find((t) => t._id === task._id);
        if (updatedTask) task.order = updatedTask.order;
      });
    } else {
      const sourceTasks = updatedTasks
        .filter((t) => t.category === sourceCategory)
        .sort((a, b) => a.order - b.order);
      const destTasks = updatedTasks
        .filter((t) => t.category === destCategory)
        .sort((a, b) => a.order - b.order);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.category = destCategory;
      destTasks.splice(destination.index, 0, movedTask);

      sourceTasks.forEach((task, index) => (task.order = index));
      destTasks.forEach((task, index) => (task.order = index));

      updatedTasks.forEach((task) => {
        const updatedSourceTask = sourceTasks.find((t) => t._id === task._id);
        const updatedDestTask = destTasks.find((t) => t._id === task._id);
        if (updatedSourceTask) task.order = updatedSourceTask.order;
        else if (updatedDestTask) {
          task.category = updatedDestTask.category;
          task.order = updatedDestTask.order;
        }
      });
    }

    queryClient.setQueryData(["tasks", user?.uid], updatedTasks);
    axios.put("/tasks/reorder", { tasks: updatedTasks });
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-center text-3xl font-bold underline my-4">
        Task Management
      </h1>
      <TaskForm onSubmit={handleTaskSubmit} tasks={tasks} />
      <TaskBoard
        tasks={tasks}
        onEdit={handleTaskEdit}
        onDelete={handleTaskDelete}
        onDragEnd={handleDragEnd}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default App;
