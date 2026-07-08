import { useState } from 'react';
import { motion } from 'framer-motion';
import SimulatorShell from './SimulatorShell';
import { useApp } from '../../context/AppContext';
import { payees, formatCurrency } from '../../data/mockData';
import PulsingHighlight from '../../components/ui/PulsingHighlight';
import CoachMark from '../../components/ui/CoachMark';
import Button from '../../components/ui/Button';
import SuccessAnimation from '../../components/ui/SuccessAnimation';

interface Props {
  mode: 'guided' | 'demo';
  onComplete: () => void;
  onBack: () => void;
}

export default function ManagePayeesFlow({ mode, onComplete, onBack }: Props) {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedPayee, setSelectedPayee] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (showSuccess) return <SuccessAnimation onTryAnother={onComplete} onHome={onBack} />;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('managePayees')}</h3>
            <div className="space-y-3">
              {payees.map(p => (
                <PulsingHighlight key={p.id} active={mode === 'guided' && !selectedPayee}>
                  <button
                    onClick={() => { setSelectedPayee(p.id); setTimeout(() => setStep(2), 400); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedPayee === p.id ? 'border-rbc-blue bg-rbc-bright-lightest' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-rbc-dark">{p.name}</p>
                        <p className="text-sm text-rbc-secondary">{p.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        {p.amountDue && <p className="font-semibold text-rbc-dark">{formatCurrency(p.amountDue)}</p>}
                        {p.dueDate && <p className="text-xs text-rbc-secondary">Due {p.dueDate}</p>}
                      </div>
                    </div>
                  </button>
                  {mode === 'guided' && !selectedPayee && p.id === payees[0].id && (
                    <CoachMark text="Tap a payee to view details" visible position="top" />
                  )}
                </PulsingHighlight>
              ))}
            </div>

            <PulsingHighlight active={mode === 'guided' && !!selectedPayee} className="mt-6">
              <Button fullWidth size="lg" variant="outline">
                + {t('addRecipient')}
              </Button>
            </PulsingHighlight>
          </div>
        );

      case 2: {
        const p = payees.find(x => x.id === selectedPayee);
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold text-rbc-dark mb-4">{p?.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-rbc-secondary">{t('accountNumber')}</span>
                  <span className="font-medium text-rbc-dark">{p?.accountNumber}</span>
                </div>
                {p?.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-rbc-secondary">{t('dueDate')}</span>
                    <span className="font-medium text-rbc-dark">{p.dueDate}</span>
                  </div>
                )}
                {p?.amountDue && (
                  <div className="flex justify-between">
                    <span className="text-rbc-secondary">{t('amountDue')}</span>
                    <span className="font-bold text-rbc-dark">{formatCurrency(p.amountDue)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button fullWidth size="lg" onClick={() => setStep(3)}>{t('payBill')}</Button>
              <Button fullWidth size="lg" variant="outline" onClick={() => setStep(1)}>{t('back')}</Button>
            </div>
          </div>
        );
      }

      case 3:
        return (
          <div className="p-6 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-20 h-20 rounded-full bg-rbc-success/10 flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-rbc-dark mb-2">{t('done')}</h3>
              <p className="text-rbc-secondary mb-8">You've viewed and managed your payees</p>
              <Button fullWidth size="lg" onClick={() => setShowSuccess(true)}>{t('done')}</Button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SimulatorShell currentStep={step} totalSteps={3} title={t('managePayees')} onBack={step === 1 ? onBack : () => setStep(step - 1)}>
      {renderStep()}
    </SimulatorShell>
  );
}
