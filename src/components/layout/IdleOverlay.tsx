import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function IdleOverlay() {
  const { showIdleWarning, secondsUntilReset, dismissIdleWarning, t } = useApp();

  return (
    <AnimatePresence>
      {showIdleWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-6"
          onClick={dismissIdleWarning}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring' as const, stiffness: 260, damping: 24 }}
            className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4" aria-hidden>👋</div>
            <h2 className="text-2xl font-semibold text-rbc-dark mb-2">
              {t('stillThere')}
            </h2>
            <p className="text-rbc-secondary text-lg mb-6">
              {t('stillThereDesc')}
            </p>
            <p className="text-rbc-secondary text-sm mb-6">
              Resetting in{' '}
              <span className="font-semibold text-rbc-dark tabular-nums">
                {secondsUntilReset}
              </span>{' '}
              second{secondsUntilReset === 1 ? '' : 's'}
            </p>
            <button
              onClick={dismissIdleWarning}
              className="w-full py-4 rounded-xl bg-rbc-blue text-white font-semibold text-lg cursor-pointer active:bg-rbc-bright transition-colors"
              autoFocus
            >
              I'm still here
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
