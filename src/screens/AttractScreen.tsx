import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import RBCShield from '../components/ui/RBCShield';

interface AttractScreenProps {
  onStart: () => void;
}

export default function AttractScreen({ onStart }: AttractScreenProps) {
  const { t } = useApp();

  return (
    <motion.div
      className="h-full bg-gradient-to-b from-rbc-blue via-rbc-bright to-rbc-blue flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
      onClick={onStart}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="button"
      tabIndex={0}
      aria-label={t('attractSubheadline')}
    >
      {/* Animated background circles */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-white/5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-white/5"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-rbc-gold/5"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <RBCShield size={100} />
        </motion.div>

        <motion.h1
          className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mt-8 mb-4 max-w-3xl leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('attractHeadline')}
        </motion.h1>

        <motion.p
          className="text-white/80 text-xl md:text-2xl mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {t('attractSubheadline')}
        </motion.p>

        <motion.div
          className="flex gap-6 flex-wrap justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: '📱', label: 'e-Transfer' },
            { icon: '💳', label: 'Bill Pay' },
            { icon: '📊', label: 'Balances' },
            { icon: '📸', label: 'Deposits' },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-white"
              animate={{
                y: [0, -4, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
            >
              <div className="text-3xl mb-1">{feature.icon}</div>
              <div className="text-sm font-medium">{feature.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white/60 text-lg">Tap anywhere to begin</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
