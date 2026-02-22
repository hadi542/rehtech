
export enum TransactionType {
  SEND = 'Send Money Receipt',
  RECEIVE = 'Receive Money Receipt'
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  dueDate?: string;
  personName: string;
  phoneNumber: string;
  personEmail?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  invoiceNumber: string;
  receiptNumber: string;
  createdAt: string;
  pdfGenerated: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  role?: 'OWNER' | 'MANAGER' | 'VIEWER';
  createdAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: 'STOCK' | 'CRYPTO' | 'MUTUAL_FUND';
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  createdAt: string;
}

export interface BudgetGoal {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  cost: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  nextRenewal: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING';
  createdAt: string;
}

export interface CreditHealth {
  score: number;
  updatedAt: string;
}

export interface LoanData {
  income: number;
  emi: number;
  score: number;
  purpose: string;
  updatedAt: string;
}
