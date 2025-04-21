/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://gjb8114.github.io',
  generateRobotsTxt: true,
  outDir: 'out',
  exclude: ['/404'],
  // For canonical URLs
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
}