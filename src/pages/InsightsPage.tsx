import { useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { CATEGORY_CONFIG, CATEGORY_COLORS, MOOD_CONFIG } from '@/lib/types';
import type { Category, Mood } from '@/lib/types';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Lightbulb, Brain } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

export default function InsightsPage() {
  const { transactions } = useExpenseStore();

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([cat, val]) => ({
        name: CATEGORY_CONFIG[cat as Category]?.label || cat,
        value: val,
        color: CATEGORY_COLORS[cat as Category] || '#888',
        category: cat,
      }));
  }, [transactions]);

  const moodData = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    transactions.filter((t) => t.type === 'expense' && t.mood).forEach((t) => {
      if (!map[t.mood!]) map[t.mood!] = { total: 0, count: 0 };
      map[t.mood!].total += t.amount;
      map[t.mood!].count++;
    });
    return Object.entries(map).map(([mood, data]) => ({
      mood: MOOD_CONFIG[mood as Mood]?.emoji + ' ' + MOOD_CONFIG[mood as Mood]?.label,
      avgSpend: Math.round(data.total / data.count),
      total: data.total,
    }));
  }, [transactions]);

  const totalExpenses = categoryData.reduce((s, d) => s + d.value, 0);
  const topCategory = categoryData[0];

  const tips = useMemo(() => {
    const tips: string[] = [];
    if (topCategory) tips.push(`Your highest spending category is ${topCategory.name} (${formatCurrency(topCategory.value)}). Consider setting a tighter budget.`);
    const stressedSpend = moodData.find((m) => m.mood.includes('Stressed'));
    if (stressedSpend) tips.push(`You tend to spend ${formatCurrency(stressedSpend.avgSpend)} on average when stressed. Try mindful spending techniques.`);
    tips.push('Setting up automatic savings of 20% of your income can help build wealth faster.');
    tips.push('Review subscriptions monthly — canceling unused ones can save ₹8,000+/year.');
    return tips;
  }, [topCategory, moodData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Insights</h1>
        <p className="text-sm text-muted-foreground">Smart analysis of your spending patterns</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Top Spending</h3>
          </div>
          <p className="mt-2 font-display text-xl font-bold">{topCategory?.name || 'N/A'}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(topCategory?.value || 0)} total</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex items-center gap-2 text-savings">
            <Brain className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Spending Trend</h3>
          </div>
          <p className="mt-2 font-display text-xl font-bold">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-muted-foreground">Total expenses this period</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex items-center gap-2 text-accent">
            <Lightbulb className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Categories Tracked</h3>
          </div>
          <p className="mt-2 font-display text-xl font-bold">{categoryData.length}</p>
          <p className="text-xs text-muted-foreground">Active spending categories</p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} innerRadius={55} dataKey="value" paddingAngle={2}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">No data yet</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Mood-Based Spending</h3>
          {moodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mood" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="avgSpend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg Spend" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">Add mood data to see patterns</p>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-accent" /> Smart Tips
        </h3>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <span className="mt-0.5 text-sm">💡</span>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
