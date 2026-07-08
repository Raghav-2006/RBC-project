import type { Payee } from '../../data/mockData';
import { payees } from '../../data/mockData';
import {
  ChevronLeftIcon, ChevronRightIcon,
  PayBillsIcon, PeopleIcon,
} from '../../components/ui/RBCIcons';

interface Props {
  onBack: () => void;
  onPayABill: (prefillPayee?: Payee) => void;
  onAddPayee: () => void;
  onManagePayees: () => void;
  onCancelPayment: () => void;
  onViewPastPayments: () => void;
  onViewUpcomingPayments: () => void;
  seniorMode?: boolean;
}

export default function PayBillsHub({
  onBack, onPayABill, onAddPayee, onManagePayees, onCancelPayment,
  onViewPastPayments, onViewUpcomingPayments,
  seniorMode = false,
}: Props) {
  const frequent = payees[0];

  return (
    <div className={`flex flex-col bg-white min-h-full pb-24 ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      <BlueHeader title="Pay Bills" onBack={onBack} seniorMode={seniorMode} />

      {/* Frequently Paid */}
      <div className="bg-[#F2F4F5] px-5 py-3 flex items-center justify-between border-y border-[#E5E7EA]">
        <h3 className="text-[15px] text-rbc-dark">Frequently Paid</h3>
        <svg width="22" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /><circle cx="8" cy="7" r="1" fill="#006AC3" /><circle cx="14" cy="12" r="1" fill="#006AC3" /><circle cx="10" cy="17" r="1" fill="#006AC3" /></svg>
      </div>
      <div className="px-4 py-4">
        <div className="border border-[#E5E7EA] rounded-md px-4 py-3">
          <p className="text-[16px] text-rbc-dark">{frequent.name}</p>
          <p className="text-[13px] text-rbc-secondary mt-0.5 tracking-wide">
            {frequent.accountNumber}
          </p>
          <div className="border-t border-[#E5E7EA] mt-3 pt-2 flex justify-end">
            <button
              onClick={() => onPayABill(frequent)}
              className="text-[14px] text-rbc-bright font-medium cursor-pointer"
            >
              Pay
            </button>
          </div>
        </div>
      </div>

      {/* Pay a Bill / Add a Payee */}
      <HubRow
        icon={<PayBillsIcon size={20} stroke="#006AC3" />}
        label="Pay a Bill"
        sub="Access your payee list"
        onClick={() => onPayABill()}
      />
      <HubRow
        icon={<PeopleIcon size={20} stroke="#006AC3" />}
        label="Add a Payee"
        onClick={onAddPayee}
      />

      {/* Manage Bills section */}
      <div className="bg-[#F2F4F5] px-5 py-3 border-y border-[#E5E7EA]">
        <h3 className="text-[15px] text-rbc-dark">Manage Bills</h3>
      </div>
      <HubRow icon={<TrashIcon />} label="Cancel or Stop a Payment" onClick={onCancelPayment} />
      <HubRow icon={<PastPaymentsIcon />} label="View Past Payments" onClick={onViewPastPayments} />
      <HubRow icon={<UpcomingIcon />} label="View Upcoming Payments" onClick={onViewUpcomingPayments} />
      <HubRow icon={<PeopleIcon size={20} stroke="#006AC3" />} label="Manage Payees" onClick={onManagePayees} />
    </div>
  );
}

function BlueHeader({ title, onBack, seniorMode }: { title: string; onBack?: () => void; seniorMode?: boolean }) {
  return (
    <div
      className="relative pt-14 pb-4 px-5"
      style={{ background: 'linear-gradient(180deg, #0E5BAC 0%, #003E7E 100%)' }}
    >
      {onBack && (
        <button onClick={onBack} className="absolute left-3 top-12 p-2 cursor-pointer">
          <ChevronLeftIcon size={22} stroke="white" />
        </button>
      )}
      <div className="text-center">
        <span className={`text-white font-medium ${seniorMode ? 'text-[22px]' : 'text-[16px]'}`}>{title}</span>
      </div>
      <div className="absolute right-4 top-12">
        <div className="w-7 h-7 bg-white rounded-md rounded-bl-none flex items-center justify-center">
          <span className="text-rbc-bright text-[13px] font-semibold leading-none">?</span>
        </div>
      </div>
    </div>
  );
}

function HubRow({
  icon, label, sub, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer border-b border-[#E5E7EA] active:bg-[#F2F4F5]"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rbc-bright/60 shrink-0">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-[16px] text-rbc-dark">{label}</p>
        {sub && <p className="text-[13px] text-rbc-secondary mt-0.5">{sub}</p>}
      </div>
      <ChevronRightIcon size={16} stroke="#9CA3AF" />
    </button>
  );
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function PastPaymentsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="15" y2="14" />
    </svg>
  );
}

function UpcomingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}
