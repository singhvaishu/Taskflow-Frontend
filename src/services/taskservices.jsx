import axios from 'axios';
const API_URL = 'http://localhost:5000/api/tasks';

export const fetchTasks = async (filter = 'all') => {
    const url = filter !== 'all' ? `${API_URL}?status=${filter}` : API_URL;
    const res = await axios.get(url);
    return res.data;
};

export const addTask = async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data; // return the new task
};



export const toggleTaskStatus = async (id) => {
    const res = await axios.put(`${API_URL}/${id}`);
    return res.data;
};
export const updateTask = async (id, data) => {
    const response = await axios.put(`${API_URL}/update/${id}`, data);
    return response.data; // must be the updated task
};



export const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const deleteAllTasks = async () => {
    await axios.delete(API_URL);
};