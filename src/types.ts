import type { LucideIcon } from 'lucide-react';

export type FeatureId = 'search' | 'mail' | 'passwords' | 'maps';
export type View = 'home' | FeatureId;
export interface Feature { id: FeatureId; label: string; prompt: string; icon: LucideIcon; accent: string; }
