export interface AgentAction {
  id: string;
  type: 'swap' | 'stake' | 'unstake' | 'rebalance' | 'harvest' | 'bridge' | 'snipe';
  description: string;
  tokens: string[];
  amount: number;
  profit?: number;
  status: 'scanning' | 'executing' | 'confirmed' | 'failed';
  txHash?: string;
  reason: string;
  timestamp: number;
}

export interface AgentStatus {
  isActive: boolean;
  mode: 'conservative' | 'balanced' | 'aggressive';
  portfolioValue: number;
  totalPnL: number;
  pnlPercent: number;
  actionsToday: number;
  winRate: number;
  currentTask: string;
  nextAction: string;
  riskScore: number;
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
function randomHash() {
  return Array.from({ length: 88 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}
function uid() {
  return `action_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

const ACTION_TEMPLATES: Record<AgentAction['type'], { tokens: string[][]; reasons: string[]; descFn: (t: string[]) => string }> = {
  swap: {
    tokens: [['SOL','USDC'],['JUP','SOL'],['BONK','USDC'],['WIF','SOL'],['PYTH','USDC'],['SOL','JTO']],
    reasons: [
      'Price momentum signal detected — rotating into stronger asset',
      'RSI divergence on 15m chart — tactical swap executed',
      'Rebalancing target allocation drift exceeds 3% threshold',
      'Sentiment shift detected — de-risking meme exposure',
    ],
    descFn: (t) => `Swap ${t[0]} → ${t[1]}`,
  },
  stake: {
    tokens: [['SOL'],['JTO'],['mSOL']],
    reasons: [
      'Liquid staking APY at 7.8% — optimal yield deployment',
      'Idle SOL detected — deploying to maximize yield',
      'Jito validator performance top-quartile — increasing allocation',
    ],
    descFn: (t) => `Stake ${t[0]} for yield`,
  },
  unstake: {
    tokens: [['mSOL'],['JTO'],['SOL']],
    reasons: [
      'Rebalance signal: reducing staked position for liquidity',
      'Opportunity cost analysis favors liquid allocation',
      'Volatility spike — increasing liquid reserves',
    ],
    descFn: (t) => `Unstake ${t[0]}`,
  },
  rebalance: {
    tokens: [['SOL','JUP','USDC'],['SOL','BONK','WIF'],['SOL','PYTH','JTO']],
    reasons: [
      'Portfolio drift >5% from target weights — rebalancing',
      'Correlation matrix updated — optimizing risk-adjusted exposure',
      'Monthly rebalance trigger: realigning to strategy weights',
    ],
    descFn: (t) => `Rebalance ${t.join(' / ')}`,
  },
  harvest: {
    tokens: [['SOL'],['USDC'],['JUP']],
    reasons: [
      'Yield farming rewards accumulated — compounding harvested',
      'Protocol rewards claiming threshold reached',
      'Gas-adjusted harvest: net positive after fees',
    ],
    descFn: (t) => `Harvest ${t[0]} rewards`,
  },
  bridge: {
    tokens: [['USDC','ETH'],['SOL','ETH'],['USDC','ARB']],
    reasons: [
      'Cross-chain yield opportunity identified on target chain',
      'Arbitrage window open across chains — bridging capital',
      'Portfolio diversification: adding cross-chain exposure',
    ],
    descFn: (t) => `Bridge ${t[0]} → ${t[1]}`,
  },
  snipe: {
    tokens: [['BONK'],['WIF'],['MEME'],['NEW_TOKEN']],
    reasons: [
      'New token launch detected — sniping liquidity pool opening',
      'Social volume spike + low market cap — entry signal confirmed',
      'Whale wallet copied — entering same position',
      'MEV opportunity: new pool with favorable initial pricing',
    ],
    descFn: (t) => `Snipe ${t[0]} launch`,
  },
};

const TASKS = [
  'Scanning DEX order books for arbitrage...', 'Monitoring whale wallet movements...',
  'Analyzing price momentum signals...', 'Calculating optimal rebalance targets...',
  'Scanning new token launches...', 'Monitoring funding rates across perp DEXs...',
  'Analyzing on-chain flow data...', 'Checking yield farming opportunities...',
  'Processing MEV bundle opportunities...', 'Evaluating cross-chain yield spreads...',
];

const NEXT_ACTIONS = [
  'Harvest JUP staking rewards in ~2 min', 'Monitor WIF for breakout above $3.50',
  'Rebalance if SOL allocation exceeds 50%', 'Snipe next meme token launch on-chain',
  'Compound USDC yield position at $1k threshold', 'Bridge USDC for Arbitrum yield opportunity',
];

let agentInterval: ReturnType<typeof setInterval> | null = null;
let scanInterval: ReturnType<typeof setInterval> | null = null;

const actionsStore: AgentAction[] = [];
let agentStatus: AgentStatus = {
  isActive: true,
  mode: 'balanced',
  portfolioValue: 24847.32,
  totalPnL: 3284.18,
  pnlPercent: 15.23,
  actionsToday: 0,
  winRate: 73.4,
  currentTask: TASKS[0],
  nextAction: NEXT_ACTIONS[0],
  riskScore: 42,
};

function generateAction(mode: AgentStatus['mode']): AgentAction {
  const types: AgentAction['type'][] = ['swap', 'stake', 'unstake', 'rebalance', 'harvest', 'bridge', 'snipe'];
  const modeWeights: Record<AgentStatus['mode'], number[]> = {
    conservative: [0.25, 0.30, 0.15, 0.20, 0.08, 0.02, 0.00],
    balanced:     [0.30, 0.20, 0.10, 0.18, 0.10, 0.05, 0.07],
    aggressive:   [0.25, 0.10, 0.08, 0.12, 0.08, 0.05, 0.32],
  };
  const weights = modeWeights[mode];
  const rand = Math.random();
  let cum = 0;
  let type: AgentAction['type'] = 'swap';
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i];
    if (rand < cum) { type = types[i]; break; }
  }

  const tmpl = ACTION_TEMPLATES[type];
  const tokenSet = tmpl.tokens[Math.floor(Math.random() * tmpl.tokens.length)];
  const reason = tmpl.reasons[Math.floor(Math.random() * tmpl.reasons.length)];
  const amountMap = { conservative: [50, 500], balanced: [100, 2000], aggressive: [200, 5000] };
  const [minA, maxA] = amountMap[mode];
  const amount = parseFloat((minA + Math.random() * (maxA - minA)).toFixed(2));
  const statusWeights = [0.03, 0.07, 0.82, 0.08];
  const statuses: AgentAction['status'][] = ['scanning', 'executing', 'confirmed', 'failed'];
  let sr = Math.random(); let cumSt = 0; let status: AgentAction['status'] = 'confirmed';
  for (let i = 0; i < statusWeights.length; i++) { cumSt += statusWeights[i]; if (sr < cumSt) { status = statuses[i]; break; } }

  const profit = status === 'confirmed' ? parseFloat(((Math.random() - 0.25) * amount * 0.08).toFixed(2)) : undefined;

  return {
    id: uid(),
    type,
    description: tmpl.descFn(tokenSet),
    tokens: tokenSet,
    amount,
    profit,
    status,
    txHash: status === 'confirmed' || status === 'failed' ? randomHash() : undefined,
    reason,
    timestamp: Date.now(),
  };
}

export function startAgent(
  mode: 'conservative' | 'balanced' | 'aggressive',
  callback: (actions: AgentAction[], status: AgentStatus) => void
): () => void {
  agentStatus.mode = mode;
  agentStatus.isActive = true;

  const intervalMs = mode === 'conservative' ? 12000 : mode === 'balanced' ? 8000 : 5000;
  const variance = mode === 'aggressive' ? 5000 : 8000;

  const fireAction = () => {
    if (!agentStatus.isActive) return;
    const action = generateAction(agentStatus.mode);
    actionsStore.unshift(action);
    if (actionsStore.length > 100) actionsStore.pop();

    if (action.status === 'confirmed') {
      agentStatus.actionsToday++;
      const pnlDelta = action.profit ?? 0;
      agentStatus.portfolioValue = parseFloat((agentStatus.portfolioValue + pnlDelta).toFixed(2));
      agentStatus.totalPnL = parseFloat((agentStatus.totalPnL + pnlDelta).toFixed(2));
      agentStatus.pnlPercent = parseFloat(((agentStatus.totalPnL / (agentStatus.portfolioValue - agentStatus.totalPnL)) * 100).toFixed(2));
      const wins = actionsStore.slice(0, 30).filter(a => (a.profit ?? 0) > 0).length;
      const total = actionsStore.slice(0, 30).filter(a => a.status === 'confirmed').length;
      agentStatus.winRate = total > 0 ? parseFloat(((wins / total) * 100).toFixed(1)) : 73.4;
    }

    agentStatus.currentTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    agentStatus.nextAction = NEXT_ACTIONS[Math.floor(Math.random() * NEXT_ACTIONS.length)];

    callback([...actionsStore], { ...agentStatus });

    const next = intervalMs + Math.random() * variance;
    agentInterval = setTimeout(fireAction, next) as unknown as ReturnType<typeof setInterval>;
  };

  scanInterval = setInterval(() => {
    agentStatus.currentTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    agentStatus.riskScore = Math.max(10, Math.min(90, agentStatus.riskScore + Math.floor((Math.random() - 0.5) * 6)));
    callback([...actionsStore], { ...agentStatus });
  }, 3000);

  // Seed initial history
  for (let i = 0; i < 12; i++) {
    const action = generateAction(mode);
    action.timestamp = Date.now() - (12 - i) * 180000;
    actionsStore.push(action);
    if (action.status === 'confirmed') {
      agentStatus.actionsToday++;
    }
  }

  fireAction();
  callback([...actionsStore], { ...agentStatus });

  return () => {
    agentStatus.isActive = false;
    if (agentInterval) clearTimeout(agentInterval as unknown as ReturnType<typeof setTimeout>);
    if (scanInterval) clearInterval(scanInterval);
  };
}

export function stopAgent(): void {
  agentStatus.isActive = false;
}
