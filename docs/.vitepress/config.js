import head from './config/head';
import sidebars from './config/sidebars';
import markdownItKatex from 'markdown-it-katex';
import { customElements } from './markdown/customElement';

const config = {
  base: '/chestnut-cli/',
  title: 'Chestnut CLI',
  description: '前端项目工程化脚手架',
  head,
  themeConfig: {
    docsDir: 'docs',
    sidebars,
  },
  markdown: {
    lineNumbers: false,
    config: md => {
      md.use(markdownItKatex);
    }
  },
  vue: {
    template: {
      compilerOptions: {
        // https://github.com/vuejs/vitepress/issues/529#issuecomment-1151186631
        isCustomElement: (tag) => customElements.includes(tag)
      }
    }
  }
};

export default config;
