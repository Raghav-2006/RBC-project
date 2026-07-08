import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { accounts, formatPlain } from '../../data/mockData';
import { ChevronLeftIcon, ChevronRightIcon, HelpIcon } from '../../components/ui/RBCIcons';

type Sheet = 'actions' | 'account' | null;
type View = 'form' | 'review' | 'done';

interface Props {
  onBack: () => void;
  onOpenVoidCheque: () => void;
  seniorMode?: boolean;
  startWithActions?: boolean;
}

export default function AppDepositFlow({ onBack, onOpenVoidCheque, seniorMode = false, startWithActions = true }: Props) {
  const bankingAccounts = accounts.filter((account) => account.category === 'banking');
  const [view, setView] = useState<View>('form');
  const [sheet, setSheet] = useState<Sheet>(startWithActions ? 'actions' : null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [confirmationNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const selectedAccount = bankingAccounts.find((account) => account.id === selectedAccountId) ?? null;
  const amountNumber = parseFloat(amount || '0');
  const canContinue = !!selectedAccount && amountNumber > 0 && frontCaptured && backCaptured;
  const newBalance = selectedAccount ? selectedAccount.balance + amountNumber : 0;

  return (
    <div className={`relative min-h-full bg-[#EEF3F7] ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      {view === 'form' && (
        <>
          <BlueHeader title="Deposit Cheque" onBack={onBack} seniorMode={seniorMode} />

          <div className="px-3 pt-2 pb-6">
            <ChequeCaptureCard
              title="FRONT OF CHEQUE"
              captured={frontCaptured}
              onClick={() => setFrontCaptured((current) => !current)}
              seniorMode={seniorMode}
            />
            <ChequeCaptureCard
              title="BACK OF CHEQUE"
              captured={backCaptured}
              onClick={() => setBackCaptured((current) => !current)}
              seniorMode={seniorMode}
            />

            <div className="mt-4 overflow-hidden border border-[#E5E7EA] bg-white">
              <div className="px-3 py-4">
                <p className={`${seniorMode ? 'text-[17px]' : 'text-[14px]'} text-rbc-secondary`}>Amount</p>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ''))}
                  inputMode="decimal"
                  className={`mt-1 w-full bg-transparent text-rbc-dark outline-none ${seniorMode ? 'text-[24px]' : 'text-[19px]'}`}
                  placeholder="0.00"
                />
              </div>

              <button
                onClick={() => setSheet('account')}
                className="flex w-full items-center justify-between border-t border-[#E5E7EA] px-3 py-4 text-left"
              >
                <div>
                  <p className={`${seniorMode ? 'text-[17px]' : 'text-[14px]'} text-rbc-secondary`}>Deposit Into</p>
                  <p className={`mt-1 ${seniorMode ? 'text-[24px]' : 'text-[19px]'} ${selectedAccount ? 'text-rbc-dark' : 'text-[#C0C5CD]'}`}>
                    {selectedAccount ? `${selectedAccount.name}(${selectedAccount.accountNumber})` : 'Select Account'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedAccount && <span className={`pt-5 ${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-rbc-dark`}>{formatPlain(selectedAccount.balance)}</span>}
                  <ChevronRightIcon size={22} stroke="#D1D5DB" className="rotate-90" />
                </div>
              </button>
            </div>

            <button
              onClick={() => canContinue && setView('review')}
              disabled={!canContinue}
              className={`mt-8 w-full ${seniorMode ? 'py-5 text-[22px]' : 'py-4 text-[18px]'} font-medium ${
                canContinue ? 'bg-rbc-bright text-white' : 'bg-[#E5E5E5] text-[#666666]'
              }`}
            >
              Continue
            </button>
          </div>

          <div className="px-4 pt-1 text-right">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rbc-bright text-[13px] font-bold text-white">i</span>
          </div>
        </>
      )}

      {view === 'review' && selectedAccount && (
        <>
          <BlueHeader title="Deposit Cheque" onBack={() => setView('form')} seniorMode={seniorMode} />
          <div className={`bg-[#F2F4F5] px-6 text-center text-rbc-dark ${seniorMode ? 'py-7 text-[24px] font-normal' : 'py-6 text-[19px] font-light'}`}>
            Ready to Deposit?
          </div>

          <div className="bg-white">
            <ReviewRow label="Front of Cheque" value="Captured" seniorMode={seniorMode} />
            <ReviewRow label="Back of Cheque" value="Captured" seniorMode={seniorMode} />
            <ReviewRow label="Amount" value={formatPlain(amountNumber)} seniorMode={seniorMode} />
            <ReviewRow label="Deposit Into" value={`${selectedAccount.name}(${selectedAccount.accountNumber})`} subvalue={formatPlain(selectedAccount.balance)} last seniorMode={seniorMode} />
          </div>

          <div className="px-6 py-8">
            <button
              onClick={() => setView('done')}
              className={`w-full bg-rbc-bright text-white font-medium ${seniorMode ? 'py-6 text-[22px]' : 'py-5 text-[18px]'}`}
            >
              Deposit Now
            </button>
            <button
              onClick={() => setView('form')}
              className={`mt-3 w-full border-2 border-rbc-bright bg-white text-rbc-bright font-medium ${seniorMode ? 'py-5 text-[22px]' : 'py-4 text-[18px]'}`}
            >
              Edit
            </button>
          </div>
        </>
      )}

      {view === 'done' && selectedAccount && (
        <>
          <BlueHeader title="Deposit Cheque" seniorMode={seniorMode} />
          <div className="flex flex-col items-center bg-white px-6 pt-10 pb-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#39B54A]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 12 10 18 20 6" />
              </svg>
            </div>
            <p className={`mt-5 text-rbc-dark ${seniorMode ? 'text-[24px] font-normal' : 'text-[18px] font-light'}`}>Deposit Complete!</p>
            <p className="mt-1 text-[12px] text-rbc-secondary">Jul 8, 2026 at 1:32 p.m. PT</p>
            <p className={`mt-10 text-rbc-dark ${seniorMode ? 'text-[24px] font-normal' : 'text-[18px] font-light'}`}>Confirmation # {confirmationNumber}</p>
          </div>

          <div className="bg-white">
            <ReviewRow label="Deposit Into" value={`${selectedAccount.name}(${selectedAccount.accountNumber})`} seniorMode={seniorMode} />
            <ReviewRow label="New Balance" value={formatPlain(newBalance)} seniorMode={seniorMode} />
            <ReviewRow label="Amount" value={formatPlain(amountNumber)} seniorMode={seniorMode} />
            <ReviewRow label="Hold Funds" value="Up to 5 business days" last seniorMode={seniorMode} />
          </div>

          <div className="px-6 py-5">
            <button
              onClick={() => {
                setView('form');
                setAmount('');
                setSelectedAccountId(null);
                setFrontCaptured(false);
                setBackCaptured(false);
              }}
              className={`w-full bg-rbc-bright text-white font-medium ${seniorMode ? 'py-6 text-[22px]' : 'py-5 text-[18px]'}`}
            >
              Deposit Another Cheque
            </button>
            <button
              onClick={onBack}
              className={`mt-3 w-full border-2 border-rbc-bright bg-white text-rbc-bright font-medium ${seniorMode ? 'py-5 text-[22px]' : 'py-4 text-[18px]'}`}
            >
              Done
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {view === 'form' && sheet === 'actions' && (
          <BottomSheet title="Deposit" onClose={onBack} seniorMode={seniorMode}>
            <SheetAction
              label="Deposit a cheque"
              onClick={() => setSheet(null)}
              icon={<CameraCircle />}
            />
            <SheetAction
              label="Get a void cheque"
              onClick={() => {
                setSheet(null);
                onOpenVoidCheque();
              }}
              icon={<VoidCircle />}
            />
          </BottomSheet>
        )}

        {view === 'form' && sheet === 'account' && (
          <BottomSheet title="Select Account" onClose={() => setSheet(null)} seniorMode={seniorMode}>
            {bankingAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  setSelectedAccountId(account.id);
                  setSheet(null);
                }}
                className="flex w-full items-center justify-between border-b border-[#E5E7EA] px-5 py-4 text-left"
              >
                <div>
                  <p className={`${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-rbc-dark`}>{account.name}({account.accountNumber})</p>
                  <p className={`mt-1 ${seniorMode ? 'text-[17px]' : 'text-[14px]'} text-rbc-secondary`}>{formatPlain(account.balance)}</p>
                </div>
                {selectedAccountId === account.id && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 12 10 18 20 6" />
                  </svg>
                )}
              </button>
            ))}
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
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

function ChequeCaptureCard({
  title,
  captured,
  onClick,
  seniorMode,
}: {
  title: string;
  captured: boolean;
  onClick: () => void;
  seniorMode?: boolean;
}) {
  return (
    <div className="mb-4">
      <p className={`mb-2 pl-1 font-semibold text-[#6B7280] ${seniorMode ? 'text-[15px]' : 'text-[12px]'}`}>{title}</p>
      <button
        onClick={onClick}
        className="flex aspect-[1.65/1] w-full items-center justify-center border border-[#D6DCE3] bg-white"
      >
        {captured ? <CapturedBadge /> : <CameraBadge />}
      </button>
    </div>
  );
}

function CameraBadge() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-rbc-bright text-rbc-bright">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
        <circle cx="12" cy="13" r="3.8" />
      </svg>
      <span className="absolute -right-1 -top-1 text-[18px] leading-none">+</span>
    </div>
  );
}

function CapturedBadge() {
  return (
    <div className="flex flex-col items-center gap-3 text-rbc-dark">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#39B54A]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </div>
      <span className="text-[15px]">Photo captured</span>
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

function BottomSheet({ title, onClose, children, seniorMode }: { title: string; onClose: () => void; children: React.ReactNode; seniorMode?: boolean }) {
  return (
    <>
      <motion.button
        type="button"
        className="absolute inset-0 bg-black/20"
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
        <div className="pb-10">{children}</div>
      </motion.div>
    </>
  );
}

function SheetAction({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-[#E5E7EA] px-6 py-7 text-left"
    >
      {icon}
      <span className="flex-1 text-[17px] text-rbc-dark">{label}</span>
      <ChevronRightIcon size={16} stroke="#9CA3AF" />
    </button>
  );
}

function CameraCircle() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rbc-bright text-rbc-bright">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
        <circle cx="12" cy="13" r="3.8" />
      </svg>
    </span>
  );
}

function VoidCircle() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rbc-bright text-rbc-bright">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <line x1="6" y1="10" x2="18" y2="10" />
        <line x1="7" y1="14" x2="11" y2="14" />
      </svg>
    </span>
  );
}
