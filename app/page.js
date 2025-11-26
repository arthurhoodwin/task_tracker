"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [taskName, setTaskName] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [manualModal, setManualModal] = useState(false);

  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");

  const startTask = () => {
    if (!taskName.trim()) return;
    setActiveTask({ name: taskName, start: new Date(), elapsed: 0 });
    setTaskName("");
  };

  const stopTask = () => {
    if (!activeTask) return;
    const end = new Date();
    const diff = Math.floor((end - activeTask.start) / 1000);
    setCompleted([{ ...activeTask, end, diff }, ...completed]);
    setActiveTask(null);
  };

  useEffect(() => {
    if (!activeTask) return;
    const t = setInterval(() => {
      setActiveTask((p) => ({ ...p, elapsed: Math.floor((Date.now() - p.start) / 1000) }));
    }, 1000);
    return () => clearInterval(t);
  }, [activeTask]);

  const format = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const getTotalSeconds = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    return h * 3600 + m * 60 + s;
  };

  const addManual = () => {
    const now = new Date();
    const elapsedSec = getTotalSeconds();
    setCompleted([
      {
        name: taskName || "Без названия",
        start: now,
        end: new Date(now.getTime() + elapsedSec * 1000),
        diff: elapsedSec,
      },
      ...completed,
    ]);
    setTaskName("");
    setHours("0");
    setMinutes("0");
    setSeconds("0");
    setManualModal(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 text-white min-h-screen bg-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-6 tracking-wide"
      >
        Трекер задач
      </motion.h1>

      {/* Поле ввода */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 items-center">
        <input
          className="bg-gray-700 p-4 rounded-xl w-full focus:ring-2 ring-blue-400 outline-none transition"
          placeholder="Новая задача..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button
          onClick={startTask}
          className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-xl font-bold transition"
        >
          ▶
        </button>
        <button
          onClick={() => setManualModal(true)}
          className="bg-gray-600 hover:bg-gray-500 px-5 py-3 rounded-xl font-bold transition"
        >
          +
        </button>
      </motion.div>

      {/* Активная задача */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700 p-6 rounded-2xl border border-gray-600"
          >
            <div className="text-xl font-semibold">{activeTask.name}</div>
            <div className="text-blue-300 text-3xl font-extrabold mt-2">{format(activeTask.elapsed)}</div>
            <div className="text-gray-400 text-sm mt-1">{activeTask.start.toLocaleTimeString()} — ...</div>
            <button
              onClick={stopTask}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl font-bold transition"
            >
              Остановить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold mt-10">Выполненные задачи</h2>

      <div className="space-y-4">
        <AnimatePresence>
          {completed.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-700 p-5 rounded-2xl border border-gray-600"
            >
              <div className="text-lg font-medium">{t.name}</div>
              <div className="text-gray-400 text-sm">
                {t.start.toLocaleTimeString()} — {t.end.toLocaleTimeString()}
              </div>
              <div className="text-blue-300 font-bold text-lg mt-1">{format(t.diff)}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Модальное окно ручного добавления */}
      <AnimatePresence>
        {manualModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-700 p-6 rounded-2xl w-96"
            >
              <h3 className="text-xl font-bold mb-4">Добавить завершённую задачу</h3>
              <input
                className="w-full p-3 rounded-lg mb-3 bg-gray-600 outline-none"
                placeholder="Название задачи"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  min="0"
                  className="w-1/3 p-3 rounded-lg bg-gray-600 outline-none"
                  placeholder="часы"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-1/3 p-3 rounded-lg bg-gray-600 outline-none"
                  placeholder="минуты"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-1/3 p-3 rounded-lg bg-gray-600 outline-none"
                  placeholder="секунды"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setManualModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-400"
                >
                  Отмена
                </button>
                <button onClick={addManual} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">
                  Добавить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
