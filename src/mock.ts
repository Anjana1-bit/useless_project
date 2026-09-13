import { Search, Mail, LockKeyhole } from 'lucide-react';
import type { Feature } from './types';

export const features: Feature[] = [
  { id: 'search', label: "Searchn’t", prompt: 'Search Googlent or type a URL', icon: Search, accent: 'blue' },
  { id: 'mail', label: "Gmailn’t", prompt: 'Search your protected inbox', icon: Mail, accent: 'red' },
  { id: 'passwords', label: "Passwordn’t", prompt: 'Search saved credentials', icon: LockKeyhole, accent: 'amber' }
];

export const results = {
  search: ['A calmer web starts here', 'Your search stays yours', 'Googlent Privacy Principles'],
  mail: ['Project Aurora — final review', 'Your weekly privacy digest', 'Welcome to a quieter inbox'],
  passwords: ['notion.so', 'github.com', 'figma.com'],
  maps: ['Museum of Modern Art', 'Little Collins Street', 'Blue Bottle Coffee']
};
