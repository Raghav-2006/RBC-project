import { useState } from 'react';
import { motion } from 'framer-motion';
import SimulatorShell from './SimulatorShell';
import { useApp } from '../../context/AppContext';
import { accounts, formatCurrency } from '../../data/mockData';
import PulsingHighlight from '../../components/ui/PulsingHighlight';
import CoachMark from '../../components/ui/CoachMark';
import Button from '../../components/ui/Button';
import OnScreenKeyboard from '../../components/ui/OnScreenKeyboard';
import SuccessAnimation from '../../components/ui/SuccessAnimation';

interface Props {
  mode: 'guided' | 'demo';
  onComplete: () => void;
  onBack: () => void;
}

export default function DepositChequeFlow({ mode, onComplete, onBack }: Props) {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const bankingAccounts = accounts.filter(a => a.category === 'banking');

  if (showSuccess) return <SuccessAnimation onTryAnother={onComplete} onHome={onBack} />;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('selectAccount')}</h3>
            <div className="space-y-3">
              {bankingAccounts.map(a => (
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
                      <p className="font-semibold text-rbc-dark">{formatCurrency(a.balance)}</p>
                    </div>
                  </button>
                </PulsingHighlight>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('enterAmount')}</h3>
            <PulsingHighlight active={mode === 'guided' && !amount}>
              <button onClick={() => setShowKeyboard(true)} className="w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-white cursor-pointer">
                <p className="text-sm text-rbc-secondary mb-1">{t('amount')}</p>
                <p className={`text-3xl font-bold ${amount ? 'text-rbc-dark' : 'text-gray-300'}`}>${amount || '0.00'}</p>
              </button>
            </PulsingHighlight>
            {amount && parseFloat(amount) > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <Button fullWidth size="lg" onClick={() => setStep(3)}>{t('next')}</Button>
              </motion.div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-6">{t('frontOfCheque')}</h3>
            <PulsingHighlight active={mode === 'guided' && !frontCaptured}>
              <div className="bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 aspect-[16/9] flex flex-col items-center justify-center mb-6">
                {frontCaptured ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-rbc-success/10 flex items-center justify-center mx-auto mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="text-rbc-success font-medium">Front captured</p>
                  </motion.div>
                ) : (
                  <>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M17 8h.01" />
                    </svg>
                    <p className="text-rbc-secondary mt-3">{t('takePhoto')}</p>
                  </>
                )}
              </div>
              {!frontCaptured && (
                <Button fullWidth size="lg" onClick={() => setFrontCaptured(true)}>
                  📸 {t('takePhoto')}
                </Button>
              )}
              {mode === 'guided' && !frontCaptured && (
                <CoachMark text="Tap to simulate taking a photo of the front" visible />
              )}
            </PulsingHighlight>

            {frontCaptured && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('backOfCheque')}</h3>
                <PulsingHighlight active={mode === 'guided' && !backCaptured}>
                  <div className="bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 aspect-[16/9] flex flex-col items-center justify-center mb-4">
                    {backCaptured ? (
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                        <div className="w-16 h-16 rounded-full bg-rbc-success/10 flex items-center justify-center mx-auto mb-2">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <p className="text-rbc-success font-medium">Back captured</p>
                      </motion.div>
                    ) : (
                      <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="18" rx="2" />
                          <circle cx="12" cy="12" r="3" />
                          <path d="M17 8h.01" />
                        </svg>
                        <p className="text-rbc-secondary mt-3">{t('takePhoto')}</p>
                      </>
                    )}
                  </div>
                  {!backCaptured && (
                    <Button fullWidth size="lg" onClick={() => setBackCaptured(true)}>
                      📸 {t('takePhoto')}
                    </Button>
                  )}
                </PulsingHighlight>
              </motion.div>
            )}

            {frontCaptured && backCaptured && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <Button fullWidth size="lg" onClick={() => setStep(4)}>{t('next')}</Button>
              </motion.div>
            )}
          </div>
        );

      case 4: {
        const acct = accounts.find(a => a.id === selectedAccount);
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('review')}</h3>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex justify-between">
                <span className="text-rbc-secondary">{t('to')}</span>
                <span className="font-medium text-rbc-dark">{acct?.name}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-rbc-secondary">{t('amount')}</span>
                <span className="font-bold text-rbc-dark text-xl">${amount}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <PulsingHighlight active={mode === 'guided'}>
                <Button fullWidth size="lg" onClick={() => setStep(5)}>{t('confirm')}</Button>
              </PulsingHighlight>
              <Button fullWidth size="lg" variant="outline" onClick={() => setStep(3)}>{t('back')}</Button>
            </div>
          </div>
        );
      }

      case 5:
        return (
          <div className="p-6 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-20 h-20 rounded-full bg-rbc-success/10 flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-rbc-dark mb-2">{t('depositComplete')}</h3>
              <p className="text-rbc-secondary mb-2">${amount} deposited</p>
              <p className="text-sm text-rbc-secondary mb-8">Funds may be held for up to 5 business days</p>
              <Button fullWidth size="lg" onClick={() => setShowSuccess(true)}>{t('done')}</Button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SimulatorShell currentStep={step} totalSteps={5} title={t('depositCheque')} onBack={step === 1 ? onBack : () => setStep(step - 1)}>
        {renderStep()}
      </SimulatorShell>
      <OnScreenKeyboard visible={showKeyboard} type="number" value={amount} onInput={setAmount} onSubmit={() => {}} onClose={() => setShowKeyboard(false)} />
    </>
  );
}
