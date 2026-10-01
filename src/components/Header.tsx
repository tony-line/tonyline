import React from 'react';
import { MessageSquareText, History } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ historyCount, onOpenHistory }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs border-b border-stone-200 dark:border-stone-800 shadow-2xs">
      <div className="max-w-[640px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-orange-600 dark:bg-orange-700 text-white flex items-center justify-center shadow-xs">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-none">
                Guest Reply Helper
              </h1>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300">
                LINE
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              ผู้ช่วยตอบลูกค้าภาษาอังกฤษสำหรับร้านอาหาร
            </p>
          </div>
        </div>

        {/* Quick History Button */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer min-h-[40px]"
          title="ดูประวัติการสร้างข้อความ"
        >
          <History className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>ประวัติ</span>
          {historyCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
