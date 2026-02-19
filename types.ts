import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface RuleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export interface InfoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

export interface CharacterProfileProps {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  affiliation: string;
  color: string;
}