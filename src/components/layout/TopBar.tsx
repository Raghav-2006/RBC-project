import { useApp } from '../../context/AppContext';
import RBCShield from '../ui/RBCShield';

interface TopBarProps {
  onHome: () => void;
  showControls?: boolean;
}

export default function TopBar({ onHome, showControls = true }: TopBarProps) {
  const { language, setLanguage, textSize, setTextSize, highContrast, setHighContrast, t } = useApp();

  const cycleTextSize = () => {
    const next = textSize === 'default' ? 'large' : textSize === 'large' ? 'xlarge' : 'default';
    setTextSize(next);
  };

  const textSizeLabel = textSize === 'default' ? 'A' : textSize === 'large' ? 'A+' : 'A++';

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-50">
      <button onClick={onHome} className="flex items-center gap-3 cursor-pointer">
        <RBCShield size={36} />
        <span className="text-rbc-blue font-semibold text-lg hidden sm:inline">RBC Royal Bank</span>
      </button>

      {showControls && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-rbc-blue bg-rbc-bright-lightest hover:bg-rbc-bright-lighter transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>

          <button
            onClick={cycleTextSize}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-rbc-blue bg-rbc-bright-lightest hover:bg-rbc-bright-lighter transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
            aria-label="Change text size"
          >
            {textSizeLabel}
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] cursor-pointer ${
              highContrast
                ? 'bg-rbc-dark text-white'
                : 'text-rbc-blue bg-rbc-bright-lightest hover:bg-rbc-bright-lighter'
            }`}
            aria-label="Toggle high contrast"
          >
            ◐
          </button>

          <div className="w-px h-8 bg-gray-200 mx-1" />

          <button
            onClick={onHome}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-rbc-blue bg-rbc-bright-lightest hover:bg-rbc-bright-lighter transition-colors min-h-[44px] cursor-pointer"
          >
            {t('startOver')}
          </button>
        </div>
      )}
    </header>
  );
}
