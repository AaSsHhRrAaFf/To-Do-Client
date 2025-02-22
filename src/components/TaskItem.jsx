// D:\PH-Assignments\Job-Task\task-management\src\components\TaskItem.jsx

import React, { useState } from "react";
import { Edit, Trash, Save, X } from "lucide-react";
import Swal from "sweetalert2";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(task._id, editedTask);
    setIsEditing(false);
    Swal.fire({
      icon: "success",
      title: "Task Updated!",
      text: "Your task has been successfully updated.",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDeleteClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(task._id);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-lg">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleEditChange}
            className="w-full text-lg font-semibold border-b-2 border-gray-200 focus:border-blue-500 outline-none"
            placeholder="Task title"
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleEditChange}
            className="w-full text-sm text-gray-600 border-b-2 border-gray-200 focus:border-blue-500 outline-none resize-none"
            placeholder="Task description"
            rows="2"
          />
          <select
            name="category"
            value={editedTask.category}
            onChange={handleEditChange}
            className="w-full text-sm text-gray-500 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {task.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{task.description}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-1 text-blue-500 hover:text-blue-700"
            >
              <Edit className="h-5 w-5 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center px-3 py-1 text-red-500 hover:text-red-700"
            >
              <Trash className="h-5 w-5 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
