import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'green' | 'blue' | 'orange' | 'red';
}

const colors = {
  green: 'bg-accent/10 text-accent-dark',
  blue: 'bg-blue-50 text-blue-700',
  orange: 'bg-orange-50 text-orange-700',
  red: 'bg-red-50 text-red-600',
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'green' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-admin border border-black/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-brand-700/40 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-4xl font-black text-brand-700 tracking-tighter">{value}</p>
          {subtitle && <p className="text-xs text-brand-700/40 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
