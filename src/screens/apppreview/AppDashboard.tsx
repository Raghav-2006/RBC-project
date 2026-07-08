import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AppVersion } from '../VersionChooser';
import type { Account } from '../../data/mockData';
import { accounts, formatPlain } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import {
  SendIcon, TransferIcon, PayBillsIcon,
  HomeIcon, CardIcon, MoveMoneyIcon, MoreIcon, ChevronUpIcon, ChevronRightIcon,
  SearchIcon, KebabIcon,
} from '../../components/ui/RBCIcons';
import AccountDetail from './AccountDetail';
import AccountSummary from './AccountSummary';
import MoveMoneyHub from './MoveMoneyHub';
import AppETransferFlow from './AppETransferFlow';

interface AppDashboardProps {
  version: AppVersion;
}

type Tab = 'home' | 'accounts' | 'moveMoney' | 'more';

export default function AppDashboard({ version }: AppDashboardProps) {
  useApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [openAccount, setOpenAccount] = useState<Account | null>(null);
  const [inETransfer, setInETransfer] = useState(false);

  const isSenior = version === 'senior';
  const isStudent = version === 'student';

  // e-Transfer flow overlay (no bottom nav during flow)
  if (inETransfer) {
    return (
      <div className="h-full bg-white overflow-auto">
        <AppETransferFlow
          onExitToDashboard={() => { setInETransfer(false); setActiveTab('home'); }}
          onExitToMoveMoney={() => setInETransfer(false)}
        />
      </div>
    );
  }

  // Account detail overlay (shared across tabs)
  if (openAccount) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto">
          <AccountDetail account={openAccount} onBack={() => setOpenAccount(null)} />
        </div>
        <BottomNav activeTab={activeTab} onChange={(t) => { setOpenAccount(null); setActiveTab(t); }} />
      </div>
    );
  }

  // For now, only Regular Home is the fidelity-matched version.
  // Senior/Student kept simple until Regular is approved.
  if (isSenior || isStudent) {
    return <LegacyDashboard version={version} />;
  }

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const banking = accounts.filter(a => a.category === 'banking');
  const credit = accounts.filter(a => a.category === 'creditCards');

  const renderHome = () => (
    <div className="flex flex-col bg-white">
      {/* Hero header with subtle wave/swirl */}
      <div className="relative overflow-hidden">
        <div
          className="px-6 pt-14 pb-10 text-white relative"
          style={{
            background: 'linear-gradient(155deg, #1466B8 0%, #0a4d96 40%, #00305E 100%)',
          }}
        >
          {/* Subtle decorative swirl — matches RBC's hero illustration */}
          <svg
            className="absolute top-0 right-0 opacity-25 pointer-events-none"
            width="240"
            height="280"
            viewBox="0 0 240 280"
            fill="none"
          >
            <path d="M -20 60 Q 140 -20 280 100 Q 240 220 80 280" stroke="white" strokeWidth="0.8" />
            <path d="M -40 120 Q 120 60 260 180 Q 220 280 60 300" stroke="white" strokeWidth="0.8" />
            <path d="M 80 -40 Q 220 80 260 240" stroke="white" strokeWidth="0.6" />
          </svg>

          {/* Help bubble */}
          <div className="absolute top-12 right-5 z-10">
            <div className="w-7 h-7 bg-white rounded-md rounded-bl-none flex items-center justify-center">
              <span className="text-rbc-bright text-[13px] font-semibold leading-none">?</span>
            </div>
          </div>

          <p className="text-[13px] font-light text-white/90 leading-none">RBC Mobile</p>
          <h1 className="text-[28px] font-extralight leading-tight mt-1 mb-5 tracking-tight">{greeting}</h1>

          {/* Search pill — frosted */}
          <div className="bg-white/20 border border-white/30 rounded-full px-4 py-3 flex items-center gap-3">
            <SearchIcon size={16} stroke="white" />
            <span className="text-[14.5px] text-white font-light">Search RBC Mobile</span>
          </div>
        </div>
      </div>

      {/* Quick actions — horizontally scrollable, slight overlap with hero */}
      <div className="relative bg-[#F2F4F5] -mt-4 z-10 pt-4 pb-3">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-3 px-4 pb-1" style={{ width: 'max-content' }}>
            {[
              { icon: <SendIcon size={26} stroke="#006AC3" />, label: 'Send', onClick: () => setInETransfer(true) },
              { icon: <TransferIcon size={26} stroke="#006AC3" />, label: 'Transfer' },
              { icon: <PayBillsIcon size={26} stroke="#006AC3" />, label: 'Pay bills' },
              { icon: <SendIcon size={26} stroke="#006AC3" />, label: 'Deposit' },
            ].map(qa => (
              <button
                key={qa.label}
                onClick={qa.onClick}
                className="bg-white border border-gray-200 rounded-md flex flex-col items-center justify-center gap-1.5 active:bg-rbc-bright-lightest cursor-pointer shadow-sm"
                style={{ width: '32%', minWidth: 120, height: 100 }}
              >
                {qa.icon}
                <span className="text-[14px] font-medium text-rbc-dark">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="bg-white">
        <div className="bg-[#F2F4F5] px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
          <h3 className="text-[16px] font-normal text-rbc-dark">Accounts Overview</h3>
          <KebabIcon size={18} stroke="#6B7280" />
        </div>
        <div className="px-5">
          {[...banking, ...credit].map((a, i, arr) => (
            <button
              key={a.id}
              onClick={() => setOpenAccount(a)}
              className="w-full flex items-center justify-between py-4 cursor-pointer text-left border-b"
              style={{ borderColor: i === arr.length - 1 ? 'transparent' : '#E5E7EA' }}
            >
              <span className="text-[16px] text-rbc-dark">
                {a.name} ({a.accountNumber})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[16px] text-rbc-dark">{formatPlain(a.balance)}</span>
                <ChevronRightIcon size={14} stroke="#9CA3AF" />
              </div>
            </button>
          ))}
        </div>
        <div className="px-5 pb-4 pt-1 flex items-center justify-end gap-4">
          <button className="text-[14px] text-rbc-bright font-medium cursor-pointer">Open an account</button>
          <span className="text-gray-300">|</span>
          <button className="text-[14px] text-rbc-bright font-medium cursor-pointer">View all</button>
        </div>
      </div>

      {/* NOMI section */}
      <div className="bg-white">
        <div className="bg-[#F2F4F5] px-5 py-3 flex items-center justify-between border-y border-[#E5E7EA]">
          <h3 className="text-[16px] font-normal text-rbc-dark">NOMI</h3>
          <KebabIcon size={18} stroke="#6B7280" />
        </div>
        <div className="w-full flex items-center justify-between px-5 py-4">
          <span className="text-[16px] text-rbc-dark">Insights</span>
          <button className="text-[14px] text-rbc-bright font-medium cursor-pointer">View all</button>
        </div>
      </div>

      {/* Spacer above tab bar so last row isn't hidden */}
      <div className="bg-white h-20" />
    </div>
  );

  const renderEmpty = (title: string) => (
    <div className="bg-white h-full flex items-center justify-center">
      <p className="text-rbc-secondary text-sm">{title} — coming soon</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'accounts' && <AccountSummary onSelectAccount={setOpenAccount} />}
        {activeTab === 'moveMoney' && <MoveMoneyHub onOpenETransfer={() => setInETransfer(true)} />}
        {activeTab === 'more' && renderEmpty('More')}
      </div>

      {/* Bottom navigation — distinctive RBC layout with gold FAB */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function BottomNav({ activeTab, onChange }: { activeTab: Tab; onChange: (t: Tab) => void }) {
  const inactiveColor = '#6B7280';
  const activeColor = '#006AC3';

  return (
    <div className="relative bg-white border-t border-gray-200">
      <div className="flex items-end justify-around pt-1 pb-1.5">
        <NavItem
          label="Home"
          active={activeTab === 'home'}
          onClick={() => onChange('home')}
          icon={<HomeIcon size={22} stroke={activeTab === 'home' ? activeColor : inactiveColor} filled={activeTab === 'home'} />}
        />
        <NavItem
          label="Accounts"
          active={activeTab === 'accounts'}
          onClick={() => onChange('accounts')}
          icon={<CardIcon size={22} stroke={activeTab === 'accounts' ? activeColor : inactiveColor} filled={activeTab === 'accounts'} />}
        />
        {/* Spacer for FAB */}
        <div className="w-14" />
        <NavItem
          label="Move Money"
          active={activeTab === 'moveMoney'}
          onClick={() => onChange('moveMoney')}
          icon={<MoveMoneyIcon size={22} stroke={activeTab === 'moveMoney' ? activeColor : inactiveColor} filled={activeTab === 'moveMoney'} />}
        />
        <NavItem
          label="More"
          active={activeTab === 'more'}
          onClick={() => onChange('more')}
          icon={<MoreIcon size={22} stroke={activeTab === 'more' ? activeColor : inactiveColor} />}
        />
      </div>

      {/* Gold FAB centered on the bar */}
      <motion.button
        className="absolute left-1/2 -top-5 -translate-x-1/2 w-12 h-12 rounded-full bg-rbc-gold flex items-center justify-center shadow-md cursor-pointer"
        whileTap={{ scale: 0.94 }}
        aria-label="Move Money menu"
      >
        <ChevronUpIcon size={22} stroke="#1A1A1A" />
      </motion.button>
    </div>
  );
}

function NavItem({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-1 py-1 min-w-[56px] min-h-[44px] cursor-pointer"
    >
      {icon}
      <span className={`text-[10.5px] ${active ? 'text-rbc-bright font-medium' : 'text-rbc-secondary'}`}>
        {label}
      </span>
    </button>
  );
}

// Senior / Student kept as-is from previous iteration until Regular is approved.
function LegacyDashboard({ version }: { version: AppVersion }) {
  const { t } = useApp();
  const isSenior = version === 'senior';

  const banking = accounts.filter(a => a.category === 'banking');
  const credit = accounts.filter(a => a.category === 'creditCards');
  const invest = accounts.filter(a => a.category === 'investments');

  const padding = isSenior ? 'p-5' : 'p-4';
  const textBase = isSenior ? 'text-lg' : 'text-sm';
  const textLg = isSenior ? 'text-2xl' : 'text-lg';

  return (
    <div className="h-full flex flex-col bg-rbc-bg">
      <div className="bg-rbc-blue px-4 py-3 text-white">
        <p className="text-xs opacity-80">RBC Mobile</p>
        <p className={`font-light ${textLg}`}>Good Morning</p>
      </div>
      <div className="flex-1 overflow-auto">
        <div className={padding}>
          {([banking, credit, invest] as const).map((group, i) => (
            <div key={i} className="mb-4">
              <p className={`uppercase tracking-wider text-rbc-secondary mb-1 ${isSenior ? 'text-sm' : 'text-[10px]'}`}>
                {i === 0 ? t('banking') : i === 1 ? t('creditCards') : t('investments')}
              </p>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {group.map(a => (
                  <div key={a.id} className={`${padding} flex justify-between items-center`}>
                    <div>
                      <p className={`font-medium text-rbc-dark ${textBase}`}>{a.name} ({a.accountNumber})</p>
                    </div>
                    <p className={`font-semibold text-rbc-dark ${textBase}`}>{formatPlain(a.balance)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 py-3 text-center text-rbc-secondary text-sm">
        {t('home')}
      </div>
    </div>
  );
}
