'use client'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { Loader2, Wifi, Sparkles } from 'lucide-react'
import { useGetMyCardQuery, useIssueMyCardMutation } from '@/store/api/memberCardApi'

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://api.pipguardian.com'

export default function SmartMemberCard() {
  const user = useSelector((state: RootState) => state.auth.user)
  const { data, isLoading } = useGetMyCardQuery()
  const [issueMyCard, { isLoading: issuing }] = useIssueMyCardMutation()
  const [error, setError] = useState('')

  const card = data?.data?.attributes
  const hasCard = !!card?.hasCard

  const fallbackName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''
  const holderName = (card?.holderName || fallbackName || 'Member').toUpperCase()
  const photoUrl = user?.image ? `${IMAGE_BASE}${user.image}` : null

  const handleGetCard = async () => {
    setError('')
    try {
      await issueMyCard().unwrap()
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to issue your card. Please try again.')
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="card-frame">
      <div className="member-card">
        {/* engraved background chart lines */}
        <svg className="engrave" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
            <polyline points="430,330 500,250 560,300 640,215 700,265 790,150 860,205 1000,70" stroke="#000" strokeOpacity=".55" transform="translate(0,3)" />
            <polyline points="430,330 500,250 560,300 640,215 700,265 790,150 860,205 1000,70" stroke="#fff" strokeOpacity=".045" />
            <polyline points="760,20 900,150 1000,230" stroke="#000" strokeOpacity=".5" transform="translate(0,3)" />
            <polyline points="760,20 900,150 1000,230" stroke="#fff" strokeOpacity=".04" />
            <polyline points="-10,430 70,350 130,400 200,320 260,370 330,300" stroke="#000" strokeOpacity=".5" transform="translate(0,3)" />
            <polyline points="-10,430 70,350 130,400 200,320 260,370 330,300" stroke="#fff" strokeOpacity=".04" />
            <polyline points="-10,520 60,455 120,500 190,430" stroke="#000" strokeOpacity=".45" transform="translate(0,3)" />
            <polyline points="-10,520 60,455 120,500 190,430" stroke="#fff" strokeOpacity=".035" />
          </g>
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src="/images/pip-dark-logo.png" alt="Pipguardian" />

        {/* EMV chip */}
        <svg className="chip" viewBox="0 0 120 96" aria-hidden="true">
          <defs>
            <linearGradient id="cardGoldGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6e4a8" />
              <stop offset="35%" stopColor="#d9b356" />
              <stop offset="60%" stopColor="#c79c3f" />
              <stop offset="100%" stopColor="#eed693" />
            </linearGradient>
          </defs>
          <rect x={1} y={1} width={118} height={94} rx={14} fill="url(#cardGoldGradient)" stroke="#8d6f22" strokeWidth={1.5} />
          <g stroke="#8d6f22" strokeWidth={3} fill="none" strokeLinecap="round">
            <path d="M40 1 L40 95" /><path d="M80 1 L80 95" />
            <path d="M1 30 L40 30" /><path d="M1 66 L40 66" />
            <path d="M80 30 L119 30" /><path d="M80 66 L119 66" />
            <rect x={40} y={30} width={40} height={36} rx={6} />
            <path d="M40 48 L28 48" /><path d="M80 48 L92 48" />
          </g>
        </svg>

        <svg className="nfc" viewBox="0 0 64 80" aria-hidden="true">
          <g fill="none" stroke="#e8e8e8" strokeWidth={7} strokeLinecap="round">
            <path d="M10 26 A22 22 0 0 1 10 54" />
            <path d="M24 18 A34 34 0 0 1 24 62" />
            <path d="M38 10 A46 46 0 0 1 38 70" />
            <path d="M52 2  A58 58 0 0 1 52 78" />
          </g>
        </svg>

        {hasCard ? (
          <>
            <div className="card-number emboss">
              <span className="masked">8214</span>
              <span className="masked">0459</span>
              <span className="masked">3390</span>
              <span>{card.last4}</span>
            </div>

            <div className="valid">
              <div className="valid-label">VALID<br />THRU</div>
              <div className="valid-value emboss masked">12/29</div>
            </div>

            <div className="holder">
              <div className="photo">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={holderName} />
                ) : (
                  <svg viewBox="0 0 100 124" aria-hidden="true">
                    <rect width={100} height={124} fill="#3a4653" />
                    <circle cx={50} cy={46} r={21} fill="#8b98a6" />
                    <path d="M8 124 C8 92 30 76 50 76 C70 76 92 92 92 124 Z" fill="#8b98a6" />
                  </svg>
                )}
              </div>
              <div className="names emboss">
                <div className="name-main">{holderName}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="get-card">
            <div className="get-card-badge">
              <Sparkles size={14} />
              <span>Smart Member</span>
            </div>
            <p>Claim your unique Pipguardian member card</p>
            <button type="button" onClick={handleGetCard} disabled={issuing || isLoading}>
              {issuing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Issuing...
                </>
              ) : (
                'Get My Card'
              )}
            </button>
          </div>
        )}
      </div>
      </div>

      {hasCard && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <Wifi size={12} /> NFC enabled &bull; Card number hidden for your security
        </div>
      )}
      {error && <p className="mt-3 text-center text-xs text-rose-500">{error}</p>}

      <style jsx>{`
        .card-frame {
          position: relative;
          width: 100%;
          padding-top: 64%;
        }
        .member-card {
          position: absolute;
          inset: 0;
          container-type: inline-size;
          border-radius: 5cqw;
          overflow: hidden;
          color: #fff;
          background:
            radial-gradient(120% 90% at 78% 8%, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0) 55%),
            radial-gradient(90% 80% at 12% 95%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 60%),
            linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 38%, #161616 72%, #212121 100%);
          box-shadow:
            0 2cqw 4.5cqw rgba(0, 0, 0, 0.35),
            0 0.3cqw 0.8cqw rgba(0, 0, 0, 0.25),
            inset 0 0.12cqw 0 rgba(255, 255, 255, 0.1),
            inset 0 -0.12cqw 0 rgba(0, 0, 0, 0.6);
        }
        .member-card::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.012) 0 2px, transparent 2px 4px);
          mix-blend-mode: overlay;
        }
        .engrave {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .logo {
          position: absolute;
          left: 7%;
          top: 5.5%;
          width: 86%;
          height: auto;
          filter: drop-shadow(0 0.2cqw 0.25cqw rgba(0, 0, 0, 0.7));
        }
        .chip {
          position: absolute;
          right: 16%;
          top: 38%;
          width: 12.5%;
          height: auto;
          filter: drop-shadow(0 0.25cqw 0.35cqw rgba(0, 0, 0, 0.65));
        }
        .nfc {
          position: absolute;
          right: 6.5%;
          top: 40%;
          width: 6%;
          height: auto;
          opacity: 0.9;
          filter: drop-shadow(0 0.2cqw 0.2cqw rgba(0, 0, 0, 0.7));
        }
        .emboss {
          background: linear-gradient(180deg, #fdfdfd 0%, #dedede 30%, #8e8e8e 55%, #bdbdbd 72%, #f6f6f6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0.18cqw 0.1cqw rgba(0, 0, 0, 0.85)) drop-shadow(0 -0.08cqw 0 rgba(255, 255, 255, 0.18));
        }
        .card-number {
          position: absolute;
          top: 57%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          gap: 4.2cqw;
          font-family: 'Share Tech Mono', ui-monospace, monospace;
          font-size: 6.1cqw;
          letter-spacing: 0.07em;
        }
        .card-number .masked {
          filter: blur(0.35cqw);
          user-select: none;
        }
        .valid {
          position: absolute;
          right: 7.5%;
          top: 74%;
          display: flex;
          align-items: center;
          gap: 1.4cqw;
        }
        .valid-label {
          font-size: 2.1cqw;
          font-weight: 600;
          line-height: 1.05;
          text-align: right;
          color: #e6e6e6;
          text-shadow: 0 0.12cqw 0.15cqw rgba(0, 0, 0, 0.85);
        }
        .valid-value {
          font-family: 'Share Tech Mono', ui-monospace, monospace;
          font-size: 4.6cqw;
          letter-spacing: 0.04em;
        }
        .valid-value.masked {
          filter: blur(0.3cqw);
          user-select: none;
        }
        .holder {
          position: absolute;
          left: 6%;
          top: 75.5%;
          display: flex;
          align-items: center;
          gap: 2.2cqw;
        }
        .photo {
          width: 9.9cqw;
          height: 11.8cqw;
          flex: none;
          overflow: hidden;
          border-radius: 0.4cqw;
          background: linear-gradient(160deg, #4c5b6b, #2c3540);
          box-shadow: 0 0.2cqw 0.5cqw rgba(0, 0, 0, 0.6), inset 0 0 0 0.12cqw rgba(255, 255, 255, 0.14);
        }
        .photo img,
        .photo svg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .names {
          display: flex;
          flex-direction: column;
          gap: 0.5cqw;
          font-family: 'Share Tech Mono', ui-monospace, monospace;
          line-height: 1.05;
        }
        .name-main {
          font-size: 4cqw;
          letter-spacing: 0.06em;
        }
        .get-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4cqw;
          text-align: center;
          padding: 6cqw;
        }
        .get-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 1.4cqw;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          padding: 1.2cqw 3cqw;
          font-size: 2.6cqw;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #34d399;
        }
        .get-card p {
          font-size: 3.4cqw;
          color: #cbd5e1;
        }
        .get-card button {
          display: inline-flex;
          align-items: center;
          gap: 1.6cqw;
          background: linear-gradient(90deg, #10b981, #059669);
          color: #fff;
          font-weight: 700;
          font-size: 3.2cqw;
          padding: 2.4cqw 6cqw;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 0.5cqw 1.5cqw rgba(16, 185, 129, 0.35);
        }
        .get-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
