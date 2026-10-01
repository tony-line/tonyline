import React from 'react';
import { X, History, Trash2, ArrowRight, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-[540px] max-h-[85vh] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              ประวัติข้อความล่าสุด (10 รายการ)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-12 text-center text-stone-400 dark:text-stone-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">ยังไม่มีประวัติข้อความ</p>
              <p className="text-xs mt-0.5">เมื่อสร้างข้อความ ระบบจะบันทึกไว้ที่นี่ให้โดยอัตโนมัติ</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="group p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-orange-400 dark:hover:border-orange-500 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 mb-1.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(item.timestamp)}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    โทน: {item.tone}
                  </span>
                </div>

                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 leading-snug mb-2">
                  {item.whatHappened}
                </p>

                <div className="text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-200/60 dark:border-stone-800 line-clamp-1 italic">
                  "{item.options[0]?.english}"
                </div>

                <div className="mt-2.5 flex items-center justify-end text-xs font-semibold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                  <span>เปิดข้อความชุดนี้</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติทั้งหมด</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              ปิด
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
