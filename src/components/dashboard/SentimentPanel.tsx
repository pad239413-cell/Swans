import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { StockgeistSignal, MarketSentiment } from '@/lib/engines/stockgeist';

interface Props {
  signals: StockgeistSignal[];
  market: MarketSentiment;
}

const PRED_CONFIG = {
  strong_buy:  { label: 'STRONG BUY',  cls: 'badge-pump',        dot: 'bg-chart-1' },
  buy:         { label: 'BUY',         cls: 'badge-pump',        dot: 'bg-chart-2' },
  neutral:     { label: 'NEUTRAL',     cls: 'badge-neutral',     dot: 'bg-chart-3' },
  sell:        { label: 'SELL',        cls: 'badge-dump',        dot: 'bg-destructive' },
  strong_sell: { label: 'STRONG SELL', cls: 'badge-dump',        dot: 'bg-destructive' },
};

const SENTIMENT_META: Record<MarketSentiment['overall'], { label: string; color: string }> = {
  extreme_fear:  { label: 'Extreme Fear',  color: 'hsl(0 68% 52%)' },
  fear:          { label: 'Fear',          color: 'hsl(15 80% 52%)' },
  neutral:       { label: 'Neutral',       color: 'hsl(43 90% 50%)' },
  greed:         { label: 'Greed',         color: 'hsl(158 60% 44%)' },
  extreme_greed: { label: 'Extreme Greed', color: 'hsl(168 65% 48%)' },
};

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toFixed(2)}`;
}

function fmtTarget(p: number): string {
  if (p < 0.0001) return `$${p.toFixed(8)}`;
  if (p < 0.01) return `$${p.toFixed(6)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  return `$${p.toFixed(2)}`;
}

function FearGaugeArc({ index }: { index: number }) {
  // Simple half-circle arc gauge via SVG
  const r = 36;
  const cx = 48;
  const cy = 46;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle - (index / 100) * Math.PI;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const largeArc = index > 50 ? 0 : 1;
  const color =
    index < 25 ? 'hsl(0 68% 52%)' :
    index < 45 ? 'hsl(15 80% 52%)' :
    index < 60 ? 'hsl(43 90% 50%)' :
    index < 80 ? 'hsl(158 60% 44%)' :
    'hsl(168 65% 48%)';

  return (
    <svg width="96" height="52" viewBox="0 0 96 52" className="overflow-visible">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="hsl(155 28% 16%)" strokeWidth="6" strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        style={{ transition: 'all 0.8s ease-out' }}
      />
      {/* Needle dot */}
      <circle cx={x} cy={y} r="4" fill={color} style={{ transition: 'all 0.8s ease-out' }} />
    </svg>
  );
}

function RatioBars({ bullish, bearish }: { bullish: number; bearish: number }) {
  const neutral = Math.max(0, 1 - bullish - bearish);
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden w-full gap-px">
      <div className="rounded-l-full transition-all duration-700" style={{ width: `${bullish * 100}%`, background: 'hsl(158 60% 44%)' }} />
      <div className="transition-all duration-700" style={{ width: `${neutral * 100}%`, background: 'hsl(43 90% 50% / 0.6)' }} />
      <div className="rounded-r-full transition-all duration-700" style={{ width: `${bearish * 100}%`, background: 'hsl(0 68% 52%)' }} />
    </div>
  );
}

export default function SentimentPanel({ signals, market }: Props) {
  const meta = SENTIMENT_META[market.overall];

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <Brain size={12} className="text-primary" />
          StockGeist AI
        </span>
        <span className="font-mono text-[10px] text-chart-3">{market.overall.replace('_', ' ')}</span>
      </div>

      {/* Market Overview */}
      <div className="px-3 py-2 border-b border-border/60 flex items-start gap-3">
        {/* Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <FearGaugeArc index={market.index} />
          <span className="font-mono font-bold text-lg -mt-1" style={{ color: meta.color }}>{market.index}</span>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
        </div>

        {/* Stats + Narrative */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-md border border-border/50 bg-secondary/30 px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Solana TVL</div>
              <div className="font-mono font-bold text-sm text-foreground">{fmt(market.solanaTVL)}</div>
            </div>
            <div className="rounded-md border border-border/50 bg-secondary/30 px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">DeFi Vol</div>
              <div className="font-mono font-bold text-sm text-foreground">{fmt(market.defiVolume)}</div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{market.aiNarrative}</p>
        </div>
      </div>

      {/* Signal list */}
      <div className="flex-1 overflow-y-auto panel-body flex flex-col gap-1.5 py-2">
        {signals.map((sig, i) => {
          const pred = PRED_CONFIG[sig.prediction];
          return (
            <div
              key={sig.symbol}
              className="animate-fade-in rounded-lg border border-border/50 bg-secondary/20 px-2.5 py-2 hover:border-primary/25 hover:bg-secondary/40 transition-colors duration-150"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono font-bold text-sm text-foreground">{sig.symbol}</span>
                <span className={`${pred.cls} text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider`}>
                  {pred.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground ml-auto">{fmtTarget(sig.priceTarget)}</span>
                <div className="w-10 h-1 rounded-full bg-border/50 overflow-hidden shrink-0">
                  <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${sig.confidence}%` }} />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{sig.confidence}%</span>
              </div>

              {/* Bull/Bear ratio bar */}
              <RatioBars bullish={sig.bullishRatio} bearish={sig.bearishRatio} />
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-[10px] text-chart-1">▲ {(sig.bullishRatio * 100).toFixed(0)}% bull</span>
                <span className="font-mono text-[10px] text-destructive">{(sig.bearishRatio * 100).toFixed(0)}% bear ▼</span>
              </div>

              {/* Insight */}
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-1">{sig.keyInsight}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
