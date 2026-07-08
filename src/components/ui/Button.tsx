import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

const variants = {
  primary: 'bg-rbc-blue text-white hover:bg-rbc-bright active:bg-[#004A87]',
  secondary: 'bg-rbc-bright-lightest text-rbc-blue hover:bg-rbc-bright-lighter active:bg-rbc-bright-lighter',
  outline: 'bg-white border-2 border-rbc-blue text-rbc-blue hover:bg-rbc-bright-lightest active:bg-rbc-bright-lighter',
  ghost: 'bg-transparent text-rbc-blue hover:bg-rbc-bright-lightest active:bg-rbc-bright-lighter',
};

const sizes = {
  sm: 'px-4 py-2 text-sm min-h-[40px]',
  md: 'px-6 py-3 text-base min-h-[48px]',
  lg: 'px-8 py-4 text-lg min-h-[56px]',
  xl: 'px-10 py-5 text-xl min-h-[64px]',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-colors duration-150 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
