import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Account } from '../../data/mockData';
import { accounts, formatPlain } from '../../data/mockData';
import {
  CardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HelpIcon,
  HomeIcon,
  MoreIcon,
  MoveMoneyIcon,
} from '../../components/ui/RBCIcons';

type TransferView = 'form' | 'review' | 'done';
type Sheet = 'from' | 'to' | 'when' | 'frequency' | null;
type Tab = 'new' | 'upcoming';

interface Props {
  onBack: () => void;
  onHome: () => void;
  initialFromId?: string;
  initialToId?: string;
  initialAmount?: string;
  initialTab?: Tab;
  seniorMode?: boolean;
}

const todayLabel = 'Jul 08, 2026';
const completionLabel = 'Jul 8, 2026 at 1:24 p.m. PT';

export default function AppTransferFlow({
  onBack,
  onHome,
  initialFromId,
  initialToId,
  initialAmount = '',
  initialTab = 'new',
  seniorMode = false,
}: Props) {
  const bankingAccounts = useMemo(() => accounts.filter((account) => account.category === 'banking'), []);
  const transferTargets = useMemo(
    () => [...bankingAccounts, ...accounts.filter((account) => account.category === 'creditCards')],
    [bankingAccounts],
  );

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [view, setView] = useState<TransferView>('form');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [fromId, setFromId] = useState<string | null>(initialFromId ?? null);
  const [toId, setToId] = useState<string | null>(initialToId ?? null);
  const [amount, setAmount] = useState(initialAmount);
  const [when, setWhen] = useState(todayLabel);
  const [frequency, setFrequency] = useState<'Once' | 'Weekly' | 'Monthly'>('Once');
  const [confirmationNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const fromAccount = accounts.find((account) => account.id === fromId) ?? null;
  const toAccount = accounts.find((account) => account.id === toId) ?? null;
  const amountNumber = parseFloat(amount || '0');
  const canContinue = !!fromAccount && !!toAccount && amountNumber > 0 && fromAccount.id !== toAccount.id;

  const fromNewBalance = fromAccount ? Math.max(0, fromAccount.balance - amountNumber) : 0;
  const toNewBalance = toAccount && toAccount.category === 'banking' ? toAccount.balance + amountNumber : null;

  return (
    <div className={`relative min-h-full bg-[#EEF3F7] ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      {view === 'form' && (
        <div className="flex min-h-full flex-col">
          <BlueHeader title="Transfer Money" onBack={onBack} seniorMode={seniorMode} />
          <TopTabs activeTab={activeTab} onChange={setActiveTab} seniorMode={seniorMode} />

          {activeTab === 'upcoming' ? (
            <UpcomingEmpty />
          ) : (
            <>
              <div className="px-3 pt-3 pb-6">
                <div className="overflow-hidden border border-[#E5E7EA] bg-white">
                  <FieldButton
                    label="From"
                    value={fromAccount ? previewShortName(fromAccount) : 'Select Account'}
                    secondary={fromAccount ? formatPlain(fromAccount.balance) : undefined}
                    onClick={() => setSheet('from')}
                    placeholder={!fromAccount}
                    seniorMode={seniorMode}
                  />
                  <AmountField value={amount} onChange={setAmount} seniorMode={seniorMode} />
                  <FieldButton
                    label="To"
                    value={toAccount ? previewShortName(toAccount) : 'Select Account'}
                    secondary={toAccount ? formatPlain(toAccount.balance) : undefined}
                    onClick={() => setSheet('to')}
                    placeholder={!toAccount}
                    withDivider
                    seniorMode={seniorMode}
                  />
                </div>

                <div className="mt-3 overflow-hidden border border-[#E5E7EA] bg-white">
                  <FieldButton label="When" value={when} onClick={() => setSheet('when')} seniorMode={seniorMode} />
                  <FieldButton label="Frequency" value={frequency} onClick={() => setSheet('frequency')} withDivider seniorMode={seniorMode} />
                </div>

                <button
                  onClick={() => canContinue && setView('review')}
                  disabled={!canContinue}
                  className={`mt-7 w-full ${seniorMode ? 'py-5 text-[22px]' : 'py-4 text-[18px]'} font-medium ${
                    canContinue ? 'bg-rbc-bright text-white' : 'bg-[#E5E5E5] text-[#666666]'
                  }`}
                >
                  Continue
                </button>
              </div>
              <InfoFooter seniorMode={seniorMode} />
            </>
          )}

          {activeTab !== 'upcoming' && <PreviewBottomNav activeTab="moveMoney" />}
        </div>
      )}

      {view === 'review' && fromAccount && toAccount && (
        <div className="flex min-h-full flex-col">
          <BlueHeader title="Transfer Money" onBack={() => setView('form')} seniorMode={seniorMode} />
          <div className={`bg-[#F2F4F5] px-6 text-center text-rbc-dark ${seniorMode ? 'py-7 text-[24px] font-normal' : 'py-6 text-[19px] font-light'}`}>
            Ready to Transfer?
          </div>

          <div className="bg-white">
            <ReviewRow label="From" value={previewShortName(fromAccount)} subvalue={formatPlain(fromAccount.balance)} seniorMode={seniorMode} />
            <ReviewRow label="Amount" value={formatPlain(amountNumber)} seniorMode={seniorMode} />
            <ReviewRow label="To" value={previewShortName(toAccount)} subvalue={formatPlain(toAccount.balance)} seniorMode={seniorMode} />
            <ReviewRow label="When" value={when.replace('08', '8')} seniorMode={seniorMode} />
            <ReviewRow label="Frequency" value={frequency} last seniorMode={seniorMode} />
          </div>

          <div className="px-6 py-8">
            <button
              onClick={() => setView('done')}
              className={`w-full bg-rbc-bright text-white font-medium ${seniorMode ? 'py-6 text-[22px]' : 'py-5 text-[18px]'}`}
            >
              Transfer Now
            </button>
            <button
              onClick={() => setView('form')}
              className={`mt-3 w-full border-2 border-rbc-bright bg-white text-rbc-bright font-medium ${seniorMode ? 'py-5 text-[22px]' : 'py-4 text-[18px]'}`}
            >
              Edit
            </button>
          </div>

          <div className="flex-1 bg-[#EEF3F7]" />
          <PreviewBottomNav activeTab="moveMoney" />
        </div>
      )}

      {view === 'done' && fromAccount && toAccount && (
        <div className="flex min-h-full flex-col">
          <BlueHeader title="Transfer Money" seniorMode={seniorMode} />
          <div className="flex flex-col items-center bg-white px-6 pt-10 pb-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#39B54A]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 12 10 18 20 6" />
              </svg>
            </div>
            <p className={`mt-5 text-rbc-dark ${seniorMode ? 'text-[24px] font-normal' : 'text-[18px] font-light'}`}>Transfer Complete!</p>
            <p className="mt-1 text-[12px] text-rbc-secondary">{completionLabel}</p>
            <p className={`mt-10 text-rbc-dark ${seniorMode ? 'text-[24px] font-normal' : 'text-[18px] font-light'}`}>Confirmation # {confirmationNumber}</p>
          </div>

          <div className="bg-white">
            <ReviewRow label="From" value={previewShortName(fromAccount)} seniorMode={seniorMode} />
            <ReviewRow label="New Balance" value={formatPlain(fromNewBalance)} seniorMode={seniorMode} />
            <ReviewRow label="Amount" value={formatPlain(amountNumber)} seniorMode={seniorMode} />
            <ReviewRow label="To" value={previewShortName(toAccount)} seniorMode={seniorMode} />
            {toNewBalance !== null && <ReviewRow label="New Balance" value={formatPlain(toNewBalance)} seniorMode={seniorMode} />}
            <ReviewRow label="Frequency" value={frequency} last seniorMode={seniorMode} />
          </div>

          <div className="px-6 py-5">
            <button
              onClick={() => {
                setView('form');
                setActiveTab('new');
                setFromId(null);
                setToId(null);
                setAmount('');
                setWhen(todayLabel);
                setFrequency('Once');
              }}
              className={`w-full bg-rbc-bright text-white font-medium ${seniorMode ? 'py-6 text-[22px]' : 'py-5 text-[18px]'}`}
            >
              Make Another Transfer
            </button>
            <button
              onClick={onHome}
              className={`mt-3 w-full border-2 border-rbc-bright bg-white text-rbc-bright font-medium ${seniorMode ? 'py-5 text-[22px]' : 'py-4 text-[18px]'}`}
            >
              Home
            </button>
          </div>

          <InfoFooter compact seniorMode={seniorMode} />
          <PreviewBottomNav activeTab="moveMoney" />
        </div>
      )}

      <AnimatePresence>
        {view === 'form' && activeTab === 'new' && sheet === 'from' && (
          <BottomSheet title="Select Account" onClose={() => setSheet(null)} seniorMode={seniorMode}>
            {bankingAccounts.map((account) => (
              <SelectionRow
                key={account.id}
                title={previewShortName(account)}
                subtitle={formatPlain(account.balance)}
                seniorMode={seniorMode}
                onClick={() => {
                  setFromId(account.id);
                  if (toId === account.id) {
                    setToId(null);
                  }
                  setSheet(null);
                }}
              />
            ))}
          </BottomSheet>
        )}

        {view === 'form' && activeTab === 'new' && sheet === 'to' && (
          <BottomSheet title="Select Account" onClose={() => setSheet(null)} seniorMode={seniorMode}>
            {transferTargets
              .filter((account) => account.id !== fromId)
              .map((account) => (
                <SelectionRow
                  key={account.id}
                  title={previewShortName(account)}
                  subtitle={formatPlain(account.balance)}
                  seniorMode={seniorMode}
                  onClick={() => {
                    setToId(account.id);
                    setSheet(null);
                  }}
                />
              ))}
          </BottomSheet>
        )}

        {view === 'form' && activeTab === 'new' && sheet === 'when' && (
          <BottomSheet title="When" onClose={() => setSheet(null)} seniorMode={seniorMode}>
            <SelectionRow
              title="Jul 08, 2026"
              seniorMode={seniorMode}
              onClick={() => {
                setWhen('Jul 08, 2026');
                setSheet(null);
              }}
            />
            <SelectionRow
              title="Jul 09, 2026"
              seniorMode={seniorMode}
              onClick={() => {
                setWhen('Jul 09, 2026');
                setSheet(null);
              }}
            />
          </BottomSheet>
        )}

        {view === 'form' && activeTab === 'new' && sheet === 'frequency' && (
          <BottomSheet title="Frequency" onClose={() => setSheet(null)} seniorMode={seniorMode}>
            {(['Once', 'Weekly', 'Monthly'] as const).map((item) => (
              <SelectionRow
                key={item}
                title={item}
                seniorMode={seniorMode}
                selected={frequency === item}
                onClick={() => {
                  setFrequency(item);
                  setSheet(null);
                }}
              />
            ))}
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
}

function previewShortName(account: Account) {
  return `${account.name}(${account.accountNumber})`;
}

function BlueHeader({ title, onBack, seniorMode }: { title: string; onBack?: () => void; seniorMode?: boolean }) {
  return (
    <div className="relative bg-[#0051A5] px-4 pb-3 pt-14 text-white">
      {onBack && (
        <button onClick={onBack} className="absolute left-2 top-12 p-2">
          <ChevronLeftIcon size={24} stroke="white" />
        </button>
      )}
      <h1 className={`text-center font-medium ${seniorMode ? 'text-[24px]' : 'text-[19px]'}`}>{title}</h1>
      <div className="absolute right-3 top-12">
        <HelpIcon size={22} stroke="#006AC3" />
      </div>
    </div>
  );
}

function TopTabs({ activeTab, onChange, seniorMode }: { activeTab: Tab; onChange: (tab: Tab) => void; seniorMode?: boolean }) {
  return (
    <div className="grid grid-cols-2 border-b border-[#D7DEE5] bg-white">
      {([
        ['new', 'New'],
        ['upcoming', 'Upcoming'],
      ] as const).map(([key, label]) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`${seniorMode ? 'py-4 text-[21px]' : 'py-3 text-[17px]'}`}
            style={{ background: active ? '#F2F4F5' : 'white' }}
          >
            <span className={active ? 'text-rbc-dark' : 'text-rbc-bright'}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FieldButton({
  label,
  value,
  secondary,
  onClick,
  placeholder,
  withDivider,
  seniorMode,
}: {
  label: string;
  value: string;
  secondary?: string;
  onClick: () => void;
  placeholder?: boolean;
  withDivider?: boolean;
  seniorMode?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between px-3 text-left ${seniorMode ? 'py-5' : 'py-4'} ${withDivider ? 'border-t border-[#E5E7EA]' : ''}`}
    >
      <div>
        <p className={`${seniorMode ? 'text-[17px]' : 'text-[14px]'} text-rbc-secondary`}>{label}</p>
        <p className={`mt-1 ${seniorMode ? 'text-[24px]' : 'text-[19px]'} ${placeholder ? 'text-[#9CA3AF]' : 'text-rbc-dark'}`}>{value}</p>
      </div>
      <div className="flex items-center gap-3">
        {secondary && <span className={`pt-5 ${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-rbc-dark`}>{secondary}</span>}
        <ChevronRightIcon size={22} stroke="#006AC3" className="rotate-90" />
      </div>
    </button>
  );
}

function AmountField({ value, onChange, seniorMode }: { value: string; onChange: (value: string) => void; seniorMode?: boolean }) {
  return (
    <div className={`border-t border-[#E5E7EA] px-3 ${seniorMode ? 'py-5' : 'py-4'}`}>
      <p className={`${seniorMode ? 'text-[17px]' : 'text-[14px]'} text-rbc-secondary`}>Amount</p>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d.]/g, ''))}
        inputMode="decimal"
        className={`mt-1 w-full bg-transparent text-rbc-dark outline-none ${seniorMode ? 'text-[24px]' : 'text-[19px]'}`}
        placeholder="0.00"
      />
    </div>
  );
}

function ReviewRow({
  label,
  value,
  subvalue,
  last,
  seniorMode,
}: {
  label: string;
  value: string;
  subvalue?: string;
  last?: boolean;
  seniorMode?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between px-6 ${seniorMode ? 'py-5' : 'py-4'} ${last ? '' : 'border-b border-[#E5E7EA]'}`}>
      <span className={`${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-[#555555]`}>{label}</span>
      <div className="text-right">
        <p className={`${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-rbc-dark`}>{value}</p>
        {subvalue && <p className={`${seniorMode ? 'text-[16px]' : 'text-[13px]'} text-rbc-secondary`}>{subvalue}</p>}
      </div>
    </div>
  );
}

function UpcomingEmpty() {
  return (
    <>
      <div className="bg-white px-6 py-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center text-[#7A808A]">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p className="text-[15px] text-rbc-secondary">You have no scheduled transfers in the next 30 days.</p>
      </div>
      <InfoFooter />
    </>
  );
}

function InfoFooter({ compact, seniorMode }: { compact?: boolean; seniorMode?: boolean }) {
  return (
    <div className={`flex-1 bg-[#EEF3F7] ${compact ? 'px-4 pt-4' : 'px-4 pt-7'}`}>
      <div className="flex items-center gap-3 text-rbc-secondary">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rbc-bright text-[13px] font-bold text-white">i</span>
        <span className={seniorMode ? 'text-[18px]' : 'text-[15px]'}>Important Information</span>
      </div>
    </div>
  );
}

function BottomSheet({
  title,
  onClose,
  children,
  seniorMode,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  seniorMode?: boolean;
}) {
  return (
    <>
      <motion.button
        type="button"
        className="absolute inset-0 bg-black/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[18px] bg-white shadow-2xl"
      >
        <div className="flex items-center border-b border-[#E5E7EA] px-5 py-4">
          <button onClick={onClose} className="mr-3 text-rbc-bright">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          <h2 className={`flex-1 text-center font-medium text-rbc-dark ${seniorMode ? 'text-[24px]' : 'text-[18px]'}`}>{title}</h2>
          <div className="w-6" />
        </div>
        <div className="pb-6">{children}</div>
      </motion.div>
    </>
  );
}

function SelectionRow({
  title,
  subtitle,
  selected,
  onClick,
  seniorMode,
}: {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick: () => void;
  seniorMode?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between border-b border-[#E5E7EA] px-5 text-left ${seniorMode ? 'py-5' : 'py-4'}`}
    >
      <div>
        <p className={`${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-rbc-dark`}>{title}</p>
        {subtitle && <p className={`mt-1 ${seniorMode ? 'text-[17px]' : 'text-[14px]'} text-rbc-secondary`}>{subtitle}</p>}
      </div>
      {selected && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      )}
    </button>
  );
}

function PreviewBottomNav({ activeTab }: { activeTab: 'accounts' | 'moveMoney' | 'home' | 'more' }) {
  const activeColor = '#006AC3';
  const inactiveColor = '#7B8190';

  return (
    <div className="relative border-t border-[#E5E7EA] bg-white pb-2 pt-1">
      <div className="flex items-end justify-around">
        <NavItem label="Home" active={activeTab === 'home'} icon={<HomeIcon size={24} stroke={activeTab === 'home' ? activeColor : inactiveColor} filled={activeTab === 'home'} />} />
        <NavItem label="Accounts" active={activeTab === 'accounts'} icon={<CardIcon size={24} stroke={activeTab === 'accounts' ? activeColor : inactiveColor} filled={activeTab === 'accounts'} />} />
        <div className="w-14" />
        <NavItem label="Move Money" active={activeTab === 'moveMoney'} icon={<MoveMoneyIcon size={24} stroke={activeTab === 'moveMoney' ? activeColor : inactiveColor} filled={activeTab === 'moveMoney'} />} />
        <NavItem label="More" active={activeTab === 'more'} icon={<MoreIcon size={24} stroke={activeTab === 'more' ? activeColor : inactiveColor} />} />
      </div>
      <div className="absolute left-1/2 top-[-17px] -translate-x-1/2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rbc-gold shadow-md">
          <ChevronUpIcon size={26} stroke="#111827" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active, icon }: { label: string; active: boolean; icon: React.ReactNode }) {
  return (
    <div className="flex min-w-[62px] flex-col items-center gap-0.5 py-1">
      {icon}
      <span className={`text-[11px] ${active ? 'font-medium text-rbc-bright' : 'text-rbc-secondary'}`}>{label}</span>
    </div>
  );
}
