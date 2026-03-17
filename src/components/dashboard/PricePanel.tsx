import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import type { TokenPrice } from '@/lib/engines/priceEngine';
import { getHistoricalData } from '@/lib/engines/priceEngine';

interface Props {
  prices: Record<string, TokenPrice>;
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtPrice(p: number): string {
  if (p < 0.0001) return `$${p.toFixed(8)}`;
  if (p < 0.01) return `$${p.toFixed(6)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Sparkline({ symbol }: { symbol: string }) {
  const pts = getHistoricalData(symbol, 24);
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const w = 72;
  const h = 24;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const isUp = pts[pts.length - 1] >= pts[0];
  const color = isUp ? 'hsl(158 60% 44%)' : 'hsl(0 68% 56%)';
  return (
    <svg width={w} height={h} className="shrink-0 opacity-80">
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SignalBadge({ signal }: { signal: TokenPrice['signal'] }) {
  const cls = {
    pump: 'badge-pump',
    dump: 'badge-dump',
    neutral: 'badge-neutral',
    accumulate: 'badge-accumulate',
  }[signal];
  return (
    <span className={`${cls} text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider`}>
      {signal}
    </span>
  );
}

export default function PricePanel({ prices }: Props) {
  const tokens = Object.values(prices);

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <Activity size={12} className="text-primary" />
          Price Feed
        </span>
        <span className="font-mono text-[10px]">{tokens.length} tokens</span>
      </div>

      <div className="panel-body flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-1.5">
          {tokens.map((token) => {
            const up = token.change24h >= 0;
            return (
              <div
                key={token.symbol}
                className="animate-fade-in rounded-lg border border-border/60 bg-secondary/30 p-2.5 hover:border-primary/30 hover:bg-secondary/50 transition-colors duration-200 cursor-default"
              >
                <div className="flex items-center gap-2">
                  {/* Symbol + Name */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono font-bold text-sm text-foreground">{token.symbol}</span>
                      <SignalBadge signal={token.signal} />
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate block">{token.name}</span>
                  </div>

                  {/* Sparkline */}
                  <Sparkline symbol={token.symbol} />

                  {/* Price data */}
                  <div className="text-right shrink-0">
                    <div className="font-mono font-semibold text-sm text-foreground">{fmtPrice(token.price)}</div>
                    <div className={`font-mono text-[11px] font-medium flex items-center justify-end gap-0.5 ${up ? 'text-chart-1' : 'text-destructive'}`}>
                      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {up ? '+' : ''}{token.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Bottom row: vol + confidence bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Vol {fmt(token.volume24h)}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    MCap {fmt(token.marketCap)}
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 ml-auto justify-end">
                    <span className="text-[10px] text-muted-foreground font-mono">{token.confidence}%</span>
                    <div className="w-14 h-1 rounded-full bg-border/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${token.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
