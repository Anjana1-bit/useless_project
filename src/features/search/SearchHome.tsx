import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowUp, Search } from 'lucide-react';
import { localSearchResponse } from './localResponses';

type Message = { role: 'user' | 'assistant'; content: string };

export function SearchHome({ initialQuery }: { initialQuery?: string }) {
  const [draft, setDraft] = useState(initialQuery ?? '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const inConversation = messages.length > 0 || loading;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading]);
  useEffect(() => { if (!seededRef.current && initialQuery?.trim()) { seededRef.current = true; void submit(initialQuery); } // Seed only after mount when a home-bar search initiated navigation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(message = draft) {
    const question = message.trim();
    if (!question || loading) return;
    setDraft(''); setLoading(true); setMessages((current) => [...current, { role: 'user', content: question }]);
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', content: localSearchResponse(question, current.length) }]);
      setLoading(false);
    }, 420);
  }

  function onSubmit(event: FormEvent) { event.preventDefault(); void submit(); }
  return <main className={`searchnt-page ${inConversation ? 'has-results' : ''}`}>
    {!inConversation && <section className="searchnt-empty"><div className="searchnt-mark"><Search size={39}/></div><h1>Searchn’t</h1><SearchForm value={draft} onChange={setDraft} onSubmit={onSubmit} loading={loading} label="Search Googlent or type a URL"/></section>}
    {inConversation && <section className="searchnt-conversation"><header className="searchnt-header"><div className="searchnt-brand"><Search size={20}/><span>Searchn’t</span></div><SearchForm value={draft} onChange={setDraft} onSubmit={onSubmit} loading={loading} label="Ask something else..." compact/></header><div className="conversation-list">{messages.map((message, index) => <article className={`conversation-message ${message.role}`} key={`${message.role}-${index}`}><p>{message.role === 'user' ? 'You' : 'Searchn’t'}</p><div>{message.content}</div></article>)}{loading && <article className="conversation-message assistant thinking"><p>Searchn’t</p><div><i/><i/><i/></div></article>}<div ref={bottomRef}/></div></section>}
  </main>;
}

function SearchForm({ value, onChange, onSubmit, loading, label, compact = false }: { value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent) => void; loading: boolean; label: string; compact?: boolean }) {
  return <form className={`searchnt-form ${compact ? 'compact' : ''}`} onSubmit={onSubmit}><Search size={compact ? 18 : 21}/><input autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} disabled={loading}/><button type="submit" disabled={loading || !value.trim()} aria-label="Search"><ArrowUp size={18}/></button></form>;
}
