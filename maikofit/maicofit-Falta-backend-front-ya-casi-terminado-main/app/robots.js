const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Rutas privadas / transaccionales: fuera del índice
      disallow: ['/api/', '/cuenta', '/login', '/registro', '/checkout/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
