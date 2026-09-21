'use client'

import React, { useRef, useState } from 'react'
import {
  Store,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  X,
  ShieldCheck,
  Ban,
} from 'lucide-react'
import { useGetMyProfileQuery } from '@/store/api/userApi'
import {
  useGetMyVendorRequestQuery,
  useSubmitVendorRequestMutation,
  useGetVendorRegistrationStatusQuery,
} from '@/store/api/vendorApi'
import { BANGLADESH_DISTRICTS, OTHER_DISTRICT_OPTION } from '@/lib/bangladeshDistricts'

const NidUploadTile = ({
  label,
  file,
  onChange,
}: {
  label: string
  file: File | null
  onChange: (file: File | null) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (selected: File | null) => {
    onChange(selected)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(selected ? URL.createObjectURL(selected) : null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer overflow-hidden ${
          file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-950'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
        }}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

        {preview ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="mx-auto max-h-32 rounded-lg object-contain" />
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle size={14} />
              <span className="truncate max-w-[180px]">{file?.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFile(null)
                  if (inputRef.current) inputRef.current.value = ''
                }}
                className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center text-slate-400 dark:text-slate-500">
            <UploadCloud size={26} className="mb-2" />
            <p className="text-xs">Click or drag an image here</p>
          </div>
        )}
      </div>
    </div>
  )
}

const StatusBanner = ({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: React.ElementType
  title: string
  description: string
  tone: 'success' | 'warning' | 'error'
}) => {
  const toneClasses = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
  }[tone]

  return (
    <div className={`rounded-xl border p-6 flex flex-col items-center text-center gap-3 ${toneClasses}`}>
      <Icon size={32} />
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
    </div>
  )
}

export default function BecomeVendor() {
  const { data: profileResponse, isLoading: profileLoading } = useGetMyProfileQuery()
  const { data: requestResponse, isLoading: requestLoading } = useGetMyVendorRequestQuery()
  const { data: registrationStatusResponse, isLoading: statusLoading } = useGetVendorRegistrationStatusQuery()
  const [submitVendorRequest, { isLoading: submitting }] = useSubmitVendorRequestMutation()

  const role = profileResponse?.data?.attributes?.user?.role
  const vendorRequest = requestResponse?.data?.attributes || null
  const registrationEnabled = registrationStatusResponse?.data?.attributes?.enabled ?? true

  const [nidFrontImage, setNidFrontImage] = useState<File | null>(null)
  const [nidBackImage, setNidBackImage] = useState<File | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [district, setDistrict] = useState('')
  const [customDistrict, setCustomDistrict] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isRejected = vendorRequest?.status === 'rejected'
  const isPending = vendorRequest?.status === 'pending'
  const isOtherDistrict = district === OTHER_DISTRICT_OPTION

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!registrationEnabled) {
      setError('Vendor registration is currently closed. Please check back later.')
      return
    }

    const finalDistrict = isOtherDistrict ? customDistrict.trim() : district

    if (!vendorRequest && (!nidFrontImage || !nidBackImage)) {
      setError('Please upload both the front and back of your NID')
      return
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number')
      return
    }
    if (!finalDistrict) {
      setError('Please select or enter your area/district')
      return
    }

    try {
      const formData = new FormData()
      if (nidFrontImage) formData.append('nidFrontImage', nidFrontImage)
      if (nidBackImage) formData.append('nidBackImage', nidBackImage)
      formData.append('phoneNumber', phoneNumber.trim())
      formData.append('district', finalDistrict)

      await submitVendorRequest(formData).unwrap()
      setSuccess(true)
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to submit your vendor request. Please try again.')
    }
  }

  if (profileLoading || requestLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={32} />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (role === 'vendor') {
    return (
      <div className="max-w-xl mx-auto">
        <StatusBanner
          icon={ShieldCheck}
          title="You're a Vendor"
          description="Your vendor request has been approved. You now have vendor access on the platform."
          tone="success"
        />
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <StatusBanner
          icon={Clock}
          title="Request Pending Review"
          description="Your vendor request has been submitted and is awaiting admin review. You'll be notified once it's reviewed."
          tone="warning"
        />
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Phone Number</span>
            <span className="font-medium text-slate-900 dark:text-white">{vendorRequest.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Area / District</span>
            <span className="font-medium text-slate-900 dark:text-white">{vendorRequest.district}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Submitted</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {new Date(vendorRequest.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center text-center gap-2 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-500/20">
          <Store size={26} className="text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Become a Vendor</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
          Open your own store on the platform. Submit your NID and contact details below for admin review.
        </p>
      </div>

      {isRejected && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-rose-500 font-medium">Your previous request was rejected</p>
            <p className="text-rose-500/80 text-sm mt-1">
              Reason: {vendorRequest.rejectionReason}. Please update your details and resubmit below.
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-emerald-500 font-medium">Vendor Request Submitted!</p>
            <p className="text-emerald-500/80 text-sm mt-1">
              Your request has been submitted successfully and is pending admin review.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-rose-500 font-medium">Error</p>
            <p className="text-rose-500/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {!success && !registrationEnabled && (
        <StatusBanner
          icon={Ban}
          title="Vendor Registration Closed"
          description="We're not accepting new vendor applications right now. You can still fill out the form, but submitting is disabled until registration reopens."
          tone="error"
        />
      )}

      {!success && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NidUploadTile label="NID Front Image" file={nidFrontImage} onChange={setNidFrontImage} />
            <NidUploadTile label="NID Back Image" file={nidBackImage} onChange={setNidBackImage} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 01712345678"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Area / District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            >
              <option value="">Select your district</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option value={OTHER_DISTRICT_OPTION}>Other</option>
            </select>
            {isOtherDistrict && (
              <input
                type="text"
                value={customDistrict}
                onChange={(e) => setCustomDistrict(e.target.value)}
                placeholder="Enter your area/district"
                className="w-full mt-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                required
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !registrationEnabled}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 px-4 rounded-lg shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {!registrationEnabled ? (
              'Registration Closed'
            ) : submitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Submitting...
              </>
            ) : isRejected ? (
              'Resubmit Request'
            ) : (
              'Submit Request'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
