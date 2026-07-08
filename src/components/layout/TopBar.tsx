import { useApp } from '../../context/AppContext';
import RBCShield from '../ui/RBCShield';

interface TopBarProps {
  onHome: () => void;
  showControls?: boolean;
}

export default function TopBar({ onHome, showControls = true }: TopBarProps) {
  const { t } = useApp();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-50">
      <button onClick={onHome} className="flex items-center gap-3 cursor-pointer">
        <RBCShield size={36} />
        <span className="text-rbc-blue font-semibold text-lg hidden sm:inline">RBC Royal Bank</span>
      </button>

      {showControls && (
        <button
          onClick={onHome}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-rbc-blue bg-rbc-bright-lightest hover:bg-rbc-bright-lighter transition-colors min-h-[44px] cursor-pointer"
        >
          {t('startOver')}
        </button>
      )}
    </header>
  );
}
