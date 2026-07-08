import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PulsingHighlightProps {
  children: ReactNode;
  active: boolean;
  onClick?: () => void;
  className?: string;
}

export default function PulsingHighlight({ children, active, onClick, className = '' }: PulsingHighlightProps) {
  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {active && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-rbc-gold pointer-events-none z-10"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(255,210,0,0.4)',
              '0 0 0 8px rgba(255,210,0,0)',
              '0 0 0 0 rgba(255,210,0,0.4)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      {children}
    </div>
  );
}
