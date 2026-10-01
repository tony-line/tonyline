import React from 'react';
import { Check, Copy } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 text-white text-xs sm:text-sm font-medium shadow-xl border border-slate-700/50 backdrop-blur-xs">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
        <span>{message}</span>
        <span className="text-slate-400 text-xs hidden sm:inline">
          (พร้อมส่งใน LINE ทันที)
        </span>
      </div>
    </div>
  );
};
