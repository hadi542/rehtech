
import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Lightbulb, AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface AIAdvisorProps {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactions.length === 0) {
      setInsights([]);
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      const data = await getFinancialInsights(transactions);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Financial Advisor</h2>
          <p className="text-slate-500 text-sm">Personalized insights based on your spending patterns</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Awaiting Data</h3>
          <p className="text-slate-500 max-w-md">
            Add at least one transaction to unlock AI-powered financial insights and recommendations tailored to your habits.
          </p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Analyzing your financial health...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                  {i === 0 ? <Lightbulb className="w-5 h-5" /> : i === 1 ? <Sparkles className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{insight.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                --
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Financial Health Score</h4>
                <p className="text-emerald-700 text-sm">Score will be calculated once more data is available.</p>
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 hidden sm:block opacity-20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
