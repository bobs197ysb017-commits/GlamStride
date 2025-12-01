import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, ListTodo } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'تحليل صيحات السوق', completed: true },
    { id: 2, text: 'تصميم شعار المتجر', completed: false },
    { id: 3, text: 'إنشاء وصف المنتجات', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <ListTodo className="text-violet-400" size={20} />
          </div>
          <h3 className="font-bold text-white text-lg">المهام</h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
          {tasks.filter(t => t.completed).length}/{tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto min-h-[150px] space-y-2 mb-4 custom-scrollbar pl-2">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`group flex items-center gap-3 p-2 rounded-lg border transition-all ${
              task.completed 
                ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 transition-colors">
              {task.completed 
                ? <CheckCircle2 size={18} className="text-emerald-500" /> 
                : <Circle size={18} className="text-slate-500 group-hover:text-violet-400" />
              }
            </button>
            <span className={`flex-1 text-sm truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {task.text}
            </span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-opacity p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
             <p className="text-sm">لا توجد مهام</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-slate-800">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="مهمة جديدة..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskBoard;