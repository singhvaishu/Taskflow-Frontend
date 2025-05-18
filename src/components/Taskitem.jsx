import React from 'react';
import { deleteTask, toggleTaskStatus, fetchTasks } from '../services/taskservices';
import { useTasks } from '../context/Taskcontext';

const TaskItem = ({ task }) => {
    const { setTasks, filter } = useTasks();

    const handleToggle = async () => {
        await toggleTaskStatus(task._id);
        const updated = await fetchTasks(filter);
        setTasks(updated);
    };

    const handleDelete = async () => {
        await deleteTask(task._id);
        const updated = await fetchTasks(filter);
        setTasks(updated);
    };

    return (
        <li className="border p-3 mb-2 flex justify-between items-start">
            <div>
                <h2
                    className={`font-semibold ${task.completed ? 'line-through text-green-600' : ''}`}
                >
                    {task.title}
                </h2>
                <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="space-x-2">
                <button
                    onClick={handleToggle}
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                    {task.completed ? 'Undo' : 'Done'}
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default TaskItem;
