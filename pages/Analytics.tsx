import React from 'react';
import { getLogs } from '../services/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';

const Analytics: React.FC = () => {
  const logs = getLogs().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  // Last 30 days
  const data = logs.slice(-30);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500">Visualizing your last 30 days.</p>
      </header>

      {/* Mood vs Sleep Correlation */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Mood & Sleep Correlation</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => new Date(val).getDate().toString()} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis yAxisId="left" domain={[0, 6]} hide />
              <YAxis yAxisId="right" orientation="right" domain={[0, 12]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Bar yAxisId="right" dataKey="sleepHours" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Sleep (hrs)" barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} name="Mood (1-5)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-slate-400 mt-4">Blue bars = Sleep, Purple line = Mood</p>
      </section>

      {/* Spending Trend */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Spending Habits</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => new Date(val).getDate().toString()} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8' }}
              />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 formatter={(value) => [`$${value}`, 'Spent']}
              />
              <Area type="monotone" dataKey="expenseAmount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Habit Completion Heatmap (Simplified as Grid) */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Habit Consistency</h3>
        <div className="grid grid-cols-7 gap-2">
           {/* Headers */}
           {['S','M','T','W','T','F','S'].map((d, i) => (
             <div key={i} className="text-center text-xs text-slate-400 font-bold">{d}</div>
           ))}
           {/* Days */}
           {data.slice(-14).map((d, i) => {
             const completionRate = d.completedHabits.length / 5; // Assuming 5 total habits
             let bgClass = 'bg-slate-100';
             if (completionRate > 0.8) bgClass = 'bg-indigo-600';
             else if (completionRate > 0.5) bgClass = 'bg-indigo-400';
             else if (completionRate > 0.2) bgClass = 'bg-indigo-200';
             
             return (
               <div key={i} className="aspect-square rounded-md flex items-center justify-center relative group">
                  <div className={`w-full h-full rounded-md ${bgClass}`}></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {new Date(d.date).toLocaleDateString()}
                  </div>
               </div>
             );
           })}
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">Last 14 days intensity</p>
      </section>
    </div>
  );
};

export default Analytics;
