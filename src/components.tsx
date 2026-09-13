import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowLeft, Home, Search, Settings2, X } from 'lucide-react';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`} aria-label="Googlent"><span className="g-blue">G</span><span className="g-red">o</span><span className="g-amber">o</span><span className="g-blue">g</span><span className="g-green">l</span><span className="g-red">e</span><span className="g-dark">n’t</span></div>;
}

export function IconButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="icon-button" {...props}>{children}</button>;
}

export function Topbar({ onHome, onBack, onSettings, back }: { onHome: () => void; onBack?: () => void; onSettings: () => void; back?: boolean }) {
  return <header className="topbar">
    <div className="topbar-left">{back ? <IconButton aria-label="Go back" onClick={onBack}><ArrowLeft size={19}/></IconButton> : <Brand compact/>}</div>
    <div className="topbar-actions"><IconButton aria-label="Home" onClick={onHome}><Home size={18}/></IconButton><IconButton aria-label="Settings" onClick={onSettings}><Settings2 size={18}/></IconButton></div>
  </header>;
}

export function SearchBox({ value, onChange, onSubmit, placeholder, disabled }: { value: string; onChange: (v:string) => void; onSubmit: () => void; placeholder: string; disabled?: boolean }) {
  return <form className="search-box" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}><Search size={19}/><input autoFocus value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>{value && <button type="button" onClick={() => onChange('')} aria-label="Clear search"><X size={17}/></button>}</form>;
}

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="modal-layer" role="dialog" aria-modal="true"><div className="modal"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18}/></button>{children}</div></div>;
}
