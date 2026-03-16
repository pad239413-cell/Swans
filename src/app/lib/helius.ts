// Helius API utility functions

export interface HeliusBalanceInfo {
  lamports: number;
  solBalance: number;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  symbol?: string;
  name?: string;
  logoUrl?: string;
}

export interface Transaction {
  signature: string;
  timestamp: number;
  type: string;
  fee: number;
  amount?: number;
  token?: string;
  status: 'confirmed' | 'failed';
}

/**
 * Fetches balance information for a given wallet address
 */
export async function getWalletBalance(address: string, apiKey: string): Promise<HeliusBalanceInfo | null> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch balance: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      lamports: data.nativeBalance,
      solBalance: data.nativeBalance / 1_000_000_000, // Convert lamports to SOL
      tokens: data.tokens || []
    };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return null;
  }
}

/**
 * Fetches recent transactions for a given wallet address
 */
export async function getRecentTransactions(address: string, apiKey: string, limit = 10): Promise<Transaction[]> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${apiKey}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.map((tx: any) => ({
      signature: tx.signature,
      timestamp: tx.timestamp,
      type: tx.type || 'Unknown',
      fee: tx.fee / 1_000_000_000, // Convert lamports to SOL
      amount: tx.amount,
      token: tx.tokenSymbol,
      status: tx.status || 'confirmed'
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Validates if a Helius API key is valid by making a test request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    // Use a test address to validate the API key
    const testAddress = '11111111111111111111111111111111';
    const response = await fetch(`https://api.helius.xyz/v0/addresses/${testAddress}/balances?api-key=${apiKey}`);
    
    // Return true if the status is 200 (OK) or 404 (Not Found)
    // 404 is acceptable because the address might not exist but the API key is still valid
    return response.status === 200 || response.status === 404;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}