import { useState } from 'react';
import type { Account } from '../../data/mockData';
import { recentTransactions, formatPlain } from '../../data/mockData';
import {
  ChevronLeftIcon, ChevronRightIcon, SearchIcon, KebabIcon,
  SendIcon, TransferIcon, PayBillsIcon,
} from '../../components/ui/RBCIcons';

interface AccountDetailProps {
  account: Account;
  onBack: () => void;
  onOpenTransfer?: (options?: { fromId?: string; toId?: string; amount?: string }) => void;
  seniorMode?: boolean;
}

type Tab = 'transactions' | 'details';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function AccountDetail({ account, onBack, onOpenTransfer, seniorMode = false }: AccountDetailProps) {
  const [tab, setTab] = useState<Tab>('transactions');
  const [lockCard, setLockCard] = useState(false);

  const isVisa = account.type === 'visa';
  const txns = recentTransactions.filter(t => t.accountId === account.id);
  const pending = txns.filter(t => !t.posted);
  const posted = txns.filter(t => t.posted);

  return (
    <div className={`flex flex-col bg-white min-h-full ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      {/* Header — short blue bar */}
      <div
        className="relative px-5 pt-14 pb-4"
        style={{ background: 'linear-gradient(180deg, #0E5BAC 0%, #003E7E 100%)' }}
      >
        <button onClick={onBack} className="absolute left-4 top-12 cursor-pointer p-2">
          <ChevronLeftIcon size={22} stroke="white" />
        </button>
        <div className="absolute right-4 top-12">
          <div className="w-7 h-7 bg-white rounded-md rounded-bl-none flex items-center justify-center">
            <span className="text-rbc-bright text-[13px] font-semibold leading-none">?</span>
          </div>
        </div>
      </div>

      {/* Title block */}
      <div className={`px-5 ${seniorMode ? 'pt-6 pb-4' : 'pt-5 pb-3'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`${seniorMode ? 'text-[38px] font-normal' : 'text-[32px] font-extralight'} text-rbc-dark leading-none`}>{account.name}</h1>
            <p className={`${seniorMode ? 'text-[16px] mt-2' : 'text-[13px] mt-1.5'} text-rbc-secondary tracking-wide`}>
              {account.fullNumber ?? account.accountNumber}
            </p>
          </div>
          <KebabIcon size={18} stroke="#6B7280" />
        </div>
        <div className={`flex items-baseline gap-1.5 ${seniorMode ? 'mt-5' : 'mt-4'}`}>
          <span className={`${seniorMode ? 'text-[16px]' : 'text-[12px]'} text-rbc-secondary uppercase tracking-wide`}>CAD</span>
          <span className={`${seniorMode ? 'text-[48px] font-normal' : 'text-[40px] font-extralight'} text-rbc-dark leading-none`}>
            {formatPlain(account.balance)}
          </span>
        </div>
      </div>

      {/* VISA Lock Card toggle */}
      {isVisa && (
        <div className="px-5 py-3 border-t border-[#E5E7EA] flex items-center justify-end gap-2">
          <span className="text-[15px] text-rbc-dark">Lock Card</span>
          <button
            onClick={() => setLockCard(v => !v)}
            className="w-12 h-7 rounded-full relative transition-colors cursor-pointer"
            style={{ background: lockCard ? '#006AC3' : '#D1D5DB' }}
          >
            <span
              className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all"
              style={{ left: lockCard ? '22px' : '2px' }}
            />
          </button>
        </div>
      )}

      {/* Available Balance / Credit row */}
      <div className="px-5 py-3 border-t border-[#E5E7EA] flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-rbc-dark">
            {isVisa ? 'Available Credit' : 'Available Balance'}
          </span>
          <HelpDot />
        </div>
        <div className="text-right">
          <p className="text-[16px] text-rbc-dark">
            {formatPlain(account.available ?? account.balance)}
          </p>
          {isVisa && (
            <p className="text-[11.5px] text-rbc-secondary mt-0.5">As of Jun 22, 2026</p>
          )}
        </div>
      </div>

      {/* Chequing-only: Pay With Visa Debit */}
      {!isVisa && (
        <div className="px-5 py-3 border-t border-[#E5E7EA] flex items-center gap-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6"><rect x="2" y="6" width="20" height="13" rx="2.5" /><line x1="2" y1="10" x2="22" y2="10" /><circle cx="18" cy="15" r="1.5" fill="#006AC3" stroke="none" /></svg>
          <span className="text-[15px] text-rbc-bright font-medium">Pay With Visa Debit</span>
        </div>
      )}

      {/* Lock or Replace (chequing) */}
      {!isVisa && (
        <button className="px-5 py-3 border-t border-[#E5E7EA] w-full flex items-center justify-between text-left cursor-pointer">
          <span className="text-[15px] text-rbc-dark">Lock or Replace Your Card</span>
          <ChevronRightIcon size={16} stroke="#006AC3" />
        </button>
      )}

      {/* Action pills — scrollable */}
      <div className="px-4 py-3 border-t border-[#E5E7EA]">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-2.5" style={{ width: 'max-content' }}>
            {(isVisa
              ? [
                  { icon: <PayBillsIcon size={18} stroke="#006AC3" />, label: 'Make a payment' },
                  { icon: <DocIcon />, label: 'View statements' },
                  { icon: <TrashIcon />, label: '' },
                ]
              : [
                  { icon: <SendIcon size={18} stroke="#006AC3" />, label: 'Send' },
                  { icon: <TransferIcon size={18} stroke="#006AC3" />, label: 'Transfer' },
                  { icon: <PayBillsIcon size={18} stroke="#006AC3" />, label: 'Pay bills' },
                  { icon: <TrashIcon />, label: '' },
                ]
            ).map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  if (isVisa && p.label === 'Make a payment') {
                    onOpenTransfer?.({ toId: account.id, amount: String(account.balance) });
                  }
                }}
                className={`flex items-center gap-2 rounded-full border border-gray-300 bg-white text-rbc-dark cursor-pointer ${
                  seniorMode ? 'px-5 py-3.5' : 'px-4 py-2.5'
                }`}
              >
                {p.icon}
                {p.label && <span className={`${seniorMode ? 'text-[18px]' : 'text-[14.5px]'} font-medium`}>{p.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab strip: Transactions | Details */}
      <div className="grid grid-cols-2 border-t border-[#E5E7EA]">
        {(['transactions', 'details'] as const).map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="py-3.5 cursor-pointer relative"
              style={{ background: active ? 'white' : '#F2F4F5' }}
            >
              <span className={`text-[15px] ${active ? 'text-rbc-bright font-medium' : 'text-rbc-dark'}`}>
                {t === 'transactions' ? 'Transactions' : 'Details'}
              </span>
              {active && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-rbc-bright rounded-t" />
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      {tab === 'transactions' ? (
        <div className="bg-white pb-24">
          {/* Sub-tabs */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
            <div className="flex items-center gap-3">
              <button className="text-[15px] text-rbc-dark font-medium pb-0.5 border-b-2 border-rbc-dark">Recent</button>
              {!isVisa && (
                <>
                  <span className="text-gray-300">|</span>
                  <button className="text-[15px] text-rbc-bright">NOMI Forecast</button>
                </>
              )}
            </div>
            <SearchIcon size={20} stroke="#006AC3" />
          </div>

          {/* Pending (VISA only, if any) */}
          {isVisa && pending.length > 0 && (
            <>
              <div className="bg-[#F2F4F5] px-5 py-2 flex items-center gap-2 border-b border-[#E5E7EA]">
                <span className="text-[15px] text-rbc-dark">Pending</span>
                <HelpDot />
                <span className="text-[11.5px] text-rbc-secondary ml-auto">As of Jun 22, 2026, 2:10 p.m. PT</span>
              </div>
              {pending.map(tx => (
                <TransactionRow key={tx.id} description={tx.description} amount={tx.amount} pending />
              ))}
            </>
          )}

          {/* Posted by date */}
          {(() => {
            const groups: Record<string, typeof posted> = {};
            for (const tx of posted) (groups[tx.date] ??= []).push(tx);
            const dates = Object.keys(groups).sort().reverse();
            return dates.map(date => (
              <div key={date}>
                <div className="bg-[#F2F4F5] px-5 py-2 border-b border-[#E5E7EA]">
                  {isVisa ? (
                    <span className="text-[15px] text-rbc-dark">{formatDateLabel(date)}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] text-rbc-dark">Posted</span>
                      <HelpDot />
                    </div>
                  )}
                </div>
                {!isVisa && (
                  <div className="px-5 py-2 bg-[#F2F4F5] border-b border-[#E5E7EA]">
                    <span className="text-[14px] text-rbc-secondary">{formatDateLabel(date)}</span>
                  </div>
                )}
                {groups[date].map(tx => (
                  <TransactionRow key={tx.id} description={tx.description} amount={tx.amount} />
                ))}
              </div>
            ));
          })()}
        </div>
      ) : (
        <DetailsTab account={account} />
      )}
    </div>
  );
}

function TransactionRow({ description, amount, pending }: { description: string; amount: number; pending?: boolean }) {
  return (
    <button className="w-full flex items-center justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer">
      <span className={`text-[15.5px] ${pending ? 'text-rbc-secondary italic' : 'text-rbc-dark'}`}>
        {description}
      </span>
      <span className={`text-[15.5px] ${amount > 0 ? 'text-rbc-success' : 'text-rbc-dark'}`}>
        {amount > 0 ? '+' : ''}{formatPlain(amount)}
      </span>
    </button>
  );
}

function DetailsTab({ account }: { account: Account }) {
  const isVisa = account.type === 'visa';
  if (isVisa) {
    return (
      <div className="bg-white pb-24">
        <DetailRow label="Current Balance" value={formatPlain(account.balance)} hasHelp />
        <DetailRow label="Credit Limit" value={formatPlain(account.creditLimit ?? 0)} />
        <DetailRow
          label="Available Credit"
          sublabel="As of Jun 22, 2026 at 2:10 p.m. PT"
          value={formatPlain(account.available ?? 0)}
          hasHelp
        />
        <DetailRow label="Points" value="2,847 points" chevron />
      </div>
    );
  }
  return (
    <div className="bg-white pb-24">
      <DetailRow label="Account Number" value={account.fullNumber ?? account.accountNumber} />
      <DetailRow label="Account Type" value="Personal Chequing" />
      <DetailRow label="Branch" value="Toronto - Yonge & Bloor" />
      <DetailRow label="Transit / Institution" value="07395 / 003" />
    </div>
  );
}

function DetailRow({ label, sublabel, value, hasHelp, chevron }: { label: string; sublabel?: string; value: string; hasHelp?: boolean; chevron?: boolean }) {
  return (
    <div className="px-5 py-4 border-b border-[#E5E7EA] flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[15.5px] text-rbc-dark">{label}</span>
          {hasHelp && <HelpDot />}
        </div>
        {sublabel && <p className="text-[12px] text-rbc-secondary mt-0.5">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[15.5px] text-rbc-dark">{value}</span>
        {chevron && <ChevronRightIcon size={14} stroke="#9CA3AF" />}
      </div>
    </div>
  );
}

function HelpDot() {
  return (
    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-rbc-bright text-white text-[11px] font-bold leading-none">?</span>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
