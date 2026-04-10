import React from 'react';
import { ArrowLeft, Box, BrainCircuit, Activity, Database, Terminal, FileQuestion, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProcessFlow = () => {
  const steps = [
    { icon: <Database className="w-5 h-5"/>, label: "Collect" },
    { icon: <BrainCircuit className="w-5 h-5"/>, label: "Train" },
    { icon: <TrendingUp className="w-5 h-5"/>, label: "Forecast" },
    { icon: <AlertTriangle className="w-5 h-5"/>, label: "Alert" },
    { icon: <Activity className="w-5 h-5"/>, label: "Visualize" }
  ];

  return (
    <div className="w-full mt-10 mb-4 relative">
       {/* Connecting line */}
       <div className="absolute top-[32px] left-0 w-full h-[2px] bg-zinc-100 -translate-y-1/2 z-0 hidden md:block" />
       
       <div className="flex flex-col md:flex-row justify-between relative z-10 gap-6">
         {steps.map((s, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: i * 0.15 }}
             className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md border border-zinc-200/80 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all md:min-w-[130px] flex-1"
           >
             <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 relative">
                {s.icon}
                {/* Flowing animated dot */}
                {i < 4 && (
                   <motion.div 
                      animate={{ x: [0, 80] }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.2 }} 
                      className="absolute -right-2 top-1/2 -mt-1 w-2 h-2 rounded-full bg-blue-400 hidden md:block" 
                      style={{ opacity: 0.5 }}
                   />
                )}
             </div>
             <span className="text-[14px] font-bold tracking-tight text-zinc-700">{s.label}</span>
           </motion.div>
         ))}
       </div>
    </div>
  );
};

const ForecastChart = () => (
  <div className="w-full h-48 md:h-64 mt-8 relative rounded-3xl overflow-hidden bg-white border border-zinc-200 shadow-sm flex items-end">
    <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4285f4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4285f4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="#fafafa" />
      {/* Grid lines */}
      <line x1="0" y1="25" x2="100" y2="25" stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2 2" />
      
      {/* Confidence interval shadow */}
      <motion.path 
         initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1 }}
         d="M50,40 Q75,15 100,5 L100,60 Q75,60 50,55 Z" fill="url(#grad1)" 
      />
      
      {/* Main historical line */}
      <motion.path 
        initial={{ pathLength: 0 }} 
        whileInView={{ pathLength: 1 }} 
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M0,85 Q15,75 30,80 T50,50" 
        fill="none" stroke="#64748b" strokeWidth="2.5" 
      />
      
      {/* Forecast line */}
      <motion.path 
        initial={{ pathLength: 0 }} 
        whileInView={{ pathLength: 1 }} 
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
        d="M50,50 Q75,25 100,15" 
        fill="none" stroke="#4285f4" strokeWidth="3" strokeDasharray="6 6"
      />
      
      <circle cx="50" cy="50" r="4" fill="#4285f4" className="animate-pulse" />
      <circle cx="50" cy="50" r="8" fill="#4285f4" opacity="0.3" className="animate-ping" />
    </svg>
  </div>
);

const TerminalWindow = () => (
   <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full mt-8 rounded-[1.5rem] overflow-hidden bg-[#0a0a0c] border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
   >
      <div className="flex items-center justify-between px-5 py-3 bg-[#111114] border-b border-zinc-800/50">
         <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
         </div>
         <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">curl requests</span>
         <div className="w-10"></div>
      </div>
      <div className="p-6 font-mono text-[13px] leading-relaxed">
         <div className="flex gap-5 mb-4">
            <span className="text-zinc-600 select-none">1</span>
            <div><span className="text-[#a5d6ff]">GET</span><span className="text-[#7ee787]"> /api/v1/forecast \\</span></div>
         </div>
         <div className="flex gap-5 mb-4">
            <span className="text-zinc-600 select-none">2</span>
            <div className="pl-6"><span className="text-zinc-400">?sku=</span><span className="text-[#ff7b72]">"AC-1.5T"</span><span className="text-zinc-400"> &</span><span className="text-zinc-400">horizon=</span><span className="text-[#79c0ff]">30</span></div>
         </div>
         <div className="flex gap-5 mb-4">
            <span className="text-zinc-600 select-none">3</span>
            <div><span className="text-zinc-600 italic">{"// Computing probability density matrices..."}</span></div>
         </div>
         <div className="flex gap-5">
            <span className="text-zinc-600 select-none">4</span>
            <div className="text-zinc-300">
               <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }}>{`{ "status": 200, "demand_bounds": [142.1, 164.8] }`}</motion.span>
               <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-2.5 h-3 ml-2 bg-[#7ee787] align-middle shadow-[0_0_8px_#7ee787]" />
            </div>
         </div>
      </div>
   </motion.div>
);

const DemoDatasetVisual = () => (
  <div className="mt-8 w-full rounded-[1.5rem] overflow-hidden border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 font-mono text-[11px] md:text-[12px]">
    <div className="grid grid-cols-4 bg-[#f8fafc] text-zinc-500 font-semibold border-b border-zinc-200 p-4">
      <span>Date</span><span>SKU</span><span>Channel</span><span className="text-right">Units</span>
    </div>
    {[
      { d: '2025-06-01', s: 'AC-1.5T', c: 'Retail', u: '142' },
      { d: '2025-06-01', s: 'AC-1.5T', c: 'Online', u: '380' },
      { d: '2025-06-02', s: 'HT-2000', c: 'Retail', u: '12' },
      { d: '2025-06-02', s: 'W-Purifier', c: 'D2C', u: '65' },
    ].map((r, i) => (
      <div key={i} className="grid grid-cols-4 text-zinc-700 border-b border-zinc-100 p-4 hover:bg-blue-50/50 transition-colors cursor-pointer">
        <span>{r.d}</span>
        <span className="font-bold text-blue-600">{r.s}</span>
        <span>{r.c}</span>
        <span className="font-bold text-zinc-900 text-right">{r.u}</span>
      </div>
    ))}
  </div>
);

export default function Resources() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-zinc-900 overflow-hidden relative">
      
      {/* Background blobs for a crazy but soft look */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#eef2ff] rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 -z-10" />
      <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] bg-[#faf5ff] rounded-full blur-[140px] translate-x-1/3 -z-10" />

      <div className="max-w-[1300px] mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* Header with Branding */}
        <div className="flex items-center justify-between mb-16 px-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col items-start cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.05em', color: '#111', lineHeight: '1.1', fontFamily: 'serif', transition: 'opacity 0.2s', textTransform: 'uppercase' }} className="group-hover:opacity-70">
               DemandIQ
            </span>
            <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: '#8a8981', marginTop: '2px', transition: 'opacity 0.2s', textTransform: 'uppercase' }} className="group-hover:opacity-70">
               Inspired by Williams-Sonoma
            </span>
          </motion.div>

          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-black/[0.04] text-[13px] font-semibold text-[#8a8981] hover:text-[#111] hover:bg-white hover:shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="px-5 py-2 rounded-full bg-white text-blue-600 font-bold text-[11px] tracking-[0.2em] uppercase mb-8 inline-block border border-blue-100 shadow-sm">
                Engineering
            </span>
            <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-medium tracking-tighter text-zinc-900 mb-6 leading-[1.05]">
              System architecture <br/><span className="text-zinc-400">&</span> data schemas.
            </h1>
            <p className="text-xl text-zinc-500 max-w-3xl leading-relaxed font-light">
              Dive deep into how the DemandIQ engine fundamentally works. From probabilistic forecasting to scalable REST APIs.
            </p>
          </motion.div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card 1: Flowchart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white/40 backdrop-blur-3xl border border-zinc-200/50 p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-zinc-200/40 md:col-span-2">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Box className="w-7 h-7"/>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Pipeline Architecture</h2>
            </div>
            <ProcessFlow />
          </motion.div>

          {/* Card 2: AI Chart */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white/40 backdrop-blur-3xl border border-zinc-200/50 p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-zinc-200/40 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-5 mb-8">
                 <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                   <BrainCircuit className="w-7 h-7"/>
                 </div>
                 <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Model Inference</h2>
               </div>
               <div className="flex flex-col gap-5 text-[16px] text-zinc-600 leading-relaxed">
                 <p className="m-0"><strong>Time series forecasting:</strong> Leverages historical arrays to extrapolate complex future consumption trajectories.</p>
                 <p className="m-0"><strong>Bounded Confidence:</strong> Generates probabilistic upper and lower prediction bands to heavily quantify uncertainty.</p>
               </div>
            </div>
            <ForecastChart />
          </motion.div>

          {/* Card 3: Terminal */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/40 backdrop-blur-3xl border border-zinc-200/50 p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-zinc-200/40 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-5 mb-8">
                 <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-900/30">
                   <Terminal className="w-7 h-7"/>
                 </div>
                 <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">API Capabilities</h2>
               </div>
               <p className="text-[16px] text-zinc-600 leading-relaxed m-0">
                  Interact programmatically using our high-throughput REST API. Continuously synchronize live prediction sets into your own internal ERP tools.
               </p>
            </div>
            <TerminalWindow />
          </motion.div>

          {/* Card 4: Dataset */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white/40 backdrop-blur-3xl border border-zinc-200/50 p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-zinc-200/40 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-5 mb-8">
                 <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                   <Database className="w-7 h-7"/>
                 </div>
                 <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Data Simulation</h2>
               </div>
               <p className="text-[16px] text-zinc-600 leading-relaxed m-0">
                  Our live environment operates on a complex synthesis of 10 highly-seasonal electronic SKUs across multi-channel environments to accurately simulate real enterprise analytics.
               </p>
            </div>
            <DemoDatasetVisual />
          </motion.div>

          {/* Card 5: FAQ */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/40 backdrop-blur-3xl border border-zinc-200/50 p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-zinc-200/40 flex flex-col">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <FileQuestion className="w-7 h-7"/>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Technical FAQ</h2>
            </div>
            <div className="flex flex-col gap-8 flex-1 justify-center">
               <div className="border-b border-zinc-200/70 pb-6">
                  <h4 className="font-semibold text-zinc-900 text-lg mb-2">What data is strictly required?</h4>
                  <p className="text-[15px] text-zinc-500 leading-relaxed m-0">Typically 12-24 months of historical volume categorized explicitly by SKU string and sales channel format.</p>
               </div>
               <div className="pb-2">
                  <h4 className="font-semibold text-zinc-900 text-lg mb-2">How are risk alerts dynamically triggered?</h4>
                  <p className="text-[15px] text-zinc-500 leading-relaxed m-0">Alerts strictly execute when the algorithm detects <code>(Calculated Forecast - Current Available Stock)</code> falling under the configured global supplier lead time baseline.</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
