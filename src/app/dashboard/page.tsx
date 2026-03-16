"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ApiKeyModal from "../components/ApiKeyModal";
import { getWalletBalance, getRecentTransactions, HeliusBalanceInfo, Transaction as HeliusTransaction } from "../lib/helius";

/* ── Tiny SVG icons ── */
const Icon = {
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Swap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/></svg>
  ),
  Stake: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Chat: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Chart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  ArrowDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
  ),
  Wallet: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/><path d="M18 5v3a2 2 0 0 0 2 2h3"/><rect x="14" y="12" width="4" height="4" rx="1"/></svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Key: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
  ),
  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>
  ),
};

// SVG Token Logos
function LogoSOL() {
  return (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="url(#solana-gradient)"/>
      <path d="M93.94,42.63H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="white"/>
      <path d="M38.58,30.75a1.25,1.25,0,0,1-.88-2.13L51.83,14.49a1.25,1.25,0,0,1,1.77,1.77L39.47,30.38A1.24,1.24,0,0,1,38.58,30.75Z" fill="white"/>
      <path d="M93.94,106.12H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="white"/>
      <path d="M38.58,118a1.24,1.24,0,0,1-.88-.36L23.56,103.5a1.25,1.25,0,0,1,1.77-1.77l14.14,14.14a1.25,1.25,0,0,1-.88,2.13Z" fill="white"/>
      <path d="M93.94,74.38H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="white"/>
      <path d="M38.58,86.25a1.25,1.25,0,0,1-.88-2.13L51.83,70a1.25,1.25,0,0,1,1.77,1.77L39.47,85.89A1.24,1.24,0,0,1,38.58,86.25Z" fill="white"/>
      <defs>
        <linearGradient id="solana-gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9945FF"/>
          <stop offset="1" stopColor="#14F195"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
function LogoUSDC() {
  return (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="#2775CA"/>
      <path d="M64 108C88.3005 108 108 88.3005 108 64C108 39.6995 88.3005 20 64 20C39.6995 20 20 39.6995 20 64C20 88.3005 39.6995 108 64 108Z" fill="white"/>
      <path d="M82.48 55.74C82.48 47.67 76.92 44.97 67.11 44.23V34H61.05V44.12C59.62 44.12 58.17 44.15 56.73 44.19V34H50.67V44.23C49.13 44.26 39.99 44.19 39.99 44.19V50.56C39.99 50.56 44.43 50.49 46.13 50.49C49.02 50.49 49.81 51.79 49.81 53.71V75.17C49.52 76.6 48.46 77.69 46.13 77.69C44.43 77.69 39.99 77.62 39.99 77.62V83.99H50.67V94.32H56.73V84.03C58.19 84.06 59.62 84.06 61.05 84.06V94.32H67.11V83.96C79.59 83.19 87 80.29 87 69.14C87 59.89 81.84 57.56 75.47 56.86C79.34 55.74 82.48 53.23 82.48 55.74ZM61.09 78.2C57.58 78.2 54.1 77.94 50.67 77.43V68.11C52.56 68.44 54.48 68.7 56.41 68.94C60.48 69.4 68.2 69.57 68.2 73.7C68.2 77.09 64.99 78.2 61.09 78.2ZM56.41 63.58C54.55 63.38 52.63 63.09 50.67 62.72V54.03C52.42 54.42 54.21 54.65 56.02 54.82C59.47 55.14 64.23 55.63 64.23 59.13C64.23 62.43 60.55 63.88 56.41 63.58Z" fill="#2775CA"/>
    </svg>
  );
}
function LogoMSOL() {
  return (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="#FBBF24"/>
      <path d="M34 34L62.5 94L94 34" stroke="#065F46" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 94H94" stroke="#065F46" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function LogoJITO() {
  return (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="#059669"/>
      <circle cx="64" cy="64" r="30" stroke="white" strokeWidth="8"/>
      <circle cx="64" cy="64" r="10" fill="white"/>
    </svg>
  );
}

// Generic token logo for unknown tokens
function LogoToken({ symbol }: { symbol: string }) {
  // Create a deterministic color based on the symbol
  const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash) % 360;
    return `hsl(${color}, 70%, 60%)`;
  };

  return (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill={getColor(symbol || 'TOKEN')}/>
      <text x="64" y="76" textAnchor="middle" fill="white" fontWeight="bold" fontSize="40">
        {symbol ? symbol.substring(0, 2).toUpperCase() : 'T'}
      </text>
    </svg>
  );
}

function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

const navItems = [
  { icon: <Icon.Home />, label: "Overview", active: true },
  { icon: <Icon.Swap />, label: "Swap", active: false },
  { icon: <Icon.Stake />, label: "Staking", active: false },
  { icon: <Icon.Chat />, label: "Chat", active: false },
  { icon: <Icon.Chart />, label: "Analytics", active: false },
  { icon: <Icon.Settings />, label: "Settings", active: false },
];

const mockStats = [
  { 
    label: "Portfolio Value", 
    value: "$12,847.32", 
    change: "+4.2%", 
    up: true,
    chart: [38, 42, 35, 30, 45, 43, 47, 42, 39, 41, 48, 42, 44, 46, 43, 45, 48, 45, 43, 47, 46, 42]
  },
  { 
    label: "24h P&L", 
    value: "+$312.18", 
    change: "+2.5%", 
    up: true,
    chart: [30, 28, 32, 36, 32, 34, 35, 38, 35, 40, 42, 40, 38, 42, 45, 43, 42, 40, 44, 46, 47, 48]
  },
  { 
    label: "Active Positions", 
    value: "7", 
    change: "3 protocols", 
    up: true,
    chart: [5, 6, 5, 7, 6, 7, 8, 7, 6, 5, 7, 8, 7, 6, 7, 8, 7, 6, 7, 6, 7, 7]
  },
  { 
    label: "Total Swaps", 
    value: "142", 
    change: "Last: 3m ago", 
    up: true,
    chart: [100, 105, 110, 115, 118, 122, 125, 126, 128, 130, 132, 134, 136, 135, 137, 138, 139, 140, 141, 142, 142, 142]
  },
];

const mockChatMessages = [
  { role: "user" as const, text: "What's my current yield?" },
  { role: "agent" as const, text: "Your blended APY across all positions is 6.8%. Marinade mSOL is your top performer at 7.24%." },
  { role: "user" as const, text: "Swap 0.5 SOL to USDC" },
  { role: "agent" as const, text: "Routed via Jupiter. Swapped 0.5 SOL → 82.65 USDC at 0.04% slippage. Tx confirmed." },
];

const mockStakingPositions = [
  { token: "mSOL", logo: <LogoMSOL />, protocol: "Marinade", apy: "7.24%", staked: "24.5 SOL", fill: 72 },
  { token: "jitoSOL", logo: <LogoJITO />, protocol: "Jito", apy: "7.01%", staked: "12.0 SOL", fill: 45 },
  { token: "bSOL", logo: <LogoJITO />, protocol: "BlazeStake", apy: "6.89%", staked: "8.2 SOL", fill: 30 },
];

const API_KEY_STORAGE_KEY = "swanai_helius_api_key";
const WALLET_ADDRESS_STORAGE_KEY = "swanai_wallet_address";
// Example Solana wallet addresses
const EXAMPLE_ADDRESSES = [
  "dingoBsmEJnGdNPMVziBK3CuPRjptTYVU6DeYs1H7Yv9",
  "DYrNjjZ3SxEGcKFUd1dMouTPfWVWTVJnGAu5GQoxNC9H",
  "2qeDTnfw8NcX7H9a4V9ecJQPJoVo1QYBga3qzZ4twMBJ",
  "ACbUzQq9T4sfjcFFKxwgJfAfrrXgbm4iQDNPCUGmxVAV"
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletData, setWalletData] = useState<HeliusBalanceInfo | null>(null);
  const [transactions, setTransactions] = useState<HeliusTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Load API key and wallet address from localStorage on mount
  useEffect(() => {
    const savedApiKey = typeof window !== 'undefined' ? localStorage.getItem(API_KEY_STORAGE_KEY) : null;
    const savedWalletAddress = typeof window !== 'undefined' ? localStorage.getItem(WALLET_ADDRESS_STORAGE_KEY) : null;
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
    } else {
      // Use a random example address if none is saved
      const randomAddress = EXAMPLE_ADDRESSES[Math.floor(Math.random() * EXAMPLE_ADDRESSES.length)];
      setWalletAddress(randomAddress);
      if (typeof window !== 'undefined') {
        localStorage.setItem(WALLET_ADDRESS_STORAGE_KEY, randomAddress);
      }
    }
  }, []);

  // Check if we need to show the modal on first load
  useEffect(() => {
    const shouldShowModal = !apiKey;
    if (shouldShowModal) {
      setIsModalOpen(true);
    }
  }, [apiKey]);

  const fetchWalletData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Fetch wallet balance and transactions in parallel
      const [balance, txs] = await Promise.all([
        getWalletBalance(walletAddress, apiKey),
        getRecentTransactions(walletAddress, apiKey, 10)
      ]);
      
      if (balance) {
        setWalletData(balance);
      } else {
        setError("Failed to fetch wallet data. Please check your API key and try again.");
      }
      
      setTransactions(txs);
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error("Error fetching wallet data:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data when API key and wallet address are available
  // We need to disable this rule to prevent an infinite loop
  // since fetchWalletData depends on apiKey and walletAddress which are part of the dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (apiKey && walletAddress) {
      fetchWalletData();
    }
  }, [apiKey, walletAddress]);

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
    }
    // Fetch data with the new API key
    if (walletAddress) {
      fetchWalletData();
    }
  };

  const handleChangeWallet = () => {
    const input = prompt("Enter a Solana wallet address to monitor:", walletAddress);
    if (input && input.trim() !== "" && input !== walletAddress) {
      const newWalletAddress = input.trim();
      setWalletAddress(newWalletAddress);
      if (typeof window !== 'undefined') {
        localStorage.setItem(WALLET_ADDRESS_STORAGE_KEY, newWalletAddress);
      }
      // Fetch data for the new wallet
      if (apiKey) {
        fetchWalletData();
      }
    }
  };

  // Helper function to format numbers nicely
  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  // Helper function to format tokens for display
  const formatToken = (amount: number, symbol?: string) => {
    return `${formatNumber(amount)} ${symbol || ''}`;
  };

  return (
    <div className="flex min-h-screen bg-[#f0fdf4]">
      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-green-700/30">
          <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
            <span className="text-gradient-light">Swan</span>
            <span className="text-green-300 font-medium">AI</span>
          </Link>
          <button
            className="lg:hidden text-green-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon.X />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Agent Status */}
        <div className="p-4 border-t border-green-700/30">
          <div className="flex items-center gap-2 text-xs text-green-300">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Agent Active
          </div>
          <div className="mt-1 text-[10px] text-green-500 font-[family-name:var(--font-jetbrains)]">
            v0.1.0-mvp · mainnet-beta
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto bg-green-premium">
        {/* Top Bar */}
        <header className="navbar sticky top-0 z-20 flex items-center justify-between px-4 py-3 lg:px-6">
          <button
            className="lg:hidden text-green-700 hover:text-green-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon.Menu />
          </button>
          <h1 className="text-sm font-semibold text-green-800">Dashboard Overview</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
              title="Set API Key"
            >
              <Icon.Key />
            </button>
            <button
              onClick={fetchWalletData}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
              title="Refresh Data"
              disabled={isLoading || !apiKey}
            >
              <Icon.Refresh />
            </button>
            <button
              onClick={handleChangeWallet}
              className="hidden sm:inline-flex items-center gap-1.5 badge-green px-3 py-1 text-[11px] font-[family-name:var(--font-jetbrains)]"
            >
              <Icon.Wallet />
              {formatAddress(walletAddress)}
            </button>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* API Key warning */}
          {!apiKey && (
            <div className="card-glossy p-4 border-yellow-300 bg-yellow-50/80">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">Helius API Key Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    To view real Solana data, please provide a Helius API key.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <Icon.Key /> Add API Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-green-200 border-t-green-500 animate-spin"></div>
                <p className="mt-4 text-green-700">Loading wallet data...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="card-glossy p-4 border-red-300 bg-red-50/80">
              <div className="flex items-start gap-3">
                <div className="text-red-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={fetchWalletData}
                    className="mt-2 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <Icon.Refresh /> Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SOL Balance */}
            <div className="stat-card p-4">
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-green-600 font-medium uppercase tracking-wider">
                  SOL Balance
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <LogoSOL />
                </div>
              </div>
              <div className="mt-1 text-xl font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                {walletData ? formatNumber(walletData.solBalance) : "—"} SOL
              </div>
              
              {/* Mini chart - mock for now */}
              <div className="stats-chart mt-3">
                {mockStats[0].chart.map((val, i) => (
                  <div 
                    key={i} 
                    className="stats-chart-bar" 
                    style={{ 
                      height: `${val}%`,
                      opacity: 0.5 + i / (2 * mockStats[0].chart.length)
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Token Count */}
            <div className="stat-card p-4">
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-green-600 font-medium uppercase tracking-wider">
                  Token Types
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  {walletData && walletData.tokens.length > 0 ? "Multiple" : "—"}
                </div>
              </div>
              <div className="mt-1 text-xl font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                {walletData ? walletData.tokens.length : "—"} Tokens
              </div>
              
              <div className="stats-chart mt-3">
                {mockStats[1].chart.map((val, i) => (
                  <div 
                    key={i} 
                    className="stats-chart-bar" 
                    style={{ 
                      height: `${val}%`,
                      opacity: 0.5 + i / (2 * mockStats[1].chart.length)
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="stat-card p-4">
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-green-600 font-medium uppercase tracking-wider">
                  Recent Activity
                </div>
                <div className="text-xs text-green-600">
                  {transactions.length > 0 ? "Last 24h" : "—"}
                </div>
              </div>
              <div className="mt-1 text-xl font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                {transactions.length} Transactions
              </div>
              
              <div className="stats-chart mt-3">
                {mockStats[2].chart.map((val, i) => (
                  <div 
                    key={i} 
                    className="stats-chart-bar" 
                    style={{ 
                      height: `${val}%`,
                      opacity: 0.5 + i / (2 * mockStats[2].chart.length)
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Data Freshness */}
            <div className="stat-card p-4">
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-green-600 font-medium uppercase tracking-wider">
                  Data Freshness
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live
                </div>
              </div>
              <div className="mt-1 text-xl font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                Just Updated
              </div>
              
              <div className="stats-chart mt-3">
                {mockStats[3].chart.map((val, i) => (
                  <div 
                    key={i} 
                    className="stats-chart-bar" 
                    style={{ 
                      height: `${val}%`,
                      opacity: 0.5 + i / (2 * mockStats[3].chart.length)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Two-Column Layout ── */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Chat UI */}
            <div className="panel flex flex-col md:col-span-1 lg:col-span-1">
              <div className="panel-header">
                <span className="flex items-center gap-2">
                  <Icon.Chat />
                  Agent Chat
                </span>
              </div>
              <div className="panel-body flex-1 space-y-3 max-h-[400px] overflow-y-auto">
                {mockChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={
                        msg.role === "user" ? "chat-bubble-user" : "chat-bubble-agent"
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-green-200 p-3">
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setChatInput("");
                  }}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask SwanAI..."
                    className="flex-1 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-900 placeholder:text-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="btn-primary !p-0 flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                  >
                    <Icon.Send />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Stack: Token Display + Transactions */}
            <div className="space-y-5 md:col-span-1 lg:col-span-1">
              {/* Tokens Panel */}
              <div className="panel">
                <div className="panel-header">
                  <span className="flex items-center gap-2">
                    <Icon.Wallet />
                    Token Holdings
                  </span>
                  <span className="text-[11px] text-green-600">
                    {walletData ? walletData.tokens.length : 0} tokens
                  </span>
                </div>
                <div className="panel-body">
                  {walletData && walletData.tokens.length > 0 ? (
                    <div className="space-y-3">
                      {/* SOL entry */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-2">
                          <LogoSOL />
                          <div>
                            <div className="font-medium">SOL</div>
                            <div className="text-xs text-green-700">Native Token</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-[family-name:var(--font-jetbrains)] font-medium">
                            {formatNumber(walletData.solBalance)}
                          </div>
                          <div className="text-xs text-green-700">
                            ~${formatNumber(walletData.solBalance * 150)} {/* Mock price */}
                          </div>
                        </div>
                      </div>
                      
                      {/* Other tokens */}
                      {walletData.tokens.slice(0, 5).map((token, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50/50">
                          <div className="flex items-center gap-2">
                            {token.symbol === "USDC" ? <LogoUSDC /> : 
                             token.symbol === "mSOL" ? <LogoMSOL /> :
                             token.symbol === "jitoSOL" ? <LogoJITO /> :
                             <LogoToken symbol={token.symbol || token.mint.substring(0, 4)} />
                            }
                            <div>
                              <div className="font-medium">{token.symbol || formatAddress(token.mint)}</div>
                              <div className="text-xs text-green-700 truncate max-w-[150px]" title={token.mint}>
                                {formatAddress(token.mint)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-[family-name:var(--font-jetbrains)] font-medium">
                              {formatNumber(token.uiAmount)}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Show more button if needed */}
                      {walletData.tokens.length > 5 && (
                        <button className="w-full py-2 text-center text-sm text-green-600 hover:text-green-800">
                          + {walletData.tokens.length - 5} more tokens
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-green-600">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full border-2 border-green-200 border-t-green-500 animate-spin"></div>
                          <p className="mt-2 text-sm">Loading tokens...</p>
                        </div>
                      ) : (
                        <p>No tokens found in this wallet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="panel">
                <div className="panel-header">
                  <span className="flex items-center gap-2">
                    <Icon.Chart />
                    Recent Transactions
                  </span>
                </div>
                <div className="panel-body">
                  {transactions.length > 0 ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {transactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50/50 text-sm">
                          <div>
                            <div className="font-medium text-green-900">
                              {tx.type}
                            </div>
                            <div className="text-xs text-green-700">
                              {new Date(tx.timestamp * 1000).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-[family-name:var(--font-jetbrains)] text-green-900">
                              {formatAddress(tx.signature)}
                            </div>
                            <div className="text-xs text-green-700">
                              Fee: {tx.fee.toFixed(6)} SOL
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-green-600">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full border-2 border-green-200 border-t-green-500 animate-spin"></div>
                          <p className="mt-2 text-sm">Loading transactions...</p>
                        </div>
                      ) : (
                        <p>No recent transactions found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}