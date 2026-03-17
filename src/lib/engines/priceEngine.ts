export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  signal: 'pump' | 'dump' | 'neutral' | 'accumulate';
  confidence: number;
  lastUpdated: number;
}

const BASE_PRICES: Record<string, { name: string; price: number; vol: number; mcap: number }> = {
  SOL:  { name: 'Solana',        price: 178.42,    vol: 2_840_000_000, mcap: 82_100_000_000 },
  JUP:  { name: 'Jupiter',       price: 1.24,      vol: 340_000_000,   mcap: 1_620_000_000 },
  BONK: { name: 'Bonk',          price: 0.0000284, vol: 180_000_000,   mcap: 1_980_000_000 },
  WIF:  { name: 'dogwifhat',     price: 3.18,      vol: 520_000_000,   mcap: 3_170_000_000 },
  PYTH: { name: 'Pyth Network',  price: 0.518,     vol: 120_000_000,   mcap: 710_000_000 },
  JTO:  { name: 'Jito',          price: 4.82,      vol: 95_000_000,    mcap: 680_000_000 },
  RNDR: { name: 'Render',        price: 8.74,      vol: 210_000_000,   mcap: 3_580_000_000 },
  MEME: { name: 'Memecoin',      price: 0.0342,    vol: 67_000_000,    mcap: 340_000_000 },
  RAY:  { name: 'Raydium',       price: 2.14,      vol: 85_000_000,    mcap: 560_000_000 },
  MNGO: { name: 'Mango Markets', price: 0.0187,    vol: 12_000_000,    mcap: 87_000_000 },
};

export const TRACKED_TOKENS: Record<string, TokenPrice> = Object.fromEntries(
  Object.entries(BASE_PRICES).map(([sym, d]) => [
    sym,
    {
      symbol: sym,
      name: d.name,
      price: d.price,
      change24h: (Math.random() * 20 - 10),
      volume24h: d.vol,
      marketCap: d.mcap,
      signal: 'neutral' as const,
      confidence: 50,
      lastUpdated: Date.now(),
    },
  ])
);

const history: Record<string, number[]> = Object.fromEntries(
  Object.keys(BASE_PRICES).map((sym) => [
    sym,
    Array.from({ length: 120 }, (_, i) => {
      const base = BASE_PRICES[sym].price;
      return base * (1 + (Math.random() - 0.5) * 0.08 * (i / 120));
    }),
  ])
);

function computeSignal(changes: number[], current: number): { signal: TokenPrice['signal']; confidence: number } {
  const recent = changes.slice(-10);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const momentum = avg / current;

  if (momentum > 0.003) return { signal: 'pump', confidence: Math.min(95, 60 + momentum * 5000) };
  if (momentum < -0.003) return { signal: 'dump', confidence: Math.min(95, 60 + Math.abs(momentum) * 5000) };
  if (Math.abs(momentum) < 0.001 && Math.random() > 0.6) return { signal: 'accumulate', confidence: 45 + Math.random() * 20 };
  return { signal: 'neutral', confidence: 40 + Math.random() * 20 };
}

export function startPriceEngine(callback: (prices: Record<string, TokenPrice>) => void): () => void {
  const deltas: Record<string, number[]> = Object.fromEntries(
    Object.keys(BASE_PRICES).map((s) => [s, []])
  );

  const tick = () => {
    Object.keys(TRACKED_TOKENS).forEach((sym) => {
      const token = TRACKED_TOKENS[sym];
      const volatility =
        sym === 'BONK' || sym === 'MEME' || sym === 'MNGO' ? 0.012
        : sym === 'SOL' ? 0.004
        : sym === 'RAY' ? 0.008
        : 0.007;
      const drift = (Math.random() - 0.498) * volatility;
      const newPrice = token.price * (1 + drift);

      deltas[sym].push(newPrice - token.price);
      if (deltas[sym].length > 20) deltas[sym].shift();

      history[sym].push(newPrice);
      if (history[sym].length > 300) history[sym].shift();

      const change24h = token.change24h + drift * 100 * (Math.random() * 0.1);
      const clamped24h = Math.max(-40, Math.min(40, change24h));

      const { signal, confidence } = computeSignal(deltas[sym], newPrice);

      TRACKED_TOKENS[sym] = {
        ...token,
        price: newPrice,
        change24h: clamped24h,
        volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.02),
        signal,
        confidence: Math.round(confidence),
        lastUpdated: Date.now(),
      };
    });

    callback({ ...TRACKED_TOKENS });
  };

  tick();
  const interval = setInterval(tick, 3000);
  return () => clearInterval(interval);
}

export function getHistoricalData(symbol: string, points: number): number[] {
  const h = history[symbol] ?? [];
  if (h.length >= points) return h.slice(-points);
  const base = BASE_PRICES[symbol]?.price ?? 1;
  const pad = Array.from({ length: points - h.length }, () => base * (1 + (Math.random() - 0.5) * 0.05));
  return [...pad, ...h];
}
