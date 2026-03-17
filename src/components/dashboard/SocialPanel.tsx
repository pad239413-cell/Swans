import { TrendingUp, TrendingDown, Minus, Globe } from 'lucide-react';
import type { SocialMetric } from '@/lib/engines/lunarcrush';

interface Props {
  metrics: SocialMetric[];
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-10 h-1 rounded-full bg-border/50 overflow-hidden shrink-0">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px] text-foreground/80">{value}</span>
    </div>
  );
}

function SentimentBar({ value }: { value: number }) {
  // value is 0–100; middle = neutral
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped >= 65 ? 'hsl(158 60% 44%)' :
    clamped >= 45 ? 'hsl(43 90% 50%)' :
    'hsl(0 68% 52%)';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 rounded-full bg-border/50 overflow-hidden shrink-0">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${clamped}%`, background: color }} />
      </div>
      <span className="font-mono text-[11px]" style={{ color }}>{clamped}</span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: SocialMetric['trend'] }) {
  if (trend === 'rising') return <TrendingUp size={12} className="text-chart-1" />;
  if (trend === 'falling') return <TrendingDown size={12} className="text-destructive" />;
  return <Minus size={12} className="text-muted-foreground" />;
}

function GalaxyBadge({ score }: { score: number }) {
  const cls =
    score >= 75 ? 'badge-pump' :
    score >= 50 ? 'badge-neutral' :
    'badge-dump';
  return (
    <span className={`${cls} text-[10px] font-mono px-1.5 py-0.5 rounded uppercase`}>
      {score}
    </span>
  );
}

export default function SocialPanel({ metrics }: Props) {
  const sorted = [...metrics].sort((a, b) => b.galaxyScore - a.galaxyScore);

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <Globe size={12} className="text-primary" />
          LunarCrush Social
        </span>
        <span className="font-mono text-[10px]">{metrics.length} tokens</span>
      </div>

      {/* Column headers */}
      <div className="px-3 py-1.5 border-b border-border/40 grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center">
        {['Token', 'Galaxy', 'AltRank', 'Social Vol', 'Sentiment', 'Trend'].map((h) => (
          <span key={h} className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
            {h}
          </span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto panel-body flex flex-col gap-0 py-1">
        {sorted.map((m, i) => (
          <div
            key={m.symbol}
            className="animate-fade-in grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center px-1 py-2 rounded-md hover:bg-secondary/30 transition-colors duration-150 border border-transparent hover:border-border/40"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Token */}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-xs text-foreground">{m.symbol}</span>
              </div>
              <span className="text-[10px] text-muted-foreground block truncate">{fmtK(m.mentions24h)} mentions</span>
            </div>

            {/* Galaxy Score */}
            <GalaxyBadge score={m.galaxyScore} />

            {/* AltRank */}
            <span className="font-mono text-[11px] text-foreground/70 text-center">#{m.altRank}</span>

            {/* Social Volume */}
            <div className="flex items-center gap-1 min-w-[64px]">
              <ScoreBar value={Math.round((m.socialVolume / 500000) * 100)} max={100} color="hsl(168 65% 48%)" />
              <span className="text-[10px] text-muted-foreground font-mono">{fmtK(m.socialVolume)}</span>
            </div>

            {/* Sentiment */}
            <SentimentBar value={m.sentiment} />

            {/* Trend */}
            <div className="flex items-center justify-center">
              <TrendIcon trend={m.trend} />
            </div>
          </div>
        ))}

        {metrics.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-xs">
            Awaiting social data…
          </div>
        )}
      </div>
    </div>
  );
}
