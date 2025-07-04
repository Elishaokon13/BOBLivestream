'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import confetti from 'canvas-confetti';
import { WalletConnect } from './components/WalletConnect';
import Image from 'next/image';

// Contract address
const CONTRACT_ADDRESS = '0xc90Cf316E1A74Ea9da13E87d95Eda3d9281731a1'.toLowerCase() as `0x${string}`;

// Contract ABI (simplified to just what we need)
const contractABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasMinted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Basescan API endpoint
const BASESCAN_API = 'https://api.basescan.org/api';
const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || '';

// Types for Basescan API response
interface BasescanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  // Add other fields as needed
}

interface BasescanResponse {
  status: string;
  message: string;
  result: BasescanTransaction[];
}

export default function Home() {
  const { address } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);
  const [justMinted, setJustMinted] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  
  // Metrics state
  const [totalMints, setTotalMints] = useState<number>(0);
  const [recentMints, setRecentMints] = useState<Array<{
    address: string;
    timestamp: number;
  }>>([]);

  // Fetch contract transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Fetch normal transactions to the contract
        const response = await fetch(
          `${BASESCAN_API}?module=account&action=txlist&address=${CONTRACT_ADDRESS}&startblock=0&endblock=99999999&sort=desc&apikey=${BASESCAN_API_KEY}`
        );
        
        const data = await response.json() as BasescanResponse;
        
        if (data.status === '1' && data.result) {
          // Filter successful mint transactions (method ID for mint function)
          const mintTxs = data.result.filter((tx: BasescanTransaction) => 
            tx.isError === '0' && // successful transactions
            tx.input.startsWith('0x1249c58b') && // mint function signature
            tx.txreceipt_status === '1' // confirmed transactions
          );

          // Update total mints
          setTotalMints(mintTxs.length);

          // Update recent mints
          const recent = mintTxs
            .slice(0, 5)
            .map((tx: BasescanTransaction) => ({
              address: tx.from,
              timestamp: parseInt(tx.timeStamp) * 1000 // Convert to milliseconds
            }));
          
          setRecentMints(recent);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    // Fetch initial data
    fetchTransactions();

    // Set up polling for updates every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);

    return () => clearInterval(interval);
  }, []);

  // Check if user has already minted
  const { data: hasMintedData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'hasMinted',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Update hasMinted state when data changes
  useEffect(() => {
    if (hasMintedData !== undefined) {
      setHasMinted(!!hasMintedData);
    }
  }, [hasMintedData]);

  // Handle minting
  const { writeContract } = useWriteContract();

  const handleMint = async () => {
    if (!address) return;
    
    try {
      setIsMinting(true);
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'mint',
      });
      setJustMinted(true);
      confetti();
    } catch (error) {
      console.error('Error minting:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0052FF] text-white">
      <header className="fixed top-0 left-0 right-0 bg-[#0052FF]/80 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-medium">Base Challenge</span>
          </div>
          <WalletConnect />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Base Challenge POAP</h1>
          <p className="text-xl text-white/60">
            Mint your POAP to commemorate participating in the Build on Base Challenge by Borderless Workshops!
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
          <Image
            src="/hero.png"
            alt="Hero image"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold">{totalMints}</div>
            <div className="text-sm text-white/60">Total POAPs Minted</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4">
            <div className="text-sm font-medium mb-2">Recent Mints</div>
            <div className="space-y-1">
              {recentMints.map((mint, i) => (
                <div key={i} className="text-xs text-white/60 flex justify-between">
                  <span>{mint.address.slice(0, 6)}...{mint.address.slice(-4)}</span>
                  <span>{new Date(mint.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              {recentMints.length === 0 && (
                <div className="text-xs text-white/40 text-center">No recent mints</div>
              )}
            </div>
          </div>
        </div>

        {/* Mint Section */}
        <div className="text-center">
          {!address ? (
            <p className="text-white/60 mb-4">Connect your wallet to mint</p>
          ) : hasMinted ? (
            <div className="bg-white/10 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">🎉 You&apos;ve already minted!</h3>
              <p className="text-white/60">Thank you for participating in the Base Challenge</p>
            </div>
          ) : justMinted ? (
            <div className="bg-white/10 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold mb-2">🎉 Mint successful!</h3>
              <p className="text-white/60">Your POAP has been minted to your wallet</p>
            </div>
          ) : (
            <button
              onClick={handleMint}
              disabled={isMinting || !address}
              className={`w-full max-w-sm mx-auto px-8 py-4 rounded-xl font-medium transition
                ${isMinting 
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-white hover:bg-white/90 text-[#0052FF] hover:scale-105'
                }`}
            >
              {isMinting ? 'Minting...' : 'Mint POAP'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}