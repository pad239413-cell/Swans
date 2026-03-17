import { Zap, CheckCircle2, Clock, XCircle, Loader2, BarChart3 } from 'lucide-react';
import type { MEVBundle, JitoStats } from '@/lib/engines/mevEngine';

interface Props {
  bundles: MEVBundle[];
  stats: JitoStats;
}

function truncHash(h: string): string {
  return `${h.slice(0, 4)}…${h.slice(-4)}`;
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

const TYPE_COLORS: Record<MEVBundle['type'], string> = {
  arbitrage: 'text-chart-2 bg-chart-2/10 border-chart-2/25',
  sandwich: 'text-chart-3 bg-chart-3/10 border-chart-3/25',
  liquidation: 'text-chart-5 bg-chart-5/10 border-chart-5/25',
  frontrun: 'text-destructive bg-destructive/10 border-destructive/25',
};

const STATUS_CONFIG: Record<MEVBundle['status'], { icon: typeof CheckCircle2; cls: string; label: string }> = {
  confirmed: { icon: CheckCircle2, cls: 'text-chart-1', label: 'Confirmed' },
  pending:   { icon: Clock,        cls: 'text-chart-3', label: 'Pending'   },
  submitted: { icon: Loader2,      cls: 'text-chart-2', label: 'Submitted' },
  failed:    { icon: XCircle,      cls: 'text-destructive', label: 'Failed' },
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-2 min-w-0">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono font-bold text-sm text-foreground">{value}</span>
      {sub && <span className="font-mono text-[10px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function MevPanel({ bundles, stats }: Props) {
  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <Zap size={12} className="text-primary" />
          MEV / Jito Bundles
        </span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot" />
          <span className="font-mono text-[10px]">Slot {fmtNum(stats.currentSlot)}</span>
        </span>
      </div>

      {/* Jito Stats */}
      <div className="px-3 py-2 border-b border-border/60 grid grid-cols-5 gap-1.5">
        <StatCard label="Landed"    value={fmtNum(stats.bundlesLanded)} sub={`/ ${fmtNum(stats.bundlesSubmitted)}`} />
        <StatCard label="Success"   value={`${stats.successRate}%`} />
        <StatCard label="Profit"    value={`${stats.totalProfitSOL.toFixed(2)}`} sub="SOL" />
        <StatCard label="TPS"       value={fmtNum(stats.tps)} />
        <StatCard label="Avg Tip"   value={stats.avgTipSOL.toFixed(5)} sub="SOL" />
      </div>

      {/* Bundle list */}
      <div className="flex-1 overflow-y-auto panel-body flex flex-col gap-1.5 py-2">
        {bundles.slice(0, 20).map((b) => {
          const { icon: StatusIcon, cls, label } = STATUS_CONFIG[b.status];
          const typeCls = TYPE_COLORS[b.type];
          return (
            <div
              key={b.id}
              className="animate-fade-in flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/20 px-2.5 py-2 hover:border-primary/25 hover:bg-secondary/40 transition-colors duration-150"
            >
              {/* Type badge */}
              <span className={`text-[10px] font-mono font-semibold border rounded px-1.5 py-0.5 uppercase shrink-0 ${typeCls}`}>
                {b.type.slice(0, 4)}
              </span>

              {/* Tokens */}
              <span className="font-mono text-[11px] text-foreground/80 shrink-0">
                {b.tokens.join('/')}
              </span>

              {/* Profit */}
              <span className="font-mono text-xs font-bold text-chart-1 shrink-0">
                +{b.profit.toFixed(4)} SOL
              </span>

              {/* Tip */}
              <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                tip {b.jitoTip.toFixed(5)}
              </span>

              {/* Hash */}
              <span className="font-mono text-[10px] text-muted-foreground flex-1 truncate text-right">
                {truncHash(b.txHash)}
              </span>

              {/* Status */}
              <span className={`flex items-center gap-0.5 shrink-0 ${cls}`}>
                <StatusIcon size={11} className={b.status === 'submitted' ? 'animate-spin' : ''} />
                <span className="text-[10px] font-mono hidden sm:inline">{label}</span>
              </span>

              {/* Time */}
              <span className="font-mono text-[10px] text-muted-foreground shrink-0 hidden md:inline">
                {relTime(b.timestamp)}
              </span>
            </div>
          );
        })}

        {bundles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
            <BarChart3 size={24} className="opacity-40" />
            <span className="text-xs">Waiting for bundles…</span>
          </div>
        )}
      </div>
    </div>
  );
}
