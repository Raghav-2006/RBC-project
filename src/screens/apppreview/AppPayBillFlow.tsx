import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Account, Payee } from '../../data/mockData';
import { accounts, payees as seedPayees, recipients as seedRecipients, billerDirectory, formatPlain } from '../../data/mockData';
import { ChevronLeftIcon } from '../../components/ui/RBCIcons';
import PayBillsHub from './PayBillsHub';
import type { PracticeTarget } from '../learnpractice/practiceSteps';

type Step =
  | 'hub'
  | 'payForm'
  | 'review'
  | 'sent'
  | 'addPayeeSearch'
  | 'addPayeeForm'
  | 'addPayeeConfirm'
  | 'payeeAdded'
  | 'managePayees'
  | 'editPayee'
  | 'cancelHub'
  | 'cancelList'
  | 'cancelConfirm'
  | 'cancelDone';

interface RecentPayment {
  id: string;
  payee: string;
  accountNumber: string;
  amount: number;
  date: string; // ISO
  fromAccountId: string;
}

type Sheet = 'account' | 'payee' | 'frequency' | null;

interface Props {
  onExitToDashboard: () => void;
  onExitToMoveMoney: () => void;
  /** If provided, land directly on Pay form pre-filled with this payee */
  initialPayee?: Payee | null;
  seniorMode?: boolean;
  startAt?: 'hub' | 'payForm' | 'managePayees';
  practiceHighlight?: PracticeTarget | null;
  onPracticeTargetActivated?: (target: PracticeTarget) => void;
  onStepChange?: (step: string) => void;
  practiceStep?: string;
}

interface FormState {
  from: Account | null;
  amount: string;
  to: Payee | null;
  when: string;
  frequency: 'Once' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export default function AppPayBillFlow({
  onExitToDashboard,
  onExitToMoveMoney,
  initialPayee,
  seniorMode = false,
  startAt,
  practiceHighlight = null,
  onPracticeTargetActivated,
  onStepChange,
  practiceStep,
}: Props) {
  const [step, setStep] = useState<Step>(startAt ?? (initialPayee ? 'payForm' : 'hub'));
  const [sheet, setSheet] = useState<Sheet>(null);
  const [payees, setPayees] = useState<Payee[]>(seedPayees);
  const [form, setForm] = useState<FormState>({
    from: null,
    amount: '',
    to: initialPayee ?? null,
    when: todayISO(),
    frequency: 'Once',
  });
  const [newPayeeDraft, setNewPayeeDraft] = useState<{ name: string; nickname: string; accountNumber: string } | null>(null);
  const [editingPayee, setEditingPayee] = useState<Payee | null>(null);
  const [confirmationNumber] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [cancelConfirmationNumber] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString().padStart(5, '0')
  );
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([
    { id: 'rp1', payee: 'Bell Canada', accountNumber: '3401 **** **** 022', amount: 89.99, date: todayISO(), fromAccountId: 'chq1' },
    { id: 'rp2', payee: 'Toronto Hydro', accountNumber: '7823 **** **** 194', amount: 134.50, date: todayISO(), fromAccountId: 'chq1' },
  ]);
  const [cancellingPayment, setCancellingPayment] = useState<RecentPayment | null>(null);
  const [payFormInitialTab, setPayFormInitialTab] = useState<'New' | 'Upcoming' | 'History'>('New');

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (practiceStep === 'managePayees' && step !== 'managePayees') {
      setStep('managePayees');
    }
  }, [practiceStep, step]);

  const practiceTap = (target: PracticeTarget, action: () => void) => {
    if (practiceHighlight === target) {
      onPracticeTargetActivated?.(target);
    }
    action();
  };

  return (
    <div className={`relative h-full ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      {step === 'hub' && (
        <PayBillsHub
          onBack={onExitToMoveMoney}
          onPayABill={(prefill) => {
            if (prefill) setForm(f => ({ ...f, to: prefill }));
            setPayFormInitialTab('New');
            setStep('payForm');
          }}
          onAddPayee={() => setStep('addPayeeSearch')}
          onManagePayees={() => practiceTap('hub-manage-payees', () => setStep('managePayees'))}
          onCancelPayment={() => setStep('cancelHub')}
          onViewPastPayments={() => {
            setPayFormInitialTab('History');
            setStep('payForm');
          }}
          onViewUpcomingPayments={() => {
            setPayFormInitialTab('Upcoming');
            setStep('payForm');
          }}
          seniorMode={seniorMode}
          practiceHighlight={practiceHighlight}
        />
      )}

      {step === 'payForm' && (
        <PayForm
          key={payFormInitialTab}
          form={form}
          onBack={() => setStep('hub')}
          onOpenSheet={setSheet}
          onChange={(patch) => setForm(f => ({ ...f, ...patch }))}
          onContinue={() => setStep('review')}
          recentPayments={recentPayments}
          initialTab={payFormInitialTab}
        />
      )}

      {step === 'review' && (
        <ReviewPayment
          form={form}
          onBack={() => setStep('payForm')}
          onEdit={() => setStep('payForm')}
          onPay={() => {
            if (form.from && form.to) {
              setRecentPayments(rp => [
                {
                  id: 'rp' + Date.now(),
                  payee: form.to!.name,
                  accountNumber: form.to!.accountNumber,
                  amount: parseFloat(form.amount || '0'),
                  date: todayISO(),
                  fromAccountId: form.from!.id,
                },
                ...rp,
              ]);
            }
            setStep('sent');
          }}
        />
      )}

      {step === 'sent' && (
        <PaymentSent
          form={form}
          confirmationNumber={confirmationNumber}
          onPayAnother={() => {
            setForm({ from: null, amount: '', to: null, when: todayISO(), frequency: 'Once' });
            setStep('payForm');
          }}
          onViewAccount={onExitToDashboard}
        />
      )}

      {step === 'addPayeeSearch' && (
        <AddPayeeSearch
          onBack={() => setStep('hub')}
          onSelect={(name) => {
            setNewPayeeDraft({ name, nickname: '', accountNumber: '' });
            setStep('addPayeeForm');
          }}
        />
      )}

      {step === 'addPayeeForm' && newPayeeDraft && (
        <AddPayeeForm
          draft={newPayeeDraft}
          onBack={() => setStep('addPayeeSearch')}
          onChange={(patch) => setNewPayeeDraft(d => d && { ...d, ...patch })}
          onSave={() => setStep('addPayeeConfirm')}
        />
      )}

      {step === 'addPayeeConfirm' && newPayeeDraft && (
        <AddPayeeConfirm
          draft={newPayeeDraft}
          onBack={() => setStep('addPayeeForm')}
          onCancel={() => setStep('addPayeeForm')}
          onSave={() => {
            const newPayee: Payee = {
              id: 'p' + Date.now(),
              name: newPayeeDraft.name,
              accountNumber: newPayeeDraft.accountNumber,
              dueDate: todayISO(),
              amountDue: 0,
            };
            setPayees(ps => [newPayee, ...ps]);
            setStep('payeeAdded');
          }}
        />
      )}

      {step === 'payeeAdded' && newPayeeDraft && (
        <PayeeAdded
          draft={newPayeeDraft}
          onPayNow={() => {
            const newPayee = payees.find(p => p.name === newPayeeDraft.name && p.accountNumber === newPayeeDraft.accountNumber);
            if (newPayee) setForm(f => ({ ...f, to: newPayee }));
            setStep('payForm');
          }}
          onAddAnother={() => {
            setNewPayeeDraft(null);
            setStep('addPayeeSearch');
          }}
        />
      )}

      {step === 'managePayees' && (
        <ManagePayees
          payees={payees}
          onBack={() => setStep('hub')}
          onEditPayee={(p) => { setEditingPayee(p); setStep('editPayee'); }}
        />
      )}

      {step === 'editPayee' && editingPayee && (
        <EditPayee
          payee={editingPayee}
          onBack={() => setStep('managePayees')}
          onSave={(updated) => {
            setPayees(ps => ps.map(p => p.id === updated.id ? updated : p));
            setStep('managePayees');
          }}
          onDelete={() => {
            setPayees(ps => ps.filter(p => p.id !== editingPayee.id));
            setStep('managePayees');
          }}
        />
      )}

      {step === 'cancelHub' && (
        <CancelHub
          onBack={() => setStep('hub')}
          onCancelBillPayment={() => setStep('cancelList')}
        />
      )}

      {step === 'cancelList' && (
        <CancelList
          payments={recentPayments}
          onBack={() => setStep('cancelHub')}
          onSelect={(pay) => { setCancellingPayment(pay); setStep('cancelConfirm'); }}
        />
      )}

      {step === 'cancelConfirm' && cancellingPayment && (
        <CancelConfirm
          payment={cancellingPayment}
          returnAccount={accounts.find(a => a.id === cancellingPayment.fromAccountId) ?? accounts[0]}
          onBack={() => setStep('cancelList')}
          onCancelPayment={() => setStep('cancelDone')}
        />
      )}

      {step === 'cancelDone' && cancellingPayment && (
        <CancelDone
          payment={cancellingPayment}
          returnAccount={accounts.find(a => a.id === cancellingPayment.fromAccountId) ?? accounts[0]}
          confirmationNumber={cancelConfirmationNumber}
          onViewAccount={() => {
            setRecentPayments(rp => rp.filter(p => p.id !== cancellingPayment.id));
            onExitToDashboard();
          }}
        />
      )}

      {/* Bottom sheets */}
      <AnimatePresence>
        {step === 'payForm' && sheet === 'account' && (
          <BottomSheet title="Select Account" onClose={() => setSheet(null)}>
            {accounts.map(a => (
              <button
                key={a.id}
                onClick={() => { setForm(f => ({ ...f, from: a })); setSheet(null); }}
                className="w-full flex items-start justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
              >
                <div>
                  <p className="text-[16px] text-rbc-dark">{a.name}</p>
                  <p className="text-[13px] text-rbc-secondary mt-0.5 tracking-wide">
                    {a.fullNumber ?? a.accountNumber}
                  </p>
                </div>
                <p className="text-[16px] text-rbc-dark pt-1">{formatPlain(a.balance)}</p>
              </button>
            ))}
          </BottomSheet>
        )}

        {step === 'payForm' && sheet === 'payee' && (
          <PayeeSheet
            payees={payees}
            onSelect={(p) => { setForm(f => ({ ...f, to: p })); setSheet(null); }}
            onClose={() => setSheet(null)}
            onAdd={() => { setSheet(null); setStep('addPayeeSearch'); }}
          />
        )}

        {step === 'payForm' && sheet === 'frequency' && (
          <BottomSheet title="Frequency" onClose={() => setSheet(null)}>
            {(['Once', 'Weekly', 'Bi-Weekly', 'Monthly'] as const).map(freq => (
              <button
                key={freq}
                onClick={() => { setForm(f => ({ ...f, frequency: freq })); setSheet(null); }}
                className="w-full flex items-center justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
              >
                <span className="text-[16px] text-rbc-dark">{freq}</span>
                {form.frequency === freq && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6" /></svg>
                )}
              </button>
            ))}
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Pay form ─────────────────────────────────────────────────────────────
function PayForm({
  form, onBack, onOpenSheet, onChange, onContinue, recentPayments, initialTab,
}: {
  form: FormState;
  onBack: () => void;
  onOpenSheet: (s: Sheet) => void;
  onChange: (patch: Partial<FormState>) => void;
  onContinue: () => void;
  recentPayments: RecentPayment[];
  initialTab?: 'New' | 'Upcoming' | 'History';
}) {
  const canContinue = form.from && parseFloat(form.amount || '0') > 0 && form.to;
  const [tab, setTab] = useState<'New' | 'Upcoming' | 'History'>(initialTab ?? 'New');

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Pay Bills" onBack={onBack} />

      {/* Sub-tabs */}
      <div className="grid grid-cols-3 border-b border-[#E5E7EA]">
        {(['New', 'Upcoming', 'History'] as const).map(t => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="py-3.5 relative cursor-pointer"
              style={{ background: active ? 'white' : '#F2F4F5' }}
            >
              <span className={`text-[15px] ${active ? 'text-rbc-dark font-medium' : 'text-rbc-bright'}`}>{t}</span>
              {active && <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-rbc-dark rounded-t" />}
            </button>
          );
        })}
      </div>

      {tab === 'Upcoming' && (
        <div className="px-5 py-10 text-center">
          <div className="flex justify-center mb-3">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="12" width="36" height="30" rx="2" />
              <line x1="8" y1="20" x2="44" y2="20" />
              <line x1="16" y1="8" x2="16" y2="14" />
              <line x1="36" y1="8" x2="36" y2="14" />
              <circle cx="18" cy="28" r="1.5" fill="#6B7280" />
              <circle cx="26" cy="28" r="1.5" fill="#6B7280" />
              <circle cx="34" cy="28" r="1.5" fill="#6B7280" />
            </svg>
          </div>
          <p className="text-[13.5px] text-rbc-dark leading-snug">
            You have no scheduled payments in the next 30 days.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <HelpDot />
            <span className="text-[13px] text-rbc-bright font-medium">Important Information</span>
          </div>
        </div>
      )}

      {tab === 'History' && (
        <HistoryTab payments={recentPayments} />
      )}

      {tab === 'New' && (
        <NewPayContent
          form={form}
          onOpenSheet={onOpenSheet}
          onChange={onChange}
          onContinue={onContinue}
          canContinue={!!canContinue}
        />
      )}
    </div>
  );
}

function NewPayContent({
  form, onOpenSheet, onChange, onContinue, canContinue,
}: {
  form: FormState;
  onOpenSheet: (s: Sheet) => void;
  onChange: (patch: Partial<FormState>) => void;
  onContinue: () => void;
  canContinue: boolean;
}) {
  return (
    <>
      {/* Pay with */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[12px] text-rbc-secondary mb-1">Pay with:</p>
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold text-rbc-dark">RBC Account</span>
          <span className="text-gray-300">|</span>
          <button className="text-[15px] text-rbc-bright cursor-pointer">Avion Rewards</button>
        </div>
      </div>

      {/* From */}
      <FieldDropdown
        label="From"
        value={form.from ? `${form.from.name} (${form.from.accountNumber})` : 'Select Account'}
        right={form.from ? formatPlain(form.from.balance) : undefined}
        placeholder={!form.from}
        onClick={() => onOpenSheet('account')}
        topBorder
      />
      <FieldInput
        label="Amount"
        value={form.amount}
        placeholder="0.00"
        onChange={(v) => onChange({ amount: v.replace(/[^0-9.]/g, '') })}
        inputMode="decimal"
      />
      <FieldDropdown
        label="To"
        value={form.to ? `${form.to.name}${form.to.accountNumber ? ` (${form.to.accountNumber.slice(-4)})` : ''}` : 'Select Payee'}
        placeholder={!form.to}
        onClick={() => onOpenSheet('payee')}
      />
      <FieldDropdown
        label="When"
        value={formatDate(form.when)}
        onClick={() => { /* would open date sheet */ }}
      />
      <FieldDropdown
        label="Frequency"
        value={form.frequency}
        onClick={() => onOpenSheet('frequency')}
      />

      <div className="px-4 pt-6">
        <button
          disabled={!canContinue}
          onClick={onContinue}
          className={`w-full py-4 rounded font-medium text-[16px] cursor-pointer transition-colors ${canContinue ? 'bg-rbc-blue text-white' : 'bg-[#E5E7EA] text-rbc-secondary'}`}
        >
          Continue
        </button>
      </div>
    </>
  );
}

// ── History tab ──────────────────────────────────────────────────────────
function HistoryTab({ payments }: { payments: RecentPayment[] }) {
  const groups: Record<string, RecentPayment[]> = {};
  for (const p of payments) (groups[p.date] ??= []).push(p);
  const dates = Object.keys(groups).sort().reverse();

  return (
    <div>
      <div className="px-5 py-3 border-b border-[#E5E7EA] flex items-center gap-2 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.8" strokeLinecap="round">
          <line x1="4" y1="7" x2="14" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="10" y2="17" />
        </svg>
        <span className="text-[14px] text-rbc-bright font-medium">Sort By</span>
      </div>
      {payments.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-[13.5px] text-rbc-secondary">No past payments to show yet.</p>
        </div>
      ) : (
        dates.map(date => (
          <div key={date}>
            <div className="bg-[#F2F4F5] px-5 py-2 border-b border-[#E5E7EA]">
              <span className="text-[13px] text-rbc-secondary">{formatDate(date)}</span>
            </div>
            {groups[date].map(p => (
              <button
                key={p.id}
                className="w-full flex items-center justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
              >
                <span className="text-[14.5px] text-rbc-dark uppercase tracking-wide">{p.payee}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-rbc-dark">{formatPlain(p.amount)}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                </div>
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ── Review Payment ───────────────────────────────────────────────────────
function ReviewPayment({
  form, onBack, onEdit, onPay,
}: {
  form: FormState;
  onBack: () => void;
  onEdit: () => void;
  onPay: () => void;
}) {
  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Pay Bills" onBack={onBack} />

      <div className="px-5 pt-4">
        <h2 className="text-[20px] font-light text-rbc-dark">Ready to Pay?</h2>
      </div>

      {/* Summary card */}
      <div className="mx-5 mt-3 bg-white rounded-lg border border-[#E5E7EA] p-5 text-center">
        <p className="text-[13px] text-rbc-secondary">
          {form.from ? `${form.from.name} (${form.from.accountNumber})` : ''}
        </p>
        <p className="text-[38px] font-light text-rbc-dark my-2">{formatPlain(parseFloat(form.amount || '0'))}</p>
        <div className="border-t border-[#E5E7EA] my-3" />
        <p className="text-[13px] text-rbc-secondary">To</p>
        <p className="text-[18px] font-medium text-rbc-dark mt-1">{form.to?.name}</p>
        {form.to?.accountNumber && (
          <p className="text-[13px] text-rbc-secondary mt-0.5 tracking-wide">{form.to.accountNumber}</p>
        )}
      </div>

      <div className="bg-[#F2F4F5] px-5 py-3 mt-4">
        <p className="text-[15px] text-rbc-dark">Payment Details</p>
      </div>
      <div className="bg-white">
        <DetailRow label="When" value={formatDate(form.when)} />
        <DetailRow label="Frequency" value={form.frequency} />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          onClick={onPay}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Pay Now
        </button>
        <button
          onClick={onEdit}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

// ── Payment Sent ─────────────────────────────────────────────────────────
function PaymentSent({
  form, confirmationNumber, onPayAnother, onViewAccount,
}: {
  form: FormState;
  confirmationNumber: string;
  onPayAnother: () => void;
  onViewAccount: () => void;
}) {
  const amount = parseFloat(form.amount || '0');
  const newBalance = (form.from?.balance ?? 0) - amount;

  const timeStr = useMemo(() => {
    const d = new Date();
    const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    return `${formatDate(form.when)} at ${t} PT`;
  }, [form.when]);

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Pay Bills" />

      <div className="flex flex-col items-center pt-6 pb-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 260, damping: 18 }}
          className="w-14 h-14 rounded-full bg-rbc-success flex items-center justify-center"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6" /></svg>
        </motion.div>
        <h2 className="text-[24px] font-light text-rbc-dark mt-3">Payment Sent!</h2>
        <p className="text-[13px] text-rbc-secondary mt-1">{timeStr}</p>
      </div>

      <div className="mx-5 mt-2 pt-4 border-t border-[#E5E7EA]">
        <p className="text-[14px] text-rbc-dark text-center leading-snug">
          Changed your mind? Tap the link below to cancel this payment.
        </p>
        <div className="flex justify-center mt-2">
          <button className="text-[15px] text-rbc-bright font-medium cursor-pointer">Cancel Payment</button>
        </div>
      </div>

      <div className="mt-4">
        <DetailRow label="From" value={form.from ? `${form.from.name} (${form.from.accountNumber})` : ''} />
        <DetailRow label="Amount" value={formatPlain(amount)} />
        <DetailRow label="New Balance" value={formatPlain(newBalance)} />
        <DetailRow label="To" value={form.to?.name ?? ''} />
        {form.to?.accountNumber && (
          <DetailRow label="Account Number" value={form.to.accountNumber} />
        )}
        <DetailRow label="When" value={formatDate(form.when)} />
        <DetailRow label="Frequency" value={form.frequency} />
        <DetailRow label="Confirmation #" value={confirmationNumber} />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          onClick={onPayAnother}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Pay Another Bill
        </button>
        <button
          onClick={onViewAccount}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          View Your Account
        </button>
      </div>
    </div>
  );
}

// ── Add Payee: Search ────────────────────────────────────────────────────
function AddPayeeSearch({ onBack, onSelect }: { onBack: () => void; onSelect: (name: string) => void }) {
  const [q, setQ] = useState('');
  const results = q.trim().length === 0 ? [] : billerDirectory
    .filter(name => name.toLowerCase().includes(q.trim().toLowerCase()))
    .slice(0, 20);

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Add Payee" onBack={onBack} />

      <div className="px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-[#F2F4F5] rounded-md px-3 py-2 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6" /><line x1="20" y1="20" x2="16" y2="16" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            autoFocus
            className="flex-1 bg-transparent outline-none text-[15px] text-rbc-dark"
          />
          {q.length > 0 && (
            <button onClick={() => setQ('')} className="cursor-pointer" aria-label="Clear">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6B7280"><circle cx="12" cy="12" r="10" /><line x1="8" y1="8" x2="16" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="16" y1="8" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
        <button onClick={onBack} className="text-[15px] text-rbc-bright cursor-pointer px-1">Cancel</button>
      </div>

      {q.trim().length > 0 && (
        <div className="bg-[#F2F4F5] px-5 py-2 border-y border-[#E5E7EA]">
          <span className="text-[13px] text-rbc-secondary">{results.length} results</span>
        </div>
      )}
      {results.map(name => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className="w-full text-left px-5 py-4 border-b border-[#E5E7EA] cursor-pointer active:bg-[#F2F4F5]"
        >
          <span className="text-[15px] text-rbc-bright font-semibold">
            {highlightMatch(name, q)}
          </span>
        </button>
      ))}
    </div>
  );
}

function highlightMatch(text: string, q: string) {
  if (!q.trim()) return text;
  const lower = text.toLowerCase();
  const needle = q.trim().toLowerCase();
  const i = lower.indexOf(needle);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-rbc-bright">{text.slice(i, i + needle.length)}</span>
      <span className="text-rbc-dark font-normal">{text.slice(i + needle.length)}</span>
    </>
  );
}

// ── Add Payee: Form ──────────────────────────────────────────────────────
function AddPayeeForm({
  draft, onBack, onChange, onSave,
}: {
  draft: { name: string; nickname: string; accountNumber: string };
  onBack: () => void;
  onChange: (patch: Partial<{ name: string; nickname: string; accountNumber: string }>) => void;
  onSave: () => void;
}) {
  const canSave = draft.accountNumber.trim().length >= 4;
  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Add Payee" onBack={onBack} />

      <div className="bg-white">
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
          <div>
            <p className="text-[12px] text-rbc-secondary mb-0.5">Name</p>
            <p className="text-[16px] text-rbc-dark">{draft.name}</p>
          </div>
          <HelpDot />
        </div>
        <TextField
          label="Nickname"
          value={draft.nickname}
          onChange={(v) => onChange({ nickname: v })}
          placeholder="Enter a Nickname (Optional)"
        />
        <TextField
          label="Account Number"
          value={draft.accountNumber}
          onChange={(v) => onChange({ accountNumber: v })}
          placeholder="Enter your Account Number"
          inputMode="numeric"
        />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          disabled={!canSave}
          onClick={onSave}
          className={`w-full py-4 rounded font-medium text-[16px] cursor-pointer transition-colors ${canSave ? 'bg-rbc-blue text-white' : 'bg-[#E5E7EA] text-rbc-secondary'}`}
        >
          Save
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Add Payee: Confirm ───────────────────────────────────────────────────
function AddPayeeConfirm({
  draft, onBack, onCancel, onSave,
}: {
  draft: { name: string; nickname: string; accountNumber: string };
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Add Payee" onBack={onBack} />

      <div className="bg-[#F2F4F5] py-3 text-center">
        <span className="text-[14px] text-rbc-dark">Add This Payee?</span>
      </div>

      <div className="bg-white">
        <DetailRow label="Name" value={draft.name} />
        <DetailRow label="Account Number" value={draft.accountNumber} />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          onClick={onSave}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Payee Added! ─────────────────────────────────────────────────────────
function PayeeAdded({
  draft, onPayNow, onAddAnother,
}: {
  draft: { name: string; nickname: string; accountNumber: string };
  onPayNow: () => void;
  onAddAnother: () => void;
}) {
  const timeStr = useMemo(() => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    return `${dateStr} at ${t} PT`;
  }, []);

  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Add Payee" />

      <div className="flex flex-col items-center pt-6 pb-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 260, damping: 18 }}
          className="w-14 h-14 rounded-full bg-rbc-success flex items-center justify-center"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6" /></svg>
        </motion.div>
        <h2 className="text-[24px] font-light text-rbc-dark mt-3">Payee Added!</h2>
        <p className="text-[13px] text-rbc-secondary mt-1">{timeStr}</p>
      </div>

      <div className="bg-white mt-4">
        <DetailRow label="Name" value={draft.name} />
        <DetailRow label="Account Number" value={draft.accountNumber} />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          onClick={onPayNow}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Pay Now
        </button>
        <button
          onClick={onAddAnother}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          Add Another Payee
        </button>
      </div>
    </div>
  );
}

// ── Manage Payees (list with 3 tabs) ─────────────────────────────────────
function ManagePayees({ payees, onBack, onEditPayee }: { payees: Payee[]; onBack: () => void; onEditPayee: (p: Payee) => void }) {
  type Tab = 'Payees' | 'RBC Clients' | 'Recipients';
  const [tab, setTab] = useState<Tab>('Payees');

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Manage" onBack={onBack} />

      <div className="grid grid-cols-3 border-b border-[#E5E7EA]">
        {(['Payees', 'RBC Clients', 'Recipients'] as const).map(t => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="py-3.5 relative cursor-pointer"
              style={{ background: active ? 'white' : '#F2F4F5' }}
            >
              <span className={`text-[15px] ${active ? 'text-rbc-dark font-medium' : 'text-rbc-bright'}`}>{t}</span>
              {active && <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-rbc-dark rounded-t" />}
            </button>
          );
        })}
      </div>

      {tab === 'Payees' && payees.map(p => (
        <button
          key={p.id}
          onClick={() => onEditPayee(p)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
        >
          <div>
            <p className="text-[16px] text-rbc-dark">{p.name}</p>
            <p className="text-[13px] text-rbc-secondary mt-0.5 tracking-wide">{p.accountNumber}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
        </button>
      ))}

      {tab === 'RBC Clients' && (
        <div className="px-5 py-10 text-center bg-white">
          <div className="flex justify-center mb-3">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M15 12h20l10 10v26H15z" stroke="#6B7280" strokeWidth="1.5" strokeLinejoin="round" fill="white" />
              <path d="M35 12v10h10" stroke="#6B7280" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M20 34c4 3 12 3 20 0" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[13.5px] text-rbc-dark leading-snug max-w-[280px] mx-auto">
            You currently don't have any RBC Clients saved in your list. Let's add your first one.
          </p>
        </div>
      )}

      {tab === 'Recipients' && seedRecipients.map(r => (
        <button
          key={r.id}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
        >
          <span className="text-[16px] text-rbc-dark">{r.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
        </button>
      ))}
    </div>
  );
}

// ── Edit Payee ───────────────────────────────────────────────────────────
function EditPayee({
  payee, onBack, onSave, onDelete,
}: {
  payee: Payee;
  onBack: () => void;
  onSave: (p: Payee) => void;
  onDelete: () => void;
}) {
  const [nickname, setNickname] = useState('');
  const [accountNumber, setAccountNumber] = useState(payee.accountNumber);

  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Edit" onBack={onBack} />

      <div className="bg-white">
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
          <div>
            <p className="text-[12px] text-rbc-secondary mb-0.5">Name</p>
            <p className="text-[15px] text-rbc-bright font-semibold">{payee.name}</p>
          </div>
          <HelpDot />
        </div>
        <TextField
          label="Nickname"
          value={nickname}
          onChange={setNickname}
          placeholder="Enter a Nickname (Optional)"
        />
        <TextField
          label="Account Number"
          value={accountNumber}
          onChange={setAccountNumber}
          placeholder="Enter your Account Number"
        />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          onClick={() => onSave({ ...payee, accountNumber })}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Save
        </button>
        <button
          onClick={onDelete}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Cancel or Stop a Payment hub ─────────────────────────────────────────
function CancelHub({ onBack, onCancelBillPayment }: { onBack: () => void; onCancelBillPayment: () => void }) {
  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Cancel or Stop a Payment" onBack={onBack} />

      <SectionHeader title="Bill Payments" />
      <p className="px-5 py-3 text-[13.5px] text-rbc-dark leading-snug border-b border-[#E5E7EA]">
        Cancel a bill payment you recently made or delete an upcoming payment you set up with RBC.
      </p>
      <CancelRow
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
            <path d="M10 8h4M10 12h4M10 16h2" />
          </svg>
        }
        label="Cancel a Bill Payment"
        onClick={onCancelBillPayment}
      />
      <CancelRow
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        }
        label="Delete an Upcoming Payment"
      />

      <SectionHeader title="Pre-Authorized Payments" />
      <p className="px-5 py-3 text-[13.5px] text-rbc-dark leading-snug border-b border-[#E5E7EA]">
        Stop one payment, from a series of recurring payments, you set up with a merchant or organization. For example, a gym membership or online subscription payment.
      </p>
      <CancelRow
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 14" />
            <path d="M15 5l-2-2M9 5l2-2" strokeWidth="1" opacity="0" />
          </svg>
        }
        label="Stop a Pre-Authorized Payment"
      />

      <SectionHeader title="Cheques" />
      <p className="px-5 py-3 text-[13.5px] text-rbc-dark leading-snug border-b border-[#E5E7EA]">
        Stop a cheque you already issued to the payee.
      </p>
      <CancelRow
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <line x1="7" y1="10" x2="17" y2="10" />
            <line x1="7" y1="14" x2="11" y2="14" />
          </svg>
        }
        label="Stop a Cheque"
      />

      <div className="px-5 pt-4 flex items-center gap-2">
        <HelpDot />
        <span className="text-[13.5px] text-rbc-dark">Can't find the payment you were looking for?</span>
      </div>
    </div>
  );
}

function CancelRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer border-b border-[#E5E7EA] active:bg-[#F2F4F5]"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rbc-bright/60 shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-[16px] text-rbc-dark">{label}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#F2F4F5] px-5 py-3 border-y border-[#E5E7EA]">
      <h3 className="text-[15px] text-rbc-dark">{title}</h3>
    </div>
  );
}

// ── Cancel List ──────────────────────────────────────────────────────────
function CancelList({
  payments, onBack, onSelect,
}: {
  payments: RecentPayment[];
  onBack: () => void;
  onSelect: (p: RecentPayment) => void;
}) {
  const groups: Record<string, RecentPayment[]> = {};
  for (const p of payments) (groups[p.date] ??= []).push(p);
  const dates = Object.keys(groups).sort().reverse();

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Cancel Payments" onBack={onBack} />

      <p className="px-5 py-4 text-[15px] text-rbc-dark bg-[#F2F4F5] border-b border-[#E5E7EA] leading-snug">
        Tap the bill payment that you wish to cancel.
      </p>

      {payments.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-[14px] text-rbc-secondary">No recent payments to cancel.</p>
        </div>
      ) : (
        dates.map(date => (
          <div key={date}>
            <div className="bg-[#F2F4F5] px-5 py-2 border-b border-[#E5E7EA]">
              <span className="text-[13px] text-rbc-secondary">{formatDate(date)}</span>
            </div>
            {groups[date].map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full flex items-center justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
              >
                <div>
                  <p className="text-[15px] text-rbc-dark">{p.payee}</p>
                  <p className="text-[12.5px] text-rbc-secondary mt-0.5 tracking-wide">
                    {p.accountNumber.replace(/[^0-9]/g, '')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-rbc-dark">{formatPlain(p.amount)}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                </div>
              </button>
            ))}
          </div>
        ))
      )}

      <div className="px-5 py-4">
        <p className="text-[12.5px] text-rbc-dark leading-snug">
          Bill payments made on business days before <b>6:00 p.m. (local time)</b> can be cancelled until <b>9:10 p.m. ET</b> on the same day.
        </p>
        <p className="text-[12.5px] text-rbc-dark leading-snug mt-3">
          Bill payments made on weekends or on business days after <b>6:00 p.m. (local time)</b> can be cancelled until <b>9:10 p.m. ET</b> on the next business day.
        </p>
        <div className="flex items-center gap-2 mt-4">
          <HelpDot />
          <span className="text-[13px] text-rbc-dark">Can't find the bill payment you were looking for?</span>
        </div>
      </div>
    </div>
  );
}

// ── Ready to Cancel? ─────────────────────────────────────────────────────
function CancelConfirm({
  payment, returnAccount, onBack, onCancelPayment,
}: {
  payment: RecentPayment;
  returnAccount: Account;
  onBack: () => void;
  onCancelPayment: () => void;
}) {
  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Cancel Payments" onBack={onBack} />

      <div className="px-5 pt-4">
        <h2 className="text-[20px] font-light text-rbc-dark">Ready to Cancel?</h2>
      </div>

      <div className="bg-white mt-3">
        <DetailRow label="Return to" value={`${returnAccount.name} (${returnAccount.accountNumber})`} />
        <DetailRow label="Refund Amount" value={formatPlain(payment.amount)} />
        <DetailRow label="Payee" value={payment.payee} />
        <DetailRow label="Account Number" value={payment.accountNumber.replace(/[^0-9]/g, '')} />
      </div>

      <p className="px-5 py-4 text-[13.5px] text-rbc-dark leading-snug">
        Once you cancel this payment, your money will be deposited back into your account immediately.
      </p>
      <p className="px-5 pb-2 text-[13.5px] text-rbc-dark leading-snug">
        Any fees or interest charges you may have incurred when you made this payment will not be reimbursed.
      </p>

      <div className="px-4 pt-4">
        <button
          onClick={onCancelPayment}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
}

// ── Payment Cancelled! ───────────────────────────────────────────────────
function CancelDone({
  payment, returnAccount, confirmationNumber, onViewAccount,
}: {
  payment: RecentPayment;
  returnAccount: Account;
  confirmationNumber: string;
  onViewAccount: () => void;
}) {
  const timeStr = useMemo(() => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    return `${dateStr} at ${t} PT`;
  }, []);

  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Cancel Payments" />

      <div className="flex flex-col items-center pt-6 pb-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 260, damping: 18 }}
          className="w-14 h-14 rounded-full bg-rbc-success flex items-center justify-center"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6" /></svg>
        </motion.div>
        <h2 className="text-[24px] font-light text-rbc-dark mt-3">Payment Cancelled</h2>
        <p className="text-[13px] text-rbc-secondary mt-1">{timeStr}</p>
      </div>

      <p className="px-5 pb-4 text-[13.5px] text-rbc-dark text-center leading-snug">
        Your payment has been cancelled. The funds or points will be returned to your account.
      </p>

      <div className="bg-white">
        <DetailRow label="Return to" value={`${returnAccount.name} (${returnAccount.accountNumber})`} />
        <DetailRow label="Amount" value={formatPlain(payment.amount)} />
        <DetailRow label="Payee" value={payment.payee} />
        <DetailRow label="Account Number" value={payment.accountNumber.replace(/[^0-9]/g, '')} />
        <DetailRow label="Confirmation #" value={confirmationNumber} />
      </div>

      <div className="px-4 pt-6">
        <button
          onClick={onViewAccount}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          View Your Account
        </button>
      </div>
    </div>
  );
}

// ═════════ Shared UI ═════════════════════════════════════════════════════

function BlueHeader({ title, onBack }: { title: string; onBack?: () => void }) {
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
        <span className="text-white text-[16px] font-medium">{title}</span>
      </div>
      <div className="absolute right-4 top-12">
        <div className="w-7 h-7 bg-white rounded-md rounded-bl-none flex items-center justify-center">
          <span className="text-rbc-bright text-[13px] font-semibold leading-none">?</span>
        </div>
      </div>
    </div>
  );
}

function FieldDropdown({
  label, value, right, placeholder, onClick, topBorder,
}: {
  label: string;
  value: string;
  right?: string;
  placeholder?: boolean;
  onClick: () => void;
  topBorder?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-3 border-b border-[#E5E7EA] cursor-pointer active:bg-[#F2F4F5] ${topBorder ? 'border-t' : ''}`}
    >
      <p className="text-[12px] text-rbc-secondary mb-0.5">{label}</p>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[16px] flex-1 truncate ${placeholder ? 'text-rbc-secondary' : 'text-rbc-dark'}`}>{value}</p>
        <div className="flex items-center gap-2 pt-0.5">
          {right && <span className="text-[15px] text-rbc-dark">{right}</span>}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>
    </button>
  );
}

function FieldInput({
  label, value, placeholder, onChange, inputMode,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  inputMode?: 'decimal' | 'text' | 'tel' | 'email' | 'numeric';
}) {
  return (
    <div className="px-5 py-3 border-b border-[#E5E7EA]">
      <p className="text-[12px] text-rbc-secondary mb-0.5">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="text-[16px] text-rbc-dark w-full outline-none placeholder:text-rbc-secondary bg-transparent"
      />
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder, inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: 'decimal' | 'text' | 'tel' | 'email' | 'numeric';
}) {
  return (
    <div className="px-5 py-3 border-b border-[#E5E7EA]">
      <p className="text-[12px] text-rbc-secondary mb-0.5">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="text-[16px] text-rbc-dark w-full outline-none placeholder:text-rbc-secondary bg-transparent"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
      <span className="text-[15px] text-rbc-dark">{label}</span>
      <span className="text-[15px] text-rbc-dark">{value}</span>
    </div>
  );
}

function HelpDot() {
  return (
    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-rbc-bright text-white text-[11px] font-bold leading-none">?</span>
  );
}

// ── Payee sheet (with search + Add) ──────────────────────────────────────
function PayeeSheet({
  payees, onSelect, onClose, onAdd,
}: {
  payees: Payee[];
  onSelect: (p: Payee) => void;
  onClose: () => void;
  onAdd: () => void;
}) {
  return (
    <BottomSheet
      title="To Whom?"
      onClose={onClose}
      rightAction={<button onClick={onAdd} className="text-rbc-bright text-[15px] font-medium cursor-pointer">Add</button>}
    >
      <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
        {payees.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full text-left px-5 py-3 border-b border-[#E5E7EA] cursor-pointer active:bg-[#F2F4F5]"
          >
            <p className="text-[16px] text-rbc-dark">{p.name}</p>
            <p className="text-[13px] text-rbc-secondary mt-0.5 tracking-wide">{p.accountNumber}</p>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

// ── Bottom sheet primitive ───────────────────────────────────────────────
function BottomSheet({
  title, children, onClose, rightAction,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  rightAction?: React.ReactNode;
}) {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 overflow-hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring' as const, stiffness: 260, damping: 30 }}
      >
        <div className="flex justify-center pt-2 pb-1">
          <span className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
          <button onClick={onClose} className="cursor-pointer p-1" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="2"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
          </button>
          <h3 className="text-[16px] text-rbc-dark">{title}</h3>
          {rightAction ?? <span className="w-6" />}
        </div>
        <div className="pb-4">{children}</div>
      </motion.div>
    </>
  );
}
