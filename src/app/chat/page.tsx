'use client';

import { useState } from 'react';
import { mockAIResponse } from './mockAI';

export default function Chat() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant'; content: string}>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Get AI response
    const aiResponse = await mockAIResponse(userMessage);
    
    // Add AI response
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
      <header className="bg-neutral-800 p-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        <p className="text-sm text-neutral-400">Type a message to start chatting</p>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`max-w-xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            <div className={`${msg.role === 'user' ? 'bg-blue-600' : 'bg-neutral-800'} rounded-lg p-3 max-w-xs`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="max-w-xl mr-auto">
            <div className="bg-neutral-800 rounded-lg p-3 max-w-xs animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </main>
      
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 border-t border-neutral-700 bg-neutral-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}