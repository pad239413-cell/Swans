export interface MEVBundle {
  id: string;
  type: 'arbitrage' | 'sandwich' | 'liquidation' | 'frontrun';
  tokens: string[];
  profit: number;
  gasUsed: number;
  jitoTip: number;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  txHash: string;
  timestamp: number;
  slot: number;
  blockTime: number;
}

export interface JitoStats {
  bundlesSubmitted: number;
  bundlesLanded: number;
  totalProfitSOL: number;
  avgTipSOL: number;
  successRate: number;
  currentSlot: number;
  tps: number;
}

const TOKEN_PAIRS = [
  ['SOL', 'USDC'], ['JUP', 'SOL'], ['BONK', 'USDC'], ['WIF', 'SOL'],
  ['PYTH', 'USDC'], ['JTO', 'SOL'], ['SOL', 'mSOL'], ['USDC', 'USDT'],
  ['BONK', 'WIF'], ['JUP', 'USDC'],
];

let bundleIdCounter = 1000;
let slotCounter = 285_412_000 + Math.floor(Math.random() * 10000);

function randomTxHash(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  return Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateBundle(): MEVBundle {
  const types: MEVBundle['type'][] = ['arbitrage', 'sandwich', 'liquidation', 'frontrun'];
  const weights = [0.45, 0.30, 0.15, 0.10];
  const rand = Math.random();
  let cumulative = 0;
  let type: MEVBundle['type'] = 'arbitrage';
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) { type = types[i]; break; }
  }

  const pair = TOKEN_PAIRS[Math.floor(Math.random() * TOKEN_PAIRS.length)];
  const profitMap = { arbitrage: [0.02, 0.35], sandwich: [0.005, 0.12], liquidation: [0.1, 2.5], frontrun: [0.008, 0.08] };
  const [minP, maxP] = profitMap[type];
  const profit = minP + Math.random() * (maxP - minP);
  const jitoTip = profit * (0.05 + Math.random() * 0.15);
  const statuses: MEVBundle['status'][] = ['pending', 'submitted', 'confirmed', 'failed'];
  const statusWeights = [0.05, 0.1, 0.78, 0.07];
  let statusRand = Math.random();
  let cumS = 0;
  let status: MEVBundle['status'] = 'confirmed';
  for (let i = 0; i < statusWeights.length; i++) {
    cumS += statusWeights[i];
    if (statusRand < cumS) { status = statuses[i]; break; }
  }

  slotCounter += Math.floor(Math.random() * 3) + 1;

  return {
    id: `bundle_${++bundleIdCounter}`,
    type,
    tokens: pair,
    profit: parseFloat(profit.toFixed(4)),
    gasUsed: Math.floor(5000 + Math.random() * 45000),
    jitoTip: parseFloat(jitoTip.toFixed(5)),
    status,
    txHash: randomTxHash(),
    timestamp: Date.now(),
    slot: slotCounter,
    blockTime: 400 + Math.floor(Math.random() * 200),
  };
}

let jitoStats: JitoStats = {
  bundlesSubmitted: 1847,
  bundlesLanded: 1612,
  totalProfitSOL: 284.73,
  avgTipSOL: 0.0023,
  successRate: 87.3,
  currentSlot: slotCounter,
  tps: 3420,
};

export function startMEVEngine(callback: (bundles: MEVBundle[], stats: JitoStats) => void): () => void {
  const bundles: MEVBundle[] = Array.from({ length: 8 }, () => generateBundle());

  const bundleInterval = setInterval(() => {
    const newBundle = generateBundle();
    bundles.unshift(newBundle);
    if (bundles.length > 50) bundles.pop();

    if (newBundle.status === 'confirmed') {
      jitoStats.bundlesLanded++;
      jitoStats.totalProfitSOL = parseFloat((jitoStats.totalProfitSOL + newBundle.profit).toFixed(4));
    }
    jitoStats.bundlesSubmitted++;
    jitoStats.successRate = parseFloat(((jitoStats.bundlesLanded / jitoStats.bundlesSubmitted) * 100).toFixed(1));

    callback([...bundles], { ...jitoStats });
  }, 4000 + Math.random() * 4000);

  const statsInterval = setInterval(() => {
    slotCounter += Math.floor(Math.random() * 2) + 1;
    jitoStats = {
      ...jitoStats,
      currentSlot: slotCounter,
      tps: Math.floor(3200 + Math.random() * 800),
      avgTipSOL: parseFloat((0.0018 + Math.random() * 0.001).toFixed(5)),
    };
    callback([...bundles], { ...jitoStats });
  }, 2000);

  callback([...bundles], { ...jitoStats });

  return () => {
    clearInterval(bundleInterval);
    clearInterval(statsInterval);
  };
}
