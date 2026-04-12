/** Full-size logo (nav, etc.) */
export const SITE_LOGO_URL =
  'https://res.cloudinary.com/dshkbza19/image/upload/v1775996191/WhatsApp_Image_2026-04-09_at_7.37.00_PM_yfqkei.jpg'

/**
 * Same asset, with a cache-bust query so browsers & CDNs refetch after you change the logo.
 * Bump FAVICON_VERSION when you replace the image (or production may keep the old tab icon).
 */
const FAVICON_VERSION = '2'

function withIconCacheBust(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}fv=${FAVICON_VERSION}`
}

/** Use for `metadata.icons` / `<link rel="icon">` only */
export const FAVICON_URL = withIconCacheBust(SITE_LOGO_URL)
