
import { UserProfile, Transaction, Investment, BudgetGoal, Subscription, TeamMember, CreditHealth, LoanData } from '../types';

class MockFirebaseService {
  private currentUser: UserProfile | null = null;

  constructor() {
    const savedUser = localStorage.getItem('rehcaps_user');
    if (savedUser) this.currentUser = JSON.parse(savedUser);
  }

  // Auth
  async login(email: string, name: string): Promise<UserProfile> {
    const user: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString(),
      role: 'OWNER'
    };
    this.currentUser = user;
    localStorage.setItem('rehcaps_user', JSON.stringify(user));
    return user;
  }

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('rehcaps_user');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentUser) throw new Error('No user logged in');
    this.currentUser = { ...this.currentUser, ...profile };
    localStorage.setItem('rehcaps_user', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  // Generic Storage Helpers
  private getCollection<T>(key: string): T[] {
    const data = localStorage.getItem(`rehcaps_${key}`);
    const allData: T[] = data ? JSON.parse(data) : [];
    // Filter by userId if the object has it
    if (this.currentUser) {
      return allData.filter((item: any) => item.userId === this.currentUser?.uid);
    }
    return [];
  }

  private saveToCollection<T>(key: string, item: T) {
    const data = localStorage.getItem(`rehcaps_${key}`);
    const allData: any[] = data ? JSON.parse(data) : [];
    allData.push({ ...item, userId: this.currentUser?.uid, createdAt: new Date().toISOString() });
    localStorage.setItem(`rehcaps_${key}`, JSON.stringify(allData));
  }

  private removeFromCollection(key: string, id: string) {
    const data = localStorage.getItem(`rehcaps_${key}`);
    if (!data) return;
    const allData: any[] = JSON.parse(data);
    const filtered = allData.filter(item => item.id !== id);
    localStorage.setItem(`rehcaps_${key}`, JSON.stringify(filtered));
  }

  // Transactions
  async addTransaction(tx: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'invoiceNumber' | 'receiptNumber' | 'pdfGenerated'>): Promise<Transaction> {
    const receiptId = Math.floor(100000 + Math.random() * 900000);
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      userId: this.currentUser!.uid,
      createdAt: new Date().toISOString(),
      invoiceNumber: `INV-${receiptId}`,
      receiptNumber: `RCPT-${receiptId}`,
      pdfGenerated: false
    };
    this.saveToCollection('txs', newTx);
    return newTx;
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.getCollection<Transaction>('txs').sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteTransaction(id: string) {
    this.removeFromCollection('txs', id);
  }

  async toggleTransactionStatus(id: string) {
    const data = localStorage.getItem('rehcaps_txs');
    if (!data) return;
    const allData: Transaction[] = JSON.parse(data);
    const updated = allData.map(t => 
      t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t
    );
    localStorage.setItem('rehcaps_txs', JSON.stringify(updated));
  }

  // Portfolio
  async getInvestments(): Promise<Investment[]> {
    return this.getCollection<Investment>('investments');
  }

  async addInvestment(inv: Omit<Investment, 'id' | 'userId' | 'createdAt'>) {
    const newInv = { ...inv, id: Math.random().toString(36).substr(2, 9) };
    this.saveToCollection('investments', newInv);
    return newInv;
  }

  async deleteInvestment(id: string) {
    this.removeFromCollection('investments', id);
  }

  // Budgets
  async getBudgets(): Promise<BudgetGoal[]> {
    return this.getCollection<BudgetGoal>('budgets');
  }

  async saveBudget(budget: Omit<BudgetGoal, 'id' | 'userId' | 'createdAt'>) {
    const existing = this.getCollection<BudgetGoal>('budgets').find(b => b.category === budget.category);
    if (existing) {
      this.removeFromCollection('budgets', existing.id);
    }
    const newBudget = { ...budget, id: Math.random().toString(36).substr(2, 9) };
    this.saveToCollection('budgets', newBudget);
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return this.getCollection<Subscription>('subscriptions');
  }

  async addSubscription(sub: Omit<Subscription, 'id' | 'userId' | 'createdAt'>) {
    const newSub = { ...sub, id: Math.random().toString(36).substr(2, 9) };
    this.saveToCollection('subscriptions', newSub);
  }

  async deleteSubscription(id: string) {
    this.removeFromCollection('subscriptions', id);
  }

  // Credit Health
  async getCreditHealth(): Promise<CreditHealth | null> {
    const data = localStorage.getItem(`rehcaps_credit_${this.currentUser?.uid}`);
    return data ? JSON.parse(data) : null;
  }

  async saveCreditHealth(health: CreditHealth) {
    localStorage.setItem(`rehcaps_credit_${this.currentUser?.uid}`, JSON.stringify(health));
  }

  // Loan Advisor
  async getLoanData(): Promise<LoanData | null> {
    const data = localStorage.getItem(`rehcaps_loan_${this.currentUser?.uid}`);
    return data ? JSON.parse(data) : null;
  }

  async saveLoanData(loan: LoanData) {
    localStorage.setItem(`rehcaps_loan_${this.currentUser?.uid}`, JSON.stringify(loan));
  }

  // Team
  async getTeam(): Promise<TeamMember[]> {
    return this.getCollection<TeamMember>('team');
  }

  async addTeamMember(member: Omit<TeamMember, 'id' | 'userId' | 'createdAt'>) {
    const newMember = { ...member, id: Math.random().toString(36).substr(2, 9) };
    this.saveToCollection('team', newMember);
  }

  async deleteTeamMember(id: string) {
    this.removeFromCollection('team', id);
  }
}

export const firebaseService = new MockFirebaseService();
