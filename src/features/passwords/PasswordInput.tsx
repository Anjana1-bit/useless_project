import { Copy, Eye, EyeOff, KeyRound } from 'lucide-react';

interface PasswordInputProps { value: string; onChange: (value: string) => void; visible: boolean; onToggleVisibility: () => void; }

export function PasswordInput({ value, onChange, visible, onToggleVisibility }: PasswordInputProps) {
  const copy = async () => { if (value) await navigator.clipboard?.writeText(value); };
  return <div className="password-input-wrap"><label htmlFor="password-field">New password</label><div className="password-input"><KeyRound size={19}/><input id="password-field" autoFocus type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Start creating a strong password"/><button type="button" onClick={onToggleVisibility} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button><button type="button" onClick={copy} aria-label="Copy password" disabled={!value}><Copy size={17}/></button></div></div>;
}
