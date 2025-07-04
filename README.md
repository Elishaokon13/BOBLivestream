# BUILD ON BASE CHALLENGE - POAP Application

A **Proof of Attendance Protocol (POAP)** application built for the "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS" event. This application allows workshop attendees to mint unique, non-transferable tokens (Soulbound Tokens) as proof of their participation.

![POAP App Screenshot](public/app.png)

## 🎯 Project Overview

This is a decentralized application that enables workshop attendees to claim a unique POAP NFT to commemorate their participation in the BUILD ON BASE CHALLENGE. Each POAP is implemented as a Soulbound Token (SBT), ensuring it's non-transferable and limited to one per wallet address.

### Key Features

- **🎫 One-Click POAP Minting** - Simple interface for claiming workshop attendance tokens
- **🔒 Soulbound Token Implementation** - Non-transferable NFTs ensuring authenticity
- **📱 Farcaster Frame Compatible** - Designed to work seamlessly in Farcaster frames
- **🎉 Interactive UI** - Confetti animations and real-time feedback
- **⚡ Base Network Integration** - Deployed on Base Mainnet for low fees
- **🧪 Test Mode** - Development-friendly testing capabilities

## 🛠 Technical Stack

- **Frontend**: Next.js 15 with TypeScript
- **Blockchain**: Base Mainnet
- **Web3 Integration**: Base Minikit + OnchainKit
- **Wallet Connection**: Wagmi v2 + Viem
- **Styling**: Tailwind CSS
- **Animations**: Canvas Confetti
- **Smart Contract**: ERC721-based Soulbound Token

## 📋 Features Implemented

### Core Functionality
- ✅ **Smart Contract Integration** - Connected to deployed POAP contract
- ✅ **Mint Status Checking** - Verifies if user already claimed POAP
- ✅ **Workshop Data Loading** - Displays real workshop details from contract
- ✅ **Transaction Handling** - Full transaction lifecycle with status updates
- ✅ **Error Handling** - Proper handling for edge cases and failed transactions

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
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xd3F581adEF8b654b7ed08F3aD43fEd0fC359b117
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=KMTx3-re3hSXd1WEqKyJjTVcD96xUZmP
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
- **Address**: `0xd3F581adEF8b654b7ed08F3aD43fEd0fC359b117`
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

### Workshop Metadata
- **Name**: "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS"
- **Start Date**: June 16, 2025
- **End Date**: June 25, 2025
- **Token Standard**: ERC721 (Soulbound)

## 🏗 Project Structure

```
demo/
├── app/
│   ├── components/
│   │   └── DemoComponents.tsx    # Base UI components
│   ├── page.tsx                  # Main POAP application
│   ├── layout.tsx               # App layout
│   ├── providers.tsx            # Web3 providers
│   └── globals.css              # Global styles
├── lib/                         # Utility libraries
├── public/                      # Static assets
├── .env                         # Environment variables
└── package.json                 # Dependencies
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
- Compatible with Farcaster frame standards
- Automatic wallet connection in frame context
- Optimized for mobile frame viewing

### Standalone Deployment
- Can be deployed to Vercel, Netlify, or any static hosting
- Environment variables must be configured
- Requires wallet connection for full functionality

## 🛡 Security Considerations

- **Contract Verification**: Smart contract is deployed and verified on Base
- **One-per-address**: Enforced at contract level to prevent double-claiming
- **Non-transferable**: Soulbound implementation prevents token transfers
- **Input Validation**: All user inputs are properly validated
- **Error Handling**: Graceful handling of network and transaction errors

## 📊 Analytics & Events

The contract emits several events for tracking:
- `POAPMinted(address to, uint256 tokenId)` - Successful mints
- `MintAttempted(address attempter, bool success, string message)` - All mint attempts
- `Transfer(address from, address to, uint256 tokenId)` - Token transfers (blocked for SBT)

## 🤝 Contributing

This project was built for the BUILD ON BASE CHALLENGE workshop. For modifications or improvements:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly on Base testnet first
4. Submit a pull request with detailed description

## 📝 License

This project is built for educational and workshop purposes as part of the BUILD ON BASE CHALLENGE.

## 🙏 Acknowledgments

- **Base Team** - For the amazing Base Minikit and OnchainKit
- **Workshop Organizers** - For the BUILD ON BASE CHALLENGE event
- **Farcaster** - For the frame integration capabilities
- **OpenZeppelin** - For secure smart contract standards

---

**Built with ❤️ on Base** | **Powered by Base Minikit**

For questions or support, please refer to the [Base documentation](https://docs.base.org) or contact the workshop organizers.
