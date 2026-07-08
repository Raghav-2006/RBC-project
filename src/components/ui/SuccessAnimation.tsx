import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Button from './Button';
import { useState } from 'react';

interface SuccessAnimationProps {
  onTryAnother: () => void;
  onHome: () => void;
}

export default function SuccessAnimation({ onTryAnother, onHome }: SuccessAnimationProps) {
  const { t } = useApp();
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-rbc-bg p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-rbc-success flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 15, delay: 0.2 }}
      >
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>

      {/* Confetti particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#FFD200', '#005DAA', '#16A34A', '#006AC3', '#73B0E3'][i % 5],
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            opacity: 0,
            scale: [1, 1.5, 0],
          }}
          transition={{
            duration: 1.5,
            delay: 0.3 + Math.random() * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.h1
        className="text-4xl font-bold text-rbc-dark mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {t('youDidIt')}
      </motion.h1>

      <motion.p
        className="text-rbc-secondary text-lg mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {t('tryAnother')}
      </motion.p>

      <motion.div
        className="flex gap-4 mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button onClick={onTryAnother} size="lg">
          {t('tryAnother')}
        </Button>
        <Button onClick={onHome} variant="outline" size="lg">
          {t('mainMenu')}
        </Button>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        {feedback === null ? (
          <>
            <p className="text-rbc-secondary mb-3">{t('wasThisHelpful')}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setFeedback('yes')}
                className="text-3xl hover:scale-110 transition-transform cursor-pointer p-2"
                aria-label={t('yes')}
              >
                👍
              </button>
              <button
                onClick={() => setFeedback('no')}
                className="text-3xl hover:scale-110 transition-transform cursor-pointer p-2"
                aria-label={t('no')}
              >
                👎
              </button>
            </div>
          </>
        ) : (
          <motion.p
            className="text-rbc-success font-medium"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {t('thankYou')}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
