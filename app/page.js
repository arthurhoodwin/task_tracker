"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [taskName, setTaskName] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [manualModal, setManualModal] = useState(false);
  const [manualTime, setManualTime] = useState("00:00:00");

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

  const parseTime = (str) => {
    const [h, m, s] = str.split(":").map((n) => parseInt(n) || 0);
    return h * 3600 + m * 60 + s;
  };

  const handleTimeChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, "");
    if (val.length > 6) val = val.slice(0, 6);
    while (val.length < 6) val = "0" + val;
    const h = val.slice(0, 2);
    const m = val.slice(2, 4);
    const s = val.slice(4, 6);
    setManualTime(`${h}:${m}:${s}`);
  };

  const addManual = () => {
    const now = new Date();
    const elapsedSec = parseTime(manualTime);
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
    setManualTime("00:00:00");
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

      {/* Модальное окно */}
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
              <input
                className="w-full p-3 rounded-lg mb-3 bg-gray-600 outline-none"
                placeholder="Время (чч:мм:сс)"
                value={manualTime}
                onChange={handleTimeChange}
              />
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
