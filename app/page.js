"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [taskName, setTaskName] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [completed, setCompleted] = useState([]);

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

  const format = (s) => `${Math.floor(s/3600)}ч ${Math.floor((s%3600)/60)}м ${s%60}с`;

  const addManual = () => {
    const now = new Date();
    setCompleted([{ name: taskName || "Без названия", start: now, end: now, diff: 0 }, ...completed]);
    setTaskName("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl mb-4">Трекер задач</h1>

      <div className="flex gap-3">
        <input
          className="bg-neutral-800 p-3 rounded w-full"
          placeholder="Новая задача..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button onClick={startTask} className="bg-blue-600 px-4 py-2 rounded">▶</button>
        <button onClick={addManual} className="bg-neutral-700 px-4 py-2 rounded">+</button>
      </div>

      {activeTask && (
        <div className="bg-neutral-900 p-4 rounded">
          <div className="text-lg">{activeTask.name}</div>
          <div className="text-blue-400 text-xl font-bold">{format(activeTask.elapsed)}</div>
          <div className="text-neutral-400 text-sm mt-1">
            {activeTask.start.toLocaleTimeString()} — ...
          </div>
          <button onClick={stopTask} className="mt-3 bg-red-600 px-3 py-2 rounded w-full">Остановить</button>
        </div>
      )}

      <h2 className="text-xl">Выполненные задачи</h2>

      {completed.length === 0 && <div className="text-neutral-500">Выполненных задач нет</div>}

      <div className="space-y-3">
        {completed.map((t, i) => (
          <div key={i} className="bg-neutral-900 p-4 rounded">
            <div>{t.name}</div>
            <div className="text-neutral-400 text-sm">{t.start.toLocaleTimeString()} — {t.end.toLocaleTimeString()}</div>
            <div className="text-blue-400 font-bold">{format(t.diff)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}