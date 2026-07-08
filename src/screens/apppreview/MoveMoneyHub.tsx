import {
  ChevronRightIcon, KebabIcon, TransferIcon, PayBillsIcon, SendIcon,
  PeopleIcon, CameraIcon, SplitIcon, CrossBorderIcon, GlobeIcon,
} from '../../components/ui/RBCIcons';
import PracticeHighlight from '../learnpractice/PracticeHighlight';
import type { PracticeTarget } from '../learnpractice/practiceSteps';

interface MoveMoneyHubProps {
  onOpenTransfer: () => void;
  onOpenETransfer: () => void;
  onOpenPayBills: () => void;
  onOpenDeposit: () => void;
  seniorMode?: boolean;
  practiceHighlight?: PracticeTarget | null;
  onPracticeTap?: (target: PracticeTarget, action: () => void) => void;
}

interface Row {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  practiceTarget?: PracticeTarget;
}

export default function MoveMoneyHub({
  onOpenTransfer,
  onOpenETransfer,
  onOpenPayBills,
  onOpenDeposit,
  seniorMode = false,
  practiceHighlight = null,
  onPracticeTap,
}: MoveMoneyHubProps) {
  const tap = (target: PracticeTarget, action?: () => void) => {
    if (action && onPracticeTap) onPracticeTap(target, action);
    else action?.();
  };

  const canadaRows: Row[] = [
    { icon: <TransferIcon size={20} stroke="#006AC3" />, label: 'Transfer Between My Accounts', onClick: onOpenTransfer },
    {
      icon: <PayBillsIcon size={20} stroke="#006AC3" />,
      label: 'Pay a Bill',
      onClick: () => tap('hub-pay-bill', onOpenPayBills),
      practiceTarget: 'hub-pay-bill',
    },
    {
      icon: <SendIcon size={20} stroke="#006AC3" />,
      label: (<><em className="italic">Interac</em> e-Transfer</>),
      onClick: onOpenETransfer,
    },
    { icon: <PeopleIcon size={20} stroke="#006AC3" />, label: 'Send to an RBC Client' },
    { icon: <CameraIcon size={20} stroke="#006AC3" />, label: 'Deposit a Cheque', onClick: onOpenDeposit },
    { icon: <SplitIcon size={20} stroke="#006AC3" />, label: 'Split with Friends' },
  ];

  const internationalRows: Row[] = [
    { icon: <CrossBorderIcon size={20} stroke="#006AC3" />, label: 'Transfer funds to RBC Bank U.S.' },
    { icon: <GlobeIcon size={20} stroke="#006AC3" />, label: 'International Money Transfer' },
    { icon: <DollarCircleIcon />, label: 'Purchase Foreign Cash' },
  ];

  return (
    <div className={`flex flex-col bg-white min-h-full ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
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
      <div className={`px-5 flex items-center justify-between ${seniorMode ? 'pt-7 pb-5' : 'pt-6 pb-3'}`}>
        <h1 className={`${seniorMode ? 'text-[34px] font-normal' : 'text-[26px] font-extralight'} text-rbc-dark leading-none`}>Move Money</h1>
        <KebabIcon size={18} stroke="#6B7280" />
      </div>

      {/* Canada section */}
      <SectionHeader title="Canada" seniorMode={seniorMode} />
      {canadaRows.map((r, i) => (
        r.practiceTarget ? (
          <PracticeHighlight key={i} target={r.practiceTarget} activeTarget={practiceHighlight}>
            <HubRow icon={r.icon} label={r.label} onClick={r.onClick} seniorMode={seniorMode} />
          </PracticeHighlight>
        ) : (
          <HubRow key={i} icon={r.icon} label={r.label} onClick={r.onClick} seniorMode={seniorMode} />
        )
      ))}

      {/* International section */}
      <SectionHeader title="International" seniorMode={seniorMode} />
      {internationalRows.map((r, i) => (
        <HubRow key={i} icon={r.icon} label={r.label} onClick={r.onClick} seniorMode={seniorMode} />
      ))}

      {/* Spacer for bottom nav */}
      <div className="h-24" />
    </div>
  );
}

function SectionHeader({ title, seniorMode }: { title: string; seniorMode?: boolean }) {
  return (
    <div className={`bg-[#F2F4F5] px-5 border-y border-[#E5E7EA] ${seniorMode ? 'py-4' : 'py-3'}`}>
      <h3 className={`${seniorMode ? 'text-[20px] font-medium' : 'text-[15px]'} text-rbc-dark`}>{title}</h3>
    </div>
  );
}

function HubRow({ icon, label, onClick, seniorMode }: Row & { seniorMode?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-5 text-left cursor-pointer border-b border-[#E5E7EA] active:bg-[#F2F4F5] ${
        seniorMode ? 'gap-5 py-5' : 'gap-4 py-4'
      }`}
    >
      <span className={`inline-flex items-center justify-center rounded-full border border-rbc-bright/60 shrink-0 ${seniorMode ? 'w-12 h-12' : 'w-9 h-9'}`}>
        {icon}
      </span>
      <span className={`flex-1 ${seniorMode ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>{label}</span>
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
