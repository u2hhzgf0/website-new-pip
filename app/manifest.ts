import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PipGuardianElt',
    short_name: 'PipGuardianElt',
    description: 'Smart forex investment platform for confident growth and capital protection.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://res.cloudinary.com/dshkbza19/image/upload/v1775996191/WhatsApp_Image_2026-04-09_at_7.37.00_PM_yfqkei.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any maskable',
      },
      {
        src: 'https://res.cloudinary.com/dshkbza19/image/upload/v1775996191/WhatsApp_Image_2026-04-09_at_7.37.00_PM_yfqkei.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any maskable',
      },
    ],
  }
}
