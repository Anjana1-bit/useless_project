import { useState } from 'react';
import { Check, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { useRuleEngine } from './useRuleEngine';

export function PasswordHome() {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const { visibleRules, satisfied, completed, unlockedCount, totalRules } = useRuleEngine(password);
  const strength = getStrength(completed, password.length);

  return <main className="password-page"><section className="password-hero"><div className="password-badge"><LockKeyhole size={24}/></div><div><p className="eyebrow">GOOGLENT SECURITY</p><h1>Passwordn’t</h1><p>Create a strong password that meets our security requirements.</p></div></section><section className="password-workspace"><div className="password-main"><PasswordInput value={password} onChange={setPassword} visible={visible} onToggleVisibility={() => setVisible((current) => !current)}/><div className="strength-block"><div className="strength-copy"><span>Password strength</span><strong>{strength.label}</strong></div><div className="strength-track"><span style={{ width: `${strength.percent}%` }}/></div><p>{completed} of {visibleRules.length} active requirements satisfied</p></div><div className="security-note"><ShieldCheck size={17}/><span>We never store your password. We just keep asking for more of it.</span></div></div><aside className="requirements-card"><div className="requirements-heading"><div><p className="eyebrow">ACTIVE POLICY</p><h2>Requirements</h2></div><span>{unlockedCount}/{totalRules}</span></div><div className="rule-list">{visibleRules.map((rule, index) => { const passed = satisfied.get(rule.id); return <div key={rule.id} className={`rule ${passed ? 'passed' : ''} ${index === visibleRules.length - 1 && unlockedCount > 5 ? 'new-rule' : ''}`}><span className="rule-state">{passed ? <Check size={15}/> : <X size={15}/>}</span><span>{rule.description}</span></div>; })}</div></aside></section></main>;
}

function getStrength(completed: number, length: number) { const score = Math.min(100, Math.round((completed / 10) * 72 + Math.min(length, 24) * 1.2)); if (score < 20) return { label: 'Weak', percent: score }; if (score < 42) return { label: 'Fair', percent: score }; if (score < 64) return { label: 'Good', percent: score }; if (score < 84) return { label: 'Strong', percent: score }; return { label: 'Excellent', percent: score }; }
