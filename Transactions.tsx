
import React, { useState } from 'react';
import { 
  Search, Download, Trash2, CheckCircle, Clock, MessageSquare, Smartphone, 
  ArrowUpRight, ArrowDownLeft, FileText, Receipt
} from 'lucide-react';
import { Transaction, TransactionType, UserProfile } from '../types';
import { jsPDF } from 'jspdf';

interface TransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  user: UserProfile;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onDelete, onToggleStatus, user }) => {
  const [filter, setFilter] = useState<'ALL' | 'SEND' | 'RECEIVE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filter === 'ALL' || (filter === 'SEND' ? t.type === TransactionType.SEND : t.type === TransactionType.RECEIVE);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch = t.personName.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleDownloadPDF = (t: Transaction) => {
    const doc = new jsPDF();
    
    // Professional Header
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('REHCAPS', 20, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL TRANSACTION RECEIPT', 20, 40);
    
    // User Profile Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ISSUED BY:', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(user.name, 20, 72);
    if (user.businessName) doc.text(user.businessName, 20, 78);
    doc.text(user.email, 20, 84);
    
    // Receipt Metadata
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT DETAILS:', 130, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt #: ${t.receiptNumber}`, 130, 72);
    doc.text(`Date: ${t.date}`, 130, 78);
    doc.text(`Status: ${t.status}`, 130, 84);
    
    // Main Content Box
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 100, 170, 80, 'FD');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t.type.toUpperCase(), 105, 115, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('PERSON / ENTITY', 30, 130);
    doc.text('DESCRIPTION', 30, 145);
    doc.text('CATEGORY', 30, 160);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(t.personName, 30, 136);
    doc.text(t.description || 'No description provided', 30, 151);
    doc.text(t.category, 30, 166);
    
    // Amount Highlight
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('TOTAL AMOUNT', 130, 130);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`INR ${t.amount.toLocaleString()}`, 130, 145);
    
    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`System Timestamp: ${new Date().toISOString()}`, 20, 275);
    doc.text(`Transaction ID: ${t.id}`, 20, 280);
    doc.text('This is a digitally generated receipt. No physical signature is required.', 20, 285);
    
    doc.save(`${t.receiptNumber}.pdf`);
  };

  const handleManualSend = (t: Transaction, platform: 'SMS' | 'WHATSAPP') => {
    const message = t.type === TransactionType.SEND 
      ? `₹${t.amount} has been sent. Receipt ID: ${t.receiptNumber}. — REHCAPS`
      : `You owe ₹${t.amount}. Receipt ID: ${t.receiptNumber}. — REHCAPS`;

    const encodedMsg = encodeURIComponent(message);
    const cleanPhone = t.phoneNumber.replace(/\D/g, '');

    if (platform === 'SMS') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const separator = isIOS ? '&' : '?';
      window.location.href = `sms:${t.phoneNumber}${separator}body=${encodedMsg}`;
    } else {
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Transaction History</h2>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by name or description..." className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['ALL', 'SEND', 'RECEIVE'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Person</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Quick Send</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.SEND ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                      {t.type === TransactionType.SEND ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold dark:text-white">{t.personName}</div>
                    <div className="text-xs text-slate-500">{t.receiptNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-bold text-lg ${t.type === TransactionType.SEND ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.type === TransactionType.SEND ? '-' : '+'}₹{t.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleManualSend(t, 'SMS')} className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 transition-colors">
                        <Smartphone className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleManualSend(t, 'WHATSAPP')} className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => onToggleStatus(t.id)} className={`flex items-center text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>
                      {t.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
                      {t.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownloadPDF(t)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg" title="Download Receipt"><FileText className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(t.id)} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Receipt className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
