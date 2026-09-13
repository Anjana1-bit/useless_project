import { ChangeEvent, useState } from 'react';
import { ImagePlus, Mail, Send, X } from 'lucide-react';
import { simulateSend } from './sendSimulator';

export function GmailHome() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState('');
  const [attempt, setAttempt] = useState(0);

  function attach(event: ChangeEvent<HTMLInputElement>) { setFile(event.target.files?.[0] ?? null); setFeedback(''); }
  function send() { setFeedback(simulateSend(file, attempt)); setAttempt((count) => count + 1); }

  return <main className="gmail-page"><section className="gmail-compose"><header className="gmail-heading"><div className="gmail-mark"><Mail size={23}/></div><div><p className="eyebrow">GOOGLENT MAIL</p><h1>Gmailn’t</h1><p>Write something worth not delivering.</p></div></header><div className="compose-fields"><label>Email<input type="email" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="x@email.com"/></label><label>Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..."/></label></div><div className="compose-actions"><label className="attachment"><ImagePlus size={18}/><span>{file ? file.name : 'Attach image'}</span><input type="file" accept="image/*" onChange={attach}/>{file && <button type="button" onClick={(event) => { event.preventDefault(); setFile(null); }} aria-label="Remove attachment"><X size={15}/></button>}</label><button className="send-button" type="button" onClick={send}>Send <Send size={16}/></button></div>{feedback && <div className="send-feedback" role="status"><span>Delivery update</span><p>{feedback}</p></div>}</section></main>;
}
