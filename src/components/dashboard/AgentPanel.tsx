import {
  Bot, ArrowLeftRight, Layers, ArrowDown, RotateCcw,
  Leaf, Share2, Crosshair, CheckCircle2, XCircle, Loader2, Search,
} from 'lucide-react';
import type { AgentAction, AgentStatus } from '@/lib/engines/agentEngine';

interface Props {
  actions: AgentAction[];
  status: AgentStatus;
}

const TYPE_ICONS: Record<AgentAction['type'], typeof Bot> = {
  swap:      ArrowLeftRight,
  stake:     Layers,
  unstake:   ArrowDown,
  rebalance: RotateCcw,
  harvest:   Leaf,
  bridge:    Share2,
  snipe:     Crosshair,
};

const TYPE_COLORS: Record<AgentAction['type'], string> = {
  swap:      'text-chart-2 bg-chart-2/10 border-chart-2/25',
  stake:     'text-chart-1 bg-chart-1/10 border-chart-1/25',
  unstake:   'text-chart-3 bg-chart-3/10 border-chart-3/25',
  rebalance: 'text-chart-5 bg-chart-5/10 border-chart-5/25',
  harvest:   'text-chart-1 bg-chart-1/10 border-chart-1/20',
  bridge:    'text-chart-3 bg-chart-3/10 border-chart-3/25',
  snipe:     'text-destructive bg-destructive/10 border-destructive/25',
};

const STATUS_CFG: Record<AgentAction['status'], { icon: typeof CheckCircle2; cls: string }> = {
  confirmed: { icon: CheckCircle2, cls: 'text-chart-1' },
  failed:    { icon: XCircle,      cls: 'text-destructive' },
  executing: { icon: Loader2,      cls: 'text-chart-3' },
  scanning:  { icon: Search,       cls: 'text-chart-2' },
};

const MODE_BADGE: Record<AgentStatus['mode'], string> = {
  conservative: 'badge-accumulate',
  balanced:     'badge-neutral',
  aggressive:   'badge-pump',
};

function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function RiskMeter({ score }: { score: number }) {
  const color =
    score < 30 ? 'hsl(158 60% 44%)' :
    score < 60 ? 'hsl(43 90% 50%)' :
    'hsl(0 68% 52%)';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1 rounded-full bg-border/50 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="font-mono text-[10px]" style={{ color }}>{score}</span>
    </div>
  );
}

export default function AgentPanel({ actions, status }: Props) {
  const pnlPositive = status.totalPnL >= 0;

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <Bot size={12} className="text-primary" />
          Autonomous Agent
        </span>
        <span className="flex items-center gap-1.5">
          {status.isActive && <span className="status-dot" />}
          <span className={`${MODE_BADGE[status.mode]} text-[10px] font-mono px-1.5 py-0.5 rounded uppercase`}>
            {status.mode}
          </span>
        </span>
      </div>

      {/* Agent status card */}
      <div className="px-3 py-2 border-b border-border/60 space-y-2">
        {/* Portfolio row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-lg border border-border/50 bg-secondary/30 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Portfolio</div>
            <div className="font-mono font-bold text-sm text-foreground">
              ${status.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-secondary/30 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Total PnL</div>
            <div className={`font-mono font-bold text-sm ${pnlPositive ? 'text-chart-1' : 'text-destructive'}`}>
              {pnlPositive ? '+' : ''}${status.totalPnL.toFixed(2)}
              <span className="text-[10px] text-muted-foreground ml-1">({status.pnlPercent.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-secondary/30 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Win Rate</div>
            <div className="font-mono font-bold text-sm text-chart-1">{status.winRate}%</div>
            <div className="text-[9px] text-muted-foreground">{status.actionsToday} today</div>
          </div>
        </div>

        {/* Task + Risk */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Current Task</div>
            <p className="text-[11px] text-foreground/80 truncate">{status.currentTask}</p>
          </div>
          <div className="shrink-0">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5 text-right">Risk</div>
            <RiskMeter score={status.riskScore} />
          </div>
        </div>
        <div className="text-[10px] text-primary/80 truncate">
          ⟶ {status.nextAction}
        </div>
      </div>

      {/* Actions feed */}
      <div className="flex-1 overflow-y-auto panel-body flex flex-col gap-1 py-2">
        {actions.slice(0, 25).map((action, i) => {
          const Icon = TYPE_ICONS[action.type];
          const { icon: StatusIcon, cls: statusCls } = STATUS_CFG[action.status];
          const typeCls = TYPE_COLORS[action.type];
          const profitColor = (action.profit ?? 0) >= 0 ? 'text-chart-1' : 'text-destructive';

          return (
            <div
              key={action.id}
              className="animate-fade-in flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-secondary/30 transition-colors duration-150 border border-transparent hover:border-border/40"
              style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
            >
              {/* Type icon */}
              <span className={`flex items-center justify-center w-6 h-6 rounded border shrink-0 ${typeCls}`}>
                <Icon size={11} />
              </span>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] text-foreground/90 truncate">{action.description}</div>
                <div className="text-[10px] text-muted-foreground truncate">{action.reason}</div>
              </div>

              {/* Amount */}
              <span className="font-mono text-[11px] text-foreground/70 shrink-0">
                ${action.amount.toFixed(0)}
              </span>

              {/* Profit */}
              {action.profit !== undefined && (
                <span className={`font-mono text-[11px] font-semibold shrink-0 ${profitColor}`}>
                  {action.profit >= 0 ? '+' : ''}${action.profit.toFixed(2)}
                </span>
              )}

              {/* Status */}
              <StatusIcon
                size={12}
                className={`shrink-0 ${statusCls} ${action.status === 'executing' ? 'animate-spin' : ''}`}
              />

              {/* Time */}
              <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                {relTime(action.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
