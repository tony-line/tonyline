import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SituationForm } from './components/SituationForm';
import { ReplyList } from './components/ReplyList';
import { HistoryModal } from './components/HistoryModal';
import { ErrorState } from './components/ErrorState';
import { Toast } from './components/Toast';
import { SituationInput, ReplyOption, HistoryItem, ToneType } from './types';
import { generateReplies } from './services/messageService';

const STORAGE_KEY = 'guest_reply_helper_history';

const INITIAL_INPUT: SituationInput = {
  whatHappened: '',
  customerFeels: '',
  desiredEnding: '',
  tone: 'อ่อนโยน',
};

export default function App() {
  const [input, setInput] = useState<SituationInput>(INITIAL_INPUT);
  const [options, setOptions] = useState<ReplyOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 10));
        }
      }
    } catch (e) {
      console.error('Failed to load history from localStorage:', e);
    }
  }, []);

  // Save history helper (max 10 items)
  const saveToHistory = (inputData: SituationInput, generatedOptions: ReplyOption[]) => {
    try {
      const newItem: HistoryItem = {
        id: `hist-${Date.now()}`,
        timestamp: Date.now(),
        whatHappened: inputData.whatHappened,
        customerFeels: inputData.customerFeels,
        desiredEnding: inputData.desiredEnding,
        tone: inputData.tone,
        options: generatedOptions,
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev.filter((h) => h.whatHappened !== inputData.whatHappened)].slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  const handleInputChange = (updated: Partial<SituationInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
  };

  const handleClear = () => {
    setInput(INITIAL_INPUT);
    setOptions([]);
    setHasError(false);
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async (isRegen: boolean = false, overrideTone?: ToneType) => {
    // Only "what happened" is required
    if (!input.whatHappened.trim()) {
      setValidationError('กรุณาระบุว่าเกิดอะไรขึ้นก่อนครับ/ค่ะ');
      return;
    }

    setValidationError(null);
    setHasError(false);

    if (isRegen) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }

    const payload: SituationInput = {
      ...input,
      tone: overrideTone || input.tone,
    };

    try {
      const replies = await generateReplies(payload);
      if (replies && replies.length === 3) {
        setOptions(replies);
        saveToHistory(payload, replies);

        // Smooth scroll to Section 2 for mobile single-hand usability
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.error('Failed to generate messages:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleToneChange = (newTone: ToneType) => {
    setInput((prev) => ({ ...prev, tone: newTone }));
    // Regenerate with the newly selected tone immediately
    handleGenerate(true, newTone);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setInput({
      whatHappened: item.whatHappened,
      customerFeels: item.customerFeels,
      desiredEnding: item.desiredEnding,
      tone: item.tone,
    });
    setOptions(item.options);
    setHasError(false);
    setValidationError(null);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const showCopyToast = () => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans antialiased selection:bg-orange-200 selection:text-orange-900">
      {/* Header with App Title and History trigger */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Single-Screen Content: Centered, max-w ~640px */}
      <main className="flex-1 w-full max-w-[640px] mx-auto px-3.5 sm:px-4 py-4 sm:py-6">
        {/* Section 1 – Situation (Inputs) */}
        <SituationForm
          input={input}
          onChange={handleInputChange}
          onSubmit={() => handleGenerate(false)}
          onClear={handleClear}
          isLoading={isLoading}
          validationError={validationError}
          onClearValidation={() => setValidationError(null)}
        />

        {/* Section 2 – Generated Replies / Error State */}
        <div ref={resultsRef} className="scroll-mt-16">
          {hasError ? (
            <ErrorState
              onRetry={() => handleGenerate(false)}
              isRetrying={isLoading}
            />
          ) : options.length === 3 ? (
            <ReplyList
              options={options}
              tone={input.tone}
              onToneChange={handleToneChange}
              onRegenerate={() => handleGenerate(true)}
              isRegenerating={isRegenerating}
              onCopySuccess={showCopyToast}
            />
          ) : null}
        </div>
      </main>

      {/* Mobile-Friendly Floating Toast */}
      <Toast message="คัดลอกข้อความแล้ว พร้อมวางใน LINE ทันที" isVisible={isToastVisible} />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
