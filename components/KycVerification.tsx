'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Camera,
  Upload,
  RefreshCw,
  X,
  Loader2,
  IdCard,
  ScanFace,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useGetMyKycQuery, useSubmitKycMutation } from '../store/api/kycApi';
import type { KycDocumentType, MyKyc } from '../store/api/kycApi';
import { Toast, ToastType } from './Toast';

const MAX_CAPTURE_SIDE = 1600;

// Lets users pick an existing image instead of taking a live photo.
// Set to false to require live camera capture for every KYC photo.
const ALLOW_FILE_UPLOAD = true;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const DOCUMENT_TYPES: { value: KycDocumentType; label: string; hint: string }[] = [
  { value: 'nid', label: 'National ID Card', hint: 'Government-issued NID card' },
  { value: 'passport', label: 'Passport', hint: 'Photo page and the page behind it' },
  { value: 'driving_license', label: 'Driving License', hint: 'Front and back of the license' },
];

type Step = 'type' | 'idFront' | 'idBack' | 'selfie' | 'review';
type DocKey = 'idFront' | 'idBack' | 'selfie';

const STEPS: Step[] = ['type', 'idFront', 'idBack', 'selfie', 'review'];

const STEP_COPY: Record<DocKey, { title: string; description: string }> = {
  idFront: {
    title: 'Front of your document',
    description: 'Take a live photo or upload an image of the front side. Make sure all text is readable and there is no glare.',
  },
  idBack: {
    title: 'Back of your document',
    description: 'Now capture or upload the back side of the same document.',
  },
  selfie: {
    title: 'Take a live selfie',
    description: 'Look straight at the camera with your face inside the oval. Remove glasses or hats.',
  },
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

/* -------------------------------------------------------------------------- */
/*                               Camera capture                               */
/* -------------------------------------------------------------------------- */

interface CameraCaptureProps {
  facingMode: 'user' | 'environment';
  overlay: 'card' | 'face';
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

function CameraCapture({ facingMode, overlay, onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Your browser does not support camera access. Please use a recent version of Chrome, Safari or Firefox over HTTPS.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        if (err?.name === 'NotAllowedError') {
          setError('Camera permission was denied. Allow camera access in your browser settings and try again.');
        } else if (err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError') {
          setError('No camera was found on this device.');
        } else {
          setError('Could not start the camera. Close other apps using it and try again.');
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [facingMode, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const scale = Math.min(1, MAX_CAPTURE_SIDE / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopStream();
          onCapture(blob);
        }
      },
      'image/jpeg',
      0.9
    );
  };

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-5 text-center">
        <ShieldAlert className="mx-auto mb-3 text-rose-500" size={32} />
        <p className="text-sm text-slate-700 dark:text-slate-200">{error}</p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-950">
        <video
          ref={videoRef}
          playsInline
          muted
          onLoadedMetadata={() => setIsReady(true)}
          className={`h-full w-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
        />

        {/* Framing guide */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {overlay === 'card' ? (
            <div className="aspect-[1.586] w-[82%] rounded-xl border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)]" />
          ) : (
            <div className="h-[78%] aspect-[3/4] rounded-[50%] border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)]" />
          )}
        </div>

        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={32} />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCapture}
          disabled={!isReady}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-600"
        >
          <Camera size={18} /> Capture
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               KYC wizard modal                             */
/* -------------------------------------------------------------------------- */

interface KycWizardProps {
  onClose: () => void;
  onSubmitted: () => void;
  onError: (message: string) => void;
}

function KycWizard({ onClose, onSubmitted, onError }: KycWizardProps) {
  const [step, setStep] = useState<Step>('type');
  const [documentType, setDocumentType] = useState<KycDocumentType>('nid');
  const [images, setImages] = useState<Record<DocKey, Blob | null>>({ idFront: null, idBack: null, selfie: null });
  const [previews, setPreviews] = useState<Record<DocKey, string | null>>({ idFront: null, idBack: null, selfie: null });
  const [cameraOpen, setCameraOpen] = useState(false);
  // Front-camera selfies are shown mirrored, like the live preview; uploaded images are shown as-is
  const [mirrored, setMirrored] = useState<Record<DocKey, boolean>>({ idFront: false, idBack: false, selfie: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitKyc, { isLoading: isSubmitting }] = useSubmitKycMutation();

  // Free preview object URLs when they are replaced or the modal closes
  const previewsRef = useRef(previews);
  previewsRef.current = previews;
  useEffect(
    () => () => {
      Object.values(previewsRef.current).forEach((url) => url && URL.revokeObjectURL(url));
    },
    []
  );

  const setImage = (key: DocKey, blob: Blob, fromFrontCamera = false) => {
    setMirrored((prev) => ({ ...prev, [key]: fromFrontCamera }));
    setPreviews((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key] as string);
      return { ...prev, [key]: URL.createObjectURL(blob) };
    });
    setImages((prev) => ({ ...prev, [key]: blob }));
  };

  const clearImage = (key: DocKey) => {
    setPreviews((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key] as string);
      return { ...prev, [key]: null };
    });
    setImages((prev) => ({ ...prev, [key]: null }));
  };

  const handleFileSelect = (key: DocKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError('Please choose a JPG, PNG or WEBP image');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onError('Image must be smaller than 8MB');
      return;
    }
    setImage(key, file);
  };

  const stepIndex = STEPS.indexOf(step);
  const goNext = () => {
    setCameraOpen(false);
    setStep(STEPS[stepIndex + 1]);
  };
  const goBack = () => {
    setCameraOpen(false);
    setStep(STEPS[stepIndex - 1]);
  };

  const handleSubmit = async () => {
    if (!images.idFront || !images.idBack || !images.selfie) return;

    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('idFront', images.idFront, 'id-front.jpg');
    formData.append('idBack', images.idBack, 'id-back.jpg');
    formData.append('selfie', images.selfie, 'selfie.jpg');

    try {
      await submitKyc(formData).unwrap();
      onSubmitted();
    } catch (error: any) {
      onError(error?.data?.message || 'Failed to submit KYC. Please try again.');
    }
  };

  const renderDocumentStep = (key: DocKey) => {
    const isSelfie = key === 'selfie';
    const preview = previews[key];

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{STEP_COPY[key].title}</h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{STEP_COPY[key].description}</p>
        </div>

        {cameraOpen ? (
          <CameraCapture
            facingMode={isSelfie ? 'user' : 'environment'}
            overlay={isSelfie ? 'face' : 'card'}
            onCapture={(blob) => {
              setImage(key, blob, isSelfie);
              setCameraOpen(false);
            }}
            onCancel={() => setCameraOpen(false)}
          />
        ) : preview ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={STEP_COPY[key].title}
                className={`mx-auto max-h-72 w-full object-contain ${mirrored[key] ? '-scale-x-100' : ''}`}
              />
            </div>
            <button
              type="button"
              onClick={() => clearImage(key)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw size={16} /> Retake
            </button>
          </div>
        ) : (
          <div className={`grid gap-3 ${ALLOW_FILE_UPLOAD ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 px-4 py-8 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              {isSelfie ? <ScanFace size={32} /> : <Camera size={32} />}
              <span className="text-sm font-semibold">{isSelfie ? 'Take live selfie' : 'Take live photo'}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isSelfie ? 'Uses your front camera' : 'Uses your back camera if available'}
              </span>
            </button>

            {ALLOW_FILE_UPLOAD && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect(key)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50"
                >
                  <Upload size={32} />
                  <span className="text-sm font-semibold">Upload a file</span>
                  <span className="text-xs text-slate-500">JPG, PNG or WEBP, max 8MB</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const canContinue =
    step === 'type' ||
    (step !== 'review' && !!images[step as DocKey]);

  const docTypeLabel = DOCUMENT_TYPES.find((d) => d.value === documentType)?.label;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-slate-950/80">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">KYC Verification</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 px-5 pt-4">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'type' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Choose your document</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Use a valid, government-issued document that shows your full name and photo.
                </p>
              </div>
              <div className="space-y-2">
                {DOCUMENT_TYPES.map((doc) => (
                  <label
                    key={doc.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                      documentType === doc.value
                        ? 'border-emerald-500 bg-emerald-500/5'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="documentType"
                      value={doc.value}
                      checked={documentType === doc.value}
                      onChange={() => setDocumentType(doc.value)}
                      className="accent-emerald-500"
                    />
                    <IdCard size={20} className="text-slate-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{doc.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{doc.hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {(step === 'idFront' || step === 'idBack' || step === 'selfie') && renderDocumentStep(step)}

          {step === 'review' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Review and submit</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Check that every photo is clear. Document type: <span className="font-medium">{docTypeLabel}</span>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['idFront', 'idBack', 'selfie'] as DocKey[]).map((key) => (
                  <div key={key} className="space-y-1.5">
                    <div className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                      {previews[key] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previews[key] as string}
                          alt={key}
                          className={`h-full w-full object-cover ${mirrored[key] ? '-scale-x-100' : ''}`}
                        />
                      )}
                    </div>
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                      {key === 'idFront' ? 'Front' : key === 'idBack' ? 'Back' : 'Selfie'}
                    </p>
                  </div>
                ))}
              </div>
              <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                By submitting, you confirm these documents belong to you. They are stored privately and only
                reviewed by our verification team.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!cameraOpen && (
          <div className="flex gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step === 'review' ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-600"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-600"
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/*                             Settings > KYC tab                             */
/* -------------------------------------------------------------------------- */

export default function KycVerification() {
  const { data, isLoading, isError, refetch } = useGetMyKycQuery();
  const [showWizard, setShowWizard] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const kyc: MyKyc | undefined = data?.data?.attributes;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-emerald-500" size={28} />
      </div>
    );
  }

  if (isError || !kyc) {
    return (
      <div className="max-w-lg space-y-3 text-sm text-slate-500 dark:text-slate-400">
        <p>Could not load your KYC status.</p>
        <button type="button" onClick={() => refetch()} className="font-medium text-emerald-500 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  const canStart = kyc.status === 'pending' || kyc.status === 'rejected';

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {kyc.status === 'verified' && (
        <div className="flex items-start gap-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5">
          <ShieldCheck className="flex-shrink-0 text-emerald-500" size={28} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Your identity is verified</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Approved on {formatDate(kyc.reviewedAt)}. You have full access to all features.
            </p>
          </div>
        </div>
      )}

      {kyc.status === 'submitted' && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
          <Clock className="flex-shrink-0 text-amber-500" size={28} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Verification under review</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Submitted on {formatDate(kyc.submittedAt)}. Our team is checking your documents, and we'll notify you
              once it's done.
            </p>
          </div>
        </div>
      )}

      {kyc.status === 'rejected' && (
        <div className="flex items-start gap-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-5">
          <ShieldAlert className="flex-shrink-0 text-rose-500" size={28} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Verification was not approved</h3>
            {kyc.rejectionReason && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium">Reason:</span> {kyc.rejectionReason}
              </p>
            )}
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Please fix the issue and submit again.</p>
          </div>
        </div>
      )}

      {kyc.status === 'pending' && (
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">Verify your identity</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            KYC verification protects your account and is required for full access. It takes about two minutes.
          </p>
        </div>
      )}

      {canStart && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: IdCard, title: 'Document front', text: 'NID, passport or driving license' },
              { icon: IdCard, title: 'Document back', text: 'The reverse side of the same document' },
              { icon: ScanFace, title: 'Live selfie', text: 'A photo of your face taken with your camera' },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <item.icon className="mb-2 text-emerald-500" size={22} />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowWizard(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 sm:w-auto"
          >
            <ShieldCheck size={18} /> {kyc.status === 'rejected' ? 'Resubmit KYC' : 'Verify KYC'}
          </button>
        </>
      )}

      {kyc.status !== 'pending' && (
        <dl className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Document</dt>
            <dd className="font-medium text-slate-900 dark:text-white">
              {DOCUMENT_TYPES.find((d) => d.value === kyc.documentType)?.label || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Submitted</dt>
            <dd className="font-medium text-slate-900 dark:text-white">{formatDate(kyc.submittedAt)}</dd>
          </div>
        </dl>
      )}

      {showWizard && (
        <KycWizard
          onClose={() => setShowWizard(false)}
          onSubmitted={() => {
            setShowWizard(false);
            setToast({ message: 'KYC submitted! We will review it shortly.', type: 'success' });
          }}
          onError={(message) => setToast({ message, type: 'error' })}
        />
      )}
    </div>
  );
}
