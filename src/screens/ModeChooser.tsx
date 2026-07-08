import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
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

  return (
    <div className="h-full bg-rbc-bg flex items-center justify-center p-8">
      <motion.div
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-rbc-dark mb-2">
          {t(taskTitles[taskId])}
        </h1>
        <p className="text-rbc-secondary text-lg mb-10">{t('howToLearn')}</p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <Card onClick={onWatch} hoverable padding="lg" className="border-2 border-transparent hover:border-rbc-bright">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-rbc-bright-lightest flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#005DAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-rbc-dark mb-1">{t('watchDemo')}</h3>
              <p className="text-rbc-secondary text-sm">Auto-playing step-by-step walkthrough</p>
            </div>
          </Card>

          <Card onClick={onTry} hoverable padding="lg" className="border-2 border-transparent hover:border-rbc-bright">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-rbc-bright-lightest flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#005DAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-rbc-dark mb-1">{t('tryItYourself')}</h3>
              <p className="text-rbc-secondary text-sm">{t('guided')} — tap through with coach marks</p>
            </div>
          </Card>
        </div>

        <Button variant="ghost" onClick={onBack} size="lg">
          ← {t('back')}
        </Button>
      </motion.div>
    </div>
  );
}
