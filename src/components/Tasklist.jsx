import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/Taskcontext';
import { fetchTasks, deleteTask, deleteAllTasks, updateTask } from '../services/taskservices';
import { Pencil, Trash2, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const TaskList = () => {
    const { tasks, setTasks } = useTasks([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks(filter);
                setTasks(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                setTasks([]);
            }
        };
        loadTasks();
    }, [filter, setTasks]);

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
            toast.success('Task deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllTasks();
            setTasks([]);
            toast.success('All tasks deleted successfully!');
        } catch (error) {
            console.error('Delete all failed:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };
    const submitEdit = async () => {
        try {
            const currentTask = tasks.find(t => t._id === editingTask._id);

            const updatedPayload = {
                title: editTitle,
                description: editDescription,
                status: currentTask?.status || editingTask.status,
            };

            console.log("🛠️ Submitting edit with:", updatedPayload);

            const updated = await updateTask(editingTask._id, updatedPayload);

            console.log("✅ Updated task from backend:", updated);

            setTasks(prevTasks =>
                prevTasks.map(task => (task._id === updated._id ? updated : task))
            );

            setEditingTask(null);
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error("❌ Update failed:", error);
            toast.error("Failed to update task");
        }
    };




    const filteredTasks = tasks.filter(task =>
        task && task.title && task.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleStatus = async (id) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${id}`);
            const updated = res.data;

            // Update task in the list
            setTasks(prev => prev.map(t => t._id === id ? updated : t));
            toast.success('Status updated!');
        } catch (err) {
            console.error("Toggle failed", err);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                <h2 className="text-2xl font-bold">Tasks List</h2>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={handleDeleteAll}
                        className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                    >
                        <Trash className="mr-1 w-4 h-4" /> Delete All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTasks.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">No tasks found.</p>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task._id} className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-purple-500 flex flex-col justify-between h-full">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                                <p className="text-gray-600 mt-1">{task.description}</p>
                                <span
                                    onClick={() => handleToggleStatus(task._id)}
                                    className={`inline-block mt-3 px-4 py-2 rounded-full text-base font-semibold capitalize cursor-pointer transition-all duration-300 ${task.status === 'completed' ? 'bg-green-200 text-green-800'
                                        : task.status === 'ongoing' ? 'bg-blue-200 text-blue-800'
                                            : task.status === 'pending' ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {task.status || 'Unknown'}
                                </span>

                            </div>
                            <div className="flex justify-between items-center mt-auto pt-2">
                                <button onClick={() => handleEdit(task)} title="Edit">
                                    <Pencil className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                                </button>
                                <button onClick={() => handleToggleStatus(task._id)} title="Toggle Status">
                                    <span className="text-sm text-purple-600 hover:underline">Toggle</span>
                                </button>
                                <button onClick={() => handleDelete(task._id)} title="Delete">
                                    <Trash2 className="text-red-600 hover:text-red-800 cursor-pointer" />
                                </button>
                            </div>
                        </div>

                    ))
                )}
            </div>

            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Edit Task</h3>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full border mb-3 px-3 py-2 rounded"
                        />
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full border mb-4 px-3 py-2 rounded h-24"
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingTask(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                            <button onClick={submitEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
