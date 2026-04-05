import { useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { StatCard } from '@/components/StatCard';
import { TransactionItem } from '@/components/TransactionItem';
import { BudgetCard } from '@/components/BudgetCard';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CATEGORY_CONFIG, CATEGORY_COLORS } from '@/lib/types';
import type { Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Dashboard() {
  const { transactions, budgets } = useExpenseStore();
  const [addOpen, setAddOpen] = useState(false);

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense, savings: Math.max(income - expense, 0) };
  }, [transactions]);

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([cat, val]) => ({
      name: CATEGORY_CONFIG[cat as Category]?.label || cat,
      value: val,
      color: CATEGORY_COLORS[cat as Category] || '#888',
    }));
  }, [transactions]);

  const barData = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m][t.type] += t.amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        ...data,
      }));
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <AddTransactionDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          trigger={
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Balance" value={formatCurrency(stats.balance)} icon={Wallet} colorClass="bg-primary" delay={0} trend="12% from last month" trendUp />
        <StatCard title="Total Income" value={formatCurrency(stats.income)} icon={TrendingUp} colorClass="bg-income" delay={0.1} />
        <StatCard title="Total Expenses" value={formatCurrency(stats.expense)} icon={TrendingDown} colorClass="bg-expense" delay={0.2} />
        <StatCard title="Savings" value={formatCurrency(stats.savings)} icon={PiggyBank} colorClass="bg-savings" delay={0.3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Spending by Category</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No expense data yet</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Monthly Overview</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No data yet</p>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="mb-3 font-display text-sm font-semibold">Recent Transactions</h3>
          <div className="space-y-1">
            {recentTransactions.map((t, i) => (
              <TransactionItem key={t.id} transaction={t} index={i} />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="mb-3 font-display text-sm font-semibold">Budget Progress</h3>
          <div className="space-y-3">
            {budgets.slice(0, 4).map((b, i) => (
              <BudgetCard key={b.id} budget={b} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
