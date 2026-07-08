import { motion, AnimatePresence } from 'framer-motion';

interface CoachMarkProps {
  text: string;
  visible: boolean;
  position?: 'top' | 'bottom';
}

export default function CoachMark({ text, visible, position = 'bottom' }: CoachMarkProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? -8 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'bottom' ? -8 : 8 }}
          className={`absolute ${position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 z-50`}
        >
          <div className="bg-rbc-blue text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
            {text}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-rbc-blue rotate-45 ${
                position === 'bottom' ? '-top-1.5' : '-bottom-1.5'
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
