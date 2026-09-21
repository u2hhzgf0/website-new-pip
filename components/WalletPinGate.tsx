'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Lock, ShieldCheck, Loader2, AlertCircle, KeyRound } from 'lucide-react'
import PinInput from '@/components/PinInput'
import {
  useGetWalletPinStatusQuery,
  useSetupWalletPinMutation,
  useVerifyWalletPinMutation,
  useForgotWalletPinMutation,
  useResetWalletPinMutation,
} from '@/store/api/walletPinApi'

type Step = 'setup' | 'enter' | 'forgot-request' | 'forgot-reset'

export default function WalletPinGate({ children }: { children: React.ReactNode }) {
  const { data: statusResponse, isLoading: statusLoading } = useGetWalletPinStatusQuery()
  const [setupWalletPin, { isLoading: settingUp }] = useSetupWalletPinMutation()
  const [verifyWalletPin, { isLoading: verifying }] = useVerifyWalletPinMutation()
  const [forgotWalletPin, { isLoading: sendingCode }] = useForgotWalletPinMutation()
  const [resetWalletPin, { isLoading: resetting }] = useResetWalletPinMutation()

  const isPinSet = statusResponse?.data?.attributes?.isPinSet

  const [unlocked, setUnlocked] = useState(false)
  const [step, setStep] = useState<Step | null>(null)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmNewPin, setConfirmNewPin] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [attemptKey, setAttemptKey] = useState(0)
  const submittingRef = useRef(false)

  const activeStep: Step = step || (isPinSet ? 'enter' : 'setup')

  const clearInputs = () => {
    setPin('')
    setConfirmPin('')
    setResetCode('')
    setNewPin('')
    setConfirmNewPin('')
    setAttemptKey((k) => k + 1)
  }

  const submitSetup = async () => {
    if (submittingRef.current) return
    setError('')

    if (pin !== confirmPin) {
      setError('PINs do not match')
      clearInputs()
      return
    }

    submittingRef.current = true
    try {
      await setupWalletPin({ pin, confirmPin }).unwrap()
      setUnlocked(true)
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create PIN. Please try again.')
      clearInputs()
    } finally {
      submittingRef.current = false
    }
  }

  const submitVerify = async () => {
    if (submittingRef.current) return
    setError('')

    submittingRef.current = true
    try {
      await verifyWalletPin({ pin }).unwrap()
      setUnlocked(true)
    } catch (err: any) {
      setError(err?.data?.message || 'Incorrect PIN. Please try again.')
      clearInputs()
    } finally {
      submittingRef.current = false
    }
  }

  const handleForgotRequest = async () => {
    setError('')
    setNotice('')
    try {
      await forgotWalletPin().unwrap()
      setNotice('A reset code has been sent to your email.')
      setStep('forgot-reset')
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to send reset code. Please try again.')
    }
  }

  const submitReset = async () => {
    if (submittingRef.current) return
    setError('')

    if (newPin !== confirmNewPin) {
      setError('PINs do not match')
      clearInputs()
      return
    }

    submittingRef.current = true
    try {
      await resetWalletPin({ code: resetCode, newPin, confirmNewPin }).unwrap()
      setUnlocked(true)
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to reset PIN. Please try again.')
      clearInputs()
    } finally {
      submittingRef.current = false
    }
  }

  // Auto-submit as soon as all boxes for the active step are filled, so the
  // user doesn't have to press a button after typing the last digit.
  useEffect(() => {
    if (activeStep === 'setup' && pin.length === 4 && confirmPin.length === 4) {
      submitSetup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, confirmPin, activeStep])

  useEffect(() => {
    if (activeStep === 'enter' && pin.length === 4) {
      submitVerify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, activeStep])

  useEffect(() => {
    if (activeStep === 'forgot-reset' && resetCode.length === 6 && newPin.length === 4 && confirmNewPin.length === 4) {
      submitReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetCode, newPin, confirmNewPin, activeStep])

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={32} />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            {activeStep === 'setup' ? <ShieldCheck size={26} className="text-white" /> : <Lock size={26} className="text-white" />}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {activeStep === 'setup' && 'Create Your Wallet PIN'}
            {activeStep === 'enter' && 'Enter Your Wallet PIN'}
            {activeStep === 'forgot-request' && 'Forgot Your PIN?'}
            {activeStep === 'forgot-reset' && 'Reset Your Wallet PIN'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
            {activeStep === 'setup' && 'Set a 4-digit PIN to protect your wallet and withdrawals. You will need it every time you access this page.'}
            {activeStep === 'enter' && 'Enter your 4-digit PIN to continue.'}
            {activeStep === 'forgot-request' && "We'll email a one-time code to reset your PIN."}
            {activeStep === 'forgot-reset' && 'Enter the code from your email and choose a new PIN.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 mb-5 flex items-start gap-2">
            <AlertCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-rose-500 text-sm">{error}</p>
          </div>
        )}

        {notice && !error && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-5">
            <p className="text-emerald-500 text-sm">{notice}</p>
          </div>
        )}

        {activeStep === 'setup' && (
          <form onSubmit={(e) => { e.preventDefault(); submitSetup() }} className="space-y-5" key={attemptKey}>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">New PIN</label>
              <PinInput length={4} onChange={setPin} error={!!error} disabled={settingUp} autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">Confirm PIN</label>
              <PinInput length={4} onChange={setConfirmPin} error={!!error} disabled={settingUp} />
            </div>
            <button
              type="submit"
              disabled={settingUp || pin.length !== 4 || confirmPin.length !== 4}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {settingUp ? <><Loader2 className="animate-spin mr-2" size={18} /> Creating...</> : 'Create PIN'}
            </button>
          </form>
        )}

        {activeStep === 'enter' && (
          <div key={attemptKey}>
            <form onSubmit={(e) => { e.preventDefault(); submitVerify() }} className="space-y-5">
              <PinInput length={4} onChange={setPin} error={!!error} disabled={verifying} autoFocus />
              <button
                type="submit"
                disabled={verifying || pin.length !== 4}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {verifying ? <><Loader2 className="animate-spin mr-2" size={18} /> Verifying...</> : 'Unlock'}
              </button>
            </form>
            <button
              onClick={() => { setStep('forgot-request'); setError(''); setNotice(''); clearInputs() }}
              className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-500 mt-4"
            >
              Forgot PIN?
            </button>
          </div>
        )}

        {activeStep === 'forgot-request' && (
          <div className="space-y-5">
            <button
              onClick={handleForgotRequest}
              disabled={sendingCode}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {sendingCode ? <><Loader2 className="animate-spin mr-2" size={18} /> Sending...</> : <><KeyRound size={16} className="mr-2" /> Send Reset Code</>}
            </button>
            <button
              onClick={() => { setStep('enter'); setError(''); setNotice(''); clearInputs() }}
              className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-500"
            >
              Back to PIN entry
            </button>
          </div>
        )}

        {activeStep === 'forgot-reset' && (
          <form onSubmit={(e) => { e.preventDefault(); submitReset() }} className="space-y-5" key={attemptKey}>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">6-Digit Reset Code</label>
              <PinInput length={6} onChange={setResetCode} error={!!error} disabled={resetting} autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">New PIN</label>
              <PinInput length={4} onChange={setNewPin} error={!!error} disabled={resetting} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">Confirm New PIN</label>
              <PinInput length={4} onChange={setConfirmNewPin} error={!!error} disabled={resetting} />
            </div>
            <button
              type="submit"
              disabled={resetting || resetCode.length !== 6 || newPin.length !== 4 || confirmNewPin.length !== 4}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {resetting ? <><Loader2 className="animate-spin mr-2" size={18} /> Resetting...</> : 'Reset PIN'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('enter'); setError(''); setNotice(''); clearInputs() }}
              className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-500"
            >
              Back to PIN entry
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
