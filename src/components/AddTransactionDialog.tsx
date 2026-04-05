import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useExpenseStore } from '@/lib/store';
import { CATEGORY_CONFIG, MOOD_CONFIG } from '@/lib/types';
import type { Transaction, TransactionType, Category, Mood } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface Props {
  editTransaction?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AddTransactionDialog({ editTransaction, open, onOpenChange, trigger }: Props) {
  const { addTransaction, updateTransaction } = useExpenseStore();
  const { toast } = useToast();
  const isEdit = !!editTransaction;

  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [type, setType] = useState<TransactionType>(editTransaction?.type || 'expense');
  const [category, setCategory] = useState<Category>(editTransaction?.category || 'food');
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [date, setDate] = useState(editTransaction?.date || new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<Mood>(editTransaction?.mood || 'neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast({ title: 'Invalid amount', variant: 'destructive' });
      return;
    }

    const data = { amount: parsed, type, category, description, date, mood };

    if (isEdit && editTransaction) {
      updateTransaction(editTransaction.id, data);
      toast({ title: 'Transaction updated!' });
    } else {
      addTransaction(data);
      toast({ title: 'Transaction added!' });
    }

    onOpenChange?.(false);
    if (!isEdit) {
      setAmount('');
      setDescription('');
    }
  };

  const incomeCategories: Category[] = ['salary', 'freelance', 'investments', 'other'];
  const expenseCategories: Category[] = ['food', 'travel', 'shopping', 'bills', 'entertainment', 'health', 'education', 'other'];
  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="glass-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className={type === 'expense' ? 'flex-1 bg-expense hover:bg-expense/90' : 'flex-1'}
              onClick={() => setType('expense')}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={type === 'income' ? 'flex-1 bg-income hover:bg-income/90' : 'flex-1'}
              onClick={() => setType('income')}
            >
              Income
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_CONFIG[c].icon} {CATEGORY_CONFIG[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="What was this for?" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Mood</Label>
            <div className="flex gap-2">
              {(Object.entries(MOOD_CONFIG) as [Mood, typeof MOOD_CONFIG[Mood]][]).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMood(key)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all ${
                    mood === key ? 'bg-primary/15 ring-2 ring-primary scale-110' : 'hover:bg-muted'
                  }`}
                  title={config.label}
                >
                  {config.emoji}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            {isEdit ? 'Update' : 'Add Transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
