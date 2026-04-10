import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Used for chart + top strip (ticker/price) */
const CHART_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'] as const

/** Table: fetch each 24hr individually (batch can fail if one symbol is invalid) */
const TABLE_24H_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'USDTBUSD',
  'XRPUSDT',
  'BNBUSDT',
  'USDCUSDT',
] as const

export type Market24hRow = {
  pairSymbol: string
  displaySymbol: string
  name: string
  lastPrice: number
  priceChangePercent: number
  quoteVolumeUsd: number
  tradeSlug: string
}

const ASSET_META: Record<string, { displaySymbol: string; name: string; tradeSlug: string }> = {
  BTCUSDT: { displaySymbol: 'BTC', name: 'Bitcoin', tradeSlug: 'BTC_USDT' },
  ETHUSDT: { displaySymbol: 'ETH', name: 'Ethereum', tradeSlug: 'ETH_USDT' },
  USDTBUSD: { displaySymbol: 'USDT', name: 'Tether', tradeSlug: 'USDT_BUSD' },
  XRPUSDT: { displaySymbol: 'XRP', name: 'XRP', tradeSlug: 'XRP_USDT' },
  BNBUSDT: { displaySymbol: 'BNB', name: 'BNB', tradeSlug: 'BNB_USDT' },
  USDCUSDT: { displaySymbol: 'USDC', name: 'USD Coin', tradeSlug: 'USDC_USDT' },
}

function parsePriceResponse(raw: unknown): { symbol: string; price: string }[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object' && 'symbol' in raw && 'price' in raw) {
    return [raw as { symbol: string; price: string }]
  }
  return []
}

async function fetch24hOne(symbol: string) {
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return null
  const j = (await res.json()) as {
    symbol?: string
    lastPrice?: string
    priceChangePercent?: string
    quoteVolume?: string
    code?: number
  }
  if (j.code && j.code < 0) return null
  return j
}

/**
 * Proxies Binance for the dashboard (avoids browser CORS).
 */
export async function GET() {
  try {
    const priceParam = encodeURIComponent(JSON.stringify([...CHART_SYMBOLS]))
    const resPrice = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbols=${priceParam}`,
      { cache: 'no-store' }
    )

    if (!resPrice.ok) {
      const errText = await resPrice.text().catch(() => '')
      return NextResponse.json(
        { code: resPrice.status, message: 'Binance price request failed', detail: errText.slice(0, 200) },
        { status: 502 }
      )
    }

    const rawPrice = parsePriceResponse(await resPrice.json())
    const data = [...CHART_SYMBOLS].map((sym) => {
      const row = rawPrice.find((r) => r.symbol === sym)
      const price = row ? parseFloat(row.price) : NaN
      return {
        symbol: sym,
        symbolShort: sym.replace(/USDT$/, ''),
        price: Number.isFinite(price) ? price : 0,
      }
    })

    const settled = await Promise.all(
      [...TABLE_24H_SYMBOLS].map((sym) => fetch24hOne(sym))
    )

    const markets24h: Market24hRow[] = []
    ;[...TABLE_24H_SYMBOLS].forEach((sym, i) => {
      const row = settled[i]
      if (!row?.lastPrice) return
      const meta = ASSET_META[sym] || {
        displaySymbol: sym.replace(/USDT|BUSD/g, '') || sym,
        name: sym,
        tradeSlug: `${sym}_USDT`,
      }
      const lastPrice = parseFloat(row.lastPrice)
      const priceChangePercent = parseFloat(row.priceChangePercent || '0')
      const quoteVolume = parseFloat(row.quoteVolume || '0')
      markets24h.push({
        pairSymbol: sym,
        displaySymbol: meta.displaySymbol,
        name: meta.name,
        lastPrice: Number.isFinite(lastPrice) ? lastPrice : 0,
        priceChangePercent: Number.isFinite(priceChangePercent) ? priceChangePercent : 0,
        quoteVolumeUsd: Number.isFinite(quoteVolume) ? quoteVolume : 0,
        tradeSlug: meta.tradeSlug,
      })
    })

    return NextResponse.json({ code: 200, data, markets24h })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to fetch Binance data'
    return NextResponse.json({ code: 502, message: msg }, { status: 502 })
  }
}
