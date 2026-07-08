import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';

interface PracticeGuideProps {
  instruction: string;
  step: number;
  totalSteps: number;
  visible: boolean;
  showFinish?: boolean;
  onFinish?: () => void;
}

export default function PracticeGuide({
  instruction,
  step,
  totalSteps,
  visible,
  showFinish,
  onFinish,
}: PracticeGuideProps) {
  const { t } = useApp();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="flex-shrink-0 border-t-2 border-rbc-gold bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="rounded-full bg-rbc-bright-lightest px-2.5 py-0.5 text-xs font-semibold text-rbc-blue">
              {t('step')} {step} {t('of')} {totalSteps}
            </span>
            <span className="text-[10px] font-medium text-rbc-secondary leading-tight text-right">
              🛡️ {t('practiceModeBanner')}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug text-rbc-dark">{instruction}</p>
          {showFinish && onFinish && (
            <Button fullWidth size="md" className="mt-3" onClick={onFinish}>
              {t('done')}
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
