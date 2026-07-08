import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface OnScreenKeyboardProps {
  onInput: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  visible: boolean;
  type?: 'text' | 'number' | 'email';
  value: string;
}

const textRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['123', '@', 'space', '.', 'Done'],
];

const numberRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

export default function OnScreenKeyboard({ onInput, onSubmit, onClose, visible, type = 'text', value }: OnScreenKeyboardProps) {
  const [shifted, setShifted] = useState(false);

  const handleKey = (key: string) => {
    if (key === '⌫') {
      onInput(value.slice(0, -1));
    } else if (key === 'space') {
      onInput(value + ' ');
    } else if (key === 'shift') {
      setShifted(!shifted);
    } else if (key === 'Done') {
      onSubmit();
      onClose();
    } else if (key === '123' || key === 'ABC') {
      // toggle handled by parent
    } else {
      const char = shifted ? key.toUpperCase() : key;
      onInput(value + char);
      if (shifted) setShifted(false);
    }
  };

  const rows = type === 'number' ? numberRows : textRows;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 p-2 pb-4 z-50"
        >
          {type === 'number' ? (
            <div className="max-w-xs mx-auto">
              {rows.map((row, ri) => (
                <div key={ri} className="flex justify-center gap-2 mb-2">
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      className="flex-1 h-14 bg-white rounded-xl text-xl font-medium text-rbc-dark shadow-sm active:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
              <button
                onClick={() => { onSubmit(); onClose(); }}
                className="w-full h-12 bg-rbc-blue text-white rounded-xl text-lg font-semibold mt-1 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {rows.map((row, ri) => (
                <div key={ri} className="flex justify-center gap-1 mb-1">
                  {row.map((key) => {
                    const isSpecial = ['shift', '⌫', '123', 'Done'].includes(key);
                    const isSpace = key === 'space';
                    return (
                      <button
                        key={key}
                        onClick={() => handleKey(key)}
                        className={`
                          h-12 rounded-lg font-medium shadow-sm active:bg-gray-300 transition-colors cursor-pointer
                          ${isSpace ? 'flex-[4] bg-white text-rbc-dark' : ''}
                          ${isSpecial ? 'px-3 bg-gray-300 text-rbc-dark text-sm flex-none min-w-[48px]' : ''}
                          ${key === 'Done' ? 'bg-rbc-blue text-white' : ''}
                          ${!isSpecial && !isSpace ? 'flex-1 bg-white text-rbc-dark text-lg' : ''}
                        `}
                      >
                        {key === 'space' ? '' : shifted && key.length === 1 ? key.toUpperCase() : key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
