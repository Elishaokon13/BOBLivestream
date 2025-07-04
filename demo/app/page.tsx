'use client';

import React, { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, usePublicClient } from 'wagmi';
import confetti from 'canvas-confetti';
import { WalletConnect } from './components/WalletConnect';
import { sdk } from '@farcaster/miniapp-sdk';
import Image from 'next/image';

// Type guard for Ethereum address

// Contract address
const CONTRACT_ADDRESS = '0xc90Cf316E1A74Ea9da13E87d95Eda3d9281731a1'.toLowerCase() as `0x${string}`;

if (!/^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)) {
  throw new Error('CONTRACT_ADDRESS must be a valid Ethereum address (0x... format, 42 characters)');
}

// Actual contract ABI from deployed contract
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
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
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "attempter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"name": "MintAttempted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "POAPMinted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWorkshopDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					}
				],
				"internalType": "struct WorkshopPOAP.WorkshopMetadata",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
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
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "workshopDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;

// Base mainnet deployment block - updated for new contract
const DEPLOYMENT_BLOCK = BigInt('7300000'); // Starting from a recent block to ensure we catch all events

export default function Home() {
  const { isFrameReady } = useMiniKit();
  const { address } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);
  const [justMinted, setJustMinted] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  
  // Metrics state
  const [totalMints, setTotalMints] = useState<number>(0);
  const [successRate, setSuccessRate] = useState<number>(0);
  const [recentMints, setRecentMints] = useState<Array<{
    address: string;
    timestamp: number;
  }>>([]);

  // Get public client for fetching events
  const publicClient = usePublicClient();

  // Fetch historical events on component mount
  useEffect(() => {
    const fetchHistoricalEvents = async () => {
      if (!publicClient) return;

      try {
        // Get past POAPMinted events
        const mintEvents = await publicClient.getContractEvents({
          address: CONTRACT_ADDRESS,
          abi: contractABI,
          eventName: 'POAPMinted',
          fromBlock: DEPLOYMENT_BLOCK,
          toBlock: 'latest'
        });

        // Get past MintAttempted events
        const attemptEvents = await publicClient.getContractEvents({
          address: CONTRACT_ADDRESS,
          abi: contractABI,
          eventName: 'MintAttempted',
          fromBlock: DEPLOYMENT_BLOCK,
          toBlock: 'latest'
        });

        // Update metrics
        setTotalMints(mintEvents.length);
        
        const attempts = attemptEvents.length;
        const successes = attemptEvents.filter(event => {
          const args = event.args as { success: boolean };
          return args.success;
        }).length;
        setSuccessRate(attempts > 0 ? (successes / attempts) * 100 : 0);

        // Update recent mints
        const recentMintEvents = mintEvents
          .slice(-5)
          .map(event => {
            const args = event.args as { to: string };
            const address = args.to;
            const timestamp = Date.now();
            return { address, timestamp };
          })
          .reverse();
        
        setRecentMints(recentMintEvents);
      } catch (error) {
        console.error('Error fetching historical events:', error);
      }
    };

    fetchHistoricalEvents();
  }, [publicClient]);

  // Watch for new POAPMinted events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    eventName: 'POAPMinted',
    onLogs: (logs) => {
      setTotalMints(prev => prev + logs.length);
      const newMints = logs.map(log => {
        const args = log.args as { to: string };
        return {
          address: args.to,
          timestamp: Date.now()
        };
      });
      setRecentMints(prev => [...newMints, ...prev].slice(0, 5));
    }
  });

  // Watch for new MintAttempted events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    eventName: 'MintAttempted',
    onLogs: (logs) => {
      const successes = logs.filter(log => {
        const args = log.args as { success: boolean };
        return args.success;
      }).length;
      setSuccessRate(() => {
        const newTotal = totalMints + logs.length;
        const newSuccesses = successes;
        return newTotal > 0 ? (newSuccesses / newTotal) * 100 : 0;
      });
    }
  });

  // Initialize Farcaster SDK
  useEffect(() => {
    try {
      sdk.actions.ready();
      console.log('Farcaster SDK initialized');
    } catch (error) {
      console.error('Failed to initialize Farcaster SDK:', error);
    }
  }, []);

  // Check mint status
  const { data: mintStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    account: address,
  });

  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (mintStatus) {
      setHasMinted(true);
    }
  }, [mintStatus]);

  const handleMint = async () => {
    try {
      if (!address) {
        alert('Please connect your Farcaster wallet first.');
        return;
      }

      setIsMinting(true);
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'mint',
      });

      setJustMinted(true);
      setHasMinted(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#0052FF', '#FF8C00', '#22C55E'],
      });
    } catch (error) {
      console.error('Mint error:', error);
      alert('Failed to mint POAP. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0052FF] text-white">
      {/* Fixed Header */}
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

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Base Challenge POAP</h1>
          <p className="text-xl text-white/60">
            Mint your POAP to commemorate participating in the Base Challenge!
          </p>
        </div>

        {/* Replace img with Image component */}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold">{totalMints}</div>
            <div className="text-sm text-white/60">Total POAPs Minted</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold">{successRate.toFixed(1)}%</div>
            <div className="text-sm text-white/60">Success Rate</div>
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

        {address && (
          <div className="space-y-6">
            {/* Workshop Details Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">Workshop Details</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-white/60">Event</span>
                    <p className="font-medium">Build on Base Challenge</p>
                  </div>
                  <div>
                    <span className="text-sm text-white/60">Start Date</span>
                    <p className="font-medium">June 16, 2025</p>
                  </div>
                  <div>
                    <span className="text-sm text-white/60">End Date</span>
                    <p className="font-medium">June 25, 2025</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  <img
                    src="/icon.png"
                    alt="Workshop Logo"
                    className="w-32 h-32 object-contain opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>

            {/* Mint Section */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8">
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Claim Your POAP</h2>
                  <p className="text-white/60 mt-2">
                    Proof of Attendance Protocol - One per address, non-transferable
                  </p>
                </div>

                {hasMinted || justMinted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium text-lg">
                        {justMinted ? '🎉 POAP Minted Successfully!' : 'You already claimed your POAP!'}
                      </span>
                    </div>
                    {justMinted && (
                      <p className="mt-3 text-emerald-400 text-sm animate-pulse">
                        Your unique POAP is now in your wallet! 🚀
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleMint}
                      disabled={!isFrameReady || !address || isMinting}
                      className={`
                        w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-lg
                        transition-all duration-300 transform hover:-translate-y-0.5
                        ${isMinting ? 'bg-white/10 cursor-not-allowed' : 'bg-white text-[#0052FF] hover:bg-white/90'}
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0
                      `}
                    >
                      {isMinting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Minting...</span>
                        </div>
                      ) : !isFrameReady ? (
                        'Connecting...'
                      ) : (
                        '🎉 Claim Your POAP'
                      )}
                    </button>

                    {!isFrameReady && (
                      <p className="text-sm text-white/60">
                        Please wait for wallet connection
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Initial Connect State */}
        {!address && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">
              Connect your wallet to mint your exclusive POAP from the BUILD ON BASE workshop
            </p>
            <WalletConnect />
          </div>
        )}
      </div>
    </main>
  );
}