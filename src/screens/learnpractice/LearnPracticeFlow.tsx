import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TaskId } from '../TaskChooser';
import PhoneFrame from '../apppreview/PhoneFrame';
import AppDashboard from '../apppreview/AppDashboard';
import SuccessAnimation from '../../components/ui/SuccessAnimation';
import {
  practiceScripts,
  type PracticeCommand,
  type PracticeLocation,
  type PracticeTarget,
} from './practiceSteps';

interface LearnPracticeFlowProps {
  taskId: TaskId;
  mode: 'guided' | 'demo';
  onComplete: () => void;
  onBack: () => void;
}

function targetToCommand(target: PracticeTarget): PracticeCommand | null {
  switch (target) {
    case 'home-account':
      return { type: 'openAccount', accountId: 'chq1' };
    case 'nav-move-money':
      return { type: 'tab', tab: 'moveMoney' };
    case 'qa-transfer':
      return { type: 'openTransfer' };
    case 'qa-send':
      return { type: 'openETransfer', startAt: 'send' };
    case 'qa-pay-bills':
      return { type: 'openPayBills', startAt: 'payForm' };
    case 'qa-deposit':
      return { type: 'openDeposit' };
    case 'hub-pay-bill':
      return { type: 'openPayBills', startAt: 'hub' };
    case 'hub-manage-payees':
      return { type: 'openPayBillsStep', step: 'managePayees' };
    default:
      return null;
  }
}

export default function LearnPracticeFlow({
  taskId,
  mode,
  onComplete,
  onBack,
}: LearnPracticeFlowProps) {
  const script = useMemo(() => practiceScripts[taskId], [taskId]);
  const [stepIndex, setStepIndex] = useState(0);
  const [location, setLocation] = useState<PracticeLocation>('home');
  const [practiceCommand, setPracticeCommand] = useState<PracticeCommand | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStep = script[stepIndex];
  const isLastStep = stepIndex === script.length - 1;
  const highlight = isLastStep ? null : currentStep?.target ?? null;
  const onFlowScreen = isLastStep && currentStep?.location === location;

  const handleTargetActivated = useCallback(
    (target: PracticeTarget) => {
      if (mode !== 'guided') return;
      if (script[stepIndex]?.target === target) {
        setStepIndex((i) => Math.min(i + 1, script.length - 1));
      }
    },
    [mode, script, stepIndex],
  );

  const handleCommandHandled = useCallback(() => {
    setPracticeCommand(null);
  }, []);

  // Demo mode: auto-tap highlighted targets
  useEffect(() => {
    if (mode !== 'demo' || showSuccess || isLastStep) return;
    const step = script[stepIndex];
    if (!step || step.target === 'flow-complete') return;

    const timer = window.setTimeout(() => {
      const cmd = targetToCommand(step.target);
      if (cmd) setPracticeCommand(cmd);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [mode, showSuccess, isLastStep, script, stepIndex]);

  // Demo mode: advance when the next screen is reached
  useEffect(() => {
    if (mode !== 'demo' || showSuccess) return;
    const next = script[stepIndex + 1];
    if (!next || location !== next.location) return;

    const timer = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, script.length - 1));
    }, 900);

    return () => window.clearTimeout(timer);
  }, [mode, showSuccess, script, stepIndex, location]);

  // Demo mode: finish on the final instruction screen
  useEffect(() => {
    if (mode !== 'demo' || showSuccess) return;
    const current = script[stepIndex];
    if (!current || current.target !== 'flow-complete' || location !== current.location) return;

    const timer = window.setTimeout(() => setShowSuccess(true), 2800);
    return () => window.clearTimeout(timer);
  }, [mode, showSuccess, script, stepIndex, location]);

  if (showSuccess) {
    return <SuccessAnimation onTryAnother={onComplete} onHome={onBack} />;
  }

  return (
    <div className="h-full bg-rbc-bg flex flex-col">
      <div className="flex-1 min-h-0">
        <PhoneFrame>
          <AppDashboard
            version="regular"
            practice={{
              mode,
              highlight,
              command: practiceCommand,
              onCommandHandled: handleCommandHandled,
              onLocationChange: setLocation,
              onTargetActivated: handleTargetActivated,
              guide: {
                instruction: currentStep?.instruction ?? '',
                step: stepIndex + 1,
                totalSteps: script.length,
                showFinish: mode === 'guided' && onFlowScreen,
                onFinish: () => setShowSuccess(true),
              },
            }}
          />
        </PhoneFrame>
      </div>
    </div>
  );
}
