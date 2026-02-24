import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Homepage
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // MVP Calculators
    {
      url: `${SITE_URL}/mls-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/lhc-loading-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Guides index
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // MVP Guide pages
    {
      url: `${SITE_URL}/guides/medicare-levy-surcharge-explained`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides/lifetime-health-cover-loading`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides/is-private-health-insurance-worth-it`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides/hospital-cover-tiers-explained`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Static pages
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // NOTE: /mls-calculator/results and /lhc-loading-calculator/results are excluded
    // (dynamic results pages — no canonical URL, blocked in robots.ts)
  ];
}
