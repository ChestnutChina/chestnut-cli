<template>
<div class="layout-siderbar">
    <div
      class="siderbar-wrap"
      :class="hasScroll ? 'withScroll' : 'withoutScroll'"
    >
      <ul ref="siderBarRef" class="siderbar">
        <li v-for="(value, name) in sidebars" :key="name" class="siderbar-item">
          <template v-if="value.children">
            <p class="group-nav-title">{{ value.text }}</p>
            <ul class="group-navs">
              <li
                v-for="item in value.children"
                :key="item.text"
                class="nav-item"
              >
                <a
                  :href="base + name + item.link"
                  :class="isActive(base + name + item.link) ? 'active' : ''"
                  >{{ item.text }}</a
                >
              </li>
            </ul>
          </template>
          <template v-if="value.group">
            <p class="group-nav-title">{{ value.text }}</p>
            <div
              class="sub-nav-group"
              v-for="(item, key) in value.group"
              :key="key"
            >
              <p class="group-nav-sub-title">{{ item.text }}</p>
              <ul class="group-navs">
                <li
                  v-for="sub in item.children"
                  :key="sub.text"
                  class="nav-item"
                >
                  <a
                    :href="base + name + sub.link"
                    :class="isActive(base + name + sub.link) ? 'active' : ''"
                    >{{ sub.text }}</a
                  >
                </li>
              </ul>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "LayoutSidebar",
};
</script>
<script setup>
import { onMounted, watchEffect, ref } from "vue";
import { useData, useRoute } from "vitepress";
const currentLink = ref("");
const sidebars = ref({});
const base = ref("");
const hasScroll = ref(false);
const siderBarRef = ref({});

const { site } = useData();
const route = useRoute();

onMounted(() => {
  hasScroll.value = siderBarRef.value.scrollHeight > siderBarRef.offsetHeight;
  watchEffect(() => {
    const { themeConfig } = site.value;
    base.value = site.value.base;
    currentLink.value = route.path.split(".").shift();
    sidebars.value = themeConfig.sidebars;
  });
});

const isActive = function(link) {
  return link === currentLink.value;
}
</script>