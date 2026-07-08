import type { ReactNode } from 'react';
import PulsingHighlight from '../../components/ui/PulsingHighlight';
import type { PracticeTarget } from './practiceSteps';

interface PracticeHighlightProps {
  target: PracticeTarget;
  activeTarget: PracticeTarget | null;
  children: ReactNode;
  className?: string;
}

export default function PracticeHighlight({
  target,
  activeTarget,
  children,
  className = '',
}: PracticeHighlightProps) {
  return (
    <PulsingHighlight active={activeTarget === target} className={className}>
      {children}
    </PulsingHighlight>
  );
}
