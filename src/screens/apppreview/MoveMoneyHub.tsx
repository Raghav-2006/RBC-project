import {
  ChevronRightIcon, KebabIcon, TransferIcon, PayBillsIcon, SendIcon,
  PeopleIcon, CameraIcon, SplitIcon, CrossBorderIcon, GlobeIcon,
} from '../../components/ui/RBCIcons';

interface MoveMoneyHubProps {
  onOpenETransfer: () => void;
}

interface Row {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
}

export default function MoveMoneyHub({ onOpenETransfer }: MoveMoneyHubProps) {
  const canadaRows: Row[] = [
    { icon: <TransferIcon size={20} stroke="#006AC3" />, label: 'Transfer Between My Accounts' },
    { icon: <PayBillsIcon size={20} stroke="#006AC3" />, label: 'Pay a Bill' },
    {
      icon: <SendIcon size={20} stroke="#006AC3" />,
      label: (<><em className="italic">Interac</em> e-Transfer</>),
      onClick: onOpenETransfer,
    },
    { icon: <PeopleIcon size={20} stroke="#006AC3" />, label: 'Send to an RBC Client' },
    { icon: <CameraIcon size={20} stroke="#006AC3" />, label: 'Deposit a Cheque' },
    { icon: <SplitIcon size={20} stroke="#006AC3" />, label: 'Split with Friends' },
  ];

  const internationalRows: Row[] = [
    { icon: <CrossBorderIcon size={20} stroke="#006AC3" />, label: 'Transfer funds to RBC Bank U.S.' },
    { icon: <GlobeIcon size={20} stroke="#006AC3" />, label: 'International Money Transfer' },
    { icon: <DollarCircleIcon />, label: 'Purchase Foreign Cash' },
  ];

  return (
    <div className="flex flex-col bg-white min-h-full">
      {/* Blue header — leaves room for status-bar / notch */}
      <div
        className="relative pt-14 pb-3 px-5"
        style={{ background: 'linear-gradient(180deg, #0E5BAC 0%, #003E7E 100%)' }}
      >
        <div className="absolute right-4 top-12">
          <div className="w-7 h-7 bg-white rounded-md rounded-bl-none flex items-center justify-center">
            <span className="text-rbc-bright text-[13px] font-semibold leading-none">?</span>
          </div>
        </div>
      </div>

      {/* Title row */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-[26px] font-extralight text-rbc-dark leading-none">Move Money</h1>
        <KebabIcon size={18} stroke="#6B7280" />
      </div>

      {/* Canada section */}
      <SectionHeader title="Canada" />
      {canadaRows.map((r, i) => (
        <HubRow key={i} icon={r.icon} label={r.label} onClick={r.onClick} />
      ))}

      {/* International section */}
      <SectionHeader title="International" />
      {internationalRows.map((r, i) => (
        <HubRow key={i} icon={r.icon} label={r.label} onClick={r.onClick} />
      ))}

      {/* Spacer for bottom nav */}
      <div className="h-24" />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#F2F4F5] px-5 py-3 border-y border-[#E5E7EA]">
      <h3 className="text-[15px] text-rbc-dark">{title}</h3>
    </div>
  );
}

function HubRow({ icon, label, onClick }: Row) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer border-b border-[#E5E7EA] active:bg-[#F2F4F5]"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rbc-bright/60 shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-[16px] text-rbc-dark">{label}</span>
      <ChevronRightIcon size={16} stroke="#9CA3AF" />
    </button>
  );
}

function DollarCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8.5c-.5-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.3s1.3 2 3 2.2c1.7.2 3 .8 3 2.2S13.7 16 12 16c-1.4 0-2.5-.5-3-1.5" />
      <line x1="12" y1="5.5" x2="12" y2="7" />
      <line x1="12" y1="16" x2="12" y2="17.5" />
    </svg>
  );
}
