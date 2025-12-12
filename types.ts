export type Mood = 1 | 2 | 3 | 4 | 5; // 1: Awful, 5: Amazing

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  mood: Mood | null;
  sleepHours: number | null;
  sleepQuality: number | null; // 1-10
  expenseAmount: number;
  completedHabits: string[]; // Array of Habit IDs
  notes: string;
}

export interface UserProfile {
  name: string;
  goals: string[];
  streak: number;
}

export enum AIPersona {
  PROFESSIONAL = 'Professional Analyst',
  FRIENDLY = 'Supportive Friend',
  TOUGH_LOVE = 'Tough Coach',
  POETIC = 'Philosopher',
  HUMOROUS = 'Comedian'
}

export interface AIInsight {
  id: string;
  date: string;
  type: 'pattern' | 'warning' | 'recommendation' | 'praise';
  content: string;
  persona: AIPersona;
}
