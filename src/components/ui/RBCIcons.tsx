// RBC-style outline icons — 1.5px stroke, rounded line caps
// Sized via width/height props; color via stroke (currentColor by default)

interface IconProps {
  size?: number;
  className?: string;
  stroke?: string;
}

const base = (extra: string = '') =>
  `inline-block ${extra}`.trim();

const stdProps = (size: number, stroke: string, className: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke,
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: base(className),
});

// Paper-plane / Send icon
export function SendIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M3.5 11.5 21 4l-7.5 17.5-2.5-7L3.5 11.5Z" />
      <path d="M11 14 21 4" />
    </svg>
  );
}

// Two circular arrows / Transfer
export function TransferIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M4 8.5a8 8 0 0 1 14-3" />
      <polyline points="18 2 18 5.5 14.5 5.5" />
      <path d="M20 15.5a8 8 0 0 1-14 3" />
      <polyline points="6 22 6 18.5 9.5 18.5" />
    </svg>
  );
}

// Receipt / Pay bills
export function PayBillsIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
      <path d="M10 8h4" />
      <path d="M10 12h4" />
      <path d="M10 16h2" />
    </svg>
  );
}

// House
export function HomeIcon({ size = 24, className = '', stroke = 'currentColor', filled = false }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke} className={className}>
        <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />
      </svg>
    );
  }
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />
    </svg>
  );
}

// Credit card / Accounts
export function CardIcon({ size = 24, className = '', stroke = 'currentColor', filled = false }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke} className={className}>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <rect x="2.5" y="8" width="19" height="2.5" fill="white" opacity="0.3" />
      </svg>
    );
  }
  return (
    <svg {...stdProps(size, stroke, className)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <line x1="2.5" y1="10" x2="21.5" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  );
}

// Envelope with $ — Move Money
export function MoveMoneyIcon({ size = 24, className = '', stroke = 'currentColor', filled = false }: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" fill={stroke} />
        <path d="M3.5 7 12 13l8.5-6" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="17.5" r="3.5" fill={stroke} stroke="white" strokeWidth="1" />
        <text x="18" y="19" textAnchor="middle" fontSize="5" fill="white" fontWeight="700">$</text>
      </svg>
    );
  }
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3.5 7 12 13l8.5-6" />
      <circle cx="18.5" cy="17.5" r="3" fill="white" />
      <text x="18.5" y="19" textAnchor="middle" fontSize="4.5" fill={stroke} stroke="none" fontWeight="700">$</text>
    </svg>
  );
}

// Three horizontal lines — More
export function MoreIcon({ size = 24, className = '', stroke = 'currentColor', filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg {...stdProps(size, stroke, className)} strokeWidth={filled ? 2 : 1.6}>
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

// Up-chevron (FAB)
export function ChevronUpIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)} strokeWidth={2.4}>
      <polyline points="6 14 12 8 18 14" />
    </svg>
  );
}

// Right chevron
export function ChevronRightIcon({ size = 16, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)} strokeWidth={1.5}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

// Back chevron
export function ChevronLeftIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)} strokeWidth={1.8}>
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}

// Search magnifier
export function SearchIcon({ size = 18, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)} strokeWidth={1.8}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" />
    </svg>
  );
}

// Help bubble (?)
export function HelpIcon({ size = 22, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" className={className}>
      <path d="M4 5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-4 4v-4H6a2 2 0 0 1-2-2V5Z" />
      <text x="12.5" y="13.5" textAnchor="middle" fontSize="9" fill={stroke} fontWeight="700">?</text>
    </svg>
  );
}

// Kebab (vertical dots)
export function KebabIcon({ size = 20, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke} className={className}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

// NOMI avatar (small smiley face profile)
export function NomiAvatar({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="15" fill="none" stroke="#006AC3" strokeWidth="1.4" />
      <circle cx="16" cy="13" r="4" fill="none" stroke="#006AC3" strokeWidth="1.4" />
      <path d="M7 26c1.5-3.5 5-5.5 9-5.5s7.5 2 9 5.5" fill="none" stroke="#006AC3" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Camera (deposit cheque)
export function CameraIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.8" />
    </svg>
  );
}

// People (split/recipient)
export function PeopleIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <circle cx="9" cy="9" r="3.5" />
      <path d="M2.5 20c.7-3.2 3.4-5 6.5-5s5.8 1.8 6.5 5" />
      <circle cx="17" cy="10.5" r="2.6" />
      <path d="M16 16.5c2.5.3 4.5 1.8 5 3.5" />
    </svg>
  );
}

// Globe (international)
export function GlobeIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

// Split (branching arrow)
export function SplitIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <path d="M12 21V11" />
      <path d="M5 11l7-7 7 7" />
      <path d="M5 11v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3" />
    </svg>
  );
}

// Up-down arrows
export function CrossBorderIcon({ size = 24, className = '', stroke = 'currentColor' }: IconProps) {
  return (
    <svg {...stdProps(size, stroke, className)}>
      <line x1="9" y1="3" x2="9" y2="21" />
      <polyline points="5 7 9 3 13 7" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <polyline points="11 17 15 21 19 17" />
    </svg>
  );
}
