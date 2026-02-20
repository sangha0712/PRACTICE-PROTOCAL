import React from 'react';
import { InfoCardProps } from '../types';

export const RuleCard: React.FC<InfoCardProps> = ({ title, description, icon: Icon, variant = 'default' }) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'danger': return 'border-neon-red/50 hover:border-neon-red';
      case 'warning': return 'border-yellow-500/50 hover:border-yellow-500';
      case 'success': return 'border-neon-green/50 hover:border-neon-green';
      default: return 'border-neon-blue/30 hover:border-neon-blue';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'danger': return 'text-neon-red';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-neon-green';
      default: return 'text-neon-blue';
    }
  };

  return (
    <div className={`glass-panel p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 border ${getBorderColor()} group tech-border relative overflow-hidden h-full flex flex-col justify-between`}>
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity`}>
        <Icon className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <div className={`mb-4 ${getIconColor()}`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold font-display mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-sans text-sm md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};