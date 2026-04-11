import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Force dark mode
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  }
}
