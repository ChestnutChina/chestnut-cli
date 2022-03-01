import head from './config/head';
import sidebars from './config/sidebars';
const config = {
  base: '/chestnut-cli/',
  title: 'Chestnut CLI',
  description: '前端项目工程化脚手架',
  head,
  themeConfig: {
    docsDir: 'docs',
    sidebars
  },
  markdown: {
    lineNumbers: false
  }
}

export default config;