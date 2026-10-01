import React, { useState } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { ReplyOption } from '../types';

interface ReplyCardProps {
  reply: ReplyOption;
  onCopySuccess: () => void;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({ reply, onCopySuccess }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = reply.english.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setIsCopied(true);
      onCopySuccess();

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-4 sm:p-5 flex flex-col justify-between transition-shadow hover:shadow-md">
      <div>
        {/* Header: Approach Label & LINE Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              แบบที่ {reply.optionNumber}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200/70 dark:border-orange-900/60">
              {reply.label}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 dark:text-stone-500">
            พร้อมส่ง LINE
          </span>
        </div>

        {/* English Message in Large Readable Text */}
        <div className="rounded-xl p-4 bg-stone-50/80 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 text-stone-900 dark:text-stone-100 font-medium text-base sm:text-lg leading-relaxed select-text mb-4">
          <p className="whitespace-pre-wrap font-sans">
            "{reply.english}"
          </p>
        </div>

        {/* Big Touch-Friendly Copy Button (Min height 48px) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 touch-manipulation ${
              isCopied
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 dark:bg-emerald-700'
                : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-500 text-white shadow-orange-600/20'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-5 h-5 text-white stroke-[2.5]" />
                <span>✓ คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 text-white/90" />
                <span>📋 คัดลอก</span>
              </>
            )}
          </button>
        </div>

        {/* Lighter Box: แปลเป็นไทย */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
            แปลเป็นไทย:
          </span>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed bg-amber-50/60 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/50 dark:border-amber-900/40">
            "{reply.thai}"
          </p>
        </div>
      </div>
    </div>
  );
};
