import type { Account } from '../../data/mockData';
import { accounts, formatPlain } from '../../data/mockData';
import {
  ChevronRightIcon, KebabIcon, TransferIcon, SendIcon, PayBillsIcon,
} from '../../components/ui/RBCIcons';

interface AccountSummaryProps {
  onSelectAccount: (a: Account) => void;
  seniorMode?: boolean;
}

export default function AccountSummary({ onSelectAccount, seniorMode = false }: AccountSummaryProps) {
  const banking = accounts.filter(a => a.category === 'banking');
  const credit = accounts.filter(a => a.category === 'creditCards');

  const bankingTotal = banking.reduce((s, a) => s + a.balance, 0);
  const creditTotal = credit.reduce((s, a) => s + a.balance, 0);

  return (
    <div className={`flex flex-col bg-white min-h-full ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      {/* Header — short blue bar */}
      <div
        className="relative px-5 pt-14 pb-4"
        style={{ background: 'linear-gradient(180deg, #0E5BAC 0%, #003E7E 100%)' }}
      >
        <div className="absolute right-4 top-12">
          <div className="w-7 h-7 bg-white rounded-md rounded-bl-none flex items-center justify-center">
            <span className="text-rbc-bright text-[13px] font-semibold leading-none">?</span>
          </div>
        </div>
      </div>

      {/* Title + kebab */}
      <div className={`px-5 pt-5 pb-3 flex items-center justify-between ${seniorMode ? 'pt-6 pb-4' : ''}`}>
        <h1 className={`${seniorMode ? 'text-[34px] font-normal' : 'text-[28px] font-extralight'} text-rbc-dark leading-none`}>Account Summary</h1>
        <KebabIcon size={18} stroke="#6B7280" />
      </div>

      {/* Quick action tiles */}
      <div className={`${seniorMode ? 'bg-white py-4' : 'bg-[#F2F4F5] py-3'}`}>
        <div className="overflow-x-auto no-scrollbar">
          <div className={`flex ${seniorMode ? 'gap-4 px-5' : 'gap-3 px-4 pb-1'}`} style={{ width: 'max-content' }}>
            {[
              { icon: <TransferIcon size={26} stroke="#006AC3" />, label: 'Transfer' },
              { icon: <SendIcon size={26} stroke="#006AC3" />, label: 'Send' },
              { icon: <DepositIcon />, label: 'Deposit' },
              { icon: <PayBillsIcon size={26} stroke="#006AC3" />, label: 'Pay bills' },
            ].map(q => (
              <button
                key={q.label}
                className={`bg-white border rounded-md flex flex-col items-center justify-center shadow-sm cursor-pointer ${
                  seniorMode ? 'gap-2.5 border-[#B9C6D2]' : 'gap-1.5 border-gray-200'
                }`}
                style={{ width: seniorMode ? '38%' : '32%', minWidth: seniorMode ? 150 : 120, height: seniorMode ? 122 : 100 }}
              >
                {q.icon}
                <span className={`${seniorMode ? 'text-[18px]' : 'text-[14px]'} font-medium text-rbc-dark`}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banking group */}
      <GroupHeader title="Banking" />
      {banking.map((a, i) => (
        <button
          key={a.id}
          onClick={() => onSelectAccount(a)}
          className={`w-full flex items-start justify-between px-5 text-left cursor-pointer border-b border-[#E5E7EA] ${
            seniorMode ? 'py-5' : 'py-4'
          }`}
          style={{ borderTop: i === 0 ? '1px solid #E5E7EA' : undefined }}
        >
          <div>
            <p className={`${seniorMode ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>{a.name}</p>
            <p className={`${seniorMode ? 'text-[16px] mt-1' : 'text-[13px] mt-0.5'} text-rbc-secondary tracking-wide`}>{a.fullNumber}</p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className={`${seniorMode ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>{formatPlain(a.balance)}</span>
            <ChevronRightIcon size={14} stroke="#9CA3AF" />
          </div>
        </button>
      ))}
      <div className="px-5 py-3 flex items-center justify-end gap-3 border-b border-[#E5E7EA]">
        <span className="text-[15px] text-rbc-secondary">Total</span>
        <span className="text-[16px] text-rbc-dark">{formatPlain(bankingTotal)}</span>
      </div>
      <div className="px-5 py-2.5 flex justify-end border-b border-[#E5E7EA]">
        <button className="text-[14px] text-rbc-bright font-medium cursor-pointer">Transaction Limits</button>
      </div>

      {/* Credit Cards group */}
      <GroupHeader title="Credit Cards" />
      {credit.map(a => (
        <button
          key={a.id}
          onClick={() => onSelectAccount(a)}
          className={`w-full flex items-start justify-between px-5 text-left cursor-pointer border-b border-[#E5E7EA] ${
            seniorMode ? 'py-5' : 'py-4'
          }`}
        >
          <div>
            <p className={`${seniorMode ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>{a.name}</p>
            <p className={`${seniorMode ? 'text-[16px] mt-1' : 'text-[13px] mt-0.5'} text-rbc-secondary tracking-wide`}>{a.fullNumber}</p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className={`${seniorMode ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>{formatPlain(a.balance)}</span>
            <ChevronRightIcon size={14} stroke="#9CA3AF" />
          </div>
        </button>
      ))}
      <div className="px-5 py-3 flex items-center justify-end gap-3">
        <span className="text-[15px] text-rbc-secondary">Total</span>
        <span className="text-[16px] text-rbc-dark">{formatPlain(creditTotal)}</span>
      </div>

      {/* Spacer */}
      <div className="h-24" />
    </div>
  );
}

function GroupHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#F2F4F5] px-5 py-3 flex items-center justify-between">
      <h3 className="text-[16px] font-normal text-rbc-dark">{title}</h3>
      <button className="cursor-pointer" aria-label="Add account">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.8" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}

function DepositIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" />
      <path d="M12 4v10M8 8l4-4 4 4" />
    </svg>
  );
}
