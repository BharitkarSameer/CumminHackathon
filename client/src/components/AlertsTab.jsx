import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

function AlertItem({ item, badgeText, type }) {
  const isCritical = type === 'critical';
  const isWarning = type === 'warning';
  const isOk = type === 'ok';

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] ${
      isCritical ? 'bg-red-50/30 border-red-100 hover:bg-red-50/70' : 
      isWarning ? 'bg-amber-50/30 border-amber-100 hover:bg-amber-50/70' : 
      'bg-green-50/30 border-green-100 hover:bg-green-50/70'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
         isCritical ? 'bg-red-100 text-red-600' :
         isWarning ? 'bg-amber-100 text-amber-600' :
         'bg-green-100 text-green-600'
      }`}>
         {isCritical && <AlertCircle className="w-5 h-5" />}
         {isWarning && <AlertTriangle className="w-5 h-5" />}
         {isOk && <CheckCircle2 className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold tracking-tight text-zinc-900 mb-0.5">{item.name}</div>
        <div className="text-[13px] font-medium text-zinc-500 leading-snug">{item.message}</div>
      </div>
      <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase flex-shrink-0 ${
         isCritical ? 'bg-red-100 text-red-700' :
         isWarning ? 'bg-amber-100 text-amber-700' :
         'bg-green-100 text-green-700'
      }`}>
        {badgeText}
      </span>
    </div>
  );
}

export default function AlertsTab() {
  const { data, loading } = useFetch('/api/alerts');

  if (loading) return <div className="h-[200px] flex items-center justify-center text-[13px] text-zinc-400 font-medium tracking-wide">Scanning network anomalies...</div>;
  if (!data) return null;

  const { stockout, overstock, healthy } = data;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <h2 className="text-[17px] font-semibold tracking-tight text-red-600 flex items-center gap-2 mb-6">
           <AlertCircle className="w-5 h-5" /> Stockout Risk — Urgent Action
        </h2>
        {stockout.length === 0
          ? <div className="text-[13px] font-medium text-zinc-400">No stockout risks detected. Inventories operational.</div>
          : (
            <div className="flex flex-col gap-3">
              {stockout.map(item => (
                <AlertItem
                  key={item.id}
                  item={item}
                  type={item.severity || 'critical'}
                  badgeText={item.severity === 'critical' ? `Stockout in ${item.stockCoverDays}d` : `Watch — ${item.stockCoverDays}d`}
                />
              ))}
            </div>
          )
        }
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <h2 className="text-[17px] font-semibold tracking-tight text-amber-600 flex items-center gap-2 mb-6">
           <AlertTriangle className="w-5 h-5" /> Overstock Risk — Clearance Advised
        </h2>
        {overstock.length === 0
          ? <div className="text-[13px] font-medium text-zinc-400">No overstock anomalies detected.</div>
          : (
            <div className="flex flex-col gap-3">
              {overstock.map(item => (
                <AlertItem
                  key={item.id}
                  item={{ ...item, severity:'warning' }}
                  type="warning"
                  badgeText={`${item.suggestedDiscount}% discount limit`}
                />
              ))}
            </div>
          )
        }
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 lg:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
        <h2 className="text-[17px] font-semibold tracking-tight text-green-600 flex items-center gap-2 mb-6">
           <CheckCircle2 className="w-5 h-5" /> Healthy Telemetry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthy.map(item => (
            <AlertItem
              key={item.id}
              item={{ ...item, severity:'ok', message:'Stock volume and demand velocity perfectly balanced.' }}
              type="ok"
              badgeText="Optimized"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
