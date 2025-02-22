

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useAuth } from "../AuthProvider";

const TaskForm = ({ tasks, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (newTask) => axios.post("/tasks", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.uid]); 
      toast.success("Task added successfully! 🎉");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setCategory("To-Do");
    },
    onError: () => {
      toast.error("Oops! Something went wrong. Please try again. 😞");
    },
  });

  const handleAddTaskClick = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please log in",
        text: "You need to be logged in to add a new task.",
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      category,
      order: tasks.length,
      timestamp: new Date(),
      userId: user.uid,
    };
    mutate(newTask);
  };

  return (
    <div className="flex justify-end mx-3 lg:mx-10">
      <button
        onClick={handleAddTaskClick}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Plus className="h-4 w-4" />
        <span>Add New Task</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength="50"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength="200"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default TaskForm;
