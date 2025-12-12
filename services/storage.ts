import { DailyLog, Habit, UserProfile } from '../types';

const LOGS_KEY = 'lifedash_logs';
const HABITS_KEY = 'lifedash_habits';
const PROFILE_KEY = 'lifedash_profile';

export const defaultHabits: Habit[] = [
  { id: 'h1', name: 'Morning Meditation', icon: '🧘', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'h2', name: 'Read 30 mins', icon: '📚', color: 'bg-blue-100 text-blue-600' },
  { id: 'h3', name: 'Workout', icon: '💪', color: 'bg-rose-100 text-rose-600' },
  { id: 'h4', name: 'Drink 2L Water', icon: '💧', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'h5', name: 'No Sugar', icon: '🚫', color: 'bg-emerald-100 text-emerald-600' },
];

export const getLogs = (): DailyLog[] => {
  const stored = localStorage.getItem(LOGS_KEY);
  if (!stored) return seedData();
  return JSON.parse(stored);
};

export const saveLog = (log: DailyLog) => {
  const logs = getLogs();
  const existingIndex = logs.findIndex(l => l.date === log.date);
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getHabits = (): Habit[] => {
  const stored = localStorage.getItem(HABITS_KEY);
  return stored ? JSON.parse(stored) : defaultHabits;
};

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : { name: 'Alex', goals: ['Sleep 8h', 'Save $500/mo'], streak: 12 };
};

// Seed 30 days of mock data for visualization
const seedData = (): DailyLog[] => {
  const logs: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Generate semi-realistic patterns
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const moodBase = isWeekend ? 4 : 3;
    const mood = Math.min(5, Math.max(1, moodBase + Math.floor(Math.random() * 3) - 1)) as 1|2|3|4|5;
    const sleep = isWeekend ? 7 + Math.random() * 2 : 6 + Math.random() * 1.5;
    const expense = isWeekend ? 50 + Math.random() * 100 : 10 + Math.random() * 30;
    
    logs.push({
      date: dateStr,
      mood,
      sleepHours: Number(sleep.toFixed(1)),
      sleepQuality: Math.floor(Math.random() * 4) + 6,
      expenseAmount: Number(expense.toFixed(2)),
      completedHabits: Math.random() > 0.5 ? ['h1', 'h3'] : ['h2', 'h4'],
      notes: "Auto-generated history."
    });
  }
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return logs;
};
