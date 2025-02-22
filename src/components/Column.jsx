import React from "react";
import { useDrop } from "react-dnd";
import TaskItem from "./TaskItem";
import { Plus } from "lucide-react";

const Column = ({ category, tasks, onEdit, onDelete, onDropTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => onDropTask(item, null),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="bg-white rounded-lg shadow p-4"
      style={{
        minHeight: "100px",
        backgroundColor: isOver ? "#f0f0f0" : "white",
      }}
    >
      <h2 className="text-lg font-bold mb-4">{category}</h2>
      {tasks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center bg-gray-100 rounded-lg"
          style={{ minHeight: "100px" }}
        >
          <p className="text-gray-500">No tasks</p>
          <button className="flex items-center space-x-2 mt-2 text-blue-500 hover:underline">
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDropTask={(item) => onDropTask(item, task._id)}
          />
        ))
      )}
    </div>
  );
};

export default Column;
