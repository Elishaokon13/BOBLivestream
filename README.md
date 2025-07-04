# BUILD ON BASE CHALLENGE - POAP Application

A **Proof of Attendance Protocol (POAP)** application built for the "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS" event. This application allows workshop attendees to mint unique, non-transferable tokens (Soulbound Tokens) as proof of their participation.

![POAP App Screenshot](/demo/public/app.png)

## 🎯 Project Overview

This is a decentralized application that enables workshop attendees to claim a unique POAP NFT to commemorate their participation in the BUILD ON BASE CHALLENGE. Each POAP is implemented as a Soulbound Token (SBT), ensuring it's non-transferable and limited to one per wallet address.

### Key Features

- **🎫 One-Click POAP Minting** - Simple interface for claiming workshop attendance tokens
- **🔒 Soulbound Token Implementation** - Non-transferable NFTs ensuring authenticity
- **📱 Farcaster Frame Integration** - Full Farcaster frame support with splash screen and loading states
- **🎉 Interactive UI** - Confetti animations and real-time feedback
- **⚡ Base Network Integration** - Deployed on Base Mainnet for low fees
- **🧪 Test Mode** - Development-friendly testing capabilities

## 🛠 Technical Stack

- **Frontend**: Next.js 15 with TypeScript
- **Blockchain**: Base Mainnet
- **Web3 Integration**: Farcaster MiniApp SDK + Wagmi Connector
- **Wallet Connection**: Wagmi v2 + Viem
- **Styling**: Tailwind CSS + Magic UI Components
- **Animations**: Canvas Confetti
- **Smart Contract**: ERC721-based Soulbound Token

## 📋 Features Implemented

### Core Functionality
- ✅ **Smart Contract Integration** - Connected to deployed POAP contract
- ✅ **Mint Status Checking** - Verifies if user already claimed POAP
- ✅ **Workshop Data Loading** - Displays real workshop details from contract
- ✅ **Transaction Handling** - Full transaction lifecycle with status updates
- ✅ **Error Handling** - Proper handling for edge cases and failed transactions

### Farcaster Frame Integration
- ✅ **Splash Screen** - Custom loading screen while app initializes
- ✅ **MiniApp SDK** - Full integration with @farcaster/miniapp-sdk
- ✅ **Wallet Connection** - Seamless wallet connection via Farcaster
- ✅ **Loading States** - Proper loading indicators and state management
- ✅ **Error Recovery** - Graceful error handling in frame context

### User Experience
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Real-time Feedback** - Loading states and transaction progress
- ✅ **Success Animations** - Confetti celebration on successful mint
- ✅ **Base Branding** - Official Base blue color scheme (#0052FF)
- ✅ **Test Mode** - Fallback for development and demonstration

### Security & Constraints
- ✅ **One-per-address Limitation** - Contract enforces single POAP per wallet
- ✅ **Non-transferable Tokens** - Soulbound implementation prevents transfers
- ✅ **Input Validation** - Proper error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MetaMask or compatible wallet
- Access to Base Mainnet

### Installation

1. **Clone and Install**
   ```bash
   cd demo
   npm install
   ```

2. **Environment Setup**
   ```bash
   # .env file is already configured with:
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xc90Cf316E1A74Ea9da13E87D95Eda3d9281731a1
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-api-key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   ```
   http://localhost:3000
   ```

## 📄 Smart Contract Details

### Contract Information
- **Address**: `0xc90Cf316E1A74Ea9da13E87d95Eda3d9281731a1`
- **Network**: Base Mainnet
- **Type**: ERC721-based Soulbound Token
- **Standard**: OpenZeppelin v5

### Key Contract Functions
```solidity
// Mint a POAP (one per address)
function mint() external

// Check if address already minted
function hasMinted(address) external view returns (bool)

// Get workshop details
function getWorkshopDetails() external view returns (WorkshopMetadata)

// Standard ERC721 functions
function balanceOf(address) external view returns (uint256)
function name() external view returns (string)
```


## 🏗 Project Structure

```
demo/
├── app/
│   ├── api/
│   │   ├── notify/           # Notification endpoints
│   │   └── webhook/          # Webhook handlers
│   ├── components/
│   │   ├── DemoComponents.tsx # Base UI components
│   │   └── WalletConnect.tsx  # Wallet connection component
│   ├── page.tsx              # Main POAP application
│   ├── layout.tsx            # App layout
│   ├── providers.tsx         # Web3 providers
│   └── globals.css           # Global styles
├── lib/
│   ├── notification-client.ts # Notification handling
│   ├── notification.ts       # Notification types
│   ├── redis.ts             # Redis client
│   └── wagmi.ts             # Wagmi configuration
├── public/                   # Static assets
├── .env                      # Environment variables
└── package.json             # Dependencies
```

## 🎮 How to Use

### For Workshop Attendees

1. **Visit the Application** - Open the POAP minting interface
2. **Connect Wallet** - Wallet connects automatically in Farcaster frames
3. **Check Eligibility** - App verifies if you haven't minted already
4. **Mint POAP** - Click "🎉 Mint POAP" to claim your token
5. **Celebrate** - Enjoy the confetti animation and confirmation!

### For Developers/Testing

1. **Test Mode** - Click "🧪 Enable Test Mode" for local testing
2. **Check Contract Data** - Verify workshop details load correctly
3. **Test Minting Flow** - Use test mode to simulate minting process
4. **Debug Console** - Check browser console for detailed logs

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌐 Deployment

The application is designed for deployment as a Farcaster frame but can also be accessed as a standalone web application.

### Frame Integration
- Full Farcaster MiniApp SDK integration
- Custom splash screen and loading states
- Automatic wallet connection in frame context
- Optimized for mobile frame viewing

### Standalone Deployment
- Can be deployed to Vercel, Netlify, or any static hosting
- Environment variables must be configured
- Requires wallet connection for full functionality

## 📊 Analytics & Events

The contract emits several events for tracking:
- `POAPMinted(address to, uint256 tokenId)` - Successful mints
- `MintAttempted(address attempter, bool success, string message)` - All mint attempts
- `Transfer(address from, address to, uint256 tokenId)` - Token transfers (blocked for SBT)

## 📝 License

This project is built for educational and workshop purposes as part of the BUILD ON BASE CHALLENGE.

## 🙏 Acknowledgments

- **Base Team** - For the amazing Base ecosystem and tools
- **Workshop Organizers** - For the BUILD ON BASE CHALLENGE event
- **Farcaster** - For the MiniApp SDK and frame capabilities
- **OpenZeppelin** - For secure smart contract standards

---

**Built with ❤️ with Minikit**
