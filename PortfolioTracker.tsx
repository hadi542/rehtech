
import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, PieChart as PieIcon, Loader2 } from 'lucide-react';
import { Investment } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { firebaseService } from '../services/firebase';

const PortfolioTracker: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newInv, setNewInv] = useState<Partial<Investment>>({ type: 'STOCK' });

  useEffect(() => {
    const fetch = async () => {
      const data = await firebaseService.getInvestments();
      setInvestments(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalValue = investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);
  const totalCost = investments.reduce((acc, inv) => acc + (inv.quantity * inv.buyPrice), 0);
  const totalPL = totalValue - totalCost;

  const chartData = investments.map(inv => ({
    name: inv.symbol,
    value: inv.quantity * inv.currentPrice
  }));

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

  const handleAdd = async () => {
    if (newInv.symbol && newInv.quantity && newInv.buyPrice) {
      const inv = await firebaseService.addInvestment({
        symbol: newInv.symbol.toUpperCase(),
        name: newInv.symbol.toUpperCase(),
        type: newInv.type as any,
        quantity: Number(newInv.quantity),
        buyPrice: Number(newInv.buyPrice),
        currentPrice: Number(newInv.buyPrice) * (1 + (Math.random() * 0.2 - 0.1))
      });
      setInvestments(prev => [...prev, inv as Investment]);
      setShowAdd(false);
      setNewInv({ type: 'STOCK' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this asset?')) {
      await firebaseService.deleteInvestment(id);
      setInvestments(prev => prev.filter(i => i.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3"><Briefcase className="text-indigo-600 w-8 h-8" /><h2 className="text-2xl font-bold dark:text-white">Investment Portfolio</h2></div>
        <button onClick={() => setShowAdd(true)} className="gradient-bg text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-lg"><Plus className="w-4 h-4 mr-2" /> Add Asset</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800"><p className="text-slate-500 text-sm mb-1">Total Value</p><p className="text-2xl font-bold dark:text-white">₹{totalValue.toLocaleString()}</p></div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800"><p className="text-slate-500 text-sm mb-1">Total P/L</p><p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{totalPL >= 0 ? '+' : ''}₹{totalPL.toLocaleString()}</p></div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800"><p className="text-slate-500 text-sm mb-1">Assets</p><p className="text-2xl font-bold dark:text-white">{investments.length}</p></div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase"><tr><th className="px-6 py-4">Asset</th><th className="px-6 py-4">Qty</th><th className="px-6 py-4">Avg Price</th><th className="px-6 py-4">Current</th><th className="px-6 py-4">P/L</th><th className="px-6 py-4"></th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {investments.map(inv => {
                  const pl = (inv.currentPrice - inv.buyPrice) * inv.quantity;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold dark:text-white">{inv.symbol}</td>
                      <td className="px-6 py-4 dark:text-slate-300">{inv.quantity}</td>
                      <td className="px-6 py-4 dark:text-slate-300">₹{inv.buyPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 dark:text-slate-300">₹{inv.currentPrice.toLocaleString()}</td>
                      <td className={`px-6 py-4 font-medium ${pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{pl >= 0 ? '+' : ''}₹{pl.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(inv.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  );
                })}
                {investments.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No assets added yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2"><PieIcon className="w-5 h-5 text-indigo-600" /> Distribution</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData.length ? chartData : [{name: 'Empty', value: 1}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}{!chartData.length && <Cell fill="#e2e8f0" />}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Add Asset</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Symbol (e.g. RELIANCE, BTC)" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.symbol || ''} onChange={e => setNewInv({...newInv, symbol: e.target.value})} />
              <select className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.type} onChange={e => setNewInv({...newInv, type: e.target.value as any})}><option value="STOCK">Stock</option><option value="CRYPTO">Crypto</option><option value="MUTUAL_FUND">Mutual Fund</option></select>
              <input type="number" placeholder="Quantity" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.quantity || ''} onChange={e => setNewInv({...newInv, quantity: e.target.value})} />
              <input type="number" placeholder="Buy Price" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.buyPrice || ''} onChange={e => setNewInv({...newInv, buyPrice: e.target.value})} />
              <div className="flex gap-3 pt-4"><button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border dark:border-slate-700 dark:text-white">Cancel</button><button onClick={handleAdd} className="flex-1 py-3 rounded-xl gradient-bg text-white font-bold">Add</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTracker;
