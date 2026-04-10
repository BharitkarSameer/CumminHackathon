import React from 'react';
import { ArrowLeft, Target, TrendingUp, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function UseCases() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#111] relative overflow-hidden">
      
      {/* Subtle modern background noise/gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] opacity-70" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-100/30 rounded-full blur-[150px] opacity-70" />
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-24 relative z-10">
        
        {/* Navigation */}
        <button 
           onClick={() => navigate('/')} 
           className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-black/[0.04] text-[13px] font-semibold text-[#8a8981] hover:text-[#111] hover:bg-white hover:shadow-sm transition-all mb-16"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Hero Section */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
           className="mb-16 md:mb-24"
        >
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-[#111] leading-[1.1] mb-6">
             Unlock the power of <br/> predictive inventory.
          </h1>
          <p className="text-xl text-[#8a8981] max-w-2xl leading-relaxed font-normal">
            See how DemandIQ helps modern enterprises predict demand trajectories and programmatically optimize supply chains across scenarios.
          </p>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* Card 1 */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
             className="group bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:bg-white/90 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-black/[0.04]">
                 <Target className="w-5 h-5"/>
               </div>
               <h2 className="text-[20px] font-semibold tracking-tight text-[#111] mb-5">Retail Inventory Optimization</h2>
               <ul className="flex flex-col gap-4 list-none m-0 p-0 mb-10">
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Predict demand for each SKU and maintain absolute optimal inventory levels.
                  </li>
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Avoid critical stockouts, seamlessly reduce excess inventory buffers, and improve availability.
                  </li>
               </ul>
               <div className="mt-auto flex items-center gap-2 text-[14px] font-semibold text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pt-4 border-t border-black/[0.03]">
                  Explore solution <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
             className="group bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:bg-white/90 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-black/[0.04]">
                 <TrendingUp className="w-5 h-5"/>
               </div>
               <h2 className="text-[20px] font-semibold tracking-tight text-[#111] mb-5">Appliance Demand Forecasting</h2>
               <ul className="flex flex-col gap-4 list-none m-0 p-0 mb-10">
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Handle aggressive seasonal demand spikes for HVAC (ACs, heaters, purifiers).
                  </li>
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Programmatically separate baseline long-term trends from cyclical weather patterns.
                  </li>
               </ul>
               <div className="mt-auto flex items-center gap-2 text-[14px] font-semibold text-indigo-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pt-4 border-t border-black/[0.03]">
                  Explore solution <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
             className="group bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:bg-white/90 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 mb-8 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-sm border border-black/[0.04]">
                 <Calendar className="w-5 h-5"/>
               </div>
               <h2 className="text-[20px] font-semibold tracking-tight text-[#111] mb-5">Festival & Event Planning</h2>
               <ul className="flex flex-col gap-4 list-none m-0 p-0 mb-10">
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Detect massive macro demand spikes securely during holidays and festivals.
                  </li>
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Adjust proactive inventory buffering smoothly weeks before peak periods.
                  </li>
               </ul>
               <div className="mt-auto flex items-center gap-2 text-[14px] font-semibold text-amber-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pt-4 border-t border-black/[0.03]">
                  Explore solution <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
             className="group bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:bg-white/90 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 mb-8 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm border border-black/[0.04]">
                 <AlertTriangle className="w-5 h-5"/>
               </div>
               <h2 className="text-[20px] font-semibold tracking-tight text-[#111] mb-5">Supply Chain Risk Analytics</h2>
               <ul className="flex flex-col gap-4 list-none m-0 p-0 mb-10">
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Continuously compare real-time stock cover duration vs supplier lead times.
                  </li>
                  <li className="flex items-start text-[14.5px] text-[#8a8981] leading-relaxed before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mt-2 before:mr-3 before:flex-shrink-0 group-hover:text-zinc-600 transition-colors">
                    Detect low-stock scenarios days in advance and generate automated actions.
                  </li>
               </ul>
               <div className="mt-auto flex items-center gap-2 text-[14px] font-semibold text-red-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pt-4 border-t border-black/[0.03]">
                  Explore solution <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
