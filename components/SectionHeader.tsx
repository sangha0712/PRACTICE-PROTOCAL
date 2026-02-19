import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon }) => {
  return (
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
      {Icon && <Icon className="w-6 h-6 text-neon-blue" />}
      <h2 className="text-2xl md:text-3xl font-display font-bold tracking-wider text-white uppercase">
        {title}
      </h2>
    </div>
  );
};