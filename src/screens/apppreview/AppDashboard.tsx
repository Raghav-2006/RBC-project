import { useEffect, useState } from 'react';
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
import AppPayBillFlow from './AppPayBillFlow';
import AppTransferFlow from './AppTransferFlow';
import AppDepositFlow from './AppDepositFlow';
import AppVoidChequeFlow from './AppVoidChequeFlow';
import PracticeHighlight from '../learnpractice/PracticeHighlight';
import PracticeGuide from '../learnpractice/PracticeGuide';
import type {
  PracticeCommand,
  PracticeLocation,
  PracticeTarget,
} from '../learnpractice/practiceSteps';

export interface PracticeGuideState {
  instruction: string;
  step: number;
  totalSteps: number;
  showFinish?: boolean;
  onFinish?: () => void;
}

export interface PracticeConfig {
  mode: 'guided' | 'demo';
  highlight: PracticeTarget | null;
  command: PracticeCommand | null;
  onCommandHandled: () => void;
  onLocationChange: (location: PracticeLocation) => void;
  onTargetActivated: (target: PracticeTarget) => void;
  guide: PracticeGuideState;
}

interface AppDashboardProps {
  version: AppVersion;
  practice?: PracticeConfig;
}

type Tab = 'home' | 'accounts' | 'moveMoney' | 'more';

export default function AppDashboard({ version, practice }: AppDashboardProps) {
  useApp();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [openAccount, setOpenAccount] = useState<Account | null>(null);
  const [inETransfer, setInETransfer] = useState(false);
  const [inPayBills, setInPayBills] = useState(false);
  const [inTransfer, setInTransfer] = useState(false);
  const [inDeposit, setInDeposit] = useState(false);
  const [inVoidCheque, setInVoidCheque] = useState(false);
  const [transferPrefill, setTransferPrefill] = useState<{ fromId?: string; toId?: string; amount?: string } | null>(null);
  const [payBillsStartAt, setPayBillsStartAt] = useState<'hub' | 'payForm' | 'managePayees'>('hub');
  const [payBillsStep, setPayBillsStep] = useState<string>('hub');
  const [eTransferStartAt, setETransferStartAt] = useState<'hub' | 'send'>('hub');
  const [depositStartWithActions, setDepositStartWithActions] = useState(true);

  const isSenior = version === 'senior';
  const practiceHighlight = practice?.highlight ?? null;
  const practiceGuide = practice?.guide;

  const practiceTap = (target: PracticeTarget, action: () => void) => {
    if (practice?.highlight === target) {
      practice.onTargetActivated(target);
    }
    action();
  };

  const bottomNavProps = {
    activeTab,
    onChange: setActiveTab,
    seniorMode: isSenior,
    practiceHighlight,
    onPracticeTap: practice ? practiceTap : undefined,
  };

  const renderPracticeGuide = () => (
    practiceGuide ? (
      <PracticeGuide
        instruction={practiceGuide.instruction}
        step={practiceGuide.step}
        totalSteps={practiceGuide.totalSteps}
        visible
        showFinish={practiceGuide.showFinish}
        onFinish={practiceGuide.onFinish}
      />
    ) : null
  );

  const reportLocation = (): PracticeLocation => {
    if (openAccount) return 'accountDetail';
    if (inTransfer) return 'transfer';
    if (inPayBills) {
      if (payBillsStep === 'managePayees') return 'managePayees';
      if (payBillsStep === 'payForm') return 'payBillsForm';
      return 'payBillsHub';
    }
    if (inETransfer) return eTransferStartAt === 'send' ? 'eTransferSend' : 'home';
    if (inDeposit) return 'deposit';
    if (activeTab === 'moveMoney') return 'moveMoney';
    if (activeTab === 'accounts') return 'accounts';
    return 'home';
  };

  useEffect(() => {
    practice?.onLocationChange(reportLocation());
  }, [
    practice,
    activeTab,
    openAccount,
    inTransfer,
    inPayBills,
    inETransfer,
    inDeposit,
    payBillsStartAt,
    payBillsStep,
    eTransferStartAt,
  ]);

  useEffect(() => {
    if (!practice?.command) return;
    const cmd = practice.command;

    switch (cmd.type) {
      case 'tab':
        setActiveTab(cmd.tab);
        break;
      case 'openAccount': {
        const account = accounts.find((a) => a.id === cmd.accountId) ?? null;
        setOpenAccount(account);
        break;
      }
      case 'openTransfer':
        setTransferPrefill(null);
        setInTransfer(true);
        break;
      case 'openPayBills':
        setPayBillsStartAt(cmd.startAt);
        setPayBillsStep(cmd.startAt === 'hub' ? 'hub' : cmd.startAt);
        setInPayBills(true);
        break;
      case 'openPayBillsStep':
        setPayBillsStep(cmd.step);
        if (!inPayBills) {
          setPayBillsStartAt('hub');
          setInPayBills(true);
        }
        break;
      case 'openETransfer':
        setETransferStartAt(cmd.startAt);
        setInETransfer(true);
        break;
      case 'openDeposit':
        setDepositStartWithActions(false);
        setInDeposit(true);
        break;
      default:
        break;
    }

    practice.onCommandHandled();
  }, [practice?.command, inPayBills]);

  // e-Transfer flow overlay (no bottom nav during flow)
  if (inETransfer) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto min-h-0">
          <AppETransferFlow
            onExitToDashboard={() => { setInETransfer(false); setETransferStartAt('hub'); setActiveTab('home'); }}
            onExitToMoveMoney={() => { setInETransfer(false); setETransferStartAt('hub'); }}
            seniorMode={isSenior}
            startAt={eTransferStartAt}
          />
        </div>
        {renderPracticeGuide()}
      </div>
    );
  }

  // Pay Bills flow overlay
  if (inPayBills) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto min-h-0">
          <AppPayBillFlow
            onExitToDashboard={() => { setInPayBills(false); setPayBillsStartAt('hub'); setPayBillsStep('hub'); setActiveTab('home'); }}
            onExitToMoveMoney={() => { setInPayBills(false); setPayBillsStartAt('hub'); setPayBillsStep('hub'); }}
            seniorMode={isSenior}
            startAt={payBillsStartAt}
            practiceHighlight={practiceHighlight}
            onPracticeTargetActivated={practice?.onTargetActivated}
            onStepChange={setPayBillsStep}
            practiceStep={payBillsStep}
          />
        </div>
        {renderPracticeGuide()}
      </div>
    );
  }

  if (inTransfer) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto min-h-0">
          <AppTransferFlow
            onBack={() => {
              setInTransfer(false);
              setTransferPrefill(null);
            }}
            onHome={() => {
              setInTransfer(false);
              setTransferPrefill(null);
              setOpenAccount(null);
              setActiveTab('home');
            }}
            initialFromId={transferPrefill?.fromId}
            initialToId={transferPrefill?.toId}
            initialAmount={transferPrefill?.amount}
            seniorMode={isSenior}
          />
        </div>
        {renderPracticeGuide()}
      </div>
    );
  }

  if (inDeposit) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto min-h-0">
          <AppDepositFlow
            onBack={() => { setInDeposit(false); setDepositStartWithActions(true); }}
            onOpenVoidCheque={() => {
              setInDeposit(false);
              setDepositStartWithActions(true);
              setInVoidCheque(true);
            }}
            seniorMode={isSenior}
            startWithActions={depositStartWithActions}
          />
        </div>
        {renderPracticeGuide()}
      </div>
    );
  }

  if (inVoidCheque) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto min-h-0">
          <AppVoidChequeFlow onBack={() => setInVoidCheque(false)} seniorMode={isSenior} />
        </div>
        {renderPracticeGuide()}
      </div>
    );
  }

  // Account detail overlay (shared across tabs)
  if (openAccount) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 overflow-auto min-h-0">
          <AccountDetail
            account={openAccount}
            onBack={() => setOpenAccount(null)}
            onOpenTransfer={(options) => {
              setOpenAccount(null);
              setTransferPrefill(options ?? null);
              setInTransfer(true);
            }}
            seniorMode={isSenior}
          />
        </div>
        {renderPracticeGuide()}
        <BottomNav
          activeTab={activeTab}
          onChange={(t) => { setOpenAccount(null); setActiveTab(t); }}
          seniorMode={isSenior}
          practiceHighlight={practiceHighlight}
          onPracticeTap={practice ? practiceTap : undefined}
        />
      </div>
    );
  }

  if (version === 'student') {
    return <LegacyDashboard version={version} />;
  }

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const banking = accounts.filter(a => a.category === 'banking');
  const credit = accounts.filter(a => a.category === 'creditCards');
  const visaAccount = credit[0];

  const openSeniorTransfer = (options?: { fromId?: string; toId?: string; amount?: string }) => {
    setTransferPrefill(options ?? null);
    setInTransfer(true);
  };

  const renderSeniorHome = () => (
    <div className="flex flex-col bg-white min-h-full senior-preview high-contrast">
      <div
        className="px-6 pt-14 pb-7 text-white"
        style={{ background: 'linear-gradient(155deg, #1466B8 0%, #0a4d96 40%, #00305E 100%)' }}
      >
        <p className="text-[17px] text-white/90">RBC Mobile</p>
        <h1 className="mt-2 text-[36px] font-normal leading-tight">What would you like to do today?</h1>
        <p className="mt-3 text-[19px] text-white/90">Choose one big action to get started right away.</p>
      </div>

      <div className="flex-1 bg-[#F4F6F8] px-5 py-5">
        <div className="space-y-4">
          <SeniorActionButton
            title="Look at my balance"
            description="See all your accounts and balances."
            onClick={() => setActiveTab('accounts')}
          />
          <SeniorActionButton
            title="Transfer between my accounts"
            description="Move money between chequing, savings, or your credit card."
            onClick={() => openSeniorTransfer()}
          />
          <SeniorActionButton
            title="Pay my credit card"
            description="Go straight to a payment for your VISA balance."
            onClick={() => openSeniorTransfer(visaAccount ? { toId: visaAccount.id, amount: String(visaAccount.balance) } : undefined)}
          />
          <SeniorActionButton
            title="Pay a bill"
            description="Open bill payment directly."
            onClick={() => {
              setPayBillsStartAt('payForm');
              setInPayBills(true);
            }}
          />
          <SeniorActionButton
            title="Manage payees"
            description="Add, edit, or remove bill payees."
            onClick={() => {
              setPayBillsStartAt('managePayees');
              setInPayBills(true);
            }}
          />
          <SeniorActionButton
            title="Send an e-Transfer"
            description="Go straight to the send money form."
            onClick={() => {
              setETransferStartAt('send');
              setInETransfer(true);
            }}
          />
          <SeniorActionButton
            title="Deposit a cheque"
            description="Start a mobile cheque deposit."
            onClick={() => {
              setDepositStartWithActions(false);
              setInDeposit(true);
            }}
          />
          <SeniorActionButton
            title="Get a void cheque"
            description="View account details for direct deposit or payments."
            onClick={() => setInVoidCheque(true)}
          />
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className={`flex flex-col bg-white ${isSenior ? 'senior-preview high-contrast' : ''}`}>
      {/* Hero header with subtle wave/swirl */}
      <div className="relative overflow-hidden">
        <div
          className={`text-white relative ${isSenior ? 'px-6 pt-14 pb-12' : 'px-6 pt-14 pb-10'}`}
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

          <p className={`${isSenior ? 'text-[16px]' : 'text-[13px]'} font-light text-white/90 leading-none`}>RBC Mobile</p>
          <h1 className={`${isSenior ? 'text-[36px] font-normal mt-2 mb-6' : 'text-[28px] font-extralight mt-1 mb-5'} leading-tight tracking-tight`}>{greeting}</h1>

          {/* Search pill — frosted */}
          <div className={`bg-white/20 border border-white/30 rounded-full flex items-center gap-3 ${isSenior ? 'px-5 py-4' : 'px-4 py-3'}`}>
            <SearchIcon size={isSenior ? 20 : 16} stroke="white" />
            <span className={`${isSenior ? 'text-[18px]' : 'text-[14.5px]'} text-white font-light`}>Search RBC Mobile</span>
          </div>
        </div>
      </div>

      {/* Quick actions — horizontally scrollable, slight overlap with hero */}
      <div className="relative bg-[#F2F4F5] -mt-4 z-10 pt-4 pb-3">
        <div className="overflow-x-auto no-scrollbar">
          <div className={`flex ${isSenior ? 'gap-4 px-5 pb-2' : 'gap-3 px-4 pb-1'}`} style={{ width: 'max-content' }}>
            {[
              {
                target: 'qa-send' as const,
                icon: <SendIcon size={26} stroke="#006AC3" />,
                label: 'Send',
                // Real RBC app behavior: Send tile routes to Move Money hub
                // so the user sees all money-moving options together,
                // not just Interac.
                onClick: () => setActiveTab('moveMoney'),
              },
              {
                target: 'qa-transfer' as const,
                icon: <TransferIcon size={26} stroke="#006AC3" />,
                label: 'Transfer',
                onClick: () => {
                  setTransferPrefill(null);
                  setInTransfer(true);
                },
              },
              {
                target: 'qa-pay-bills' as const,
                icon: <PayBillsIcon size={26} stroke="#006AC3" />,
                label: 'Pay bills',
                onClick: () => {
                  setPayBillsStartAt(practice ? 'payForm' : 'hub');
                  setPayBillsStep(practice ? 'payForm' : 'hub');
                  setInPayBills(true);
                },
              },
              {
                target: 'qa-deposit' as const,
                icon: <SendIcon size={26} stroke="#006AC3" />,
                label: 'Deposit',
                onClick: () => {
                  setDepositStartWithActions(!practice);
                  setInDeposit(true);
                },
              },
            ].map((qa) => (
              <PracticeHighlight key={qa.label} target={qa.target} activeTarget={practiceHighlight}>
                <button
                  onClick={() => practiceTap(qa.target, qa.onClick)}
                  className={`bg-white border rounded-md flex flex-col items-center justify-center active:bg-rbc-bright-lightest cursor-pointer shadow-sm ${
                    isSenior ? 'gap-2.5 border-[#B9C6D2]' : 'gap-1.5 border-gray-200'
                  }`}
                  style={{ width: isSenior ? '40%' : '32%', minWidth: isSenior ? 152 : 120, height: isSenior ? 122 : 100 }}
                >
                  {qa.icon}
                  <span className={`${isSenior ? 'text-[18px]' : 'text-[14px]'} font-medium text-rbc-dark`}>{qa.label}</span>
                </button>
              </PracticeHighlight>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="bg-white">
        <div className="bg-[#F2F4F5] px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
          <h3 className={`${isSenior ? 'text-[21px] font-medium' : 'text-[16px] font-normal'} text-rbc-dark`}>Accounts Overview</h3>
          <KebabIcon size={18} stroke="#6B7280" />
        </div>
        <div className="px-5">
          {[...banking, ...credit].map((a, i, arr) => {
            const row = (
              <button
                onClick={() => (a.id === 'chq1' ? practiceTap('home-account', () => setOpenAccount(a)) : setOpenAccount(a))}
                className={`w-full flex items-center justify-between cursor-pointer text-left border-b ${isSenior ? 'py-5' : 'py-4'}`}
                style={{ borderColor: i === arr.length - 1 ? 'transparent' : '#E5E7EA' }}
              >
                <span className={`${isSenior ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>
                  {a.name} ({a.accountNumber})
                </span>
                <div className="flex items-center gap-2">
                  <span className={`${isSenior ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>{formatPlain(a.balance)}</span>
                  <ChevronRightIcon size={14} stroke="#9CA3AF" />
                </div>
              </button>
            );

            if (a.id !== 'chq1') return <div key={a.id}>{row}</div>;

            return (
              <PracticeHighlight key={a.id} target="home-account" activeTarget={practiceHighlight}>
                {row}
              </PracticeHighlight>
            );
          })}
        </div>
        <div className="px-5 pb-4 pt-1 flex items-center justify-end gap-4">
          <button className={`${isSenior ? 'text-[17px]' : 'text-[14px]'} text-rbc-bright font-medium cursor-pointer`}>Open an account</button>
          <span className="text-gray-300">|</span>
          <button className={`${isSenior ? 'text-[17px]' : 'text-[14px]'} text-rbc-bright font-medium cursor-pointer`}>View all</button>
        </div>
      </div>

      {/* NOMI section */}
      <div className="bg-white">
        <div className="bg-[#F2F4F5] px-5 py-3 flex items-center justify-between border-y border-[#E5E7EA]">
          <h3 className={`${isSenior ? 'text-[21px] font-medium' : 'text-[16px] font-normal'} text-rbc-dark`}>NOMI</h3>
          <KebabIcon size={18} stroke="#6B7280" />
        </div>
        <div className="w-full flex items-center justify-between px-5 py-4">
          <span className={`${isSenior ? 'text-[21px]' : 'text-[16px]'} text-rbc-dark`}>Insights</span>
          <button className={`${isSenior ? 'text-[17px]' : 'text-[14px]'} text-rbc-bright font-medium cursor-pointer`}>View all</button>
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
      <div className="flex-1 overflow-auto min-h-0">
        {activeTab === 'home' && (isSenior ? renderSeniorHome() : renderHome())}
        {activeTab === 'accounts' && <AccountSummary onSelectAccount={setOpenAccount} seniorMode={isSenior} />}
        {activeTab === 'moveMoney' && (
          <MoveMoneyHub
            onOpenTransfer={() => {
              setTransferPrefill(null);
              setInTransfer(true);
            }}
            onOpenETransfer={() => setInETransfer(true)}
            onOpenPayBills={() => {
              setPayBillsStartAt('hub');
              setPayBillsStep('hub');
              setInPayBills(true);
            }}
            onOpenDeposit={() => setInDeposit(true)}
            seniorMode={isSenior}
            practiceHighlight={practiceHighlight}
            onPracticeTap={practice ? practiceTap : undefined}
          />
        )}
        {activeTab === 'more' && renderEmpty('More')}
      </div>

      {renderPracticeGuide()}

      {/* Bottom navigation — distinctive RBC layout with gold FAB */}
      <BottomNav {...bottomNavProps} />
    </div>
  );
}

function BottomNav({
  activeTab,
  onChange,
  seniorMode = false,
  practiceHighlight = null,
  onPracticeTap,
}: {
  activeTab: Tab;
  onChange: (t: Tab) => void;
  seniorMode?: boolean;
  practiceHighlight?: PracticeTarget | null;
  onPracticeTap?: (target: PracticeTarget, action: () => void) => void;
}) {
  const inactiveColor = '#6B7280';
  const activeColor = '#006AC3';
  const tap = (target: PracticeTarget, action: () => void) => {
    if (onPracticeTap) onPracticeTap(target, action);
    else action();
  };

  return (
    <div className="relative bg-white border-t border-gray-200">
      <div className={`flex items-end justify-around ${seniorMode ? 'pt-2 pb-2' : 'pt-1 pb-1.5'}`}>
        <NavItem
          label="Home"
          active={activeTab === 'home'}
          onClick={() => onChange('home')}
          icon={<HomeIcon size={seniorMode ? 26 : 22} stroke={activeTab === 'home' ? activeColor : inactiveColor} filled={activeTab === 'home'} />}
          seniorMode={seniorMode}
        />
        <NavItem
          label="Accounts"
          active={activeTab === 'accounts'}
          onClick={() => onChange('accounts')}
          icon={<CardIcon size={seniorMode ? 26 : 22} stroke={activeTab === 'accounts' ? activeColor : inactiveColor} filled={activeTab === 'accounts'} />}
          seniorMode={seniorMode}
        />
        {/* Spacer for FAB */}
        <div className="w-14" />
        <PracticeHighlight target="nav-move-money" activeTarget={practiceHighlight}>
          <NavItem
            label="Move Money"
            active={activeTab === 'moveMoney'}
            onClick={() => tap('nav-move-money', () => onChange('moveMoney'))}
            icon={<MoveMoneyIcon size={seniorMode ? 26 : 22} stroke={activeTab === 'moveMoney' ? activeColor : inactiveColor} filled={activeTab === 'moveMoney'} />}
            seniorMode={seniorMode}
          />
        </PracticeHighlight>
        <NavItem
          label="More"
          active={activeTab === 'more'}
          onClick={() => onChange('more')}
          icon={<MoreIcon size={seniorMode ? 26 : 22} stroke={activeTab === 'more' ? activeColor : inactiveColor} />}
          seniorMode={seniorMode}
        />
      </div>

      {/* Gold FAB centered on the bar */}
      <motion.button
        className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-rbc-gold flex items-center justify-center shadow-md cursor-pointer ${
          seniorMode ? '-top-6 w-14 h-14' : '-top-5 w-12 h-12'
        }`}
        whileTap={{ scale: 0.94 }}
        aria-label="Move Money menu"
      >
        <ChevronUpIcon size={22} stroke="#1A1A1A" />
      </motion.button>
    </div>
  );
}

function NavItem({ label, active, onClick, icon, seniorMode = false }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode; seniorMode?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-1 py-1 cursor-pointer ${seniorMode ? 'min-w-[68px] min-h-[58px]' : 'min-w-[56px] min-h-[44px]'}`}
    >
      {icon}
      <span className={`${seniorMode ? 'text-[13px]' : 'text-[10.5px]'} ${active ? 'text-rbc-bright font-medium' : 'text-rbc-secondary'}`}>
        {label}
      </span>
    </button>
  );
}

function SeniorActionButton({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-[#B6C6D8] bg-white px-5 py-6 text-left shadow-sm"
    >
      <p className="text-[24px] font-semibold text-rbc-dark">{title}</p>
      <p className="mt-2 text-[17px] leading-7 text-[#444444]">{description}</p>
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
