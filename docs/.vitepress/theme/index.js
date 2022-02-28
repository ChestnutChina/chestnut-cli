// import DefaultTheme from 'vitepress/theme';
import Layout from './global-components/layout.vue';
import NotFound from './global-components/not-found.vue';

import './styles/pc.less';

const components = [];

const layouts = import.meta.globEager('./layouts/**/*.vue');

for (const path in layouts) {
  components.push(layouts[path].default);
}

export default {
  // ...DefaultTheme,
  Layout,
  NotFound,
  enhanceApp({ app }) {
    components.forEach(component => {
      app.component(component.name, component);
    });
  },
};
