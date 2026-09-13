export interface SearchReply { response: string; conversation_id: string; }

export async function requestSearch(message: string, conversationId?: string): Promise<SearchReply> {
  const response = await fetch('http://127.0.0.1:8000/api/search', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_id: conversationId })
  });
  if (!response.ok) throw new Error('Searchn’t is unavailable');
  return response.json() as Promise<SearchReply>;
}
