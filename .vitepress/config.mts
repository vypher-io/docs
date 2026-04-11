import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vypher",
  description: "PII and PHI Scanning Tool",
  appearance: 'dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI Reference', link: '/cli/vypher' },
      { text: 'vypher.io', link: 'https://vypher.io' }
    ],

    sidebar: [
      {
        text: 'CLI Reference',
        items: [
          { text: 'vypher', link: '/cli/vypher' },
          { text: 'vypher scan', link: '/cli/vypher_scan' }
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
