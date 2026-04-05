import { useState, useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { TransactionItem } from '@/components/TransactionItem';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Download } from 'lucide-react';
import type { Transaction, Category, TransactionType } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useExpenseStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({ title: 'Transaction deleted' });
  };

  const exportCSV = () => {
    const header = 'Date,Type,Category,Description,Amount\n';
    const rows = filtered.map((t) => `${t.date},${t.type},${t.category},"${t.description}",${t.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported to CSV!' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <AddTransactionDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            trigger={
              <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            }
          />
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.icon} {cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card divide-y divide-border">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No transactions found</p>
        ) : (
          filtered.map((t, i) => (
            <TransactionItem key={t.id} transaction={t} index={i} onEdit={(tx) => setEditTx(tx)} onDelete={handleDelete} />
          ))
        )}
      </motion.div>

      {editTx && (
        <AddTransactionDialog editTransaction={editTx} open={!!editTx} onOpenChange={(o) => !o && setEditTx(null)} />
      )}
    </div>
  );
}
