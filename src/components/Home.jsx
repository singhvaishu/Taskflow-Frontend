// src/pages/Home.jsx
import React from 'react';
import TaskForm from '../components/Taskform';
import TaskList from '../components/Tasklist';
import image from '../assets/taskmanger.png'; // Make sure this image exists

const Home = () => {
    return (
        <section className="min-h-screen bg-gray-100">
            {/* Top Section: Title */}
            <div className="container mx-auto px-6 pt-10">
                <h1 className="text-4xl font-bold text-center mb-10">Task Manager</h1>
            </div>

            {/* Middle Section: Image + Form */}
            <div className="container mx-auto px-6 pb-10">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Left Image */}
                    <div className="md:w-1/2 w-full h-64 md:h-[400px]">
                        <img
                            src={image}
                            alt="Task Manager"
                            className="w-full h-full object-cover "
                        />
                    </div>

                    {/* Right Form */}
                    <div className="md:w-1/2 w-full h-64 md:h-[400px]">
                        <TaskForm />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Task List */}
            <div className="container mx-auto px-6 pb-10">
                <TaskList />
            </div>
        </section>
    );
};

export default Home;
