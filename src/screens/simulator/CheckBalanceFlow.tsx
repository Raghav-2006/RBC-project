import { useState } from 'react';
import { motion } from 'framer-motion';
import SimulatorShell from './SimulatorShell';
import { useApp } from '../../context/AppContext';
import { accounts, recentTransactions, formatCurrency } from '../../data/mockData';
import PulsingHighlight from '../../components/ui/PulsingHighlight';
import CoachMark from '../../components/ui/CoachMark';
import SuccessAnimation from '../../components/ui/SuccessAnimation';

interface Props {
  mode: 'guided' | 'demo';
  onComplete: () => void;
  onBack: () => void;
}

export default function CheckBalanceFlow({ mode, onComplete, onBack }: Props) {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (showSuccess) {
    return <SuccessAnimation onTryAnother={onComplete} onHome={onBack} />;
  }

  const grouped = {
    banking: accounts.filter(a => a.category === 'banking'),
    creditCards: accounts.filter(a => a.category === 'creditCards'),
    investments: accounts.filter(a => a.category === 'investments'),
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <div className="bg-rbc-blue rounded-2xl p-6 mb-6 text-white">
              <p className="text-sm opacity-80 mb-1">{t('totalBalance')}</p>
              <motion.p
                className="text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {formatCurrency(totalBalance)}
              </motion.p>
            </div>

            {(Object.entries(grouped) as [string, typeof accounts][]).map(([cat, accts]) => (
              <div key={cat} className="mb-4">
                <h4 className="text-sm font-semibold text-rbc-secondary uppercase tracking-wider mb-2">
                  {t(cat as any)}
                </h4>
                <div className="space-y-2">
                  {accts.map(a => (
                    <PulsingHighlight key={a.id} active={mode === 'guided' && !selectedAccount}>
                      <button
                        onClick={() => { setSelectedAccount(a.id); setTimeout(() => setStep(2), 400); }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedAccount === a.id ? 'border-rbc-blue bg-rbc-bright-lightest' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-rbc-dark">{a.name}</p>
                            <p className="text-sm text-rbc-secondary">{a.accountNumber}</p>
                          </div>
                          <p className={`font-semibold ${a.balance < 0 ? 'text-rbc-warning' : 'text-rbc-dark'}`}>
                            {formatCurrency(a.balance)}
                          </p>
                        </div>
                      </button>
                      {mode === 'guided' && !selectedAccount && a.id === accts[0].id && (
                        <CoachMark text="Tap an account to view details" visible position="top" />
                      )}
                    </PulsingHighlight>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <p className="text-sm text-rbc-secondary">{accounts.find(a => a.id === selectedAccount)?.name}</p>
              <p className="text-3xl font-bold text-rbc-dark mt-1">
                {formatCurrency(accounts.find(a => a.id === selectedAccount)?.balance ?? 0)}
              </p>
              {accounts.find(a => a.id === selectedAccount)?.available !== undefined && (
                <p className="text-sm text-rbc-secondary mt-1">
                  {t('available')}: {formatCurrency(accounts.find(a => a.id === selectedAccount)?.available ?? 0)}
                </p>
              )}
            </div>

            <h4 className="text-sm font-semibold text-rbc-secondary uppercase tracking-wider mb-3">
              {t('recentTransactions')}
            </h4>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {recentTransactions.map(tx => (
                <motion.div
                  key={tx.id}
                  className="p-4 flex justify-between items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div>
                    <p className="font-medium text-rbc-dark text-sm">{tx.description}</p>
                    <p className="text-xs text-rbc-secondary">{tx.date}</p>
                  </div>
                  <p className={`font-semibold ${tx.amount > 0 ? 'text-rbc-success' : 'text-rbc-dark'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </motion.div>
              ))}
            </div>

            <PulsingHighlight active={mode === 'guided'} className="mt-6">
              <button
                onClick={() => setShowSuccess(true)}
                className="w-full bg-rbc-blue text-white py-4 rounded-xl font-semibold text-lg cursor-pointer"
              >
                {t('done')}
              </button>
              {mode === 'guided' && <CoachMark text="You've checked your balance! Tap Done" visible />}
            </PulsingHighlight>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SimulatorShell currentStep={step} totalSteps={2} title={t('checkBalance')} onBack={step === 1 ? onBack : () => setStep(1)}>
      {renderStep()}
    </SimulatorShell>
  );
}
