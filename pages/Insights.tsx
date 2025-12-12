import React, { useState } from 'react';
import { getLogs } from '../services/storage';
import { generateWeeklyInsights } from '../services/geminiService';
import { AIPersona } from '../types';
import { Sparkles, Brain, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

const Insights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<AIPersona>(AIPersona.PROFESSIONAL);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const logs = getLogs();
      const insights = await generateWeeklyInsights(logs, persona);
      setResult(insights);
    } catch (err) {
      setError("Failed to generate insights. Ensure API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const personas = Object.values(AIPersona);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-indigo-600" />
          AI Life Analyst
        </h1>
        <p className="text-slate-500">Uncover hidden patterns in your habits and logs.</p>
      </header>

      {/* Configuration */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Analyst Persona</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {personas.map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                persona === p 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:scale-[1.01]"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Brain size={20} /> Generate Weekly Report
            </>
          )}
        </button>
      </section>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-2">Executive Summary</h3>
            <p className="text-indigo-800 leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid gap-4">
            {result.insights?.map((insight: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  insight.type === 'pattern' ? 'bg-blue-100 text-blue-600' :
                  insight.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {insight.type === 'pattern' && <Zap size={24} />}
                  {insight.type === 'warning' && <AlertTriangle size={24} />}
                  {insight.type === 'recommendation' && <Lightbulb size={24} />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-slate-400 mb-1">{insight.type}</div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{insight.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{insight.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
