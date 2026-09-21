/** Full-size logo (nav, etc.) */
export const SITE_LOGO_URL =
  'https://res.cloudinary.com/dshkbza19/image/upload/v1775996191/WhatsApp_Image_2026-04-09_at_7.37.00_PM_yfqkei.jpg'

/** Square app/browser-tab icon mark, served locally from `public/images`. */
const FAVICON_SOURCE_URL = '/images/pip-favicn.png'

/**
 * Same asset, with a cache-bust query so browsers & CDNs refetch after you change the icon.
 * Bump FAVICON_VERSION when you replace the image (or production may keep the old tab icon).
 */
const FAVICON_VERSION = '3'

function withIconCacheBust(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}fv=${FAVICON_VERSION}`
}

/** Use for `metadata.icons` / `<link rel="icon">` only */
export const FAVICON_URL = withIconCacheBust(FAVICON_SOURCE_URL)
