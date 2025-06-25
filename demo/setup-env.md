# Environment Setup for Farcaster Wallet Connection

## Required Environment Variables

To enable proper Farcaster wallet connection, create a `.env.local` file in the `demo/` directory with the following variables:

```bash
# OnchainKit Configuration (Required for Farcaster integration)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS
NEXT_PUBLIC_ICON_URL=/icon.png

# Contract Configuration (Already set in code)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xd3F581adEF8b654b7ed08F3aD43fEd0fC359b117

# Base Network Configuration
NEXT_PUBLIC_CHAIN_ID=8453

# App Configuration for Farcaster Frame
NEXT_PUBLIC_URL=https://your-deployed-app-url.vercel.app
NEXT_PUBLIC_APP_SUBTITLE=Mint your POAP for attending the BUILD ON BASE workshop
NEXT_PUBLIC_APP_DESCRIPTION=Proof of Attendance Protocol for BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS
NEXT_PUBLIC_APP_ICON=/icon.png
NEXT_PUBLIC_APP_SPLASH_IMAGE=/splash.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#0052FF
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=defi
NEXT_PUBLIC_APP_HERO_IMAGE=/hero.png
NEXT_PUBLIC_APP_TAGLINE=Claim Your POAP
NEXT_PUBLIC_APP_OG_TITLE=BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS
NEXT_PUBLIC_APP_OG_DESCRIPTION=Mint your POAP for attending the BUILD ON BASE workshop
NEXT_PUBLIC_APP_OG_IMAGE=/screenshot.png
```

## Getting OnchainKit API Key

1. Visit [OnchainKit Dashboard](https://portal.cdp.coinbase.com/products/onchainkit)
2. Create an account or sign in
3. Create a new project
4. Copy the API key
5. Add it to your `.env.local` file

## Testing Without Environment Variables

The app has been configured with fallback values, so it should work even without environment variables, but for full Farcaster frame functionality, the API key is recommended.

## Troubleshooting Wallet Connection

If users can't access the mint button:

1. **Check Console Logs**: Look for connection status in browser console
2. **Verify Frame Context**: Ensure the app is running in a Farcaster frame
3. **API Key**: Confirm `NEXT_PUBLIC_ONCHAINKIT_API_KEY` is set
4. **Network**: Ensure user is on Base network
5. **Refresh**: Try the "Retry Connection" button

## Development vs Production

- **Development**: App will show connection status and retry options
- **Production**: In Farcaster frames, wallet should connect automatically
- **Testing**: Use the retry connection button if automatic connection fails 