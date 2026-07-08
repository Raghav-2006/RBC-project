import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, onClick, className = '', hoverable = false, padding = 'md' }: CardProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      whileHover={hoverable ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } : undefined}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        bg-white rounded-2xl shadow-md
        ${onClick ? 'cursor-pointer active:shadow-sm' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
