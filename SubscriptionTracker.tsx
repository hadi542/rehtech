
import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Calendar, Trash2, Bell, Loader2 } from 'lucide-react';
import { Subscription } from '../types';
import { firebaseService } from '../services/firebase';

const SubscriptionTracker: React.FC = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSub, setNewSub] = useState<Partial<Subscription>>({ billingCycle: 'MONTHLY' });

  useEffect(() => {
    const fetch = async () => {
      const data = await firebaseService.getSubscriptions();
      setSubs(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalMonthly = subs.reduce((acc, s) => acc + (s.billingCycle === 'MONTHLY' ? s.cost : s.cost / 12), 0);

  const handleAdd = async () => {
    if (newSub.name && newSub.cost && newSub.nextRenewal) {
      await firebaseService.addSubscription({
        name: newSub.name,
        cost: Number(newSub.cost),
        billingCycle: newSub.billingCycle as any,
        nextRenewal: newSub.nextRenewal
      });
      const data = await firebaseService.getSubscriptions();
      setSubs(data);
      setShowAdd(false);
      setNewSub({ billingCycle: 'MONTHLY' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this subscription?')) {
      await firebaseService.deleteSubscription(id);
      setSubs(prev => prev.filter(s => s.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3"><Repeat className="text-indigo-600 w-8 h-8" /><h2 className="text-2xl font-bold dark:text-white">Subscriptions</h2></div>
        <button onClick={() => setShowAdd(true)} className="gradient-bg text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-lg"><Plus className="w-4 h-4 mr-2" /> Add Subscription</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none"><p className="text-indigo-100 text-sm mb-1">Monthly Burn</p><p className="text-4xl font-bold mb-6">₹{Math.round(totalMonthly).toLocaleString()}</p><div className="p-4 bg-white/10 rounded-2xl border border-white/20"><p className="text-xs text-indigo-100 leading-relaxed">You are spending ₹{Math.round(totalMonthly * 12).toLocaleString()} annually on recurring services.</p></div></div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {subs.map(sub => (
            <div key={sub.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
              <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600"><Bell className="w-6 h-6" /></div><div><h3 className="font-bold dark:text-white">{sub.name}</h3><p className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Next: {sub.nextRenewal}</p></div></div>
              <div className="text-right"><p className="font-bold dark:text-white">₹{sub.cost.toLocaleString()}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest">{sub.billingCycle}</p><button onClick={() => handleDelete(sub.id)} className="mt-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          ))}
          {subs.length === 0 && <div className="md:col-span-2 py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">No subscriptions tracked yet.</div>}
        </div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Add Subscription</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Service Name (e.g. Netflix)" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSub.name || ''} onChange={e => setNewSub({...newSub, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Cost (₹)" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSub.cost || ''} onChange={e => setNewSub({...newSub, cost: Number(e.target.value)})} /><select className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSub.billingCycle} onChange={e => setNewSub({...newSub, billingCycle: e.target.value as any})}><option value="MONTHLY">Monthly</option><option value="YEARLY">Yearly</option></select></div>
              <input type="date" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newSub.nextRenewal || ''} onChange={e => setNewSub({...newSub, nextRenewal: e.target.value})} />
              <div className="flex gap-3 pt-4"><button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border dark:border-slate-700 dark:text-white">Cancel</button><button onClick={handleAdd} className="flex-1 py-3 rounded-xl gradient-bg text-white font-bold">Add</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTracker;
