import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { TranslationKey } from '../i18n/translations';

export type TaskId = 'checkBalance' | 'transferFunds' | 'managePayees' | 'payBill' | 'sendETransfer' | 'depositCheque';

interface TaskDef {
  id: TaskId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: React.ReactNode;
}

const stroke = '#005DAA';
const iconProps = {
  width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none',
  stroke, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
};

const tasks: TaskDef[] = [
  {
    id: 'checkBalance',
    titleKey: 'checkBalance',
    descKey: 'checkBalanceDesc',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="7" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    id: 'transferFunds',
    titleKey: 'transferFunds',
    descKey: 'transferFundsDesc',
    icon: (
      <svg {...iconProps}>
        <path d="M4 8.5a8 8 0 0 1 14-3" />
        <polyline points="18 2 18 5.5 14.5 5.5" />
        <path d="M20 15.5a8 8 0 0 1-14 3" />
        <polyline points="6 22 6 18.5 9.5 18.5" />
      </svg>
    ),
  },
  {
    id: 'sendETransfer',
    titleKey: 'sendETransfer',
    descKey: 'sendETransferDesc',
    icon: (
      <svg {...iconProps}>
        <path d="M3.5 11.5 21 4l-7.5 17.5-2.5-7L3.5 11.5Z" />
        <path d="M11 14 21 4" />
      </svg>
    ),
  },
  {
    id: 'payBill',
    titleKey: 'payBill',
    descKey: 'payBillDesc',
    icon: (
      <svg {...iconProps}>
        <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
        <path d="M10 8h4" />
        <path d="M10 12h4" />
        <path d="M10 16h2" />
      </svg>
    ),
  },
  {
    id: 'managePayees',
    titleKey: 'managePayees',
    descKey: 'managePayeesDesc',
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="9" r="3.5" />
        <path d="M2.5 20c.7-3.2 3.4-5 6.5-5s5.8 1.8 6.5 5" />
        <circle cx="17" cy="10.5" r="2.6" />
        <path d="M16 16.5c2.5.3 4.5 1.8 5 3.5" />
      </svg>
    ),
  },
  {
    id: 'depositCheque',
    titleKey: 'depositCheque',
    descKey: 'depositChequeDesc',
    icon: (
      <svg {...iconProps}>
        <path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
        <circle cx="12" cy="13" r="3.8" />
      </svg>
    ),
  },
];

interface TaskChooserProps {
  onSelectTask: (taskId: TaskId) => void;
}

export default function TaskChooser({ onSelectTask }: TaskChooserProps) {
  const { t } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const item = {
    hidden: { y: 24, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
  };

  return (
    <div className="h-full overflow-auto" style={{ background: 'linear-gradient(180deg, #F4F6F8 0%, #E9F0F7 100%)' }}>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Practice mode chip */}
          <motion.div variants={item} className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rbc-bright/30 text-rbc-blue text-[13px] font-medium shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              Practice Mode — no real money moves here
            </span>
          </motion.div>

          <motion.div variants={item} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold text-rbc-dark mb-3 tracking-tight">
              {t('learnAndPractice')}
            </h1>
            <p className="text-rbc-secondary text-lg max-w-xl mx-auto">
              Pick a task to try. Every screen looks and works like the real RBC Mobile app —
              you can practice with zero risk.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <motion.button
                key={task.id}
                variants={item}
                whileHover={{ y: -3, boxShadow: '0 12px 28px -12px rgba(0, 61, 132, 0.28)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTask(task.id)}
                className="group text-left bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-rbc-bright-lightest flex items-center justify-center shrink-0 group-hover:bg-rbc-bright-lighter transition-colors">
                    {task.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-[17px] font-semibold text-rbc-dark leading-snug mb-1">
                      {t(task.titleKey)}
                    </h3>
                    <p className="text-rbc-secondary text-[14px] leading-snug">
                      {t(task.descKey)}
                    </p>
                  </div>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="mt-1 shrink-0 group-hover:stroke-rbc-bright transition-colors"
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
