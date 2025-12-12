import React, { useState, useEffect } from 'react';
import { DailyLog, Mood } from '../types';
import { getHabits as loadHabits, getLogs, saveLog } from '../services/storage';
import { Save, CheckCircle2, Circle, Moon, DollarSign, Frown, Meh, Smile } from 'lucide-react';

const Tracker: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<Mood | null>(null);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const habits = loadHabits();

  // Load existing log for selected date
  useEffect(() => {
    const logs = getLogs();
    const existing = logs.find(l => l.date === date);
    if (existing) {
      setMood(existing.mood);
      setSleepHours(existing.sleepHours || 7);
      setExpenseAmount(existing.expenseAmount.toString());
      setCompletedHabits(existing.completedHabits);
      setNotes(existing.notes);
    } else {
      // Reset defaults for new day
      setMood(null);
      setSleepHours(7);
      setExpenseAmount('');
      setCompletedHabits([]);
      setNotes('');
    }
    setSaved(false);
  }, [date]);

  const toggleHabit = (id: string) => {
    setCompletedHabits(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const log: DailyLog = {
      date,
      mood,
      sleepHours: Number(sleepHours),
      sleepQuality: 0, // Simplified for UI
      expenseAmount: Number(expenseAmount) || 0,
      completedHabits,
      notes
    };
    saveLog(log);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Daily Log</h1>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </header>

      {/* Mood Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">How are you feeling?</h3>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setMood(val as Mood)}
              className={`flex-1 h-16 rounded-xl flex items-center justify-center text-2xl transition-all ${
                mood === val 
                ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {val === 1 ? '😫' : val === 2 ? '😕' : val === 3 ? '😐' : val === 4 ? '🙂' : '🤩'}
            </button>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sleep Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Moon className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold">Sleep</h3>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" 
              max="14" 
              step="0.5" 
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-2xl font-bold w-16 text-center">{sleepHours}h</span>
          </div>
        </section>

        {/* Expenses Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <DollarSign className="text-emerald-500" size={20} />
            <h3 className="text-lg font-semibold">Daily Spend</h3>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input 
              type="number" 
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-lg font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </section>
      </div>

      {/* Habits Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Habits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                completedHabits.includes(habit.id)
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                  : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${habit.color.replace('text-', 'bg-opacity-20 ')}`}>
                  {habit.icon}
                </span>
                <span className={`font-medium ${completedHabits.includes(habit.id) ? 'text-indigo-900' : 'text-slate-600'}`}>
                  {habit.name}
                </span>
              </div>
              {completedHabits.includes(habit.id) ? (
                <CheckCircle2 className="text-indigo-600" size={20} />
              ) : (
                <Circle className="text-slate-300" size={20} />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any thoughts about today?"
        className="w-full h-24 bg-white border border-slate-200 rounded-2xl p-4 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
          saved ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
        }`}
      >
        {saved ? (
          <>
            <CheckCircle2 size={24} /> Saved!
          </>
        ) : (
          <>
            <Save size={24} /> Save Entry
          </>
        )}
      </button>
    </div>
  );
};

export default Tracker;