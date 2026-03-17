import {
  LayoutGrid,
  TrendingUp,
  Zap,
  Radio,
  BrainCircuit,
  Bot,
  MessageSquare,
  Server,
  X,
} from 'lucide-react';
import type { AgentStatus } from '@/lib/engines/agentEngine';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',      Icon: LayoutGrid,   desc: 'All panels' },
  { id: 'prices',     label: 'Live Prices',   Icon: TrendingUp,   desc: 'Token feed' },
  { id: 'mev',        label: 'MEV / Jito',    Icon: Zap,          desc: 'Bundle tracker' },
  { id: 'social',     label: 'Social Intel',  Icon: Radio,        desc: 'LunarCrush' },
  { id: 'sentiment',  label: 'AI Predictions',Icon: BrainCircuit, desc: 'StockGeist' },
  { id: 'agent',      label: 'Agent',         Icon: Bot,          desc: 'Auto trading' },
  { id: 'chat',       label: 'AI Chat',       Icon: MessageSquare,desc: 'SwanAI chat' },
  { id: 'network',    label: 'Network',       Icon: Server,       desc: 'Solana stats' },
] as const;

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  agentStatus?: AgentStatus | null;
}

export default function Sidebar({ activeTab, onTabChange, mobileOpen, onMobileClose, agentStatus }: SidebarProps) {
  const sidebarContent = (
    <aside className="flex flex-col h-full w-56 shrink-0 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center justify-between h-10 px-4 shrink-0 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none select-none">🦢</span>
          <div className="flex flex-col">
            <span className="text-gradient-green font-bold text-sm tracking-tight leading-none">SwanAI</span>
            <span className="font-mono text-[9px] text-muted-foreground/60 leading-none mt-0.5">Solana Agent</span>
          </div>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 rounded text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-1 overflow-y-auto space-y-0.5">
        <div className="px-2 py-1 mb-1">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Dashboard</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); onMobileClose?.(); }}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all duration-150 group
                ${isActive
                  ? 'bg-primary/15 text-primary border-l-2 border-primary'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground border-l-2 border-transparent hover:bg-sidebar-accent/40 hover:border-sidebar-primary/30'
                }
              `}
            >
              <item.Icon
                size={14}
                strokeWidth={isActive ? 2.2 : 1.7}
                className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'}
              />
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-medium tracking-wide ${isActive ? 'text-primary' : ''}`}>
                  {item.label}
                </span>
                <span className="text-[9px] text-muted-foreground/50 leading-none mt-0.5 hidden group-hover:block">
                  {item.desc}
                </span>
              </div>

              {/* Active indicator dot */}
              {isActive && <span className="ml-auto status-dot shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Agent Status Footer */}
      <div className="px-3 py-3 shrink-0 border-t border-sidebar-border">
        <div className="rounded-lg bg-primary/8 border border-primary/20 px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="status-dot" />
            <span className="text-[11px] font-semibold text-primary">Agent Active</span>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground/70">
            {agentStatus ? (
              <>
                <div>Mode: <span className="text-foreground/80">{agentStatus.mode}</span></div>
                <div>PnL: <span className={agentStatus.totalPnL >= 0 ? 'text-chart-1' : 'text-destructive'}>
                  {agentStatus.totalPnL >= 0 ? '+' : ''}${agentStatus.totalPnL.toFixed(0)}
                </span></div>
                <div>Win: <span className="text-chart-2">{agentStatus.winRate}%</span></div>
              </>
            ) : (
              <span className="animate-pulse">Initializing…</span>
            )}
          </div>
        </div>
        <div className="text-center mt-2 font-mono text-[9px] text-muted-foreground/40">
          SwanAI v1.0 · Solana
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full">{sidebarContent}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative h-full animate-fade-in">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
