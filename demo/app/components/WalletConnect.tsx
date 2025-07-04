import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnect() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-200"
      >
        Disconnect
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-white text-[#0052FF] font-medium rounded-lg hover:bg-white/90 transition-all duration-200"
    >
      Connect Wallet
    </button>
  )
} 