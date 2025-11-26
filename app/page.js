"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [newTask, setNewTask] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const [finishedTasks, setFinishedTasks] = useState([]);

  function handleStart() {
    if (!newTask.trim()) return;
    setCurrentTask({ title: newTask, startedAt: new Date(), secondsPassed: 0 });
    setNewTask("");
  }

  function handleStop() {
    if (!currentTask) return;
    const stoppedAt = new Date();
    const duration = Math.floor((stoppedAt - currentTask.startedAt) / 1000);
    setFinishedTasks([{ ...currentTask, stoppedAt, duration }, ...finishedTasks]);
    setCurrentTask(null);
  }

  useEffect(() => {
    if (!currentTask) return;
    const timer = setInterval(() => {
      setCurrentTask((prev) => ({
        ...prev,
        secondsPassed: Math.floor((Date.now() - prev.startedAt) / 1000),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTask]);

  function showTime(sec) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours}ч ${minutes}м ${seconds}с`;
  }

  function addTaskManually() {
    const now = new Date();
    setFinishedTasks([
      { title: newTask || "Без названия", startedAt: now, stoppedAt: now, duration: 0 },
      ...finishedTasks,
    ]);
    setNewTask("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 p-8 text-white max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-6"
      >
        Мой трекер задач
      </motion.h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Введите задачу"
          className="bg-neutral-800 rounded-xl p-4 w-full outline-none focus:ring-2 ring-blue-500 transition"
        />
        <button
          onClick={handleStart}
          className="px-5 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
        >
          ▶
        </button>
        <button
          onClick={addTaskManually}
          className="px-5 py-3 bg-neutral-700 rounded-xl font-bold hover:bg-neutral-600"
        >
          +
        </button>
      </motion.div>

      <AnimatePresence>
        {currentTask && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 p-6 rounded-2xl shadow-xl border border-neutral-700 mb-6"
          >
            <div className="text-xl font-semibold">{currentTask.title}</div>
            <div className="text-blue-400 text-3xl font-extrabold mt-2">{showTime(currentTask.secondsPassed)}</div>
            <div className="text-neutral-400 text-sm mt-1">{currentTask.startedAt.toLocaleTimeString()} — ...</div>
            <button
              onClick={handleStop}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold shadow-lg"
            >
              Остановить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold mb-4">Завершённые задачи</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {finishedTasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25 }}
              className="bg-neutral-900 p-5 rounded-2xl border border-neutral-700 hover:border-neutral-500"
            >
              <div className="text-lg font-medium">{task.title}</div>
              <div className="text-neutral-500 text-sm">
                {task.startedAt.toLocaleTimeString()} — {task.stoppedAt.toLocaleTimeString()}
              </div>
              <div className="text-blue-400 font-bold mt-1">{showTime(task.duration)}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
