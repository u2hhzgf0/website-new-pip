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

const BINANCE_COM = 'https://api.binance.com'
const BINANCE_US = 'https://api.binance.us'

const COINGECKO_SIMPLE =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd'

const CRYPTOCOMPARE_MULTI =
  'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,BNB&tsyms=USD'

const FETCH_TIMEOUT_MS = 15_000

export type PriceSource =
  | 'binance'
  | 'binance_us'
  | 'coingecko'
  | 'coinbase'
  | 'cryptocompare'

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

/** Many CDNs/APIs drop requests with no User-Agent from datacenter IPs */
const FETCH_HEADERS = {
  Accept: 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
    headers: FETCH_HEADERS,
  })
}

async function tryBinanceBatch(base: string): Promise<PriceRow[] | null> {
  try {
    const priceParam = encodeURIComponent(JSON.stringify([...CHART_SYMBOLS]))
    const res = await fetchWithTimeout(`${base}/api/v3/ticker/price?symbols=${priceParam}`)
    if (!res.ok) return null
    const rawPrice = parsePriceResponse(await res.json())
    const rows = rowsFromBinanceRaw(rawPrice)
    return hasAnyPrice(rows) ? rows : null
  } catch {
    return null
  }
}

async function tryBinancePerSymbol(base: string): Promise<PriceRow[] | null> {
  try {
    const results = await Promise.all(
      [...CHART_SYMBOLS].map(async (sym) => {
        const res = await fetchWithTimeout(`${base}/api/v3/ticker/price?symbol=${sym}`)
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

/** Try batch then per-symbol on one Binance host */
async function tryBinanceHost(base: string): Promise<PriceRow[] | null> {
  const batch = await tryBinanceBatch(base)
  if (batch && hasAnyPrice(batch)) return batch
  const per = await tryBinancePerSymbol(base)
  if (per && hasAnyPrice(per)) return per
  return null
}

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

async function tryCryptoCompare(): Promise<PriceRow[] | null> {
  try {
    const res = await fetchWithTimeout(CRYPTOCOMPARE_MULTI)
    if (!res.ok) return null
    const j = (await res.json()) as Record<string, { USD?: number } | string>
    if (typeof j === 'object' && j !== null && 'Response' in j && j.Response === 'Error') {
      return null
    }
    const btc = j.BTC && typeof j.BTC === 'object' ? j.BTC.USD : undefined
    const eth = j.ETH && typeof j.ETH === 'object' ? j.ETH.USD : undefined
    const bnb = j.BNB && typeof j.BNB === 'object' ? j.BNB.USD : undefined
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

const COINBASE_PAIRS: { sym: string; short: string; pair: string }[] = [
  { sym: 'BTCUSDT', short: 'BTC', pair: 'BTC-USD' },
  { sym: 'ETHUSDT', short: 'ETH', pair: 'ETH-USD' },
  { sym: 'BNBUSDT', short: 'BNB', pair: 'BNB-USD' },
]

async function tryCoinbase(): Promise<PriceRow[] | null> {
  try {
    const results = await Promise.all(
      COINBASE_PAIRS.map(async ({ sym, short, pair }) => {
        const res = await fetchWithTimeout(`https://api.coinbase.com/v2/prices/${pair}/spot`)
        if (!res.ok) return null
        const j = (await res.json()) as { data?: { amount?: string } }
        const price = parseFloat(j.data?.amount ?? '')
        if (!Number.isFinite(price) || price <= 0) return null
        return { symbol: sym, symbolShort: short, price }
      })
    )
    if (results.some((x) => x === null)) return null
    return results as PriceRow[]
  } catch {
    return null
  }
}

type SpotResult = {
  data: PriceRow[]
  priceSource: PriceSource
  /** Host for 24h ticker when Binance-derived; null for aggregate APIs */
  marketsBase: string | null
}

async function fetchSpotPrices(): Promise<SpotResult> {
  const com = await tryBinanceHost(BINANCE_COM)
  if (com && hasAnyPrice(com)) {
    return { data: com, priceSource: 'binance', marketsBase: BINANCE_COM }
  }

  const us = await tryBinanceHost(BINANCE_US)
  if (us && hasAnyPrice(us)) {
    return { data: us, priceSource: 'binance_us', marketsBase: BINANCE_US }
  }

  const cg = await tryCoinGecko()
  if (cg && hasAnyPrice(cg)) {
    return { data: cg, priceSource: 'coingecko', marketsBase: null }
  }

  const cc = await tryCryptoCompare()
  if (cc && hasAnyPrice(cc)) {
    return { data: cc, priceSource: 'cryptocompare', marketsBase: null }
  }

  const cb = await tryCoinbase()
  if (cb && hasAnyPrice(cb)) {
    return { data: cb, priceSource: 'coinbase', marketsBase: null }
  }

  return { data: [], priceSource: 'binance', marketsBase: null }
}

function noticeForSource(priceSource: PriceSource): string | undefined {
  switch (priceSource) {
    case 'coingecko':
      return 'Spot prices via CoinGecko (Binance unreachable from this host). 24h table omitted.'
    case 'cryptocompare':
      return 'Spot prices via CryptoCompare (Binance unreachable). 24h table omitted.'
    case 'coinbase':
      return 'Spot prices via Coinbase (Binance unreachable). 24h table omitted.'
    case 'binance_us':
      return 'Spot prices via Binance.US. 24h table uses Binance US tickers where available.'
    default:
      return undefined
  }
}

async function fetch24hOne(base: string, symbol: string) {
  try {
    const res = await fetchWithTimeout(`${base}/api/v3/ticker/24hr?symbol=${symbol}`)
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
 * Multiple fallbacks when Binance.com is blocked from the server host.
 */
export async function GET() {
  try {
    const { data, priceSource, marketsBase } = await fetchSpotPrices()

    let markets24h: Market24hRow[] = []
    if (marketsBase) {
      const settled = await Promise.all([...TABLE_24H_SYMBOLS].map((sym) => fetch24hOne(marketsBase, sym)))

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
          'Live prices unavailable: all providers failed from this server. Allow outbound HTTPS or fix DNS/firewall.',
      })
    }

    const notice = noticeForSource(priceSource)

    return NextResponse.json({
      code: 200,
      data,
      markets24h,
      priceSource,
      ...(notice ? { notice } : {}),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to fetch market data'
    return NextResponse.json(
      { code: 502, message: msg, data: [], markets24h: [] },
      { status: 502 }
    )
  }
}
