import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export default function IdleOverlay() {
  const { showIdleWarning, t } = useApp();

  return (
    <AnimatePresence>
      {showIdleWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md mx-4"
          >
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-semibold text-rbc-dark mb-2">{t('stillThere')}</h2>
            <p className="text-rbc-secondary text-lg">{t('stillThereDesc')}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
