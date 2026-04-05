import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, colorClass, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trendUp ? 'text-income' : 'text-expense'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
