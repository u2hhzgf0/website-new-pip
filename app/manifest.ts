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
        src: '/images/pip-favicn.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
