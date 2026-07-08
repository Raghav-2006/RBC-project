import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProgressBar from '../../components/ui/ProgressBar';
import type { ReactNode } from 'react';

interface SimulatorShellProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack?: () => void;
}

export default function SimulatorShell({ children, currentStep, totalSteps, title, onBack }: SimulatorShellProps) {
  const { t } = useApp();

  return (
    <div className="h-full flex flex-col bg-rbc-bg">
      {/* Practice mode banner */}
      <div className="bg-rbc-gold/20 border-b border-rbc-gold/40 px-4 py-2 text-center">
        <p className="text-sm font-medium text-rbc-dark">
          🛡️ {t('practiceModeBanner')}
        </p>
      </div>

      {/* Simulator header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          {onBack && (
            <button onClick={onBack} className="text-rbc-blue font-medium cursor-pointer min-h-[44px] min-w-[44px] flex items-center">
              ← {t('back')}
            </button>
          )}
          <h2 className="text-xl font-semibold text-rbc-dark flex-1 text-center">{title}</h2>
          <div className="w-[44px]" />
        </div>
        <ProgressBar
          current={currentStep}
          total={totalSteps}
          label={`${t('step')} ${currentStep} ${t('of')} ${totalSteps}`}
        />
      </div>

      {/* Step content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="flex-1 overflow-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}
