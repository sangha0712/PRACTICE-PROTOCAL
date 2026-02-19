import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon }) => {
  return (
    <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
      {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10 text-neon-blue" />}
      <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wider text-white uppercase">
        {title}
      </h2>
    </div>
  );
};