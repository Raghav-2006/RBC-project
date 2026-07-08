export interface Account {
  id: string;
  type: 'chequing' | 'savings' | 'visa' | 'tfsa' | 'rrsp';
  category: 'banking' | 'creditCards' | 'investments';
  name: string;
  nameFr: string;
  balance: number;
  available?: number;
  accountNumber: string;
  fullNumber?: string;
  creditLimit?: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;     // ISO yyyy-mm-dd
  posted?: boolean; // false = pending
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  autoDeposit: boolean;
}

export interface Payee {
  id: string;
  name: string;
  accountNumber: string;
  dueDate?: string;
  amountDue?: number;
}

// Demo data only — fictional kiosk practice account
export const accounts: Account[] = [
  { id: 'chq1', type: 'chequing', category: 'banking', name: 'Chequing', nameFr: 'Chèques', balance: 3452.18, available: 3452.18, accountNumber: '4218', fullNumber: '07395-4218042' },
  { id: 'sav1', type: 'savings', category: 'banking', name: 'Savings', nameFr: 'Épargne', balance: 1127.65, available: 1127.65, accountNumber: '8530', fullNumber: '07395-8530771' },
  { id: 'visa1', type: 'visa', category: 'creditCards', name: 'VISA', nameFr: 'VISA', balance: 487.32, available: 4512.68, accountNumber: '2647', fullNumber: '4519 **** **** 2647', creditLimit: 5000.00 },
  { id: 'tfsa1', type: 'tfsa', category: 'investments', name: 'TFSA Savings', nameFr: 'Épargne CÉLI', balance: 14820.50, accountNumber: '6193' },
  { id: 'rrsp1', type: 'rrsp', category: 'investments', name: 'RRSP', nameFr: 'REER', balance: 32675.80, accountNumber: '9054' },
];

export const recentTransactions: Transaction[] = [
  // Chequing (4218)
  { id: 't1', accountId: 'chq1', date: '2026-06-22', posted: true, description: 'INTERAC e-Transfer from Alex K.', amount: 75.00, type: 'credit' },
  { id: 't2', accountId: 'chq1', date: '2026-06-21', posted: true, description: 'Tim Hortons #4821', amount: -6.45, type: 'debit' },
  { id: 't3', accountId: 'chq1', date: '2026-06-20', posted: true, description: 'Loblaws Maple Leaf Gardens', amount: -52.18, type: 'debit' },
  { id: 't4', accountId: 'chq1', date: '2026-06-19', posted: true, description: 'Payroll - Northwind Inc.', amount: 1840.00, type: 'credit' },
  { id: 't5', accountId: 'chq1', date: '2026-06-18', posted: true, description: 'Bell Mobility', amount: -78.99, type: 'debit' },
  // Savings (8530)
  { id: 't10', accountId: 'sav1', date: '2026-06-19', posted: true, description: 'Transfer from Chequing', amount: 200.00, type: 'credit' },
  { id: 't11', accountId: 'sav1', date: '2026-06-01', posted: true, description: 'Interest Earned', amount: 3.42, type: 'credit' },
  // VISA (2647) — pending + posted
  { id: 't20', accountId: 'visa1', date: '2026-06-22', posted: false, description: 'UBER CANADA TORONTO ON', amount: -18.75, type: 'debit' },
  { id: 't21', accountId: 'visa1', date: '2026-06-20', posted: true, description: 'AMAZON.CA*TX2L8 ON', amount: -42.30, type: 'debit' },
  { id: 't22', accountId: 'visa1', date: '2026-06-18', posted: true, description: 'STARBUCKS #7842 TORONTO ON', amount: -7.85, type: 'debit' },
  { id: 't23', accountId: 'visa1', date: '2026-06-15', posted: true, description: 'NETFLIX.COM ON', amount: -18.99, type: 'debit' },
  { id: 't24', accountId: 'visa1', date: '2026-06-12', posted: true, description: 'PAYMENT - THANK YOU', amount: 250.00, type: 'credit' },
];

export const recipients: Recipient[] = [
  { id: 'r1', name: 'Sarah Mitchell', email: 'sarah.mitchell@email.com', mobile: '(416) 555-0142', autoDeposit: true },
  { id: 'r2', name: 'James Chen', email: 'j.chen@email.com', mobile: '(647) 555-0187', autoDeposit: false },
  { id: 'r3', name: 'Emily Rodriguez', email: 'emily.r@email.com', mobile: '(905) 555-0203', autoDeposit: true },
  { id: 'r4', name: 'Michael Thompson', email: 'mthompson@email.com', mobile: '(416) 555-0176', autoDeposit: false },
  { id: 'r5', name: 'Ava Patel', email: 'ava.patel@email.com', mobile: '(437) 555-0198', autoDeposit: false },
  { id: 'r6', name: "Ryan O'Brien", email: 'r.obrien@email.com', mobile: '(289) 555-0155', autoDeposit: false },
];

export const payees: Payee[] = [
  { id: 'p1', name: 'Bell Canada', accountNumber: '****4567', dueDate: '2025-06-25', amountDue: 89.99 },
  { id: 'p2', name: 'Toronto Hydro', accountNumber: '****8901', dueDate: '2025-06-28', amountDue: 134.50 },
  { id: 'p3', name: 'Rogers Communications', accountNumber: '****2345', dueDate: '2025-07-01', amountDue: 75.00 },
  { id: 'p4', name: 'City of Toronto - Property Tax', accountNumber: '****6789', dueDate: '2025-07-15', amountDue: 2150.00 },
  { id: 'p5', name: 'Enbridge Gas', accountNumber: '****0123', dueDate: '2025-06-30', amountDue: 67.25 },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
}

// RBC app style: numbers without $ sign, comma thousands separator, 2 decimals
export function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(amount));
}
