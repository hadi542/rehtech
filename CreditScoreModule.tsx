
import React, { useState, useEffect } from 'react';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { getCreditTips } from '../services/geminiService';
import { firebaseService } from '../services/firebase';

const CreditScoreModule: React.FC = () => {
  const [score, setScore] = useState(720);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await firebaseService.getCreditHealth();
      if (data) setScore(data.score);
      setInitialLoad(false);
    };
    fetch();
  }, []);

  const getClassification = (s: number) => {
    if (s >= 800) return { label: 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (s >= 740) return { label: 'Very Good', color: 'text-indigo-500', bg: 'bg-indigo-50' };
    if (s >= 670) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (s >= 580) return { label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { label: 'Poor', color: 'text-rose-500', bg: 'bg-rose-50' };
  };

  const classification = getClassification(score);

  useEffect(() => {
    if (initialLoad) return;
    const fetchTips = async () => {
      setLoading(true);
      const data = await getCreditTips(score);
      setTips(data);
      setLoading(false);
      await firebaseService.saveCreditHealth({ score, updatedAt: new Date().toISOString() });
    };
    fetchTips();
  }, [score, initialLoad]);

  if (initialLoad) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
          <h3 className="text-lg font-bold mb-8 dark:text-white">Credit Health Gauge</h3>
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90"><circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100 dark:text-slate-800" /><circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * (score - 300)) / 550} strokeLinecap="round" className="text-indigo-600 transition-all duration-1000" /></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold dark:text-white">{score}</span><span className={`text-xs font-bold uppercase tracking-widest ${classification.color}`}>{classification.label}</span></div>
          </div>
          <input type="range" min="300" max="850" value={score} onChange={(e) => setScore(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          <p className="text-xs text-slate-500 mt-4">Drag to update your current score manually</p>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold dark:text-white">AI Improvement Tips</h3><Shield className="text-indigo-600 w-6 h-6" /></div>
          {loading ? <div className="flex items-center justify-center h-48"><Loader2 className="animate-spin text-indigo-600" /></div> : (
            <div className="space-y-4">{tips.map((tip, i) => (<div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex gap-4 items-start"><div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4" /></div><p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{tip}</p></div>))}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditScoreModule;
