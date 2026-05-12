'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, User, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: 'admin' | 'customer') => {
    sessionStorage.setItem('user_role', role);
    sessionStorage.setItem('user_id', '1');
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/customer');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0b0e14]">
      {/* Anime Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=2070&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#0b0e14]/80 to-[#0b0e14]" />
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        
        {/* Animated City Lights */}
        <div className="absolute bottom-0 w-full h-1/3 overflow-hidden opacity-30">
          <div className="flex gap-4 animate-scroll-left">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="min-w-[100px] h-32 bg-gray-800/50 rounded-t-lg relative">
                 <div className="absolute top-4 left-4 w-4 h-4 bg-yellow-500/20 rounded-sm" />
                 <div className="absolute top-10 left-4 w-4 h-4 bg-yellow-500/20 rounded-sm" />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/50">
            <Truck className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">Return & Refund</h1>
        <p className="text-gray-400 mb-10 text-lg">AI-Powered E-commerce Support</p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('customer')}
            className="group relative w-full flex items-center justify-between p-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <span className="text-lg font-semibold">Customer Portal</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </div>
          </button>

          <button
            onClick={() => handleLogin('admin')}
            className="group relative w-full flex items-center justify-between p-5 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </div>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
             <Headphones className="w-4 h-4" />
             <span>24/7 AI Support</span>
          </div>
          <div className="w-1 h-1 bg-gray-700 rounded-full" />
          <span>Instant Refunds</span>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          display: flex;
          width: 200%;
          animation: scroll-left 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
