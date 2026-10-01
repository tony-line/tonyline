import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry, isRetrying }) => {
  return (
    <div className="mt-6 bg-red-50/70 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900/50 p-5 text-center shadow-xs animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-2.5">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-900 dark:text-red-200 mb-1">
        ไม่สามารถสร้างข้อความได้ในขณะนี้
      </h3>
      <p className="text-xs sm:text-sm text-red-700/90 dark:text-red-300/80 mb-4 max-w-sm mx-auto">
        สัญญาณอินเทอร์เน็ตอาจขัดข้องชั่วคราว กรุณากดลองใหม่อีกครั้งครับ
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className={`min-h-[44px] py-2.5 px-6 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs active:scale-98 ${
          isRetrying ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
        <span>{isRetrying ? 'กำลังลองใหม่...' : 'ลองใหม่อีกครั้ง (Retry)'}</span>
      </button>
    </div>
  );
};
