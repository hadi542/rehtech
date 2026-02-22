
import React, { useState } from 'react';
import { FileText, Plus, Download, MessageSquare, Smartphone, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Transaction, TransactionType, UserProfile } from '../types';
import { jsPDF } from 'jspdf';

interface InvoicingProps {
  transactions: Transaction[];
  onAdd: (tx: any) => Promise<Transaction>;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  user: UserProfile;
}

const InvoicingModule: React.FC<InvoicingProps> = ({ transactions, onAdd, onDelete, onToggleStatus, user }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newInv, setNewInv] = useState<Partial<Transaction>>({ type: TransactionType.RECEIVE, status: 'PENDING' });

  const receivables = transactions.filter(t => t.type === TransactionType.RECEIVE);

  const handleAdd = async () => {
    if (newInv.personName && newInv.amount) {
      setLoading(true);
      await onAdd({
        ...newInv,
        date: new Date().toISOString().split('T')[0],
        category: 'Invoicing',
        description: newInv.description || 'Invoice generated'
      });
      setLoading(false);
      setShowAdd(false);
      setNewInv({ type: TransactionType.RECEIVE, status: 'PENDING' });
    }
  };

  const handleDownloadPDF = (t: Transaction) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('REHCAPS', 20, 30);
    doc.setFontSize(10);
    doc.text('OFFICIAL INVOICE', 20, 40);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Issued By: ${user.name}`, 20, 65);
    if (user.businessName) doc.text(`Business: ${user.businessName}`, 20, 72);
    doc.text(`Invoice #: ${t.invoiceNumber}`, 130, 65);
    doc.text(`Date: ${t.date}`, 130, 72);
    doc.line(20, 85, 190, 85);
    doc.setFontSize(14);
    doc.text('Invoice Details', 20, 100);
    doc.setFontSize(10);
    doc.text(`Client: ${t.personName}`, 20, 115);
    doc.text(`Description: ${t.description}`, 20, 122);
    doc.setFontSize(16);
    doc.text(`Total Amount: INR ${t.amount.toLocaleString()}`, 20, 140);
    doc.save(`${t.invoiceNumber}.pdf`);
  };

  const handleManualSend = (t: Transaction, platform: 'SMS' | 'WHATSAPP') => {
    const message = `You owe ₹${t.amount}. Invoice ID: ${t.invoiceNumber}. — REHCAPS`;
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3"><FileText className="text-indigo-600 w-8 h-8" /><h2 className="text-2xl font-bold dark:text-white">Invoicing & Reminders</h2></div>
        <button onClick={() => setShowAdd(true)} className="gradient-bg text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-lg"><Plus className="w-4 h-4 mr-2" /> Create Invoice</button>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase"><tr><th className="px-6 py-4">Invoice #</th><th className="px-6 py-4">Client</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {receivables.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-bold dark:text-white">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4"><div className="font-bold dark:text-white">{inv.personName}</div><div className="text-xs text-slate-500">{inv.phoneNumber}</div></td>
                  <td className="px-6 py-4 font-bold dark:text-white">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4"><button onClick={() => onToggleStatus(inv.id)} className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-1 ${inv.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{inv.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{inv.status}</button></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleManualSend(inv, 'SMS')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Smartphone className="w-4 h-4" /></button>
                      <button onClick={() => handleManualSend(inv, 'WHATSAPP')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><MessageSquare className="w-4 h-4" /></button>
                      <button onClick={() => handleDownloadPDF(inv)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Download className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(inv.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {receivables.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No invoices created yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Create New Invoice</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Client Name" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.personName || ''} onChange={e => setNewInv({...newInv, personName: e.target.value})} />
              <input type="tel" placeholder="Client Phone" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.phoneNumber || ''} onChange={e => setNewInv({...newInv, phoneNumber: e.target.value})} />
              <input type="number" placeholder="Amount (₹)" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.amount || ''} onChange={e => setNewInv({...newInv, amount: Number(e.target.value)})} />
              <textarea placeholder="Description" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newInv.description || ''} onChange={e => setNewInv({...newInv, description: e.target.value})} />
              <div className="flex gap-3 pt-4"><button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border dark:border-slate-700 dark:text-white">Cancel</button><button onClick={handleAdd} disabled={loading} className="flex-1 py-3 rounded-xl gradient-bg text-white font-bold">{loading ? 'Saving...' : 'Generate & Save'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicingModule;
