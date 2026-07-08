import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Account, Recipient } from '../../data/mockData';
import { accounts, recipients as seedRecipients, formatPlain } from '../../data/mockData';
import {
  ChevronLeftIcon, ChevronRightIcon, SendIcon,
} from '../../components/ui/RBCIcons';

type Step = 'hub' | 'send' | 'addRecipient' | 'review' | 'sent';
type Sheet = 'account' | 'recipient' | 'notify' | 'when' | 'frequency' | null;

interface Props {
  onExitToDashboard: () => void;
  onExitToMoveMoney: () => void;
  seniorMode?: boolean;
  startAt?: 'hub' | 'send';
}

interface FormState {
  from: Account | null;
  amount: string;
  to: Recipient | null;
  notify: 'Email' | 'SMS' | null;
  when: string; // yyyy-mm-dd
  frequency: 'Once' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
  reuseSecurityQA: boolean;
  securityQuestion: string;
  securityAnswer: string;
  message: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export default function AppETransferFlow({ onExitToDashboard, onExitToMoveMoney, seniorMode = false, startAt = 'hub' }: Props) {
  const [step, setStep] = useState<Step>(startAt);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [recipients, setRecipients] = useState<Recipient[]>(seedRecipients);
  const [form, setForm] = useState<FormState>({
    from: null,
    amount: '',
    to: null,
    notify: null,
    when: todayISO(),
    frequency: 'Once',
    reuseSecurityQA: true,
    securityQuestion: 'First street I lived on',
    securityAnswer: 'Maple',
    message: '',
  });
  const [confirmationNumber] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  return (
    <div className={`relative h-full ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      {step === 'hub' && (
        <ETransferHub
          onBack={onExitToMoveMoney}
          onSend={() => setStep('send')}
        />
      )}
      {step === 'send' && (
        <SendForm
          form={form}
          onBack={() => setStep('hub')}
          onOpenSheet={setSheet}
          onChange={(patch) => setForm(f => ({ ...f, ...patch }))}
          onContinue={() => setStep('review')}
        />
      )}
      {step === 'addRecipient' && (
        <AddRecipient
          onBack={() => { setStep('send'); setSheet('recipient'); }}
          onSave={(r) => {
            setRecipients(rs => [r, ...rs]);
            setForm(f => ({ ...f, to: r, notify: r.mobile ? 'SMS' : 'Email' }));
            setStep('send');
          }}
        />
      )}
      {step === 'review' && (
        <ReviewConfirm
          form={form}
          onBack={() => setStep('send')}
          onEdit={() => setStep('send')}
          onSend={() => setStep('sent')}
        />
      )}
      {step === 'sent' && (
        <MoneySent
          form={form}
          confirmationNumber={confirmationNumber}
          onSendMore={() => {
            setForm({
              from: null, amount: '', to: null, notify: null,
              when: todayISO(), frequency: 'Once',
              reuseSecurityQA: true,
              securityQuestion: 'First street I lived on',
              securityAnswer: 'Maple',
              message: '',
            });
            setStep('send');
          }}
          onHome={onExitToDashboard}
        />
      )}

      {/* Bottom sheets — only during send-form step */}
      <AnimatePresence>
        {step === 'send' && sheet === 'account' && (
          <BottomSheet title="Select Account" onClose={() => setSheet(null)}>
            {accounts
              .filter(a => a.category === 'banking')
              .map(a => (
                <button
                  key={a.id}
                  onClick={() => { setForm(f => ({ ...f, from: a })); setSheet(null); }}
                  className="w-full flex items-start justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5]"
                >
                  <div>
                    <p className="text-[16px] text-rbc-dark">{a.name}</p>
                    <p className="text-[13px] text-rbc-secondary mt-0.5">{a.fullNumber}</p>
                  </div>
                  <p className="text-[16px] text-rbc-dark pt-1">{formatPlain(a.balance)}</p>
                </button>
              ))}
          </BottomSheet>
        )}

        {step === 'send' && sheet === 'recipient' && (
          <RecipientSheet
            recipients={recipients}
            onSelect={(r) => {
              setForm(f => ({ ...f, to: r, notify: r.mobile ? 'SMS' : 'Email' }));
              setSheet(null);
            }}
            onClose={() => setSheet(null)}
            onAdd={() => { setSheet(null); setStep('addRecipient'); }}
          />
        )}

        {step === 'send' && sheet === 'notify' && form.to && (
          <BottomSheet title="Notify Recipient By" onClose={() => setSheet(null)}>
            {(['Email', 'SMS'] as const).map(method => {
              const available = method === 'Email' ? !!form.to?.email : !!form.to?.mobile;
              return (
                <button
                  key={method}
                  disabled={!available}
                  onClick={() => { setForm(f => ({ ...f, notify: method })); setSheet(null); }}
                  className="w-full flex items-start justify-between px-5 py-4 border-b border-[#E5E7EA] text-left cursor-pointer active:bg-[#F2F4F5] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div>
                    <p className="text-[16px] text-rbc-dark">{method}</p>
                    <p className="text-[13px] text-rbc-secondary mt-0.5">
                      {method === 'Email' ? form.to?.email : form.to?.mobile ?? 'No mobile number'}
                    </p>
                  </div>
                </button>
              );
            })}
          </BottomSheet>
        )}

        {step === 'send' && sheet === 'frequency' && (
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

// ── Screen 2: Interac e-Transfer hub ─────────────────────────────────────
function ETransferHub({ onBack, onSend }: { onBack: () => void; onSend: () => void }) {
  return (
    <div className="flex flex-col bg-white min-h-full">
      <BlueHeader title="Move Money" onBack={onBack} />

      {/* Title strip with Interac badge */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h1 className="text-[22px] font-extralight text-rbc-dark leading-none">
          <em className="italic">Interac</em> e-Transfer
        </h1>
        <InteracBadge />
      </div>

      <SectionHeader title="Sending Money" />
      <HubRow icon={<SendIcon size={20} stroke="#006AC3" />} label={<><em className="italic">Interac</em> e-Transfer</>} sub="Send an" onClick={onSend} />
      <HubRow icon={<CancelIcon />} label={<><em className="italic">Interac</em> e-Transfer</>} sub="Cancel an" />

      <SectionHeader title="Receiving Money" />
      <HubRow icon={<RequestIcon />} label="Request Money" />
      <HubRow icon={<AutodepositIcon />} label="Autodeposit Registration" />

      <SectionHeader title="Managing Transfers" />
      <HubRow icon={<UpcomingIcon />} label="Upcoming" />
      <HubRow icon={<HistoryIcon />} label="History" />
      <HubRow icon={<RecipientsIcon />} label="Recipients" />

      <div className="h-24" />
    </div>
  );
}

// ── Screen 3 / 7: Send Money form ────────────────────────────────────────
function SendForm({
  form, onBack, onOpenSheet, onChange, onContinue,
}: {
  form: FormState;
  onBack: () => void;
  onOpenSheet: (s: Sheet) => void;
  onChange: (patch: Partial<FormState>) => void;
  onContinue: () => void;
}) {
  const canContinue = form.from && parseFloat(form.amount || '0') > 0 && form.to && form.notify;

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Send Money" onBack={onBack} />

      {/* Sub-tabs New | Upcoming | History */}
      <div className="grid grid-cols-3 border-b border-[#E5E7EA]">
        {(['New', 'Upcoming', 'History'] as const).map((t, i) => {
          const active = i === 0;
          return (
            <button
              key={t}
              className="py-3.5 relative cursor-pointer"
              style={{ background: active ? 'white' : '#F2F4F5' }}
            >
              <span className={`text-[15px] ${active ? 'text-rbc-dark font-medium' : 'text-rbc-bright'}`}>{t}</span>
              {active && <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-rbc-dark rounded-t" />}
            </button>
          );
        })}
      </div>

      {/* Send with */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[12px] text-rbc-secondary mb-1">Send with:</p>
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold text-rbc-dark">RBC Account</span>
          <span className="text-gray-300">|</span>
          <button className="text-[15px] text-rbc-bright cursor-pointer">Avion Rewards</button>
        </div>
      </div>

      {/* Grey Interac strip with limit */}
      <div className="bg-[#F2F4F5] mx-0 mt-3 px-5 py-3 flex items-center justify-between border-y border-[#E5E7EA]">
        <span className="text-[14px] text-rbc-dark">Via <em className="italic">Interac</em> e-Transfer</span>
        <InteracBadge />
      </div>
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-rbc-dark">Remaining Daily Limit</span>
          <HelpDot />
        </div>
        <span className="text-[15px] text-rbc-dark">CAD 10,000.00</span>
      </div>
      <div className="px-5 py-3 flex items-start gap-2 border-b border-[#E5E7EA]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#6B7280"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5h2v2h-2V7Zm0 4h2v6h-2v-6Z" /></svg>
        <p className="text-[13.5px] text-rbc-dark leading-snug">
          For your security, occasionally we'll ask you to verify your identity.
        </p>
      </div>

      {/* Form fields */}
      <FieldDropdown
        label="From"
        value={form.from ? `${form.from.name} (${form.from.accountNumber})` : 'Select Account'}
        right={form.from ? formatPlain(form.from.balance) : undefined}
        placeholder={!form.from}
        onClick={() => onOpenSheet('account')}
      />
      <FieldInput
        label="Amount"
        value={form.amount}
        placeholder="0.00"
        onChange={(v) => {
          const cleaned = v.replace(/[^0-9.]/g, '');
          onChange({ amount: cleaned });
        }}
        inputMode="decimal"
      />
      <FieldDropdown
        label="To"
        value={form.to ? form.to.name : 'Select Recipient'}
        sub={form.to ? [form.to.email, form.to.mobile].filter(Boolean).join('\n') : undefined}
        placeholder={!form.to}
        onClick={() => onOpenSheet('recipient')}
      />
      <FieldDropdown
        label="Notify Recipient By"
        value={form.notify ?? 'Select Method'}
        placeholder={!form.notify}
        onClick={() => form.to && onOpenSheet('notify')}
      />
      <FieldDropdown
        label="When"
        value={formatDate(form.when)}
        onClick={() => onOpenSheet('when')}
      />
      <FieldDropdown
        label="Frequency"
        value={form.frequency}
        onClick={() => onOpenSheet('frequency')}
      />

      {/* Security Q&A — only when recipient selected */}
      {form.to && (
        <>
          <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
            <span className="text-[15px] text-rbc-dark">Re-use Security Question &amp; Answer</span>
            <Toggle on={form.reuseSecurityQA} onChange={(on) => onChange({ reuseSecurityQA: on })} />
          </div>
          <div className="px-5 py-3 border-b border-[#E5E7EA]">
            <p className="text-[12px] text-rbc-secondary mb-1">Security Question</p>
            {form.reuseSecurityQA ? (
              <p className="text-[16px] text-rbc-dark">{form.securityQuestion}</p>
            ) : (
              <input
                value={form.securityQuestion}
                onChange={(e) => onChange({ securityQuestion: e.target.value })}
                placeholder="Enter Question"
                className="text-[16px] text-rbc-dark w-full outline-none"
              />
            )}
          </div>
          <div className="px-5 py-3 border-b border-[#E5E7EA]">
            <p className="text-[12px] text-rbc-secondary mb-1">Security Answer</p>
            {form.reuseSecurityQA ? (
              <p className="text-[16px] text-rbc-dark tracking-widest">••••••••••••</p>
            ) : (
              <input
                type="password"
                value={form.securityAnswer}
                onChange={(e) => onChange({ securityAnswer: e.target.value })}
                placeholder="Enter Answer"
                className="text-[16px] text-rbc-dark w-full outline-none"
              />
            )}
          </div>
        </>
      )}

      {/* Message textarea */}
      <div className="px-5 py-3 border-b border-[#E5E7EA]">
        <p className="text-[12px] text-rbc-secondary mb-1">Message</p>
        <textarea
          value={form.message}
          onChange={(e) => onChange({ message: e.target.value.slice(0, 400) })}
          placeholder="Optional (Maximum Characters: 400)"
          className="w-full text-[15px] text-rbc-dark placeholder:text-rbc-secondary outline-none resize-none border border-[#E5E7EA] rounded p-2 min-h-[64px]"
          maxLength={400}
        />
      </div>

      {/* Continue button */}
      <div className="px-4 pt-6">
        <button
          disabled={!canContinue}
          onClick={onContinue}
          className={`w-full py-4 rounded font-medium text-[16px] cursor-pointer transition-colors ${canContinue ? 'bg-rbc-blue text-white' : 'bg-[#E5E7EA] text-rbc-secondary'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Screen 6: Add Recipient ──────────────────────────────────────────────
function AddRecipient({ onBack, onSave }: { onBack: () => void; onSave: (r: Recipient) => void }) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [notify, setNotify] = useState<'Email' | 'SMS' | null>(null);
  const [lang, setLang] = useState<'English' | 'French'>('English');
  const [remember, setRemember] = useState(true);

  const canContinue = name.trim().length > 0 && (email.trim().length > 0 || mobile.trim().length > 0);

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Add Recipient" onBack={onBack} />

      <button className="px-5 py-4 flex items-center gap-3 border-b border-[#E5E7EA] cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6"><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M7 18c1-2.5 3-4 5-4s4 1.5 5 4" /></svg>
        <span className="flex-1 text-[15px] text-rbc-bright font-medium">Pick a recipient from my contacts</span>
        <ChevronRightIcon size={16} stroke="#9CA3AF" />
      </button>

      <TextField label="Name" value={name} onChange={setName} placeholder="Enter Name" />
      <TextField label="Nickname" value={nickname} onChange={setNickname} placeholder="Enter a Nickname (Optional)" />
      <TextField label="Email" value={email} onChange={setEmail} placeholder="Enter Email Address" type="email" />
      <TextField label="Mobile" value={mobile} onChange={setMobile} placeholder="Enter Mobile Number" type="tel" />

      <FieldDropdown label="Notify Recipient By" value={notify ?? 'Select Method'} placeholder={!notify}
        onClick={() => {
          if (email && mobile) setNotify(notify === 'Email' ? 'SMS' : 'Email');
          else if (email) setNotify('Email');
          else if (mobile) setNotify('SMS');
        }} />
      <FieldDropdown label="Preferred Language" value={lang}
        onClick={() => setLang(lang === 'English' ? 'French' : 'English')} />

      <div className="px-5 py-3 flex items-center justify-between border-b border-[#E5E7EA]">
        <span className="text-[15px] text-rbc-dark">Remember Recipient</span>
        <Toggle on={remember} onChange={setRemember} />
      </div>

      <div className="px-4 pt-6">
        <button
          disabled={!canContinue}
          onClick={() =>
            onSave({
              id: 'r' + Date.now(),
              name: nickname.trim() || name.trim(),
              email: email.trim() || 'nomail@example.com',
              mobile: mobile.trim() || undefined,
              autoDeposit: false,
            })
          }
          className={`w-full py-4 rounded font-medium text-[16px] cursor-pointer transition-colors ${canContinue ? 'bg-rbc-blue text-white' : 'bg-[#E5E7EA] text-rbc-secondary'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Screen 8: Review and Confirm ─────────────────────────────────────────
function ReviewConfirm({
  form, onBack, onEdit, onSend,
}: {
  form: FormState;
  onBack: () => void;
  onEdit: () => void;
  onSend: () => void;
}) {
  return (
    <div className="flex flex-col bg-[#F2F4F5] min-h-full pb-24">
      <BlueHeader title="Send Money" onBack={onBack} />

      <div className="bg-[#F2F4F5] px-5 pt-4">
        <h2 className="text-[20px] font-light text-rbc-dark">Review and Confirm</h2>
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
        <p className="text-[14px] text-rbc-secondary mt-0.5">
          {form.notify === 'Email' ? form.to?.email : form.to?.mobile}
        </p>
      </div>

      <div className="bg-[#F2F4F5] px-5 py-3 mt-4">
        <p className="text-[15px] text-rbc-dark">Transfer Details</p>
      </div>
      <div className="bg-white">
        <DetailRow label="When" value={formatDate(form.when)} />
        <DetailRow label="Frequency" value={form.frequency} />
        <DetailRow label="Security Question" value={form.securityQuestion} />
        <DetailRow label="Security Answer" value="••••" />
      </div>

      <div className="px-5 py-4 flex items-start gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#006AC3"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5h2v2h-2V7Zm0 4h2v6h-2v-6Z" /></svg>
        <p className="text-[13.5px] text-rbc-dark">There is no service fee for this transaction.</p>
      </div>

      <div className="px-4 pt-2 space-y-3">
        <button
          onClick={onSend}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Send Now
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

// ── Screen 9: Money Sent ─────────────────────────────────────────────────
function MoneySent({
  form, confirmationNumber, onSendMore, onHome,
}: {
  form: FormState;
  confirmationNumber: string;
  onSendMore: () => void;
  onHome: () => void;
}) {
  const amount = parseFloat(form.amount || '0');
  const newBalance = (form.from?.balance ?? 0) - amount;

  const timeStr = useMemo(() => {
    const d = new Date();
    const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    return `${formatDate(form.when)} at ${t.replace(' ', ' ')} PT`;
  }, [form.when]);

  return (
    <div className="flex flex-col bg-white min-h-full pb-24">
      <BlueHeader title="Send Money" hideBack />

      <div className="flex flex-col items-center pt-6 pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 260, damping: 18 }}
          className="w-14 h-14 rounded-full bg-rbc-success flex items-center justify-center"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6" /></svg>
        </motion.div>
        <h2 className="text-[24px] font-light text-rbc-dark mt-3">Money Sent!</h2>
        <p className="text-[13px] text-rbc-secondary mt-1">{timeStr}</p>
      </div>

      <div className="mx-5 mt-4 pt-4 border-t border-[#E5E7EA]">
        <p className="text-[14px] text-rbc-dark text-center leading-snug">
          Made a mistake? Cancel an <em className="italic">Interac</em> e-Transfer<br />
          in the <span className="font-semibold">History tab</span> until it's accepted.
        </p>
        <div className="flex justify-center mt-2">
          <button className="text-[15px] text-rbc-bright font-medium cursor-pointer">Cancel an e-transfer</button>
        </div>
      </div>

      <div className="mt-4">
        <DetailRow label="From" value={form.from ? `${form.from.name} (${form.from.accountNumber})` : ''} />
        <DetailRow label="New Balance" value={formatPlain(newBalance)} />
        <DetailRow label="Amount" value={formatPlain(amount)} />
        <DetailRow label="To" value={form.to?.name ?? ''} />
        {form.notify === 'SMS' && form.to?.mobile && (
          <DetailRow label="Mobile" value={form.to.mobile} />
        )}
        {form.notify === 'Email' && form.to?.email && (
          <DetailRow label="Email" value={form.to.email} />
        )}
        <DetailRow label="Notify Recipient By" value={form.notify ?? ''} />
        <DetailRow label="Confirmation #" value={confirmationNumber} />
      </div>

      <div className="px-4 pt-6 space-y-3">
        <button
          onClick={onSendMore}
          className="w-full py-4 rounded bg-rbc-blue text-white font-medium text-[16px] cursor-pointer"
        >
          Send More Money
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded border border-rbc-blue text-rbc-blue font-medium text-[16px] bg-white cursor-pointer"
        >
          Home
        </button>
      </div>
    </div>
  );
}

// ═════════ Shared UI ═════════════════════════════════════════════════════

function BlueHeader({ title, onBack, hideBack }: { title: string; onBack?: () => void; hideBack?: boolean }) {
  return (
    <div
      className="relative pt-14 pb-4 px-5"
      style={{ background: 'linear-gradient(180deg, #0E5BAC 0%, #003E7E 100%)' }}
    >
      {!hideBack && onBack && (
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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#F2F4F5] px-5 py-3 border-y border-[#E5E7EA]">
      <h3 className="text-[15px] text-rbc-dark">{title}</h3>
    </div>
  );
}

function HubRow({ icon, label, sub, onClick }: { icon: React.ReactNode; label: React.ReactNode; sub?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer border-b border-[#E5E7EA] active:bg-[#F2F4F5]"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rbc-bright/60 shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-[16px] text-rbc-dark">
        {sub && <span>{sub} </span>}
        {label}
      </span>
      <ChevronRightIcon size={16} stroke="#9CA3AF" />
    </button>
  );
}

function FieldDropdown({
  label, value, sub, right, placeholder, onClick,
}: {
  label: string;
  value: string;
  sub?: string;
  right?: string;
  placeholder?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-3 border-b border-[#E5E7EA] cursor-pointer active:bg-[#F2F4F5]"
    >
      <p className="text-[12px] text-rbc-secondary mb-0.5">{label}</p>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`text-[16px] ${placeholder ? 'text-rbc-secondary' : 'text-rbc-dark'} truncate`}>{value}</p>
          {sub && <p className="text-[13px] text-rbc-secondary whitespace-pre-line mt-0.5">{sub}</p>}
        </div>
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
  inputMode?: 'decimal' | 'text' | 'tel' | 'email';
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

function TextField({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="px-5 py-3 border-b border-[#E5E7EA]">
      <p className="text-[12px] text-rbc-secondary mb-0.5">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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

function Toggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="w-12 h-7 rounded-full relative transition-colors cursor-pointer"
      style={{ background: on ? '#006AC3' : '#D1D5DB' }}
    >
      <span
        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all"
        style={{ left: on ? '22px' : '2px' }}
      />
    </button>
  );
}

function HelpDot() {
  return (
    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-rbc-bright text-white text-[11px] font-bold leading-none">?</span>
  );
}

function InteracBadge() {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-white text-[10px] font-bold uppercase tracking-wider"
      style={{ background: 'linear-gradient(90deg, #FDB913 0%, #F5811F 100%)' }}
      title="Interac"
    >
      <em className="italic normal-case">Interac</em>
    </span>
  );
}

// ── Recipient sheet (with search) ────────────────────────────────────────
function RecipientSheet({
  recipients, onSelect, onClose, onAdd,
}: {
  recipients: Recipient[];
  onSelect: (r: Recipient) => void;
  onClose: () => void;
  onAdd: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = recipients.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <BottomSheet
      title="To Whom?"
      onClose={onClose}
      rightAction={<button onClick={onAdd} className="text-rbc-bright text-[15px] font-medium cursor-pointer">Add</button>}
    >
      <div className="px-4 py-3 border-b border-[#E5E7EA]">
        <div className="bg-[#F2F4F5] rounded-full px-4 py-2.5 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6" /><line x1="20" y1="20" x2="16" y2="16" /></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Recipients"
            className="flex-1 bg-transparent outline-none text-[14px] text-rbc-dark"
          />
        </div>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
        {filtered.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="w-full px-5 py-4 text-left border-b border-[#E5E7EA] cursor-pointer active:bg-[#F2F4F5]"
          >
            <span className="text-[16px] text-rbc-dark">{r.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-rbc-secondary text-[14px]">No recipients found</div>
        )}
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

// ── Small icons only used in this file ───────────────────────────────────
function CancelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="7" y1="7" x2="17" y2="17" />
    </svg>
  );
}
function RequestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h13l3 4-3 4H4z" />
      <path d="M8 14v4M8 10V6" />
    </svg>
  );
}
function AutodepositIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M4 8l8 6 8-6" />
      <path d="M12 3v3" />
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
function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="15" y2="14" />
    </svg>
  );
}
function RecipientsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006AC3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3.5" />
      <path d="M3 20c.7-3 3.3-5 6-5s5.3 2 6 5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M16 15c2 .3 3.7 1.5 4 3" />
    </svg>
  );
}
