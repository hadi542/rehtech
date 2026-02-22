
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Receipt, TrendingUp, BrainCircuit, Bell, Settings, 
  LogOut, Menu, User, Sun, Moon, CreditCard, Briefcase, Target, 
  Repeat, FileText, Users, ChevronDown, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import AIAdvisor from './components/AIAdvisor';
import CreditScoreModule from './components/CreditScoreModule';
import PortfolioTracker from './components/PortfolioTracker';
import BudgetSystem from './components/BudgetSystem';
import SubscriptionTracker from './components/SubscriptionTracker';
import InvoicingModule from './components/InvoicingModule';
import TeamManagement from './components/TeamManagement';
import LoanAdvisor from './components/LoanAdvisor';
import ProfileSettings from './components/ProfileSettings';
import TransactionModal from './components/TransactionModal';
import { Transaction, UserProfile } from './types';
import { firebaseService } from './services/firebase';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    const txs = await firebaseService.getTransactions();
    setTransactions(txs);
  }, []);

  useEffect(() => {
    const init = async () => {
      const currentUser = firebaseService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await fetchTransactions();
      }
      const savedTheme = localStorage.getItem('rehcaps_theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
      const savedToolsState = localStorage.getItem('rehcaps_tools_expanded');
      if (savedToolsState === 'true') setIsToolsExpanded(true);
      setLoading(false);
    };
    init();
  }, [fetchTransactions]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rehcaps_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rehcaps_theme', 'light');
    }
  }, [isDarkMode]);

  const handleStart = async (profile: Partial<UserProfile>) => {
    const newUser = await firebaseService.login(profile.email!, profile.name!);
    setUser(newUser);
    setTransactions([]);
  };

  const handleLogout = async () => {
    await firebaseService.logout();
    setUser(null);
    setTransactions([]);
  };

  const handleAddTransaction = useCallback(async (newTx: any) => {
    const tx = await firebaseService.addTransaction(newTx);
    await fetchTransactions();
    return tx;
  }, [fetchTransactions]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    await firebaseService.deleteTransaction(id);
    await fetchTransactions();
  }, [fetchTransactions]);

  const handleToggleStatus = useCallback(async (id: string) => {
    await firebaseService.toggleTransactionStatus(id);
    await fetchTransactions();
  }, [fetchTransactions]);

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    const user = await firebaseService.updateProfile(updatedUser);
    setUser(user);
  };

  const handleDownloadPDF = (t: Transaction) => {
    if (!user) return;
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('REHCAPS', 20, 30);
    doc.setFontSize(10);
    doc.text('OFFICIAL TRANSACTION RECEIPT', 20, 40);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Issued By: ${user.name}`, 20, 65);
    if (user.businessName) doc.text(`Business: ${user.businessName}`, 20, 72);
    doc.text(`Receipt #: ${t.receiptNumber}`, 130, 65);
    doc.text(`Date: ${t.date}`, 130, 72);
    doc.line(20, 85, 190, 85);
    doc.setFontSize(14);
    doc.text('Transaction Details', 20, 100);
    doc.setFontSize(10);
    doc.text(`Type: ${t.type}`, 20, 115);
    doc.text(`Person: ${t.personName}`, 20, 122);
    doc.text(`Description: ${t.description}`, 20, 129);
    doc.setFontSize(16);
    doc.text(`Amount: INR ${t.amount.toLocaleString()}`, 20, 145);
    doc.save(`${t.receiptNumber}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <LandingPage onStart={handleStart} />;

  const toolItems = [
    { id: 'transactions', label: 'History', icon: <Receipt className="w-4 h-4" /> },
    { id: 'invoicing', label: 'Invoicing', icon: <FileText className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'budgets', label: 'Budgets', icon: <Target className="w-4 h-4" /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Repeat className="w-4 h-4" /> },
    { id: 'credit', label: 'Credit Health', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'loans', label: 'Loan Advisor', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="text-xl font-bold tracking-tight dark:text-white">REHCAPS</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400"><Menu /></button>
          </div>
          <nav className="flex-1 space-y-1">
            <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </button>
            <div className="pt-2">
              <button onClick={() => setIsToolsExpanded(!isToolsExpanded)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${toolItems.some(i => i.id === activeTab) ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <div className="flex items-center space-x-3"><Briefcase className="w-5 h-5" /><span className="text-sm">Financial Tools</span></div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isToolsExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isToolsExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-4 mt-1 space-y-1 border-l border-slate-100 dark:border-slate-800">
                    {toolItems.map(item => (
                      <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-all ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        {item.icon}<span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <Settings className="w-5 h-5" /><span className="text-sm">Profile Settings</span>
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}<span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
              <LogOut className="w-5 h-5" /><span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"><Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" /></button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsTransactionModalOpen(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-semibold shadow-lg hover:opacity-90 transition-all"><Plus className="w-4 h-4" />Add Transaction</button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-100 dark:border-slate-800">
              <div className="text-right hidden sm:block"><p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{user.businessName || 'Personal'}</p></div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 overflow-hidden border border-slate-200 dark:border-slate-700">
                {user.photoUrl ? <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard transactions={transactions} onAddClick={() => setIsTransactionModalOpen(true)} />}
            {activeTab === 'transactions' && <Transactions transactions={transactions} onDelete={handleDeleteTransaction} onToggleStatus={handleToggleStatus} user={user} />}
            {activeTab === 'profile' && <ProfileSettings user={user} onUpdate={handleUpdateProfile} />}
            {activeTab === 'invoicing' && <InvoicingModule transactions={transactions} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} onToggleStatus={handleToggleStatus} user={user} />}
            {activeTab === 'portfolio' && <PortfolioTracker />}
            {activeTab === 'budgets' && <BudgetSystem transactions={transactions} />}
            {activeTab === 'subscriptions' && <SubscriptionTracker />}
            {activeTab === 'credit' && <CreditScoreModule />}
            {activeTab === 'loans' && <LoanAdvisor />}
            {activeTab === 'team' && <TeamManagement />}
          </div>
        </div>
      </main>
      <TransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} onAdd={handleAddTransaction} onDownload={handleDownloadPDF} onDelete={handleDeleteTransaction} />
      <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}</AnimatePresence>
    </div>
  );
};

export default App;
