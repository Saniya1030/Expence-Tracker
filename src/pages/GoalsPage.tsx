import { useExpenseStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useExpenseStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [icon, setIcon] = useState('🎯');

  const handleAdd = () => {
    if (!name || !target) return;
    addGoal({ name, target: parseFloat(target), saved: 0, icon });
    setOpen(false);
    setName('');
    setTarget('');
    toast({ title: 'Goal created!' });
  };

  const addSavings = (id: string, current: number) => {
    const amount = prompt('How much to add?');
    if (!amount) return;
    updateGoal(id, { saved: current + parseFloat(amount) });
    toast({ title: 'Savings updated!' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Track progress towards your financial goals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90"><Plus className="h-4 w-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent className="glass-card sm:max-w-sm">
            <DialogHeader><DialogTitle className="font-display">Create Goal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vacation" /></div>
              <div className="space-y-1"><Label>Target (₹)</Label><Input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="5000" /></div>
              <div className="space-y-1">
                <Label>Icon</Label>
                <div className="flex gap-2">
                  {['🎯', '🏖️', '💻', '🏦', '🚗', '🏠'].map((e) => (
                    <button key={e} type="button" onClick={() => setIcon(e)} className={`h-10 w-10 rounded-lg text-lg transition-all ${icon === e ? 'bg-primary/15 ring-2 ring-primary scale-110' : 'hover:bg-muted'}`}>{e}</button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, i) => {
          const pct = Math.min((goal.saved / goal.target) * 100, 100);
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold">{goal.name}</h3>
                    <p className="text-xs text-muted-foreground">{formatCurrency(goal.saved)} / {formatCurrency(goal.target)}</p>
                  </div>
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">{pct.toFixed(0)}%</span>
                <Button size="sm" variant="outline" onClick={() => addSavings(goal.id, goal.saved)} className="text-xs">
                  + Add Savings
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
