import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [activeMatch, setActiveMatch] = useState<{ id: string; peerId: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: matches } = await supabase
        .from('matches')
        .select('id,founder_id,developer_id')
        .or(`founder_id.eq.${user.id},developer_id.eq.${user.id}`)
        .limit(1);

      const match = matches?.[0];
      if (!match) return;
      const peerId = match.founder_id === user.id ? match.developer_id : match.founder_id;
      setActiveMatch({ id: match.id, peerId });

      const { data: initial } = await supabase
        .from('messages')
        .select('id,content,created_at')
        .eq('match_id', match.id)
        .order('created_at', { ascending: true })
        .limit(50);
      setMessages(initial ?? []);
    };

    void load();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) =>
        setMessages((current) => [...current, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const send = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!text.trim() || !user || !activeMatch) return;
    await supabase.from('messages').insert({
      match_id: activeMatch.id,
      sender_id: user.id,
      receiver_id: activeMatch.peerId,
      content: text.trim()
    });
    setText('');
  };

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
      <h1 className="text-xl font-semibold">Match Chat</h1>
      {!activeMatch && (
        <p className="text-sm text-slate-500 dark:text-slate-300">No active matches yet. Accept an application to chat.</p>
      )}
      <div className="h-80 space-y-2 overflow-auto rounded border border-border p-2" aria-live="polite">
        {messages.map((m) => (
          <p key={m.id} className="text-sm">
            {m.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <Input aria-label="Message" value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={send} disabled={!activeMatch}>
          Send
        </Button>
      </div>
    </div>
  );
}
