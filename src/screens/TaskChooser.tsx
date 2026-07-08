import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import type { TranslationKey } from '../i18n/translations';

export type TaskId = 'checkBalance' | 'transferFunds' | 'managePayees' | 'payBill' | 'sendETransfer' | 'depositCheque';

interface TaskDef {
  id: TaskId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: string;
}

const tasks: TaskDef[] = [
  { id: 'checkBalance', titleKey: 'checkBalance', descKey: 'checkBalanceDesc', icon: '📊' },
  { id: 'transferFunds', titleKey: 'transferFunds', descKey: 'transferFundsDesc', icon: '🔄' },
  { id: 'managePayees', titleKey: 'managePayees', descKey: 'managePayeesDesc', icon: '👤' },
  { id: 'payBill', titleKey: 'payBill', descKey: 'payBillDesc', icon: '💳' },
  { id: 'sendETransfer', titleKey: 'sendETransfer', descKey: 'sendETransferDesc', icon: '📱' },
  { id: 'depositCheque', titleKey: 'depositCheque', descKey: 'depositChequeDesc', icon: '📸' },
];

interface TaskChooserProps {
  onSelectTask: (taskId: TaskId) => void;
}

export default function TaskChooser({ onSelectTask }: TaskChooserProps) {
  const { t } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="h-full bg-rbc-bg overflow-auto p-8">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-rbc-dark mb-2">
            {t('learnAndPractice')}
          </h1>
          <p className="text-rbc-secondary text-lg">{t('chooseAnOption')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div key={task.id} variants={item}>
              <Card
                onClick={() => onSelectTask(task.id)}
                hoverable
                padding="lg"
                className="h-full border-2 border-transparent hover:border-rbc-bright transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{task.icon}</div>
                  <h3 className="text-lg font-semibold text-rbc-dark mb-1">{t(task.titleKey)}</h3>
                  <p className="text-rbc-secondary text-sm">{t(task.descKey)}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={item}
          className="mt-8 p-4 bg-rbc-bright-lightest rounded-xl text-center"
        >
          <p className="text-rbc-blue font-medium text-sm">
            🛡️ {t('practiceModeBanner')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
