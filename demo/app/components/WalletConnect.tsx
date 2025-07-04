import { useAccount, useConnect } from 'wagmi'

export function WalletConnect() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-green-500">You&apos;re connected!</div>
        <div className="text-sm text-gray-600">Address: {address}</div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
    >
      Connect Wallet
    </button>
  )
} 