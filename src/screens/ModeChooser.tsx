import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { TaskId } from './TaskChooser';
import type { TranslationKey } from '../i18n/translations';

interface ModeChooserProps {
  taskId: TaskId;
  onWatch: () => void;
  onTry: () => void;
  onBack: () => void;
}

const taskTitles: Record<TaskId, TranslationKey> = {
  checkBalance: 'checkBalance',
  transferFunds: 'transferFunds',
  managePayees: 'managePayees',
  payBill: 'payBill',
  sendETransfer: 'sendETransfer',
  depositCheque: 'depositCheque',
};

export default function ModeChooser({ taskId, onWatch, onTry, onBack }: ModeChooserProps) {
  const { t } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { y: 24, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
  };

  return (
    <div className="h-full overflow-auto" style={{ background: 'linear-gradient(180deg, #F4F6F8 0%, #E9F0F7 100%)' }}>
      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.button
            variants={item}
            onClick={onBack}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1 text-rbc-blue font-medium text-[15px] mb-6 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 6 9 12 15 18" />
            </svg>
            {t('back')}
          </motion.button>

          <motion.div variants={item} className="text-center mb-10">
            <p className="text-rbc-secondary text-[14px] font-medium tracking-wide uppercase mb-2">
              {t('learnAndPractice')}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-rbc-dark mb-3 tracking-tight">
              {t(taskTitles[taskId])}
            </h1>
            <p className="text-rbc-secondary text-lg">{t('howToLearn')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Watch demo */}
            <motion.button
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 16px 32px -14px rgba(0, 61, 132, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onWatch}
              className="text-left bg-white rounded-2xl p-8 border border-gray-200 cursor-pointer transition-shadow group"
            >
              <div className="w-16 h-16 rounded-2xl bg-rbc-bright-lightest flex items-center justify-center mb-5 group-hover:bg-rbc-bright-lighter transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="#005DAA">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-rbc-dark mb-1.5">{t('watchDemo')}</h3>
              <p className="text-rbc-secondary text-[15px] leading-snug mb-4">
                Sit back. We'll tap through the whole flow and explain each step.
              </p>
              <span className="inline-flex items-center gap-1 text-rbc-bright font-medium text-[14px]">
                Start watching
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </span>
            </motion.button>

            {/* Try it yourself */}
            <motion.button
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 16px 32px -14px rgba(0, 61, 132, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onTry}
              className="text-left bg-white rounded-2xl p-8 border-2 border-rbc-bright cursor-pointer transition-shadow group relative"
            >
              <span className="absolute top-4 right-4 text-[11px] font-semibold uppercase tracking-wider text-rbc-bright bg-rbc-bright-lightest px-2 py-0.5 rounded-full">
                Recommended
              </span>
              <div className="w-16 h-16 rounded-2xl bg-rbc-bright-lightest flex items-center justify-center mb-5 group-hover:bg-rbc-bright-lighter transition-colors">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#005DAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-rbc-dark mb-1.5">{t('tryItYourself')}</h3>
              <p className="text-rbc-secondary text-[15px] leading-snug mb-4">
                You tap through. We'll highlight the next step and cheer you on.
              </p>
              <span className="inline-flex items-center gap-1 text-rbc-bright font-medium text-[14px]">
                Start practicing
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </span>
            </motion.button>
          </div>

          <motion.div variants={item} className="mt-8 flex justify-center">
            <span className="inline-flex items-center gap-2 text-rbc-secondary text-[13px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              {t('practiceModeBanner')}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
