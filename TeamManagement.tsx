
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Clock, Trash2, Loader2 } from 'lucide-react';
import { TeamMember } from '../types';
import { firebaseService } from '../services/firebase';

const TeamManagement: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'VIEWER' });

  useEffect(() => {
    const fetch = async () => {
      const data = await firebaseService.getTeam();
      setTeam(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleAdd = async () => {
    if (newMember.name && newMember.email) {
      await firebaseService.addTeamMember({ ...newMember, status: 'PENDING' } as any);
      const data = await firebaseService.getTeam();
      setTeam(data);
      setShowAdd(false);
      setNewMember({ name: '', email: '', role: 'VIEWER' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this team member?')) {
      await firebaseService.deleteTeamMember(id);
      setTeam(prev => prev.filter(m => m.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3"><Users className="text-indigo-600 w-8 h-8" /><h2 className="text-2xl font-bold dark:text-white">Team & Access</h2></div>
        <button onClick={() => setShowAdd(true)} className="gradient-bg text-white px-4 py-2 rounded-xl flex items-center font-medium shadow-lg"><UserPlus className="w-4 h-4 mr-2" /> Invite Member</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase"><tr><th className="px-6 py-4">Member</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4"></th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="bg-indigo-50/30 dark:bg-indigo-900/10"><td className="px-6 py-4"><div className="font-bold dark:text-white">You (Owner)</div><div className="text-xs text-slate-500">Primary Account</div></td><td className="px-6 py-4"><span className="px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-bold">OWNER</span></td><td className="px-6 py-4"><span className="text-emerald-500 text-xs font-bold">ACTIVE</span></td><td className="px-6 py-4"></td></tr>
              {team.map(member => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4"><div className="font-bold dark:text-white">{member.name}</div><div className="text-xs text-slate-500">{member.email}</div></td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">{member.role}</span></td>
                  <td className="px-6 py-4"><span className="text-amber-500 text-xs font-bold">{member.status}</span></td>
                  <td className="px-6 py-4 text-right"><button onClick={() => handleDelete(member.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"><h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-600" /> Activity Log</h3><div className="space-y-6"><div className="flex gap-4"><div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div><div><p className="text-sm dark:text-slate-300"><span className="font-bold">You</span> updated the team settings</p><p className="text-[10px] text-slate-500 uppercase mt-1">Just now</p></div></div></div></div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Invite Team Member</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
              <input type="email" placeholder="Email Address" className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              <select className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})}><option value="MANAGER">Manager (Can edit data)</option><option value="VIEWER">Viewer (Read-only)</option></select>
              <div className="flex gap-3 pt-4"><button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border dark:border-slate-700 dark:text-white">Cancel</button><button onClick={handleAdd} className="flex-1 py-3 rounded-xl gradient-bg text-white font-bold">Send Invite</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
