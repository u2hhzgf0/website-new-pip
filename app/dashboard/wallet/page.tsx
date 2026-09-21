import WalletOverviewContent from '@/components/dashboard/WalletOverviewContent'
import WalletPinGate from '@/components/WalletPinGate'

export default function WalletPage() {
  return (
    <WalletPinGate>
      <WalletOverviewContent />
    </WalletPinGate>
  )
}
