import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  useEffect(() => {
    supabase.from('messages').select('*').limit(50).then(({ data }) => setMessages(data ?? []));
    const channel = supabase.channel('messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => setMessages((m) => [...m, p.new])).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  const send = async () => {
    if (!text) return;
    await supabase.from('messages').insert({ content: text });
    setText('');
  };
  return <div className="grid gap-3"><h1 className="text-xl font-semibold">Match Chat</h1><div className="h-80 space-y-2 overflow-auto rounded border p-2">{messages.map((m)=><p key={m.id} className="text-sm">{m.content}</p>)}</div><div className="flex gap-2"><input className="flex-1 rounded border p-2" value={text} onChange={(e)=>setText(e.target.value)} /><Button onClick={send}>Send</Button></div></div>;
}
