import React, { useMemo } from 'react';
import { getLogs, getUserProfile } from '../services/storage';
import { Activity, Moon, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const logs = getLogs();
  const profile = getUserProfile();
  
  // Calculate stats for today/recent
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  
  const last7Days = useMemo(() => {
    return logs
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
  }, [logs]);

  const avgMood = (last7Days.reduce((acc, curr) => acc + (curr.mood || 0), 0) / last7Days.length).toFixed(1);
  const totalSpent = last7Days.reduce((acc, curr) => acc + curr.expenseAmount, 0).toFixed(0);
  const avgSleep = (last7Days.reduce((acc, curr) => acc + (curr.sleepHours || 0), 0) / last7Days.length).toFixed(1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good Morning, {profile.name}</h1>
          <p className="text-slate-500 mt-1">Here's your life glance for today.</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Current Streak</div>
          <div className="text-2xl font-bold text-indigo-600 flex items-center justify-end gap-1">
            <Activity className="w-5 h-5" />
            {profile.streak} Days
          </div>
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Avg Mood (7d)</span>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-800">{avgMood}</span>
            <span className="text-slate-400 text-sm ml-1">/ 5</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Avg Sleep</span>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Moon size={18} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-800">{avgSleep}</span>
            <span className="text-slate-400 text-sm ml-1">hrs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Spent (7d)</span>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-800">${totalSpent}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-sm font-medium">Today's Log</span>
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-sm font-medium text-slate-600">
            {todayLog ? '✅ Logged' : '❌ Not logged'}
          </div>
        </div>
      </div>

      {/* Quick Visual: Mood vs Sleep Trend */}
      <section className="bg-white p-6 rounded-3xl shadow-lg shadow-indigo-500/5 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Mood Flow</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9', radius: 8 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="mood" radius={[8, 8, 8, 8]}>
                {last7Days.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.mood && entry.mood >= 4 ? '#818cf8' : entry.mood && entry.mood <= 2 ? '#cbd5e1' : '#a5b4fc'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Active Goals */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Focus Goals</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {profile.goals.map((goal, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
              <span className="font-medium text-slate-700">{goal}</span>
              <div className="w-8 h-8 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-indigo-500 rounded-full opacity-20"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
