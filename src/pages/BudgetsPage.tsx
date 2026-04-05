import { useExpenseStore } from '@/lib/store';
import { BudgetCard } from '@/components/BudgetCard';
import { motion } from 'framer-motion';

export default function BudgetsPage() {
  const { budgets } = useExpenseStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Budgets</h1>
        <p className="text-sm text-muted-foreground">Track your spending against category budgets</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((b, i) => (
          <BudgetCard key={b.id} budget={b} index={i} />
        ))}
      </div>
    </div>
  );
}
