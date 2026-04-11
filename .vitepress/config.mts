import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vypher",
  description: "PII and PHI Scanning Tool",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CLI Reference', link: '/cli/vypher' }
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
    ]
  }
})
