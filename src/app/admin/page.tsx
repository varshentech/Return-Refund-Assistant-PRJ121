'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, MessageSquare, Package, Users, Bell, Search, Check, X, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { localDb } from '@/lib/localDb';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'refunds' | 'ai' | 'users'>('overview');
  const [logs, setLogs] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localDb.init();
      refreshData();
    }
  }, [activeTab]);

  const refreshData = () => {
    setLogs(localDb.get('logs') || []);
    setRefunds(localDb.get('refunds') || []);
    setPendingQuestions(localDb.get('pending_ai') || []);
  };

  const handleApproveRefund = (refund: any) => {
    const deduction = parseFloat(prompt('Enter service deduction amount ($):', '15.00') || '0');
    const finalAmount = refund.productPrice - deduction;

    const user = localDb.get('users')[0];
    localDb.update('users', user.id, { wallet: user.wallet + finalAmount });
    localDb.update('refunds', refund.id, { status: 'approved' });
    localDb.update('orders', refund.orderId, { status: 'refunded' });
    localDb.insert('logs', { id: Date.now(), userName: 'Admin', action: 'Refund Approved', details: `Approved $${finalAmount.toFixed(2)} refund for ${refund.productName}`, timestamp: new Date().toISOString() });
    
    refreshData();
    alert('Refund processed successfully!');
  };

  const handleTrainAI = (id: number, answer: string) => {
    const q = pendingQuestions.find(item => item.id === id);
    localDb.insert('learned_ai', { question: q.question, answer });
    localDb.delete('pending_ai', id);
    refreshData();
    alert('AI Knowledge Updated!');
  };

  const resetAllData = () => {
    if (confirm('Reset system to factory settings?')) {
      localDb.reset();
    }
  };

  const adminBackgrounds: Record<string, string> = {
    overview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    refunds: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2064&auto=format&fit=crop',
    ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    users: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop'
  };

  return (
    <div className="min-h-screen bg-[#020617] flex relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 transition-all duration-1000" style={{ backgroundImage: `url("${adminBackgrounds[activeTab]}")` }} />
      
      <div className="w-20 md:w-72 bg-[#0f172a]/80 backdrop-blur-xl text-white flex flex-col p-4 md:p-6 relative z-10 border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-10 px-0 md:px-2 overflow-hidden">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shrink-0"><LayoutDashboard className="w-6 h-6" /></div>
          <span className="font-bold text-xl hidden md:block">Admin Control</span>
        </div>
        <nav className="space-y-2">
          <AdminNavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Users className="w-5 h-5" />} label="Activity Feed" />
          <AdminNavItem active={activeTab === 'refunds'} onClick={() => setActiveTab('refunds')} icon={<Receipt className="w-5 h-5" />} label="Refund Requests" count={refunds.filter(r => r.status === 'pending').length} />
          <AdminNavItem active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<MessageSquare className="w-5 h-5" />} label="AI Training" count={pendingQuestions.length} />
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 w-full p-4 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><X className="w-5 h-5" /><span className="font-semibold hidden md:block">Logout</span></button>
        </nav>
        
        <div className="mt-auto hidden md:block border-t border-white/5 pt-6">
          <button 
            onClick={resetAllData}
            className="w-full py-3 text-xs font-black uppercase tracking-widest text-red-400/60 border border-red-500/10 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            Purge All Data
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-20 bg-[#0f172a]/40 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors"><Bell className="w-6 h-6" /></button>
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">AD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'overview' && <ActivityFeed logs={logs} />}
          {activeTab === 'refunds' && <RefundRequests refunds={refunds} onApprove={handleApproveRefund} />}
          {activeTab === 'ai' && <AITraining questions={pendingQuestions} onAnswered={handleTrainAI} />}
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ active, icon, label, onClick, count }: any) {
  return (
    <button onClick={onClick} className={`relative flex items-center justify-center md:justify-between w-full p-4 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      <div className="flex items-center gap-3">{icon}<span className="font-semibold hidden md:block whitespace-nowrap">{label}</span></div>
      {count > 0 && <span className="absolute md:relative top-2 right-2 md:top-0 md:right-0 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{count}</span>}
    </button>
  );
}

function ActivityFeed({ logs }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {logs.map((log: any) => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={log.id} className="bg-[#0f172a]/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl flex items-start gap-4">
          <div className={`p-3 rounded-xl ${log.action === 'Purchase' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{log.action === 'Purchase' ? <Package className="w-5 h-5" /> : <Search className="w-5 h-5" />}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1"><span className="font-bold text-white truncate">{log.userName || 'System'}</span><span className="text-[10px] text-gray-500 uppercase font-black">{new Date(log.timestamp).toLocaleTimeString()}</span></div>
            <p className="text-gray-400 text-sm line-clamp-2">{log.details}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RefundRequests({ refunds, onApprove }: any) {
  return (
    <div className="space-y-4">
      {refunds.length === 0 ? <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 text-gray-400">No requests found.</div> : 
        refunds.map((r: any) => (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={r.id} className="bg-[#0f172a]/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 md:p-4 bg-red-500/20 rounded-2xl text-red-400"><Receipt className="w-6 h-6 md:w-8 md:h-8" /></div>
              <div>
                <h4 className="font-bold text-base md:text-lg text-white">{r.productName}</h4>
                <p className="text-xs md:text-sm text-gray-400">Order: <span className="text-blue-400 font-mono">{r.orderNumber}</span> • User: <span className="text-gray-200">{r.userName}</span></p>
                <div className="mt-2 text-xs md:text-sm italic text-gray-400 bg-black/20 p-2 rounded-lg border border-white/5">"Reason: {r.reason}"</div>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
              <div className="text-left md:text-right mr-0 md:mr-4">
                <p className="text-[10px] text-gray-500 uppercase font-black">Total Price</p>
                <p className="text-lg md:text-xl font-black text-green-400">${r.productPrice}</p>
              </div>
              {r.status === 'pending' ? <button onClick={() => onApprove(r)} className="flex items-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg"><Check className="w-4 h-4 md:w-5 md:h-5" /> <span>Approve</span></button> : <span className="px-4 py-2 rounded-full font-black uppercase text-[10px] tracking-widest bg-green-500/20 text-green-400 border border-green-500/30">APPROVED</span>}
            </div>
          </motion.div>
        ))
      }
    </div>
  );
}

function AITraining({ questions, onAnswered }: any) {
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');

  return (
    <div className="grid gap-6">
      {questions.length === 0 ? <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 text-gray-400">No pending questions.</div> : 
        questions.map((q: any) => (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={q.id} className="bg-[#0f172a]/40 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-6"><AlertCircle className="w-5 h-5" /><span className="font-black text-xs uppercase tracking-widest">New Question</span></div>
            <p className="text-lg md:text-2xl font-bold text-white mb-8">"{q.question}"</p>
            {answeringId === q.id ? (
              <div className="space-y-4">
                <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full p-4 border border-white/10 rounded-xl bg-black/40 text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type answer..." rows={3} />
                <div className="flex gap-3">
                  <button onClick={() => setAnsweringId(null)} className="px-6 py-3 text-gray-400 hover:text-white font-bold">Cancel</button>
                  <button onClick={() => { onAnswered(q.id, answer); setAnsweringId(null); setAnswer(''); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500">Deploy</button>
                </div>
              </div>
            ) : <button onClick={() => setAnsweringId(q.id)} className="flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">Start Training <ChevronRight className="w-4 h-4" /></button>}
          </motion.div>
        ))
      }
    </div>
  );
}
