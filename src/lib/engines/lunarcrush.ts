export interface SocialMetric {
  symbol: string;
  name: string;
  lunarScore: number;
  socialVolume: number;
  socialEngagement: number;
  sentiment: number;
  trend: 'rising' | 'falling' | 'stable';
  mentions24h: number;
  influencerScore: number;
  galaxyScore: number;
  altRank: number;
  priceCorrelation: number;
}

const BASE_METRICS: Record<string, Omit<SocialMetric, 'trend'>> = {
  SOL:  { symbol: 'SOL',  name: 'Solana',       lunarScore: 87, socialVolume: 142000, socialEngagement: 8_420_000, sentiment: 72,  mentions24h: 48200, influencerScore: 91, galaxyScore: 88, altRank: 3,  priceCorrelation: 0.78 },
  JUP:  { symbol: 'JUP',  name: 'Jupiter',      lunarScore: 74, socialVolume: 38000,  socialEngagement: 1_200_000, sentiment: 65,  mentions24h: 12800, influencerScore: 72, galaxyScore: 71, altRank: 18, priceCorrelation: 0.65 },
  BONK: { symbol: 'BONK', name: 'Bonk',         lunarScore: 82, socialVolume: 95000,  socialEngagement: 5_800_000, sentiment: 58,  mentions24h: 34700, influencerScore: 68, galaxyScore: 79, altRank: 9,  priceCorrelation: 0.71 },
  WIF:  { symbol: 'WIF',  name: 'dogwifhat',    lunarScore: 79, socialVolume: 87000,  socialEngagement: 4_900_000, sentiment: 61,  mentions24h: 28400, influencerScore: 74, galaxyScore: 76, altRank: 12, priceCorrelation: 0.69 },
  JTO:  { symbol: 'JTO',  name: 'Jito',         lunarScore: 68, socialVolume: 21000,  socialEngagement: 680_000,  sentiment: 54,  mentions24h: 7200,  influencerScore: 65, galaxyScore: 64, altRank: 27, priceCorrelation: 0.61 },
  PYTH: { symbol: 'PYTH', name: 'Pyth Network', lunarScore: 71, socialVolume: 26000,  socialEngagement: 820_000,  sentiment: 59,  mentions24h: 9100,  influencerScore: 70, galaxyScore: 68, altRank: 22, priceCorrelation: 0.58 },
};

const current: Record<string, SocialMetric> = Object.fromEntries(
  Object.entries(BASE_METRICS).map(([k, v]) => [k, { ...v, trend: 'stable' as const }])
);

function jitter(val: number, pct: number, min: number, max: number): number {
  const v = val * (1 + (Math.random() - 0.5) * pct);
  return Math.round(Math.max(min, Math.min(max, v)));
}

export function startSocialFeed(callback: (metrics: SocialMetric[]) => void): () => void {
  const tick = () => {
    Object.keys(current).forEach((sym) => {
      const m = current[sym];
      const prevScore = m.lunarScore;
      const newScore = jitter(m.lunarScore, 0.08, 10, 100);
      const trend: SocialMetric['trend'] =
        newScore > prevScore + 1 ? 'rising' : newScore < prevScore - 1 ? 'falling' : 'stable';

      current[sym] = {
        ...m,
        lunarScore: newScore,
        socialVolume: jitter(m.socialVolume, 0.12, 1000, 500000),
        socialEngagement: jitter(m.socialEngagement, 0.1, 10000, 20_000_000),
        sentiment: jitter(m.sentiment, 0.08, -100, 100),
        mentions24h: jitter(m.mentions24h, 0.1, 100, 200000),
        influencerScore: jitter(m.influencerScore, 0.05, 10, 100),
        galaxyScore: jitter(m.galaxyScore, 0.06, 10, 100),
        altRank: Math.max(1, m.altRank + Math.floor((Math.random() - 0.5) * 3)),
        priceCorrelation: parseFloat(Math.max(-1, Math.min(1, m.priceCorrelation + (Math.random() - 0.5) * 0.05)).toFixed(2)),
        trend,
      };
    });

    callback(Object.values(current));
  };

  tick();
  const interval = setInterval(tick, 8000);
  return () => clearInterval(interval);
}
