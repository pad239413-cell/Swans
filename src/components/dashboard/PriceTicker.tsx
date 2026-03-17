import { TrendingUp, TrendingDown } from 'lucide-react';
import type { TokenPrice } from '@/lib/engines/priceEngine';

interface Props {
  prices: Record<string, TokenPrice>;
}

function fmtPrice(p: number): string {
  if (p < 0.001) return `$${p.toFixed(6)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PriceTicker({ prices }: Props) {
  const tokens = Object.values(prices);
  if (tokens.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...tokens, ...tokens];

  return (
    <div className="ticker-wrap h-7 border-b border-border/40 bg-sidebar/40 backdrop-blur-sm">
      <div className="ticker-track h-full items-center gap-0">
        {items.map((token, i) => {
          const up = token.change24h >= 0;
          return (
            <div
              key={`${token.symbol}_${i}`}
              className="flex items-center gap-1.5 px-4 h-full border-r border-border/30 shrink-0"
            >
              <span className="font-mono font-semibold text-[11px] text-foreground/90">
                {token.symbol}
              </span>
              <span className="font-mono text-[11px] text-foreground/70">
                {fmtPrice(token.price)}
              </span>
              <span className={`font-mono text-[10px] flex items-center gap-0.5 ${up ? 'text-chart-1' : 'text-destructive'}`}>
                {up ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                {up ? '+' : ''}{token.change24h.toFixed(2)}%
              </span>
              <span className={`text-[9px] font-mono px-1 py-0.5 rounded uppercase ${
                token.signal === 'pump' ? 'text-chart-1 bg-chart-1/10' :
                token.signal === 'dump' ? 'text-destructive bg-destructive/10' :
                token.signal === 'accumulate' ? 'text-chart-5 bg-chart-5/10' :
                'text-muted-foreground/60'
              }`}>
                {token.signal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
