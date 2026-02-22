
import React from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, Clock, ShieldCheck, AlertCircle, Plus
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  onAddClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddClick }) => {
  const totalIncome = transactions.filter(t => t.type === TransactionType.RECEIVE).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === TransactionType.SEND).reduce((acc, t) => acc + t.amount, 0);
  const pendingReceivables = transactions.filter(t => t.type === TransactionType.RECEIVE && t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const healthScore = transactions.length === 0 ? 0 : Math.min(100, Math.max(0, Math.round((totalIncome / (totalExpenses || 1)) * 40 + (netBalance > 0 ? 20 : 0))));
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-indigo-600 dark:bg-indigo-900 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Welcome back to REHCAPS</h2>
            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
              Your financial health is looking {healthScore > 70 ? 'excellent' : 'stable'}. 
              You've managed ₹{totalIncome.toLocaleString()} in transactions this month.
            </p>
            <button 
              onClick={onAddClick}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-3"
            >
              <Plus className="w-6 h-6" />
              Add Transaction
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">₹{netBalance.toLocaleString()}</div>
              <div className="text-indigo-200 text-sm uppercase tracking-widest font-medium">Net Balance</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{healthScore}</div>
              <div className="text-indigo-200 text-sm uppercase tracking-widest font-medium">Health Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Received" amount={totalIncome} icon={<TrendingUp className="text-emerald-500" />} color="emerald" />
        <SummaryCard title="Total Sent" amount={totalExpenses} icon={<TrendingDown className="text-rose-500" />} color="rose" />
        <SummaryCard title="Net Balance" amount={netBalance} icon={<Wallet className="text-indigo-500" />} color="indigo" />
        <SummaryCard title="Pending" amount={pendingReceivables} icon={<Clock className="text-amber-500" />} color="amber" />
      </div>

      {/* Health Score & Risk Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 dark:text-white">Financial Health Score</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Based on your income-to-expense ratio and savings stability.</p>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2" />
                {healthScore > 70 ? 'Excellent' : healthScore > 40 ? 'Good' : 'Needs Attention'}
              </div>
              <div className="text-slate-400 text-sm">Updated just now</div>
            </div>
          </div>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * healthScore) / 100} strokeLinecap="round" className="text-indigo-600 transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold dark:text-white">{healthScore}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Score</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Risk Analysis</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Expense Ratio</span>
                <span className="font-bold dark:text-white">{expenseRatio}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${expenseRatio > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${expenseRatio}%` }}></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                {expenseRatio > 70 ? 'High spending detected. Consider reducing non-essential costs.' : 'Your spending is within safe limits. Keep it up!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, amount, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h4>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{amount.toLocaleString()}</p>
  </div>
);

export default Dashboard;
