
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Calculator, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getLoanAdvice } from '../services/geminiService';
import { firebaseService } from '../services/firebase';

const LoanAdvisor: React.FC = () => {
  const [inputs, setInputs] = useState({ income: 50000, emi: 0, score: 750, purpose: 'Home Loan' });
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await firebaseService.getLoanData();
      if (data) setInputs({ income: data.income, emi: data.emi, score: data.score, purpose: data.purpose });
      setInitialLoad(false);
    };
    fetch();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    const data = await getLoanAdvice(inputs.income, inputs.emi, inputs.score, inputs.purpose);
    setAdvice(data);
    setLoading(false);
    await firebaseService.saveLoanData({ ...inputs, updatedAt: new Date().toISOString() });
  };

  if (initialLoad) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3"><BrainCircuit className="text-indigo-600 w-8 h-8" /><h2 className="text-2xl font-bold dark:text-white">AI Loan Intelligence</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2"><Calculator className="w-5 h-5 text-indigo-600" /> Input Details</h3>
          <div className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Income</label><input type="number" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={inputs.income} onChange={e => setInputs({...inputs, income: Number(e.target.value)})} /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Existing EMIs</label><input type="number" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={inputs.emi} onChange={e => setInputs({...inputs, emi: Number(e.target.value)})} /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Credit Score</label><input type="number" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={inputs.score} onChange={e => setInputs({...inputs, score: Number(e.target.value)})} /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Purpose</label><select className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={inputs.purpose} onChange={e => setInputs({...inputs, purpose: e.target.value})}><option>Home Loan</option><option>Personal Loan</option><option>Car Loan</option><option>Business Expansion</option></select></div>
            <button onClick={handleAnalyze} disabled={loading} className="w-full py-4 rounded-xl gradient-bg text-white font-bold shadow-lg flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Analyze Affordability'}</button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {advice ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-full"><div className="flex justify-between items-start mb-8"><h3 className="text-xl font-bold dark:text-white">AI Risk Analysis</h3><div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${advice.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600' : advice.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{advice.riskLevel === 'Low' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}{advice.riskLevel} Risk</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"><div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"><p className="text-slate-500 text-sm mb-1">Safe EMI Range</p><p className="text-2xl font-bold dark:text-white">{advice.safeEmiRange}</p></div><div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"><p className="text-slate-500 text-sm mb-1">Affordability Score</p><p className="text-2xl font-bold dark:text-white">{advice.affordabilityScore}/100</p></div></div><div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30"><h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Smart Repayment Strategy</h4><p className="text-indigo-800 dark:text-indigo-400 text-sm leading-relaxed">{advice.strategy}</p></div></div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center h-full"><BrainCircuit className="w-12 h-12 text-slate-300 mb-4" /><p className="text-slate-500">Enter your details and click analyze to get AI-powered loan recommendations.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanAdvisor;
