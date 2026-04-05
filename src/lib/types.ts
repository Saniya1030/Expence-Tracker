export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food' | 'travel' | 'shopping' | 'bills' 
  | 'entertainment' | 'health' | 'education' 
  | 'salary' | 'freelance' | 'investments' | 'other';

export type Mood = 'happy' | 'neutral' | 'sad' | 'stressed' | 'excited';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
  mood?: Mood;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; colorClass: string }> = {
  food: { label: 'Food & Dining', icon: '🍔', colorClass: 'bg-category-food' },
  travel: { label: 'Travel', icon: '✈️', colorClass: 'bg-category-travel' },
  shopping: { label: 'Shopping', icon: '🛍️', colorClass: 'bg-category-shopping' },
  bills: { label: 'Bills & Utilities', icon: '📄', colorClass: 'bg-category-bills' },
  entertainment: { label: 'Entertainment', icon: '🎬', colorClass: 'bg-category-entertainment' },
  health: { label: 'Health', icon: '💊', colorClass: 'bg-category-health' },
  education: { label: 'Education', icon: '📚', colorClass: 'bg-category-education' },
  salary: { label: 'Salary', icon: '💰', colorClass: 'bg-category-salary' },
  freelance: { label: 'Freelance', icon: '💻', colorClass: 'bg-category-salary' },
  investments: { label: 'Investments', icon: '📈', colorClass: 'bg-category-travel' },
  other: { label: 'Other', icon: '📌', colorClass: 'bg-category-other' },
};

export const CATEGORY_COLORS: Record<Category, string> = {
  food: 'hsl(25, 95%, 53%)',
  travel: 'hsl(217, 91%, 60%)',
  shopping: 'hsl(280, 67%, 60%)',
  bills: 'hsl(0, 72%, 51%)',
  entertainment: 'hsl(340, 82%, 52%)',
  health: 'hsl(152, 69%, 40%)',
  education: 'hsl(200, 98%, 39%)',
  salary: 'hsl(168, 80%, 36%)',
  freelance: 'hsl(168, 70%, 42%)',
  investments: 'hsl(217, 80%, 50%)',
  other: 'hsl(200, 10%, 46%)',
};

export const MOOD_CONFIG: Record<Mood, { label: string; emoji: string }> = {
  happy: { label: 'Happy', emoji: '😊' },
  neutral: { label: 'Neutral', emoji: '😐' },
  sad: { label: 'Sad', emoji: '😢' },
  stressed: { label: 'Stressed', emoji: '😰' },
  excited: { label: 'Excited', emoji: '🤩' },
};
