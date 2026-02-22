
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, ArrowDownLeft, CheckCircle2, Loader2, MessageSquare, Smartphone, Download, Trash2, Save } from 'lucide-react';
import { TransactionType, Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tx: any) => Promise<Transaction>;
  onDownload: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onAdd, onDownload, onDelete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<TransactionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedTx, setSavedTx] = useState<Transaction | null>(null);
  
  const [formData, setFormData] = useState({
    personName: '',
    phoneNumber: '',
    personEmail: '',
    amount: '',
    description: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'COMPLETED' as 'COMPLETED' | 'PENDING'
  });

  const handleTypeSelect = (selectedType: TransactionType) => {
    setType(selectedType);
    setFormData(prev => ({
      ...prev,
      status: selectedType === TransactionType.RECEIVE ? 'PENDING' : 'COMPLETED'
    }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;
    setLoading(true);
    
    try {
      const tx = await onAdd({
        type,
        amount: Number(formData.amount),
        personName: formData.personName,
        phoneNumber: formData.phoneNumber,
        personEmail: formData.personEmail,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        dueDate: formData.dueDate || undefined,
        status: formData.status as any
      });
      
      setSavedTx(tx);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSend = (platform: 'SMS' | 'WHATSAPP') => {
    if (!savedTx) return;
    const message = savedTx.type === TransactionType.SEND 
      ? `₹${savedTx.amount} has been sent. Receipt ID: ${savedTx.receiptNumber}. — REHCAPS`
      : `You owe ₹${savedTx.amount}. Receipt ID: ${savedTx.receiptNumber}. — REHCAPS`;
    const encodedMsg = encodeURIComponent(message);
    const cleanPhone = savedTx.phoneNumber.replace(/\D/g, '');
    if (platform === 'SMS') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const separator = isIOS ? '&' : '?';
      window.location.href = `sms:${savedTx.phoneNumber}${separator}body=${encodedMsg}`;
    } else {
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, '_blank');
    }
  };

  const handleDelete = () => {
    if (savedTx && window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(savedTx.id);
      onClose();
      reset();
    }
  };

  const reset = () => {
    setStep(1);
    setType(null);
    setSavedTx(null);
    setFormData({
      personName: '',
      phoneNumber: '',
      personEmail: '',
      amount: '',
      description: '',
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'COMPLETED'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <button onClick={() => { onClose(); reset(); }} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-6 h-6" /></button>
        <div className="p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="text-center">
                <h3 className="text-3xl font-bold mb-2 dark:text-white">Create New Receipt</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-10">Select the type of transaction receipt</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button onClick={() => handleTypeSelect(TransactionType.SEND)} className="group p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 hover:border-rose-500 transition-all text-left">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ArrowUpRight className="w-8 h-8" /></div>
                    <h4 className="text-xl font-bold mb-2 dark:text-white">Send Money Receipt</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Record money sent to someone else.</p>
                  </button>
                  <button onClick={() => handleTypeSelect(TransactionType.RECEIVE)} className="group p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all text-left">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ArrowDownLeft className="w-8 h-8" /></div>
                    <h4 className="text-xl font-bold mb-2 dark:text-white">Receive Money Receipt</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Record money received from someone.</p>
                  </button>
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(1)} className="text-indigo-600 font-semibold hover:underline">Back</button>
                  <h3 className="text-2xl font-bold dark:text-white">{type}</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Person Name</label>
                      <input required type="text" className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. John Doe" value={formData.personName} onChange={e => setFormData({...formData, personName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                      <input required type="tel" className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+91 98765 43210" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Amount (₹)</label>
                      <input required type="number" className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-2xl font-bold" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Category</label>
                      <select className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <input type="text" className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What is this for?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-5 rounded-[1.5rem] gradient-bg text-white font-bold text-xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    Save Receipt
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="step3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12" /></div>
                <h3 className="text-3xl font-bold mb-2 dark:text-white">Receipt Saved!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Transaction has been recorded successfully.</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={() => handleManualSend('SMS')} className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 flex flex-col items-center gap-2 transition-all"><Smartphone className="w-6 h-6 text-indigo-600" /><span className="text-xs font-bold dark:text-white">Send SMS</span></button>
                  <button onClick={() => handleManualSend('WHATSAPP')} className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 flex flex-col items-center gap-2 transition-all"><MessageSquare className="w-6 h-6 text-emerald-600" /><span className="text-xs font-bold dark:text-white">WhatsApp</span></button>
                </div>
                <div className="space-y-3">
                  <button onClick={() => savedTx && onDownload(savedTx)} className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-2 shadow-lg"><Download className="w-5 h-5" />Download PDF</button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { onClose(); reset(); }} className="py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold flex items-center justify-center gap-2"><Save className="w-5 h-5" />Save Only</button>
                    <button onClick={handleDelete} className="py-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold flex items-center justify-center gap-2"><Trash2 className="w-5 h-5" />Delete</button>
                  </div>
                  <button onClick={() => { onClose(); reset(); }} className="w-full py-2 text-slate-400 font-medium hover:text-slate-600">Close</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionModal;
