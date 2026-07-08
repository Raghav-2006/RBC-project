import { useState } from 'react';
import { motion } from 'framer-motion';
import SimulatorShell from './SimulatorShell';
import { useApp } from '../../context/AppContext';
import { accounts, recipients, formatCurrency } from '../../data/mockData';
import PulsingHighlight from '../../components/ui/PulsingHighlight';
import CoachMark from '../../components/ui/CoachMark';
import Button from '../../components/ui/Button';
import OnScreenKeyboard from '../../components/ui/OnScreenKeyboard';
import SuccessAnimation from '../../components/ui/SuccessAnimation';

interface ETransferFlowProps {
  mode: 'guided' | 'demo';
  onComplete: () => void;
  onBack: () => void;
}

export default function ETransferFlow({ mode, onComplete, onBack }: ETransferFlowProps) {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [securityQ, setSecurityQ] = useState('');
  const [securityA, setSecurityA] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<'amount' | 'securityQ' | 'securityA'>('amount');
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 6;

  const bankingAccounts = accounts.filter(a => a.category === 'banking');

  const openKeyboard = (target: 'amount' | 'securityQ' | 'securityA') => {
    setKeyboardTarget(target);
    setShowKeyboard(true);
  };

  const handleKeyboardInput = (val: string) => {
    if (keyboardTarget === 'amount') setAmount(val);
    else if (keyboardTarget === 'securityQ') setSecurityQ(val);
    else setSecurityA(val);
  };

  const currentKeyboardValue = keyboardTarget === 'amount' ? amount : keyboardTarget === 'securityQ' ? securityQ : securityA;

  if (showSuccess) {
    return <SuccessAnimation onTryAnother={onComplete} onHome={onBack} />;
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('selectRecipient')}</h3>
            <div className="space-y-3">
              {recipients.map((r) => (
                <PulsingHighlight key={r.id} active={mode === 'guided' && !selectedRecipient}>
                  <button
                    onClick={() => {
                      setSelectedRecipient(r.id);
                      setTimeout(() => setStep(2), 400);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedRecipient === r.id
                        ? 'border-rbc-blue bg-rbc-bright-lightest'
                        : 'border-gray-200 bg-white hover:border-rbc-bright-light'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-rbc-bright-lightest flex items-center justify-center text-rbc-blue font-semibold text-lg">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-rbc-dark">{r.name}</p>
                        <p className="text-sm text-rbc-secondary">{r.email}</p>
                        {r.autoDeposit && (
                          <span className="text-xs text-rbc-success font-medium">{t('autoDeposit')}</span>
                        )}
                      </div>
                    </div>
                  </button>
                  {mode === 'guided' && !selectedRecipient && (
                    <CoachMark text={`${t('tapHere')} — ${t('selectRecipient')}`} visible position="top" />
                  )}
                </PulsingHighlight>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('selectAccount')}</h3>
            <div className="space-y-3">
              {bankingAccounts.map((a) => (
                <PulsingHighlight key={a.id} active={mode === 'guided' && !selectedAccount}>
                  <button
                    onClick={() => {
                      setSelectedAccount(a.id);
                      setTimeout(() => setStep(3), 400);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedAccount === a.id
                        ? 'border-rbc-blue bg-rbc-bright-lightest'
                        : 'border-gray-200 bg-white hover:border-rbc-bright-light'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-rbc-dark">{a.name}</p>
                        <p className="text-sm text-rbc-secondary">{a.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-rbc-dark">{formatCurrency(a.balance)}</p>
                        <p className="text-xs text-rbc-secondary">{t('available')}</p>
                      </div>
                    </div>
                  </button>
                  {mode === 'guided' && !selectedAccount && (
                    <CoachMark text={`${t('tapHere')} — ${t('selectAccount')}`} visible position="top" />
                  )}
                </PulsingHighlight>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('enterAmount')}</h3>
            <PulsingHighlight active={mode === 'guided' && !amount}>
              <button
                onClick={() => openKeyboard('amount')}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-white cursor-pointer"
              >
                <p className="text-sm text-rbc-secondary mb-1">{t('amount')}</p>
                <p className={`text-3xl font-bold ${amount ? 'text-rbc-dark' : 'text-gray-300'}`}>
                  ${amount || '0.00'}
                </p>
              </button>
              {mode === 'guided' && !amount && (
                <CoachMark text={`${t('tapHere')} — ${t('enterAmount')}`} visible />
              )}
            </PulsingHighlight>

            {amount && parseFloat(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <PulsingHighlight active={mode === 'guided'}>
                  <Button fullWidth size="lg" onClick={() => setStep(4)}>
                    {t('next')}
                  </Button>
                </PulsingHighlight>
              </motion.div>
            )}
          </div>
        );

      case 4: {
        const recipientObj = recipients.find(r => r.id === selectedRecipient);
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">
              {recipientObj?.autoDeposit ? t('autoDeposit') : t('securityQuestion')}
            </h3>
            {recipientObj?.autoDeposit ? (
              <div className="bg-rbc-bright-lightest rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rbc-success flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <p className="font-semibold text-rbc-dark">{t('autoDeposit')}</p>
                </div>
                <p className="text-sm text-rbc-secondary">
                  {recipientObj.name} has Interac e-Transfer Autodeposit enabled. No security question needed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <PulsingHighlight active={mode === 'guided' && !securityQ}>
                  <button
                    onClick={() => openKeyboard('securityQ')}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-white cursor-pointer"
                  >
                    <p className="text-sm text-rbc-secondary mb-1">{t('securityQuestion')}</p>
                    <p className={`text-base ${securityQ ? 'text-rbc-dark' : 'text-gray-400'}`}>
                      {securityQ || 'e.g., What is your favourite colour?'}
                    </p>
                  </button>
                </PulsingHighlight>
                <PulsingHighlight active={mode === 'guided' && !!securityQ && !securityA}>
                  <button
                    onClick={() => openKeyboard('securityA')}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-white cursor-pointer"
                  >
                    <p className="text-sm text-rbc-secondary mb-1">{t('securityAnswer')}</p>
                    <p className={`text-base ${securityA ? 'text-rbc-dark' : 'text-gray-400'}`}>
                      {securityA || 'Enter answer'}
                    </p>
                  </button>
                </PulsingHighlight>
              </div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <PulsingHighlight active={mode === 'guided'}>
                <Button fullWidth size="lg" onClick={() => setStep(5)}>
                  {t('next')}
                </Button>
              </PulsingHighlight>
            </motion.div>
          </div>
        );
      }

      case 5: {
        const recipientObj = recipients.find(r => r.id === selectedRecipient);
        const accountObj = accounts.find(a => a.id === selectedAccount);
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-rbc-dark mb-4">{t('reviewTransfer')}</h3>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex justify-between">
                <span className="text-rbc-secondary">{t('to')}</span>
                <span className="font-medium text-rbc-dark">{recipientObj?.name}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-rbc-secondary">{t('from')}</span>
                <span className="font-medium text-rbc-dark">{accountObj?.name}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-rbc-secondary">{t('amount')}</span>
                <span className="font-bold text-rbc-dark text-xl">${amount}</span>
              </div>
              {!recipientObj?.autoDeposit && securityQ && (
                <div className="p-4 flex justify-between">
                  <span className="text-rbc-secondary">{t('securityQuestion')}</span>
                  <span className="font-medium text-rbc-dark">{securityQ}</span>
                </div>
              )}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-3">
              <PulsingHighlight active={mode === 'guided'}>
                <Button fullWidth size="lg" onClick={() => setStep(6)}>
                  {t('confirm')} — ${amount}
                </Button>
              </PulsingHighlight>
              <Button fullWidth size="lg" variant="outline" onClick={() => setStep(3)}>
                {t('back')}
              </Button>
            </motion.div>
          </div>
        );
      }

      case 6:
        return (
          <div className="p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
            >
              <div className="w-20 h-20 rounded-full bg-rbc-success/10 flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-rbc-dark mb-2">{t('transferComplete')}</h3>
              <p className="text-rbc-secondary mb-2">
                ${amount} sent to {recipients.find(r => r.id === selectedRecipient)?.name}
              </p>
              <p className="text-sm text-rbc-secondary mb-8">Reference #SIM-{Date.now().toString().slice(-6)}</p>

              <Button fullWidth size="lg" onClick={() => setShowSuccess(true)}>
                {t('done')}
              </Button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SimulatorShell
        currentStep={step}
        totalSteps={totalSteps}
        title={t('sendETransfer')}
        onBack={step === 1 ? onBack : () => setStep(step - 1)}
      >
        {renderStep()}
      </SimulatorShell>

      <OnScreenKeyboard
        visible={showKeyboard}
        type={keyboardTarget === 'amount' ? 'number' : 'text'}
        value={currentKeyboardValue}
        onInput={handleKeyboardInput}
        onSubmit={() => {}}
        onClose={() => setShowKeyboard(false)}
      />
    </>
  );
}
