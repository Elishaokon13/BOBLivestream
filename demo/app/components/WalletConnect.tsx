import { useAccount, useConnect } from 'wagmi'

export function WalletConnect() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm text-gray-600">Connected Wallet</div>
        <div className="font-mono text-sm">{address}</div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Connect Wallet
    </button>
  )
} 