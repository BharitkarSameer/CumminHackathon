import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ZapOff, Fingerprint, Crosshair, Calendar as CalIcon, ChevronDown } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ForecastTab from '../components/ForecastTab';
import HistoryTab from '../components/HistoryTab';
import AlertsTab from '../components/AlertsTab';
import CompareTab from '../components/CompareTab';
import { useFetch } from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { name: 'Overview & Forecast', id: 'forecast' },
  { name: 'Historical Data', id: 'history' },
  { name: 'Alerts & Actions', id: 'alerts' },
  { name: 'Performance Matrix', id: 'compare' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [promo, setPromo] = useState(false);
  const [fest, setFest] = useState(false);
  const { data: alerts } = useFetch('/api/alerts');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stockoutCount = alerts?.stockout?.length || 0;
  const overstockCount = alerts?.overstock?.length || 0;

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-zinc-900 selection:bg-zinc-200 pb-24">
      
      {/* CLEAN MINIMAL NAVBAR MATCHING COVER PAGE */}
      <div className="w-full h-24 flex items-center justify-between px-8 md:px-12 sticky top-0 z-50 bg-[#fafaf9]/80 backdrop-blur-md pointer-events-none">
         <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-start pointer-events-auto cursor-pointer group" 
            onClick={() => navigate('/')}
         >
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.05em', color: '#111', lineHeight: '1.1', fontFamily: 'serif', transition: 'opacity 0.2s', textTransform: 'uppercase' }} className="group-hover:opacity-70">
               DemandIQ
            </span>
            <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: '#8a8981', marginTop: '2px', transition: 'opacity 0.2s', textTransform: 'uppercase' }} className="group-hover:opacity-70">
               Inspired by Williams-Sonoma
            </span>
         </motion.div>

         {/* Centered Navigation Pill */}
         <div className="hidden lg:flex items-center gap-1 bg-white border border-black/[0.04] p-1.5 rounded-full shadow-sm pointer-events-auto">
            {TABS.map((tab, i) => {
               const isActive = activeTab === i;
               return (
                  <button 
                     key={tab.id}
                     onClick={() => setActiveTab(i)}
                     className={`px-5 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 relative ${isActive ? 'text-black bg-[#f4f4f5]' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                     {tab.name}
                     {tab.name === 'Alerts & Actions' && stockoutCount > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                           {stockoutCount}
                        </span>
                     )}
                  </button>
               )
            })}
         </div>

         {/* Right Side Clock */}
         <div className="hidden sm:flex items-center gap-2 text-[12px] font-bold text-zinc-400 pointer-events-auto bg-white border border-black/5 px-4 py-2 rounded-full">
            <CalIcon className="w-3.5 h-3.5" />
            <span>{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
         </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10">
         
         {/* EXECUTIVE HEADER */}
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8">
            <div>
               <h1 className="text-[34px] md:text-[42px] font-medium tracking-tighter text-zinc-900 leading-tight mb-2">Platform Overview</h1>
               <p className="text-[16px] text-zinc-500 font-normal">Predictive analysis and real-time inventory health orchestration.</p>
            </div>
            
            {/* Vercel style split-pill toggles */}
            <div className="flex items-center bg-zinc-100/60 p-1 rounded-xl border border-zinc-200/50 mt-6 md:mt-0 shadow-sm">
               <button 
                  onClick={() => setPromo(!promo)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${promo ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-zinc-200/80' : 'text-zinc-500 hover:text-zinc-800'}`}
               >
                  {promo ? <Zap className="w-4 h-4 fill-zinc-900" /> : <ZapOff className="w-4 h-4" />}
                  Promo Model
               </button>
               <button 
                  onClick={() => setFest(!fest)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${fest ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-zinc-200/80' : 'text-zinc-500 hover:text-zinc-800'}`}
               >
                  {fest ? <Zap className="w-4 h-4 fill-zinc-900" /> : <ZapOff className="w-4 h-4" />}
                  Festival Model
               </button>
            </div>
         </div>

         {/* 4-COLUMN LIVE METRICS GRID */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <MetricCard 
               label="Tracking Volume" 
               value="10" 
               subtitle="SKUs continuously monitored" 
               trend="+ Global Stable"
            />
            <MetricCard 
               label="Forecast Horizon" 
               value="7" 
               subtitle="Days predictive outlook" 
               trend="+ Active Window"
            />
            <MetricCard 
               label="Stockout Alerts" 
               value={stockoutCount.toString()} 
               subtitle={stockoutCount === 1 ? "Item under safety stock" : "Items under safety stock"} 
               trend={stockoutCount > 0 ? "- Urgent Action" : "+ Healthy Base"} 
               isRisk={stockoutCount > 0} 
            />
            <MetricCard 
               label="Overstock Warnings" 
               value={overstockCount.toString()} 
               subtitle={overstockCount === 1 ? "Clearance advised" : "Clearance advised"} 
               trend={overstockCount > 0 ? "- Metric Warning" : "+ Baseline Okay"} 
               isWarning={overstockCount > 0} 
            />
         </div>

         {/* TAB CONTENT WRAPPER */}
         <div className="relative w-full border border-zinc-200/80 bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] min-h-[500px]">
            
            {/* Mobile Tab Fallback */}
            <div className="lg:hidden flex overflow-x-auto scrollbar-hide mb-8 pb-4 gap-3 border-b border-zinc-100">
               {TABS.map((tab, i) => (
                  <button 
                     key={tab.id}
                     onClick={() => setActiveTab(i)}
                     className={`px-4 py-2 text-[13px] whitespace-nowrap font-medium rounded-full transition-colors flex items-center gap-2 border border-transparent ${activeTab === i ? 'bg-zinc-900 text-white shadow-md' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}
                  >
                     {tab.name}
                  </button>
               ))}
            </div>

           <AnimatePresence mode="wait">
              <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -15 }}
                 transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {activeTab === 0 && <ForecastTab />}
                {activeTab === 1 && <HistoryTab />}
                {activeTab === 2 && <AlertsTab />}
                {activeTab === 3 && <CompareTab />}
              </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
