const SITE_URL = 'https://trckfi.com';
 
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
  '/transactions*',
  '/intro*',
  '/settings*',
  '/accounts*',
  '/signin*',
  '/signin-success*',
  '/visionboard*',
  '/success*',
  '/goals*',
  '/auth*',
  '/profile*',
  '/recurring*',
  '/feedback*',
  '/link-user*',
  '/blog/.DS_Store'
];

module.exports = {
  siteUrl: SITE_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude,
  alternateRefs: [],
  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
  // additionalPaths: async (config) => [
  //   await config.transform(config, '/additional-page'),
  // ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: NEXT_SSG_FILES,
      },
    ],
  },
}