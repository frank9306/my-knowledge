import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import StyleSwitcher from './StyleSwitcher.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(StyleSwitcher)
    })
}
