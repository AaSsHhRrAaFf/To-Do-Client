// D:\PH-Assignments\Job-Task\task-management\src\components\TaskBoard.jsx

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

const TaskBoard = ({
  tasks,
  onEdit,
  onDelete,
  onDragEnd,
  isLoading,
  error,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>Failed to load tasks. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[80vh]">
            {["To-Do", "In Progress", "Done"].map((category) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded-lg shadow p-4 min-h-[100px]"
                  >
                    <h2 className="text-lg font-bold mb-4">{category}</h2>
                    {tasks
                      .filter((task) => task.category === category)
                      .sort((a, b) => a.order - b.order)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4"
                            >
                              <TaskItem
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default TaskBoard;
