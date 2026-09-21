import {
  Shield, Star, Layers, Users, Gift, DollarSign, ArrowDownLeft, TrendingUp, Percent,
  type LucideIcon,
} from 'lucide-react';

/** Icon + tint for an income-breakdown row, matched by category name keywords. */
export const getIncomeIcon = (category: string): { icon: LucideIcon; tint: string } => {
  const c = category.toLowerCase();
  if (c.includes('sponsor')) return { icon: Shield, tint: 'bg-emerald-500/10 text-emerald-500' };
  if (c.includes('lgci') || c.includes('board')) return { icon: Star, tint: 'bg-amber-500/10 text-amber-500' };
  if (c.includes('pool')) return { icon: Layers, tint: 'bg-orange-500/10 text-orange-500' };
  if (c.includes('team') || c.includes('generation')) return { icon: Users, tint: 'bg-blue-500/10 text-blue-500' };
  if (c.includes('rank') || c.includes('royalty')) return { icon: Gift, tint: 'bg-violet-500/10 text-violet-500' };
  if (c.includes('deposit')) return { icon: ArrowDownLeft, tint: 'bg-emerald-500/10 text-emerald-500' };
  if (c.includes('profit')) return { icon: TrendingUp, tint: 'bg-amber-500/10 text-amber-500' };
  if (c.includes('referral') || c.includes('commission')) return { icon: Percent, tint: 'bg-blue-500/10 text-blue-500' };
  return { icon: DollarSign, tint: 'bg-slate-500/10 text-slate-500' };
};
