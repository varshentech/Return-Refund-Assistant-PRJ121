'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, MessageSquare, Wallet, Star, ChevronRight, X, Search, Truck, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { localDb } from '@/lib/localDb';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<'shop' | 'orders' | 'returns' | 'chat'>('shop');
  const [wallet, setWallet] = useState(1000.0);
  const [orders, setOrders] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      localDb.init();
      refreshData();
    }
  }, [activeTab]);

  const refreshData = () => {
    const allUsers = localDb.get('users');
    const user = allUsers && allUsers.length > 0 ? allUsers[0] : { wallet: 1000 };
    setWallet(user.wallet);
    setOrders(localDb.get('orders') || []);
    setRefunds(localDb.get('refunds') || []);
    setProducts(localDb.get('products') || []);
  };

  const backgrounds: Record<string, string> = {
    shop: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    orders: 'https://images.unsplash.com/photo-1578632738981-4330694f023a?q=80&w=1974&auto=format&fit=crop',
    returns: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop',
    chat: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop'
  };

  const handlePurchase = (product: any) => {
    if (wallet < product.price) {
      alert('Insufficient wallet balance!');
      return;
    }

    const newOrder = localDb.insert('orders', {
      id: Date.now(),
      orderNumber: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      productName: product.name,
      productPrice: product.price,
      status: 'shipping',
      createdAt: new Date().toISOString(),
    });

    localDb.update('users', 1, { wallet: wallet - product.price });
    localDb.insert('logs', { id: Date.now(), userName: 'Varshen A', action: 'Purchase', details: `Ordered ${product.name}`, timestamp: new Date().toISOString() });
    
    refreshData();
    alert(`Order placed! Tracking ID: ${newOrder.orderNumber}`);
  };

  const handleRequestRefund = (order: any, reason: string) => {
    localDb.insert('refunds', {
      id: Date.now(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      productName: order.productName,
      productPrice: order.productPrice,
      reason,
      status: 'pending',
      userName: 'Varshen A',
      createdAt: new Date().toISOString()
    });

    localDb.update('orders', order.id, { status: 'returned' });
    refreshData();
    alert('Refund request submitted! Admin will review it shortly.');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10 transition-all duration-1000"
        style={{ backgroundImage: `url("${backgrounds[activeTab]}")` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-transparent to-[#0f172a]" />

      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-white">Return & Refund Assistant</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 bg-blue-600/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-500/20">
            <Wallet className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
            <span className="font-bold text-blue-400 text-sm md:text-base">${wallet.toFixed(2)}</span>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-gray-400 hover:text-red-400 font-medium text-sm md:text-base transition-colors">Logout</button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
        <div className="w-full md:w-64 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-row md:flex-col p-4 gap-2 overflow-x-auto md:overflow-x-visible">
          <SidebarItem active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<Search className="w-5 h-5" />} label="Shop" />
          <SidebarItem active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Package className="w-5 h-5" />} label="My Orders" count={orders.length} />
          <SidebarItem active={activeTab === 'returns'} onClick={() => setActiveTab('returns')} icon={<Receipt className="w-5 h-5" />} label="Refunds" count={refunds.length} />
          <SidebarItem active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare className="w-5 h-5" />} label="AI Assistant" />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'shop' && <ShopView products={products} onPurchase={handlePurchase} />}
            {activeTab === 'orders' && <OrdersView orders={orders} />}
            {activeTab === 'returns' && <ReturnsView orders={orders} refunds={refunds} onRefund={handleRequestRefund} />}
            {activeTab === 'chat' && <ChatView />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ active, icon, label, onClick, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between min-w-max md:w-full p-3 rounded-xl transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count > 0 && (
        <span className={`hidden md:block text-xs font-bold px-2 py-1 rounded-full ${active ? 'bg-white text-blue-600' : 'bg-gray-700 text-gray-300'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ShopView({ products, onPurchase }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p: any) => (
        <div key={p.id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:shadow-2xl transition-all group">
          <div className="h-48 overflow-hidden relative">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-900">{p.rating}</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl text-white mb-2">{p.name}</h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-blue-400">${p.price}</span>
              <button onClick={() => onPurchase(p)} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-500 transition-colors">Buy</button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function OrdersView({ orders }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Active Shipments</h2>
      {orders.filter((o:any) => o.status === 'shipping').length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 text-gray-400">No active shipments.</div>
      ) : (
        orders.filter((o:any) => o.status === 'shipping').map((o: any) => (
          <div key={o.id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase">Tracking #{o.orderNumber}</span>
                <h3 className="text-lg font-bold text-white">{o.productName}</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Est. Arrival</p>
                <p className="font-bold text-green-400">2h 45m</p>
              </div>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "65%" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 text-blue-400">
               <Truck className="w-4 h-4 animate-bounce" />
               <span className="text-xs font-bold uppercase tracking-widest">On the way to you</span>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}

function ReturnsView({ orders, refunds, onRefund }: any) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reason, setReason] = useState('');

  const eligible = orders.filter((o: any) => o.status === 'shipping');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">Return Portal</h2>
      {selectedOrder ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 max-w-2xl">
          <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white mb-4 flex items-center gap-1">&larr; Back</button>
          <h3 className="text-xl font-bold text-white mb-6">Returning {selectedOrder.productName}</h3>
          <textarea 
            className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white mb-6"
            placeholder="Why are you returning this?"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button 
            onClick={() => { onRefund(selectedOrder, reason); setSelectedOrder(null); }}
            className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-500"
          >
            Submit Refund Request
          </button>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="space-y-4">
              <p className="text-gray-400 text-sm font-bold uppercase">Eligible Items</p>
              {eligible.length === 0 && <div className="text-gray-500 italic">No items eligible for return.</div>}
              {eligible.map((o: any) => (
                <div key={o.id} className="bg-white/10 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <span className="text-white font-bold">{o.productName}</span>
                  <button onClick={() => setSelectedOrder(o)} className="text-blue-400 font-bold hover:underline">Start Return</button>
                </div>
              ))}
           </div>
           <div className="space-y-4 pt-8 border-t border-white/5">
              <p className="text-gray-400 text-sm font-bold uppercase">Refund History</p>
              {refunds.map((r: any) => (
                <div key={r.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                   <div>
                     <p className="text-white font-bold">{r.productName}</p>
                     <p className="text-xs text-gray-500">{r.status.toUpperCase()}</p>
                   </div>
                   <span className={`text-sm font-bold ${r.status === 'approved' ? 'text-green-400' : 'text-amber-400'}`}>
                     ${r.productPrice}
                   </span>
                </div>
              ))}
           </div>
        </div>
      )}
    </motion.div>
  );
}

function ChatView() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello! I am your AI Return Assistant. Ask me anything about your orders, returns, or our policies!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const query = input.toLowerCase();
      let answer = "I'm not exactly sure about that. I've sent your question to the Admin, and they will train me on this soon!";
      
      const faqs = localDb.get('faq');
      const match = faqs.find((f: any) => query.includes(f.q.toLowerCase()));
      if (match) answer = match.a;

      const learned = localDb.get('learned_ai');
      const customMatch = learned.find((l:any) => query.includes(l.question.toLowerCase()));
      if (customMatch) answer = customMatch.answer;

      if (answer.includes("Admin")) {
        localDb.insert('pending_ai', { id: Date.now(), question: input });
      }

      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  return (
    <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-160px)] flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((m, i) => (
          <motion.div initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-lg ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/90 text-gray-800 rounded-tl-none'}`}>
              <p className="text-sm md:text-base leading-relaxed">{m.content}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && <div className="flex justify-start"><div className="bg-white/80 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div></div>}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1 p-3 md:p-4 bg-black/20 text-white placeholder-gray-400 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Ask me something..." />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 md:px-8 rounded-xl font-bold hover:bg-blue-500 shadow-lg transition-all">Send</button>
      </div>
    </div>
  );
}
