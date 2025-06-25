'use client';

import React, { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import confetti from 'canvas-confetti';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

if (!CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is not defined');
}

// Actual contract ABI from deployed contract
const contractABI = [
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
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
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

interface WorkshopDetails {
  0: string; // name
  1: bigint; // startDate
  2: bigint; // endDate
  name: string;
  startDate: bigint;
  endDate: bigint;
}

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { address, isConnected } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);
  const [justMinted, setJustMinted] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);
  
  // Debug logging
  console.log('Debug - isConnected:', isConnected, 'address:', address, 'isFrameReady:', isFrameReady, 'testMode:', testMode);

  const { data: mintStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: { enabled: isFrameReady && !!address },
  });

  const { data: workshopDetails } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getWorkshopDetails',
  }) as { data: WorkshopDetails | undefined };

  const { writeContract: mint, isPending: isMinting, isSuccess: mintSuccess, error: mintError } = useWriteContract();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (mintStatus !== undefined) {
      setHasMinted(Boolean(mintStatus));
    }
  }, [mintStatus]);

  // Handle mint errors
  useEffect(() => {
    if (mintError) {
      console.error('Mint error:', mintError);
      
      if (mintError.message?.includes('already minted') || mintError.message?.includes('has already been minted')) {
        alert('You have already minted your POAP for this workshop!');
        setHasMinted(true);
      } else if (mintError.message?.includes('insufficient funds')) {
        alert('Insufficient funds for gas fees. Please ensure you have ETH on Base network.');
      } else if (mintError.message?.includes('User rejected')) {
        console.log('Transaction rejected by user');
      } else {
        alert(`Transaction failed: ${mintError.message || 'Unknown error'}`);
      }
    }
  }, [mintError]);

  // Trigger confetti when mint is successful
  useEffect(() => {
    if (mintSuccess && !justMinted) {
      setJustMinted(true);
      
      // Create a burst of confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#0052FF', '#00D4FF', '#FFFFFF', '#FFD700', '#FF6B6B'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Big burst in the center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setJustMinted(false);
      }, 5000);
    }
  }, [mintSuccess, justMinted]);

  const handleMint = async () => {
    try {
      if (testMode && !address) {
        // In test mode without real wallet, show a demo message
        alert('🧪 Test Mode: In a real Farcaster frame, this would mint your POAP! The transaction would be signed automatically.');
        setJustMinted(true);
        setTimeout(() => setJustMinted(false), 5000);
        return;
      }
      
      // Check if already minted before attempting transaction
      if (hasMinted) {
        alert('You have already minted your POAP for this workshop!');
        return;
      }
      
      if (!address) {
        alert('Please connect your wallet first.');
        return;
      }
      
      console.log('Attempting to mint POAP...', { 
        address, 
        CONTRACT_ADDRESS,
        hasMinted,
        isFrameReady,
        isConnected 
      });
      
      await mint({
        address: CONTRACT_ADDRESS!,
        abi: contractABI,
        functionName: 'mint',
      });
    } catch (error) {
      console.error('Error in handleMint:', error);
      // Error handling is now in useEffect for mintError
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#0052FF]">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            BUILD ON BASE CHALLENGE
          </h1>
          <h2 className="text-xl text-white/90">
            BORDERLESS WORKSHOPS
          </h2>
        </div>

        {/* Workshop Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Workshop Details</h3>
          {workshopDetails ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Event:</span>
                <span className="text-gray-800">{workshopDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Start Date:</span>
                <span className="text-gray-800">
                  {new Date(Number(workshopDetails.startDate) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">End Date:</span>
                <span className="text-gray-800">
                  {new Date(Number(workshopDetails.endDate) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Event:</span>
                <span className="text-gray-800">BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Start Date:</span>
                <span className="text-gray-800">June 16, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">End Date:</span>
                <span className="text-gray-800">June 25, 2025</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Loading contract data...
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Claim Your POAP
              </h3>
              <p className="text-gray-600">
                Proof of Attendance Protocol - One per address, non-transferable
              </p>
            </div>

            {!testMode && (!isFrameReady || !address) ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800">
                      {!isFrameReady ? 'Initializing frame...' : 'Connecting to your Farcaster wallet...'}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p>💡 <strong>For testing:</strong> This app is designed to work in Farcaster frames.</p>
                    <p>In a real Farcaster frame, your wallet will connect automatically.</p>
                  </div>
                  <button
                    onClick={() => {
                      setTestMode(true);
                      setFrameReady();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    🧪 Enable Test Mode
                  </button>
                </div>
              </div>
            ) : (testMode || address) && (hasMinted || justMinted) ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-green-800 font-medium">
                    {justMinted ? '🎉 POAP Minted Successfully! 🎉' : 'You have already claimed your POAP!'}
                  </span>
                </div>
                {justMinted && (
                  <div className="mt-3 text-center">
                    <p className="text-green-700 text-sm animate-pulse">
                      Congratulations! Your POAP is now in your wallet! 🚀
                    </p>
                  </div>
                )}
              </div>
            ) : (testMode || address) ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <div>{testMode ? 'Test Mode Active' : 'Connected via Farcaster'}</div>
                  <div className="font-mono">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Test Address: 0x1234...5678'}
                  </div>
                  {testMode && (
                    <div className="text-xs text-orange-600 mt-1">
                      ⚠️ This is test mode. In a real Farcaster frame, transactions would work normally.
                    </div>
                  )}
                </div>
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isMinting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-[#0052FF] hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isMinting ? 'Minting POAP...' : '🎉 Mint POAP'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-center text-gray-600">
                  <p>Please connect your wallet to continue.</p>
                </div>
              </div>
            )}

            {isMinting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800">Transaction pending...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/70 text-sm">
          Powered by Base Minikit
        </div>
      </div>
    </main>
  );
}