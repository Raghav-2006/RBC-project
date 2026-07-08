import { useState } from 'react';
import type { Account } from '../../data/mockData';
import { accounts } from '../../data/mockData';
import { ChevronLeftIcon, HelpIcon } from '../../components/ui/RBCIcons';

interface Props {
  onBack: () => void;
  seniorMode?: boolean;
}

export default function AppVoidChequeFlow({ onBack, seniorMode = false }: Props) {
  const bankingAccounts = accounts.filter((account) => account.category === 'banking');
  const [selectedId, setSelectedId] = useState<string | null>(bankingAccounts[0]?.id ?? null);
  const selected = bankingAccounts.find((account) => account.id === selectedId) ?? null;

  return (
    <div className={`min-h-full bg-[#EEF3F7] ${seniorMode ? 'senior-preview high-contrast' : ''}`}>
      <BlueHeader title="Get a Void Cheque" onBack={onBack} seniorMode={seniorMode} />

      <div className="bg-white">
        <div className="flex items-center justify-between bg-[#F2F4F5] px-5 py-6">
          <div>
            <h2 className={`max-w-[180px] leading-tight text-rbc-dark ${seniorMode ? 'text-[30px] font-normal' : 'text-[24px] font-light'}`}>Get A Void Cheque</h2>
          </div>
          <VoidHero />
        </div>

        <div className="px-7 py-8">
          <p className={`mb-6 text-rbc-dark ${seniorMode ? 'text-[22px]' : 'text-[16px]'}`}>Select Account</p>
          <div className="space-y-7">
            {bankingAccounts.map((account) => (
              <RadioRow
                key={account.id}
                account={account}
                checked={selectedId === account.id}
                onSelect={() => setSelectedId(account.id)}
                seniorMode={seniorMode}
              />
            ))}
          </div>

          {selected && (
            <>
              <p className={`mt-8 leading-10 text-[#444444] ${seniorMode ? 'text-[20px]' : 'text-[16px]'}`}>
                To set up pre-authorized payments or direct deposits, you need to provide your account&apos;s
                transit, institution and account numbers from the bottom of this void cheque.
              </p>

              <div className="mt-6 flex items-start gap-3 text-[#444444]">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#222222] text-[13px] font-bold text-white">i</span>
                <p className={`${seniorMode ? 'text-[19px]' : 'text-[15px]'} leading-8`}>Only share these important details with parties you trust.</p>
              </div>

              <VoidChequeCard account={selected} seniorMode={seniorMode} />

              <button className={`mt-10 w-full bg-rbc-bright text-white font-medium ${seniorMode ? 'py-6 text-[22px]' : 'py-5 text-[18px]'}`}>Download</button>
            </>
          )}
        </div>
      </div>
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

function RadioRow({ account, checked, onSelect, seniorMode }: { account: Account; checked: boolean; onSelect: () => void; seniorMode?: boolean }) {
  return (
    <button onClick={onSelect} className="flex items-center gap-5 text-left">
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
          checked ? 'border-rbc-bright' : 'border-[#8B8B8B]'
        }`}
      >
        {checked && <span className="h-3 w-3 rounded-full bg-rbc-bright" />}
      </span>
      <span className={`${seniorMode ? 'text-[21px]' : 'text-[17px]'} text-[#444444]`}>{account.name} ({account.accountNumber})</span>
    </button>
  );
}

function VoidChequeCard({ account, seniorMode }: { account: Account; seniorMode?: boolean }) {
  return (
    <div className="mt-7 border-2 border-rbc-bright bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-[#0051A5] text-[10px] font-bold text-rbc-gold">RBC</div>
          <div>
            <p className={`${seniorMode ? 'text-[16px]' : 'text-[13px]'} uppercase tracking-wide text-[#666666]`}>ALEXANDER PARKER</p>
          </div>
        </div>
        <p className={`${seniorMode ? 'text-[32px] font-normal' : 'text-[28px] font-light'} tracking-wide text-rbc-bright`}>VOID</p>
      </div>

      <div className="mt-10 flex justify-end">
        <div className="h-6 w-24 border border-[#B9BDC6]" />
      </div>

      <div className="mt-8 border-t border-[#C9CED6] pt-6">
        <div className="grid grid-cols-3 gap-4">
          <ChequeNumber label="Transit #" value="07395" seniorMode={seniorMode} />
          <ChequeNumber label="Institution #" value="003" seniorMode={seniorMode} />
          <ChequeNumber label="Account #" value={account.accountNumber} seniorMode={seniorMode} />
        </div>
      </div>
    </div>
  );
}

function ChequeNumber({ label, value, seniorMode }: { label: string; value: string; seniorMode?: boolean }) {
  return (
    <div>
      <p className={`${seniorMode ? 'text-[15px]' : 'text-[12px]'} text-[#6B7280]`}>{label}</p>
      <p className={`mt-1 ${seniorMode ? 'text-[20px]' : 'text-[16px]'} text-rbc-bright`}>{value}</p>
    </div>
  );
}

function VoidHero() {
  return (
    <div className="relative h-32 w-44">
      <div className="absolute right-8 top-0 h-16 w-16 border border-[#9FC0E2]" />
      <div className="absolute right-0 top-7 h-20 w-20 rounded-full bg-white/60" />
      <svg className="absolute bottom-0 right-4" width="122" height="92" viewBox="0 0 122 92" fill="none">
        <rect x="10" y="14" width="102" height="60" rx="6" fill="#F5F7FA" stroke="#6B7280" strokeWidth="1.4" />
        <path d="M0 74h122" stroke="#6B7280" strokeWidth="1.4" />
        <path d="M12 78h98" stroke="#6B7280" strokeWidth="1.4" />
        <rect x="32" y="36" width="54" height="28" fill="white" stroke="#6B7280" strokeWidth="1.2" />
        <path d="M32 48h54" stroke="#6B7280" strokeWidth="1.2" />
        <circle cx="89" cy="54" r="9" fill="#FFD200" stroke="#3A3A3A" strokeWidth="1.2" />
        <path d="M85 54l3 3 5-6" stroke="#3A3A3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
