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
}

const AppContext = createContext<AppContextType | null>(null);

const IDLE_WARNING_MS = 45_000;
const IDLE_RESET_MS = 60_000;

export function AppProvider({ children, onIdleReset }: { children: ReactNode; onIdleReset: () => void }) {
  const [language, setLanguage] = useState<Language>('en');
  const [textSize, setTextSize] = useState<TextSize>('default');
  const [highContrast, setHighContrast] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  const warningTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
  }, []);

  const resetIdleTimers = useCallback(() => {
    setShowIdleWarning(false);
    setIsIdle(false);
    clearTimeout(warningTimer.current);
    clearTimeout(resetTimer.current);

    warningTimer.current = setTimeout(() => {
      setShowIdleWarning(true);
    }, IDLE_WARNING_MS);

    resetTimer.current = setTimeout(() => {
      setIsIdle(true);
      resetAll();
      onIdleReset();
    }, IDLE_RESET_MS);
  }, [resetAll, onIdleReset]);

  useEffect(() => {
    // Skip idle handling when ?screen= debug query param is present
    if (new URLSearchParams(window.location.search).has('screen')) return;

    const events = ['touchstart', 'mousedown', 'mousemove', 'keydown', 'scroll'] as const;
    const handler = () => resetIdleTimers();

    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetIdleTimers();

    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      clearTimeout(warningTimer.current);
      clearTimeout(resetTimer.current);
    };
  }, [resetIdleTimers]);

  const textSizeClass = textSize === 'xlarge' ? 'text-size-xlarge' : textSize === 'large' ? 'text-size-large' : 'text-size-default';

  return (
    <AppContext.Provider value={{ language, setLanguage, textSize, setTextSize, highContrast, setHighContrast, t, resetAll, isIdle, showIdleWarning }}>
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
