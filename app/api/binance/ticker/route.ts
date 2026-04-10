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

const BINANCE_BASE = 'https://api.binance.com'
/** Public fallback when Binance blocks server IPs (common on VPS / some regions) */
const COINGECKO_SIMPLE =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd'

const FETCH_TIMEOUT_MS = 15_000

export type Market24hRow = {
  pairSymbol: string
  displaySymbol: string
  name: string
  lastPrice: number
  priceChangePercent: number
  quoteVolumeUsd: number
  tradeSlug: string
}

type PriceRow = {
  symbol: string
  symbolShort: string
  price: number
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

function rowsFromBinanceRaw(rawPrice: { symbol: string; price: string }[]): PriceRow[] {
  return [...CHART_SYMBOLS].map((sym) => {
    const row = rawPrice.find((r) => r.symbol === sym)
    const price = row ? parseFloat(row.price) : NaN
    return {
      symbol: sym,
      symbolShort: sym.replace(/USDT$/, ''),
      price: Number.isFinite(price) ? price : 0,
    }
  })
}

function hasAnyPrice(rows: PriceRow[]): boolean {
  return rows.some((r) => r.price > 0)
}

async function fetchWithTimeout(url: string): Promise<Response> {
  return fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: 'application/json' },
  })
}

/** Batch ticker/price — fastest when Binance allows the server IP */
async function tryBinanceBatch(): Promise<PriceRow[] | null> {
  try {
    const priceParam = encodeURIComponent(JSON.stringify([...CHART_SYMBOLS]))
    const res = await fetchWithTimeout(`${BINANCE_BASE}/api/v3/ticker/price?symbols=${priceParam}`)
    if (!res.ok) return null
    const rawPrice = parsePriceResponse(await res.json())
    const rows = rowsFromBinanceRaw(rawPrice)
    return hasAnyPrice(rows) ? rows : null
  } catch {
    return null
  }
}

/** One symbol at a time — sometimes works when batch is blocked */
async function tryBinancePerSymbol(): Promise<PriceRow[] | null> {
  try {
    const results = await Promise.all(
      [...CHART_SYMBOLS].map(async (sym) => {
        const res = await fetchWithTimeout(`${BINANCE_BASE}/api/v3/ticker/price?symbol=${sym}`)
        if (!res.ok) return null
        const j = (await res.json()) as { symbol?: string; price?: string }
        const price = j.price != null ? parseFloat(j.price) : NaN
        if (!Number.isFinite(price)) return null
        return { symbol: sym as string, symbolShort: sym.replace(/USDT$/, ''), price } satisfies PriceRow
      })
    )
    const rows = results.filter((x): x is NonNullable<typeof x> => x !== null)
    if (rows.length === 0) return null
    const bySym = new Map(rows.map((r) => [r.symbol, r]))
    return [...CHART_SYMBOLS].map((sym) => {
      const found = bySym.get(sym)
      return found ?? { symbol: sym, symbolShort: sym.replace(/USDT$/, ''), price: 0 }
    })
  } catch {
    return null
  }
}

/** Last resort: no Binance dependency (rate limits apply; ok for dashboard polling) */
async function tryCoinGecko(): Promise<PriceRow[] | null> {
  try {
    const res = await fetchWithTimeout(COINGECKO_SIMPLE)
    if (!res.ok) return null
    const j = (await res.json()) as {
      bitcoin?: { usd?: number }
      ethereum?: { usd?: number }
      binancecoin?: { usd?: number }
    }
    const btc = j.bitcoin?.usd
    const eth = j.ethereum?.usd
    const bnb = j.binancecoin?.usd
    if (
      typeof btc !== 'number' ||
      typeof eth !== 'number' ||
      typeof bnb !== 'number' ||
      !Number.isFinite(btc) ||
      !Number.isFinite(eth) ||
      !Number.isFinite(bnb)
    ) {
      return null
    }
    return [
      { symbol: 'BTCUSDT', symbolShort: 'BTC', price: btc },
      { symbol: 'ETHUSDT', symbolShort: 'ETH', price: eth },
      { symbol: 'BNBUSDT', symbolShort: 'BNB', price: bnb },
    ]
  } catch {
    return null
  }
}

async function fetchSpotPrices(): Promise<{ data: PriceRow[]; priceSource: 'binance' | 'coingecko' }> {
  const batch = await tryBinanceBatch()
  if (batch && hasAnyPrice(batch)) {
    return { data: batch, priceSource: 'binance' }
  }
  const per = await tryBinancePerSymbol()
  if (per && hasAnyPrice(per)) {
    return { data: per, priceSource: 'binance' }
  }
  const cg = await tryCoinGecko()
  if (cg && hasAnyPrice(cg)) {
    return { data: cg, priceSource: 'coingecko' }
  }
  return { data: [], priceSource: 'binance' }
}

async function fetch24hOne(symbol: string) {
  try {
    const res = await fetchWithTimeout(`${BINANCE_BASE}/api/v3/ticker/24hr?symbol=${symbol}`)
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
  } catch {
    return null
  }
}

/**
 * Proxies Binance for the dashboard (avoids browser CORS).
 * Uses CoinGecko as fallback for spot prices when Binance rejects the server (502/403 common on VPS).
 */
export async function GET() {
  try {
    const { data, priceSource } = await fetchSpotPrices()

    let markets24h: Market24hRow[] = []
    if (priceSource === 'binance') {
      const settled = await Promise.all([...TABLE_24H_SYMBOLS].map((sym) => fetch24hOne(sym)))

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
    }

    const emptyPrices = !hasAnyPrice(data)
    if (emptyPrices) {
      return NextResponse.json({
        code: 200,
        data: [],
        markets24h: [],
        priceSource,
        warning:
          'Live prices unavailable (Binance and fallback failed). Check server outbound HTTPS / region limits.',
      })
    }

    return NextResponse.json({
      code: 200,
      data,
      markets24h,
      priceSource,
      ...(priceSource === 'coingecko'
        ? {
            notice:
              'Spot prices via CoinGecko (Binance unreachable from this host). 24h table omitted.',
          }
        : {}),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to fetch market data'
    return NextResponse.json(
      { code: 502, message: msg, data: [], markets24h: [] },
      { status: 502 }
    )
  }
}
