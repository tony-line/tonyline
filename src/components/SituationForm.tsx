import React, { useRef, useEffect } from 'react';
import { Sparkles, Trash2, AlertCircle } from 'lucide-react';
import {
  SituationInput,
  WHAT_HAPPENED_CHIPS,
  CUSTOMER_FEELS_CHIPS,
  DESIRED_ENDING_CHIPS,
} from '../types';

interface SituationFormProps {
  input: SituationInput;
  onChange: (updated: Partial<SituationInput>) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
  validationError: string | null;
  onClearValidation: () => void;
}

export const SituationForm: React.FC<SituationFormProps> = ({
  input,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  validationError,
  onClearValidation,
}) => {
  const whatHappenedRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-focus the first textarea on load
  useEffect(() => {
    whatHappenedRef.current?.focus();
  }, []);

  // Helper to append or set chip text
  const handleChipClick = (
    field: 'whatHappened' | 'customerFeels' | 'desiredEnding',
    chipText: string
  ) => {
    const currentVal = input[field] || '';
    if (!currentVal.trim()) {
      onChange({ [field]: chipText });
    } else if (!currentVal.includes(chipText)) {
      onChange({ [field]: `${currentVal.trim()}, ${chipText}` });
    }
    if (field === 'whatHappened' && validationError) {
      onClearValidation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
            สถานการณ์ลูกค้า (Situation)
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            พิมพ์เป็นภาษาไทย หรือแตะคำสำเร็จรูปด้านล่าง
          </p>
        </div>
        {(input.whatHappened || input.customerFeels || input.desiredEnding) && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างข้อมูล</span>
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        onKeyDown={handleKeyDown}
        className="space-y-4"
      >
        {/* Field 1: เกิดอะไรขึ้น (Required) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="whatHappened"
              className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1"
            >
              เกิดอะไรขึ้น <span className="text-orange-600 dark:text-orange-400">*</span>
              <span className="text-[11px] font-normal text-stone-400 dark:text-stone-500">
                (จำเป็น)
              </span>
            </label>
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              Ctrl+Enter เพื่อส่ง
            </span>
          </div>

          <textarea
            id="whatHappened"
            ref={whatHappenedRef}
            rows={2}
            value={input.whatHappened}
            onChange={(e) => {
              onChange({ whatHappened: e.target.value });
              if (validationError && e.target.value.trim()) {
                onClearValidation();
              }
            }}
            placeholder="เช่น ออเดอร์ช้าไป 30 นาที ลูกค้าหิวมากและเริ่มไม่พอใจ..."
            className={`w-full p-3 text-sm sm:text-base rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 transition-colors resize-y leading-relaxed focus:outline-hidden focus:ring-3 ${
              validationError
                ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
                : 'border-stone-200 dark:border-stone-700 focus:border-orange-500 focus:ring-orange-500/20'
            }`}
          />

          {validationError && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quick chips for What Happened */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {WHAT_HAPPENED_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick('whatHappened', chip)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-800 dark:hover:bg-orange-950/70 dark:hover:text-orange-200 active:scale-95 transition-all cursor-pointer font-medium touch-manipulation"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: ลูกค้าพูด/รู้สึกอย่างไร (Optional) */}
        <div>
          <label
            htmlFor="customerFeels"
            className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1.5"
          >
            ลูกค้าพูด/รู้สึกอย่างไร{' '}
            <span className="text-[11px] font-normal text-stone-400 dark:text-stone-500">
              (ไม่บังคับ)
            </span>
          </label>

          <textarea
            id="customerFeels"
            rows={2}
            value={input.customerFeels}
            onChange={(e) => onChange({ customerFeels: e.target.value })}
            placeholder="เช่น ลูกค้าถามว่าทำไมนานจัง และบอกว่าจะไม่รอแล้ว..."
            className="w-full p-3 text-sm sm:text-base rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/20 focus:outline-hidden transition-colors resize-y leading-relaxed"
          />

          {/* Quick chips for Customer Feels */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {CUSTOMER_FEELS_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick('customerFeels', chip)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-800 dark:hover:bg-orange-950/70 dark:hover:text-orange-200 active:scale-95 transition-all cursor-pointer font-medium touch-manipulation"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Field 3: อยากให้จบด้วยอะไร (Optional) */}
        <div>
          <label
            htmlFor="desiredEnding"
            className="block text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1.5"
          >
            อยากให้จบด้วยอะไร{' '}
            <span className="text-[11px] font-normal text-stone-400 dark:text-stone-500">
              (ไม่บังคับ)
            </span>
          </label>

          <textarea
            id="desiredEnding"
            rows={2}
            value={input.desiredEnding}
            onChange={(e) => onChange({ desiredEnding: e.target.value })}
            placeholder="เช่น ขอโทษและแจ้งว่ากำลังเอาอาหารมาเสิร์ฟ พร้อมแถมเครื่องดื่มให้..."
            className="w-full p-3 text-sm sm:text-base rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/20 focus:outline-hidden transition-colors resize-y leading-relaxed"
          />

          {/* Quick chips for Desired Ending */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {DESIRED_ENDING_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick('desiredEnding', chip)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-800 dark:hover:bg-orange-950/70 dark:hover:text-orange-200 active:scale-95 transition-all cursor-pointer font-medium touch-manipulation"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Large Primary Submit Button (Min height 48px) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer touch-manipulation ${
              isLoading
                ? 'bg-stone-300 dark:bg-stone-700 text-stone-500 dark:text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-500 text-white shadow-orange-600/25 hover:shadow-orange-600/35'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>กำลังสร้างข้อความตอบกลับ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-orange-200" />
                <span>✨ สร้างข้อความ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
