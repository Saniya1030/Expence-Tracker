import { Trash2, Pencil } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/types';
import { motion } from 'framer-motion';
import { formatSignedCurrency } from '@/lib/currency';

interface Props {
  transaction: Transaction;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
  index?: number;
}

export function TransactionItem({ transaction, onEdit, onDelete, index = 0 }: Props) {
  const cat = CATEGORY_CONFIG[transaction.category];
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/50"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${cat.colorClass}/15`}>
        {cat.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">
          {cat.label} · {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
          {formatSignedCurrency(transaction.amount, transaction.type)}
        </p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button onClick={() => onEdit(transaction)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(transaction.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
