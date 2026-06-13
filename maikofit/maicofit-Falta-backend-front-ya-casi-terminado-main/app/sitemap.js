const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/planes', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/proceso', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/historia', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terminos', priority: 0.2, changeFrequency: 'yearly' },
  ];
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
