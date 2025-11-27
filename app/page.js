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
    return `${h}ч ${m}м ${sec}с`;
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
    <div className="p-6 max-w-xl mx-auto space-y-8">

      <div className="flex items-center gap-3">
        <input
          className="bg-[#0A0A0A] border border-[#222] text-sm px-4 py-3 rounded-xl w-full"
          placeholder="Новая задача..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button
          onClick={startTask}
          className="bg-[#111] border border-[#222] px-4 py-3 rounded-xl"
        >
          ▶
        </button>
      </div>

      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-b border-[#222] pb-4"
          >
            <div className="text-base">{activeTask.name}</div>
            <div className="text-blue-400 text-xl mt-1">{format(activeTask.elapsed)}</div>
            <div className="text-gray-500 text-xs mt-1">
              {activeTask.start.toLocaleTimeString()} — ...
            </div>
            <button
              onClick={stopTask}
              className="mt-3 bg-[#300] px-4 py-2 rounded-lg w-full"
            >
              Остановить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Выполненные задачи</h2>
        <button
          onClick={() => setManualModal(true)}
          className="text-xl px-3 py-1 bg-[#111] border border-[#222] rounded-xl"
        >
          +
        </button>
      </div>

      <div className="space-y-5">
        {completed.map((t, i) => (
          <div key={i} className="border-b border-[#222] pb-4">
            <div className="text-base">{t.name}</div>
            <div className="text-gray-600 text-xs mt-1">
              {t.start.toLocaleTimeString()} — {t.end.toLocaleTimeString()}
            </div>
            <div className="text-blue-400 text-base mt-1">{format(t.diff)}</div>
          </div>
        ))}
      </div>

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
              className="bg-[#111] p-6 rounded-2xl w-80 border border-[#333]"
            >
              <h3 className="text-lg mb-4">Добавить задачу</h3>
              <input
                className="w-full p-3 rounded-lg mb-3 bg-[#222] outline-none"
                placeholder="Название задачи"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  min="0"
                  className="w-1/3 p-3 rounded-lg bg-[#222] outline-none"
                  placeholder="ч"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-1/3 p-3 rounded-lg bg-[#222] outline-none"
                  placeholder="м"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-1/3 p-3 rounded-lg bg-[#222] outline-none"
                  placeholder="с"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setManualModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#333]"
                >
                  Отмена
                </button>
                <button onClick={addManual} className="px-4 py-2 rounded-lg bg-blue-600">
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
