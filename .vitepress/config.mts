import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vypher",
  description: "PII and PHI Scanning Tool",
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
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI Reference', link: '/cli/vypher' },
      { text: 'vypher.io', link: 'https://vypher.io' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
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
