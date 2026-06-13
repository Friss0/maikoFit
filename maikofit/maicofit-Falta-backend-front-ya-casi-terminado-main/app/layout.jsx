import { Bebas_Neue, DM_Sans } from 'next/font/google'
import SiteShell from '../src/components/SiteShell'
import '../src/index.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006'),
  title: 'MaicoFit | Transformación real',
  description: 'Coaching de fitness 1 a 1 para hombres que quieren verse mejor, sentirse mejor y recuperar su confianza.',
  icons: { icon: '/fotos/logo.webp' },
  openGraph: {
    title: 'MaicoFit | Transformación real',
    description: 'Coaching de fitness 1 a 1 para hombres. Mentalidad, entrenamiento y nutrición — resultados reales en 90 días.',
    images: ['/fotos/web/hero-poster-1.webp'],
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        {/* Poster del video hero: es el LCP — debe llegar antes que nada */}
        <link rel="preload" as="image" href="/fotos/web/hero-poster-1.webp" fetchPriority="high" />
        {/* Preload de las versiones web (~30KB c/u) — evita el pop al scrollear.
            Nunca precargar los .JPG originales: pesan 15MB cada uno. */}
        <link rel="preload" as="image" href="/fotos/web/DSC09949.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/fotos/web/DSC09964.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/fotos/web/DSC09937.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/fotos/web/DSC09941.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/fotos/web/DSC09966.webp" fetchPriority="low" />
      </head>
      <body suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
