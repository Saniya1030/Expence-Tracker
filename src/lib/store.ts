import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Budget, SavingsGoal } from './types';

interface ExpenseStore {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  darkMode: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setBudgets: (b: Budget[]) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  addGoal: (g: Omit<SavingsGoal, 'id'>) => void;
  updateGoal: (id: string, g: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleDarkMode: () => void;
}

const sampleTransactions: Transaction[] = [
  { id: '1', amount: 5000, type: 'income', category: 'salary', description: 'Monthly Salary', date: '2026-03-28', mood: 'happy' },
  { id: '2', amount: 1200, type: 'income', category: 'freelance', description: 'Web design project', date: '2026-03-25', mood: 'excited' },
  { id: '3', amount: 450, type: 'expense', category: 'food', description: 'Grocery shopping', date: '2026-03-27', mood: 'neutral' },
  { id: '4', amount: 120, type: 'expense', category: 'entertainment', description: 'Movie tickets', date: '2026-03-26', mood: 'happy' },
  { id: '5', amount: 800, type: 'expense', category: 'bills', description: 'Electricity bill', date: '2026-03-24', mood: 'stressed' },
  { id: '6', amount: 250, type: 'expense', category: 'travel', description: 'Uber rides', date: '2026-03-23', mood: 'neutral' },
  { id: '7', amount: 350, type: 'expense', category: 'shopping', description: 'New headphones', date: '2026-03-22', mood: 'excited' },
  { id: '8', amount: 180, type: 'expense', category: 'health', description: 'Pharmacy', date: '2026-03-21', mood: 'sad' },
  { id: '9', amount: 500, type: 'expense', category: 'education', description: 'Online course', date: '2026-03-20', mood: 'happy' },
  { id: '10', amount: 300, type: 'income', category: 'investments', description: 'Dividend payout', date: '2026-03-19', mood: 'happy' },
];

const sampleBudgets: Budget[] = [
  { id: '1', category: 'food', limit: 600, spent: 450 },
  { id: '2', category: 'travel', limit: 400, spent: 250 },
  { id: '3', category: 'shopping', limit: 500, spent: 350 },
  { id: '4', category: 'bills', limit: 1000, spent: 800 },
  { id: '5', category: 'entertainment', limit: 300, spent: 120 },
];

const sampleGoals: SavingsGoal[] = [
  { id: '1', name: 'Vacation Fund', target: 10000, saved: 3500, icon: '🏖️' },
  { id: '2', name: 'New Laptop', target: 2000, saved: 1200, icon: '💻' },
  { id: '3', name: 'Emergency Fund', target: 5000, saved: 4200, icon: '🏦' },
];

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      transactions: sampleTransactions,
      budgets: sampleBudgets,
      goals: sampleGoals,
      darkMode: false,
      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: crypto.randomUUID() }, ...s.transactions],
        })),
      updateTransaction: (id, t) =>
        set((s) => ({
          transactions: s.transactions.map((tr) => (tr.id === id ? { ...tr, ...t } : tr)),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((tr) => tr.id !== id),
        })),
      setBudgets: (b) => set({ budgets: b }),
      updateBudget: (id, b) =>
        set((s) => ({
          budgets: s.budgets.map((bg) => (bg.id === id ? { ...bg, ...b } : bg)),
        })),
      addGoal: (g) =>
        set((s) => ({
          goals: [...s.goals, { ...g, id: crypto.randomUUID() }],
        })),
      updateGoal: (id, g) =>
        set((s) => ({
          goals: s.goals.map((gl) => (gl.id === id ? { ...gl, ...g } : gl)),
        })),
      deleteGoal: (id) =>
        set((s) => ({
          goals: s.goals.filter((gl) => gl.id !== id),
        })),
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
    }),
    { name: 'expense-tracker-store' }
  )
);
