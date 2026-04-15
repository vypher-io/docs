import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vypher",
  description: "Vypher is an open-source CLI tool that detects PII and PHI in your source code. Built for Finance (PCI DSS) and Healthcare (HIPAA) compliance. SARIF output, CI/CD ready, cross-platform.",
  appearance: true,
  sitemap: {
    hostname: 'https://docs.vypher.io'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'keywords', content: 'PII scanner, PHI scanner, HIPAA compliance, PCI DSS, sensitive data detection, security CLI, Go, SARIF, DevSecOps, secret scanning' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Vypher Docs' }],
    ['meta', { property: 'og:image', content: 'https://docs.vypher.io/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Vypher logo' }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.vypher.io/og-image.png' }],
    // JSON-LD
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'name': 'Vypher Documentation',
      'url': 'https://docs.vypher.io',
      'description': 'Official documentation for Vypher, an open-source CLI tool for detecting PII and PHI in source code.',
      'publisher': {
        '@type': 'Organization',
        'name': 'Vypher',
        'url': 'https://vypher.io'
      }
    })],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'CLI Reference', link: '/cli/vypher' },
      { text: 'vypher.io', link: 'https://vypher.io' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Installation', link: '/installation' }
        ]
      },
      {
        text: 'Integrations',
        items: [
          { text: 'Docker', link: '/integrations/docker' },
          { text: 'GitHub Actions', link: '/integrations/github-actions' },
          { text: 'GitLab CI/CD', link: '/integrations/gitlab-ci' },
          { text: 'Azure Pipelines', link: '/integrations/azure-pipelines' },
          { text: 'CircleCI', link: '/integrations/circleci' },
          { text: 'Jenkins', link: '/integrations/jenkins' },
          { text: 'Git Hooks', link: '/integrations/git-hooks' }
        ]
      },
      {
        text: 'CLI Reference',
        items: [
          { text: 'vypher', link: '/cli/vypher' },
          { text: 'vypher scan', link: '/cli/vypher_scan' },
          { text: 'vypher version', link: '/cli/vypher_version' },
          { text: 'vypher docs', link: '/cli/vypher_docs' }
        ]
      },
      {
        text: 'External',
        items: [
          { text: 'vypher.io', link: 'https://vypher.io' },
          { text: 'GitHub', link: 'https://github.com/vypher-io/cli' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vypher-io/cli' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2026 Vypher'
    }
  }
})
