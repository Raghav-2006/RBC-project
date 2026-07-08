import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface PhoneFrameProps {
  children: ReactNode;
}

// Design at iPhone 14 Pro CSS dimensions and scale to fit the viewport.
// This way every font/padding inside the phone stays at real iOS sizes
// and the on-screen size adapts without distorting proportions.
const PHONE_W = 393;
const PHONE_H = 852;
const BEZEL = 14; // visual bezel thickness in design px

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { clientWidth: w, clientHeight: h } = el;
      const padding = 24;
      const sW = (w - padding) / (PHONE_W + BEZEL * 2);
      const sH = (h - padding) / (PHONE_H + BEZEL * 2);
      setScale(Math.min(sW, sH, 1.4));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="flex items-center justify-center h-full w-full overflow-hidden">
      <motion.div
        style={{
          width: PHONE_W + BEZEL * 2,
          height: PHONE_H + BEZEL * 2,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        initial={{ opacity: 0, scale: scale * 0.95 }}
        animate={{ opacity: 1, scale }}
        transition={{ type: 'spring' as const, stiffness: 280, damping: 28 }}
        className="relative shrink-0"
      >
        {/* Bezel */}
        <div
          className="absolute inset-0 bg-gray-900 shadow-2xl"
          style={{ borderRadius: 56 }}
        />
        {/* Notch (Dynamic Island style) */}
        <div
          className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-gray-900 rounded-full z-30"
          style={{ width: 120, height: 32 }}
        />
        {/* Screen */}
        <div
          className="absolute bg-white overflow-hidden"
          style={{
            top: BEZEL,
            left: BEZEL,
            width: PHONE_W,
            height: PHONE_H,
            borderRadius: 44,
          }}
        >
          <div className="absolute inset-0 overflow-auto">{children}</div>
          {/* Status bar overlay */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 z-30 pointer-events-none"
            style={{ height: 44 }}
          >
            <span className="text-white text-[14px] font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="17" height="11" viewBox="0 0 18 12" fill="white"><rect x="0" y="8" width="3" height="4" rx="0.5" /><rect x="5" y="5" width="3" height="7" rx="0.5" /><rect x="10" y="2" width="3" height="10" rx="0.5" /><rect x="15" y="0" width="3" height="12" rx="0.5" /></svg>
              <svg width="15" height="11" viewBox="0 0 16 12" fill="white"><path d="M8 2C5 2 2.4 3 0.5 4.7l1.4 1.5C3.4 4.8 5.6 4 8 4s4.6 0.8 6.1 2.2l1.4-1.5C13.6 3 11 2 8 2zM8 6c-1.8 0-3.5 0.6-4.8 1.6l1.4 1.5C5.6 8.4 6.7 8 8 8s2.4 0.4 3.4 1.1l1.4-1.5C11.5 6.6 9.8 6 8 6zm-2.4 4.2L8 12l2.4-1.8c-0.7-0.5-1.5-0.8-2.4-0.8s-1.7 0.3-2.4 0.8z" /></svg>
              <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="white" strokeOpacity="0.6" /><rect x="2" y="2" width="19" height="8" rx="1.5" fill="white" /><rect x="23" y="4" width="2" height="4" rx="1" fill="white" fillOpacity="0.6" /></svg>
            </div>
          </div>
        </div>
        {/* Home indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-gray-200 rounded-full z-30"
          style={{ bottom: 6, width: 134, height: 5 }}
        />
      </motion.div>
    </div>
  );
}
