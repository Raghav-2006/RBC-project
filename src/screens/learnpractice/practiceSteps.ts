import type { TaskId } from '../TaskChooser';

export type PracticeTarget =
  | 'home-account'
  | 'nav-accounts'
  | 'nav-move-money'
  | 'qa-transfer'
  | 'qa-send'
  | 'qa-pay-bills'
  | 'qa-deposit'
  | 'hub-pay-bill'
  | 'hub-manage-payees'
  | 'flow-complete';

export type PracticeLocation =
  | 'home'
  | 'accounts'
  | 'accountDetail'
  | 'moveMoney'
  | 'transfer'
  | 'payBillsHub'
  | 'payBillsForm'
  | 'managePayees'
  | 'eTransferSend'
  | 'deposit'
  | 'complete';

export interface PracticeStepDef {
  target: PracticeTarget;
  instruction: string;
  location: PracticeLocation;
}

export const practiceScripts: Record<TaskId, PracticeStepDef[]> = {
  checkBalance: [
    {
      target: 'home-account',
      instruction: 'You are on the Home screen. Tap your Chequing account to check your balance.',
      location: 'home',
    },
    {
      target: 'flow-complete',
      instruction: 'Great work! You can see your balance and recent transactions here.',
      location: 'accountDetail',
    },
  ],
  transferFunds: [
    {
      target: 'qa-transfer',
      instruction: 'Tap Transfer on the Home screen to move money between your accounts.',
      location: 'home',
    },
    {
      target: 'flow-complete',
      instruction: 'Choose the From and To accounts, enter an amount, then tap Continue.',
      location: 'transfer',
    },
  ],
  payBill: [
    {
      target: 'qa-pay-bills',
      instruction: 'Tap Pay bills on the Home screen.',
      location: 'home',
    },
    {
      target: 'flow-complete',
      instruction: 'Pick a payee, choose your account, enter the amount, and tap Continue.',
      location: 'payBillsForm',
    },
  ],
  sendETransfer: [
    {
      target: 'qa-send',
      instruction: 'Tap Send on the Home screen to open Move Money.',
      location: 'home',
    },
    {
      target: 'flow-complete',
      instruction: 'Tap Interac e-Transfer, then Send an Interac e-Transfer, and fill in the details.',
      location: 'moveMoney',
    },
  ],
  depositCheque: [
    {
      target: 'qa-deposit',
      instruction: 'Tap Deposit on the Home screen.',
      location: 'home',
    },
    {
      target: 'flow-complete',
      instruction: 'Enter the cheque amount, choose your account, and tap Continue.',
      location: 'deposit',
    },
  ],
  managePayees: [
    {
      target: 'nav-move-money',
      instruction: 'Tap Move Money at the bottom of the screen.',
      location: 'home',
    },
    {
      target: 'hub-pay-bill',
      instruction: 'Tap Pay a Bill to open your bill payment options.',
      location: 'moveMoney',
    },
    {
      target: 'hub-manage-payees',
      instruction: 'Tap Manage Payees to view or edit your payees.',
      location: 'payBillsHub',
    },
    {
      target: 'flow-complete',
      instruction: 'You can add, edit, or remove payees from this screen.',
      location: 'managePayees',
    },
  ],
};

export type PracticeCommand =
  | { type: 'tab'; tab: 'home' | 'accounts' | 'moveMoney' | 'more' }
  | { type: 'openAccount'; accountId: string }
  | { type: 'openTransfer' }
  | { type: 'openPayBills'; startAt: 'hub' | 'payForm' | 'managePayees' }
  | { type: 'openPayBillsStep'; step: 'managePayees' }
  | { type: 'openETransfer'; startAt: 'hub' | 'send' }
  | { type: 'openDeposit' };
