import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  BarChart2,
  Zap,
  Brain,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface Props {
  onSendMessage: (msg: string) => string;
}

function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Renders markdown-lite: **bold**, newlines, bullet points */
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />;

    const isBullet = line.trimStart().startsWith('•');
    const textToParse = isBullet ? line.trimStart().slice(1).trim() : line;

    // Split on **bold** markers
    const parts = textToParse.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={j} className="text-foreground font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{part}</span>;
    });

    if (isBullet) {
      return (
        <div key={i} className={`flex gap-1.5 leading-relaxed ${i > 0 ? 'mt-0.5' : ''}`}>
          <span className="text-primary mt-px shrink-0">•</span>
          <p>{rendered}</p>
        </div>
      );
    }

    return (
      <p key={i} className={`leading-relaxed ${i > 0 ? 'mt-0.5' : ''}`}>
        {rendered}
      </p>
    );
  });
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'agent',
    content:
      "🦢 **SwanAI online.** All engines running.\n\nI'm monitoring Solana in real-time — prices, MEV bundles, social signals, and AI sentiment. Ask me anything!\n\nType \"help\" to see all commands.",
    timestamp: Date.now() - 5000,
  },
];

const QUICK_ACTIONS = [
  { label: 'SOL pump?', icon: TrendingUp },
  { label: 'Market overview', icon: BarChart2 },
  { label: 'MEV stats', icon: Zap },
  { label: 'Agent status', icon: Bot },
  { label: 'BONK social', icon: Sparkles },
  { label: 'Strategy', icon: Brain },
];

export default function ChatPanel({ onSendMessage }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text: string) {
    const msg = text.trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(
      () => {
        const response = onSendMessage(msg);
        const agentMsg: ChatMessage = {
          id: `a_${Date.now()}`,
          role: 'agent',
          content: response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setTyping(false);
      },
      500 + Math.random() * 500,
    );
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="panel flex flex-col h-full">
      {/* Header */}
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <MessageSquare size={12} className="text-primary" />
          SwanAI Chat
        </span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot" />
          <span className="font-mono text-[10px] text-chart-1">Online</span>
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in flex gap-2 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`
                shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5
                ${
                  msg.role === 'agent'
                    ? 'bg-primary/20 border border-primary/40 text-primary'
                    : 'bg-secondary/80 border border-border/60 text-muted-foreground'
                }
              `}
            >
              {msg.role === 'agent' ? <Bot size={12} /> : <User size={12} />}
            </div>

            {/* Bubble */}
            <div
              className={`
                max-w-[85%] rounded-2xl px-3 py-2.5 text-xs
                ${
                  msg.role === 'agent'
                    ? 'bg-primary/10 border border-primary/20 text-foreground rounded-tl-sm'
                    : 'bg-secondary/70 border border-border/50 text-foreground rounded-tr-sm'
                }
              `}
            >
              <div className="break-words space-y-0 text-muted-foreground">
                {renderContent(msg.content)}
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-1.5 text-right">
                {relTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-2 items-start">
            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-primary/20 border border-primary/40 text-primary">
              <Bot size={12} />
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm px-3 py-2.5">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-primary/70"
                    style={{
                      animation: `statusPulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => sendMessage(label)}
            disabled={typing}
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full border border-border/60 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-primary/90 hover:bg-primary/10 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon size={9} />
            {label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="border-t border-border/60 px-3 py-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about tokens, signals, market…"
          disabled={typing}
          className="flex-1 bg-secondary/40 border border-border/60 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:bg-secondary/60 transition-colors duration-150 font-mono disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || typing}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-primary/80 hover:bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}
