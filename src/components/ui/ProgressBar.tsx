import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-rbc-secondary">{label}</span>
          <span className="text-sm font-medium text-rbc-blue">{current}/{total}</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-rbc-blue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
