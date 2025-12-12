import { GoogleGenAI, Type } from "@google/genai";
import { DailyLog, AIPersona } from '../types';

const getSystemInstruction = (persona: AIPersona) => {
  const base = "You are LifeDash AI, a personal analytics assistant. Analyze the user's daily logs (mood, sleep, habits, expenses).";
  
  switch (persona) {
    case AIPersona.PROFESSIONAL:
      return `${base} Be data-driven, concise, and professional. Focus on correlations and actionable productivity metrics.`;
    case AIPersona.FRIENDLY:
      return `${base} Be warm, encouraging, and empathetic. Use emojis. Celebrate small wins.`;
    case AIPersona.TOUGH_LOVE:
      return `${base} Be direct and no-nonsense. Call out bad habits and excuses. Demand better performance.`;
    case AIPersona.POETIC:
      return `${base} Speak in metaphors and philosophical musings about the passage of time and the nature of self-improvement.`;
    case AIPersona.HUMOROUS:
      return `${base} Be witty, sarcastic, and funny. Roast the user gently for bad habits but keep it lighthearted.`;
    default:
      return base;
  }
};

export const generateWeeklyInsights = async (logs: DailyLog[], persona: AIPersona) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare data for context (last 14 days)
  const recentLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 14);
  const dataContext = JSON.stringify(recentLogs);

  const prompt = `
    Analyze the following JSON data representing my last 14 days of life (Mood 1-5, Sleep Hours, Expenses, Habits).
    
    Data: ${dataContext}
    
    Please provide 3 distinct insights:
    1. A pattern recognition (correlation between two metrics).
    2. A specific warning or area for improvement.
    3. A positive reinforcement or recommendation.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(persona),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['pattern', 'warning', 'recommendation'] },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                },
                required: ['type', 'title', 'content']
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
