import React, { useState } from 'react';
import { useTasks } from '../context/Taskcontext';
import { addTask } from '../services/taskservices';

const TaskForm = () => {
    const { setTasks } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title must be added.';
        if (!description.trim()) newErrors.description = 'Description must be added.';
        if (!status) newErrors.status = 'Status must be selected.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const newTask = { title, description, status };
            const createdTask = await addTask(newTask);
            setTasks((prev) => [...prev, createdTask]);

            setTitle('');
            setDescription('');
            setStatus('pending');
            setErrors({});
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 md:p-8 rounded-2xl "
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New Task</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter task title"
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="mb-4">
                <textarea
                    placeholder="Enter task description"
                    rows="4"
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="mb-4">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white"
                >
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
            >
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
