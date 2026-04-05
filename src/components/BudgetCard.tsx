import { CATEGORY_CONFIG } from '@/lib/types';
import type { Budget } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/currency';

interface Props {
  budget: Budget;
  index?: number;
}

export function BudgetCard({ budget, index = 0 }: Props) {
  const cat = CATEGORY_CONFIG[budget.category];
  const pct = Math.min((budget.spent / budget.limit) * 100, 100);
  const status = pct >= 100 ? 'over' : pct >= 80 ? 'warning' : 'safe';
  const barColor = status === 'over' ? 'bg-expense' : status === 'warning' ? 'bg-accent' : 'bg-income';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="stat-card space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.icon}</span>
          <span className="text-sm font-medium">{cat.label}</span>
        </div>
        <span className={`text-xs font-semibold ${status === 'over' ? 'text-expense' : status === 'warning' ? 'text-accent' : 'text-income'}`}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatCurrency(budget.spent)} spent</span>
        <span>{formatCurrency(budget.limit)} limit</span>
      </div>
    </motion.div>
  );
}
