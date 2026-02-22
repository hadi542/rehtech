
import React, { useState, useEffect } from 'react';
import { Target, Plus, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Transaction, TransactionType, BudgetGoal } from '../types';
import { CATEGORIES } from '../constants';
import { firebaseService } from '../services/firebase';

interface BudgetSystemProps {
  transactions: Transaction[];
}

const BudgetSystem: React.FC<BudgetSystemProps> = ({ transactions }) => {
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBudget, setNewBudget] = useState({ category: CATEGORIES[0], limit: 0 });

  useEffect(() => {
    const fetch = async () => {
      const data = await firebaseService.getBudgets();
      setBudgets(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const getSpent = (cat: string) => {
    return transactions
      .filter(t => t.category === cat && t.type === TransactionType.SEND)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const handleAdd = async () => {
    if (newBudget.limit > 0) {
      await firebaseService.saveBudget({ category: newBudget.category, limit: newBudget.limit, spent: 0 });
      const data = await firebaseService.getBudgets();
      setBudgets(data);
      setShowAdd(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3"><Target className="text-indigo-600 w-8 h-8" /><h2 className="text-2xl font-bold dark:text-white">Budget Goals</h2></div>
        <button onClick={() => setShowAdd(true)} className="gradient-bg text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-lg"><Plus className="w-4 h-4 mr-2" /> Set Budget</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map(budget => {
          const spent = getSpent(budget.category);
          const percent = Math.min(100, (spent / budget.limit) * 100);
          const isOver = spent > budget.limit;
          return (
            <div key={budget.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4"><div><h3 className="font-bold dark:text-white">{budget.category}</h3><p className="text-xs text-slate-500">Monthly Limit: ₹{budget.limit.toLocaleString()}</p></div>{isOver ? <AlertTriangle className="text-rose-500 w-5 h-5" /> : <CheckCircle2 className="text-emerald-500 w-5 h-5" />}</div>
              <div className="flex justify-between text-sm mb-2"><span className="text-slate-500 dark:text-slate-400">Spent: ₹{spent.toLocaleString()}</span><span className={`font-bold ${isOver ? 'text-rose-500' : 'text-indigo-600'}`}>{Math.round(percent)}%</span></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isOver ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div></div>
              {isOver && <p className="text-xs text-rose-500 mt-3 font-medium">Alert: You have exceeded your budget for this category!</p>}
            </div>
          );
        })}
        {budgets.length === 0 && <div className="md:col-span-2 py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">No budgets set. Start by setting a monthly limit for a category.</div>}
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Set Category Budget</h3>
            <div className="space-y-4">
              <select className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newBudget.category} onChange={e => setNewBudget({...newBudget, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <input type="number" placeholder="Monthly Limit (₹)" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newBudget.limit || ''} onChange={e => setNewBudget({...newBudget, limit: Number(e.target.value)})} />
              <div className="flex gap-3 pt-4"><button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border dark:border-slate-700 dark:text-white">Cancel</button><button onClick={handleAdd} className="flex-1 py-3 rounded-xl gradient-bg text-white font-bold">Set Budget</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetSystem;
