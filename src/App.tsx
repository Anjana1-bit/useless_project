import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChevronRight, Inbox, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { Brand, Modal, SearchBox, Topbar } from './components';
import { features, results } from './mock';
import type { FeatureId, View } from './types';
import { PasswordHome } from './features/passwords/PasswordHome';
import { SearchHome } from './features/search/SearchHome';
import { GmailHome } from './features/gmail/GmailHome';

type Status = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [searchSeed, setSearchSeed] = useState<string>();
  const [settings, setSettings] = useState(false);
  const feature = useMemo(() => features.find((item) => item.id === view), [view]);

  useEffect(() => { setQuery(''); setStatus('idle'); }, [view]);
  function navigate(next: View) { setView(next); }
  function runSearch() {
    if (!query.trim()) { setStatus('empty'); return; }
    setStatus('loading');
    window.setTimeout(() => setStatus(query.toLowerCase().includes('error') ? 'error' : 'ready'), 650);
  }

  if (view === 'home') return <><Topbar onHome={() => navigate('home')} onSettings={() => setSettings(true)}/><main className="home"><Brand/><p className="tagline">A little less Google. A lot more yours.</p><SearchBox value={query} onChange={setQuery} onSubmit={() => { if (query.trim()) { setSearchSeed(query); setView('search'); } }} placeholder="Search Googlent or type a URL"/>
    <nav className="shortcut-grid" aria-label="Googlent tools">{features.map((item) => { const Icon = item.icon; return <button className="shortcut" key={item.id} onClick={() => { if (item.id === 'search') setSearchSeed(undefined); navigate(item.id); }}><span className={`shortcut-icon ${item.accent}`}><Icon size={25}/></span><span>{item.label}</span></button>; })}</nav>
    <p className="home-foot"><ShieldCheck size={15}/> Private by default</p></main>{settings && <Settings onClose={() => setSettings(false)}/>}</>;

  if (view === 'passwords') return <><Topbar back onBack={() => navigate('home')} onHome={() => navigate('home')} onSettings={() => setSettings(true)}/><PasswordHome/>{settings && <Settings onClose={() => setSettings(false)}/>}</>;

  if (view === 'search') return <><Topbar back onBack={() => navigate('home')} onHome={() => navigate('home')} onSettings={() => setSettings(true)}/><SearchHome initialQuery={searchSeed}/>{settings && <Settings onClose={() => setSettings(false)}/>}</>;

  if (view === 'mail') return <><Topbar back onBack={() => navigate('home')} onHome={() => navigate('home')} onSettings={() => setSettings(true)}/><GmailHome/>{settings && <Settings onClose={() => setSettings(false)}/>}</>;

  return <><Topbar back onBack={() => navigate('home')} onHome={() => navigate('home')} onSettings={() => setSettings(true)}/><main className="tool-page"><section className="tool-intro"><span className={`tool-icon ${feature!.accent}`}>{(() => { const Icon = feature!.icon; return <Icon size={25}/>; })()}</span><div><p className="eyebrow">GOOGLENT TOOL</p><h1>{feature!.label}</h1><p>{description(feature!.id)}</p></div></section><SearchBox value={query} onChange={setQuery} onSubmit={runSearch} placeholder={feature!.prompt} disabled={status === 'loading'}/><ResultArea status={status} type={feature!.id} query={query} retry={runSearch}/></main>{settings && <Settings onClose={() => setSettings(false)}/>}</>;
}

function description(id: FeatureId) { return ({ search: 'Explore without being followed around.', mail: 'A focused inbox, made just for you.', passwords: 'Your access, protected and uncomplicated.', maps: 'Find your way without leaving a trail.' } as const)[id]; }
function ResultArea({ status, type, query, retry }: { status: Status; type: FeatureId; query: string; retry: () => void }) {
  if (status === 'idle') return <div className="state idle"><Sparkles size={27}/><h2>Ready when you are</h2><p>Use the search bar to get started.</p></div>;
  if (status === 'loading') return <div className="state"><RefreshCw className="spin" size={25}/><h2>Looking that up</h2><p>Keeping your experience private.</p></div>;
  if (status === 'empty') return <div className="state"><Inbox size={28}/><h2>Nothing to search yet</h2><p>Enter a search term above and we’ll take it from there.</p></div>;
  if (status === 'error') return <div className="state error"><AlertCircle size={28}/><h2>That didn’t quite work</h2><p>This is a simulated error state. Try another search.</p><button className="subtle-button" onClick={retry}>Try again</button></div>;
  return <section className="results"><p className="result-label">RESULTS FOR <strong>“{query}”</strong></p>{results[type].map((title, index) => <button className="result-card" key={title}><div><span>{type === 'mail' ? 'INBOX' : type === 'passwords' ? 'SAVED ITEM' : type === 'maps' ? 'PLACE' : 'GOOGLENT'}</span><h2>{title}</h2><p>{resultCopy(type, index)}</p></div><ChevronRight size={19}/></button>)}</section>;
}
function resultCopy(type: FeatureId, index: number) { const copy: Record<FeatureId, string[]> = { search: ['Thoughtful results, without the noise.', 'A clearer approach to everyday browsing.', 'See how Googlent keeps things simple.'], mail: ['Maya Chen · 10:42 AM', 'The Googlent team · Yesterday', 'Googlent · Sep 10'], passwords: ['Last used today', 'Last used yesterday', 'Last used Sep 8'], maps: ['11 West 53rd Street · 0.8 mi', 'Melbourne VIC · 1.2 mi', 'Collins Street · 0.5 mi'] }; return copy[type][index]; }
function Settings({ onClose }: { onClose: () => void }) { return <Modal onClose={onClose}><div className="settings"><div className="settings-mark"><ShieldCheck size={24}/></div><p className="eyebrow">GOOGLENT</p><h2>Private by design</h2><p>Googlent is a UI prototype for a more deliberate, private web experience.</p><div className="setting-row"><span>Privacy shield</span><span className="status-pill">On</span></div><button className="primary-button" onClick={onClose}>Done</button></div></Modal>; }
