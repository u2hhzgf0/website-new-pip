import WithdrawRequest from '@/components/WithdrawRequest'
import WalletPinGate from '@/components/WalletPinGate'

export default function WithdrawPage() {
  return (
    <WalletPinGate>
      <WithdrawRequest />
    </WalletPinGate>
  )
}
