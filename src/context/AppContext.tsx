import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import translations, { type Language, type TranslationKey } from '../i18n/translations';

type TextSize = 'default' | 'large' | 'xlarge';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (on: boolean) => void;
  t: (key: TranslationKey) => string;
  resetAll: () => void;
  isIdle: boolean;
  showIdleWarning: boolean;
  /** Seconds until auto-reset while the warning is showing. 0 outside the warning window. */
  secondsUntilReset: number;
  /** Called when the user taps "I'm still here" to keep the session alive. */
  dismissIdleWarning: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Reasonable timings for a branch kiosk:
// - Warning at 90s of inactivity
// - Auto-reset at 120s (30s countdown while the warning is on screen)
// Enough slack for a Client Advisor to pull a customer aside for a minute.
const IDLE_WARNING_MS = 90_000;
const IDLE_RESET_MS = 120_000;
const COUNTDOWN_TICK_MS = 1_000;

export function AppProvider({ children, onIdleReset }: { children: ReactNode; onIdleReset: () => void }) {
  const [language, setLanguage] = useState<Language>('en');
  const [textSize, setTextSize] = useState<TextSize>('default');
  const [highContrast, setHighContrast] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [secondsUntilReset, setSecondsUntilReset] = useState(0);

  const warningTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const t = useCallback(
    (key: TranslationKey) => translations[language][key],
    [language]
  );

  const resetAll = useCallback(() => {
    setLanguage('en');
    setTextSize('default');
    setHighContrast(false);
    setIsIdle(false);
    setShowIdleWarning(false);
    setSecondsUntilReset(0);
  }, []);

  const clearAllIdleTimers = () => {
    clearTimeout(warningTimer.current);
    clearTimeout(resetTimer.current);
    clearInterval(countdownTimer.current);
  };

  const resetIdleTimers = useCallback(() => {
    setShowIdleWarning(false);
    setIsIdle(false);
    setSecondsUntilReset(0);
    clearAllIdleTimers();

    warningTimer.current = setTimeout(() => {
      setShowIdleWarning(true);
      // Start ticking down the seconds shown on the overlay
      const remainingSeconds = Math.round((IDLE_RESET_MS - IDLE_WARNING_MS) / 1000);
      setSecondsUntilReset(remainingSeconds);
      countdownTimer.current = setInterval(() => {
        setSecondsUntilReset(s => (s > 0 ? s - 1 : 0));
      }, COUNTDOWN_TICK_MS);
    }, IDLE_WARNING_MS);

    resetTimer.current = setTimeout(() => {
      setIsIdle(true);
      resetAll();
      onIdleReset();
    }, IDLE_RESET_MS);
  }, [resetAll, onIdleReset]);

  const dismissIdleWarning = useCallback(() => {
    resetIdleTimers();
  }, [resetIdleTimers]);

  useEffect(() => {
    // Skip idle handling when ?screen= debug query param is present
    if (new URLSearchParams(window.location.search).has('screen')) return;

    const events = ['touchstart', 'mousedown', 'mousemove', 'keydown', 'scroll'] as const;
    const handler = () => resetIdleTimers();

    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetIdleTimers();

    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      clearAllIdleTimers();
    };
  }, [resetIdleTimers]);

  const textSizeClass = textSize === 'xlarge' ? 'text-size-xlarge' : textSize === 'large' ? 'text-size-large' : 'text-size-default';

  return (
    <AppContext.Provider value={{ language, setLanguage, textSize, setTextSize, highContrast, setHighContrast, t, resetAll, isIdle, showIdleWarning, secondsUntilReset, dismissIdleWarning }}>
      <div className={`h-full ${textSizeClass} ${highContrast ? 'high-contrast' : ''}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
