import { TrendingUp, TrendingDown, Activity, Zap, Globe, Brain } from 'lucide-react';
import type { TokenPrice } from '@/lib/engines/priceEngine';
import type { JitoStats } from '@/lib/engines/mevEngine';
import type { MarketSentiment } from '@/lib/engines/stockgeist';
import type { AgentStatus } from '@/lib/engines/agentEngine';

interface Props {
  prices: Record<string, TokenPrice>;
  jitoStats: JitoStats | null;
  market: MarketSentiment | null;
  agentStatus: AgentStatus | null;
}

/** Compact dollar formatter */
function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

/** Fear & Greed color based on index value */
function fgColor(index: number): string {
  if (index >= 60) return 'hsl(158 60% 44%)';
  if (index >= 40) return 'hsl(43 90% 50%)';
  return 'hsl(0 68% 52%)';
}

export default function OverviewHero({
  prices,
  jitoStats,
  market,
  agentStatus,
}: Props) {
  const solPrice = prices['SOL'];
  const totalMcap = Object.values(prices).reduce((s, t) => s + t.marketCap, 0);
  const pumpCount = Object.values(prices).filter((t) => t.signal === 'pump').length;
  const dumpCount = Object.values(prices).filter((t) => t.signal === 'dump').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-2">
      {/* SOL Price */}
      <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <Activity size={9} /> SOL
        </div>
        <div className="font-mono font-bold text-sm text-foreground">
          ${solPrice?.price.toFixed(2) ?? '—'}
        </div>
        {solPrice && (
          <div
            className={`font-mono text-[10px] flex items-center gap-0.5 ${
              solPrice.change24h >= 0 ? 'text-chart-1' : 'text-destructive'
            }`}
          >
            {solPrice.change24h >= 0 ? (
              <TrendingUp size={9} />
            ) : (
              <TrendingDown size={9} />
            )}
            {solPrice.change24h >= 0 ? '+' : ''}
            {solPrice.change24h.toFixed(2)}%
          </div>
        )}
      </div>

      {/* Total Market Cap */}
      <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <Globe size={9} /> Market Cap
        </div>
        <div className="font-mono font-bold text-sm text-foreground">
          {fmt(totalMcap)}
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">
          {Object.keys(prices).length} tokens
        </div>
      </div>

      {/* AI Signals */}
      <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <Brain size={9} /> Signals
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-chart-1">
            {pumpCount} 🚀
          </span>
          <span className="font-mono font-bold text-sm text-destructive">
            {dumpCount} 📉
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground">active signals</div>
      </div>

      {/* Fear & Greed Index */}
      <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <Brain size={9} /> F&amp;G Index
        </div>
        <div
          className="font-mono font-bold text-sm"
          style={{ color: market ? fgColor(market.index) : undefined }}
        >
          {market?.index ?? '—'}
        </div>
        <div className="text-[10px] text-muted-foreground capitalize">
          {market?.overall.replace('_', ' ') ?? 'loading'}
        </div>
      </div>

      {/* Jito TPS */}
      <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <Zap size={9} /> Jito TPS
        </div>
        <div className="font-mono font-bold text-sm text-chart-2">
          {jitoStats?.tps.toLocaleString() ?? '—'}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {jitoStats ? `${jitoStats.successRate}% success` : 'loading'}
        </div>
      </div>

      {/* Agent PnL */}
      <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <Activity size={9} /> Agent PnL
        </div>
        <div
          className={`font-mono font-bold text-sm ${
            agentStatus && agentStatus.totalPnL >= 0
              ? 'text-chart-1'
              : 'text-destructive'
          }`}
        >
          {agentStatus
            ? `${agentStatus.totalPnL >= 0 ? '+' : ''}$${agentStatus.totalPnL.toFixed(0)}`
            : '—'}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {agentStatus?.mode ?? 'loading'} mode
        </div>
      </div>
    </div>
  );
}
