import React from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { ReplyOption, ToneType, TONE_OPTIONS } from '../types';
import { ReplyCard } from './ReplyCard';

interface ReplyListProps {
  options: ReplyOption[];
  tone: ToneType;
  onToneChange: (tone: ToneType) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onCopySuccess: () => void;
}

export const ReplyList: React.FC<ReplyListProps> = ({
  options,
  tone,
  onToneChange,
  onRegenerate,
  isRegenerating,
  onCopySuccess,
}) => {
  return (
    <section className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Section Header & Optional Tone Selector */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              ข้อความแนะนำ (3 แบบ)
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              เลือกแบบที่เหมาะกับลูกค้าคนนี้แล้วกดคัดลอกได้เลย
            </p>
          </div>

          {/* Optional Tone Selector: อ่อนโยน / เป็นกันเอง / สุภาพทางการ */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 px-1.5 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              โทน:
            </span>
            {TONE_OPTIONS.map((item) => {
              const isSelected = tone === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onToneChange(item.label)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer touch-manipulation ${
                    isSelected
                      ? 'bg-white dark:bg-stone-900 text-orange-700 dark:text-orange-400 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 Reply Cards */}
      <div className="space-y-4">
        {options.map((reply) => (
          <ReplyCard
            key={reply.id}
            reply={reply}
            onCopySuccess={onCopySuccess}
          />
        ))}
      </div>

      {/* Regenerate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className={`w-full min-h-[48px] py-3 px-5 rounded-xl font-bold text-sm sm:text-base border transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-xs touch-manipulation ${
            isRegenerating
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 cursor-not-allowed'
              : 'bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-800/80 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-orange-400'
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 text-orange-600 dark:text-orange-400 ${
              isRegenerating ? 'animate-spin' : ''
            }`}
          />
          <span>{isRegenerating ? 'กำลังสร้างชุดใหม่...' : '🔄 สร้างใหม่'}</span>
          <span className="text-xs font-normal text-stone-400 dark:text-stone-500">
            (โทน: {tone})
          </span>
        </button>
      </div>
    </section>
  );
};
