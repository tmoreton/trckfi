const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://trckfi.com';
 
/** @type {import('next-sitemap').IConfig} */

// Save crawling budget by not fetching SSG meta files
const NEXT_SSG_FILES = [
  '/*.json$',
  '/*_buildManifest.js$',
  '/*_middlewareManifest.js$',
  '/*_ssgManifest.js$',
  '/*.js$',
];

// add your private routes here
const exclude = [
  '/dashboard*',
  '/settings*',
  '/accounts*',
  '/signin*',
];
 
// extend the configuration
const config = {
  exclude,
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: NEXT_SSG_FILES,
      },
    ],
  },
};

export default config;