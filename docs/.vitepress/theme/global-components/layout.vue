<template>
  <div class="layout">
    <layout-nav></layout-nav>
    <div class="layout-main">
      <layout-sidebar v-if="!isIndex"></layout-sidebar>
      <div class="layout-container">
        <home v-if="isIndex"></home>
        <layout-container v-else></layout-container>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>
</template>
<script>
export default {
  name: 'Layout',
}
</script>
<script setup>
import Home from '../pages/home.vue';
import { useRoute, useData } from 'vitepress';
import { ref, watchEffect, onMounted } from 'vue';

const { site } = useData();
const route = useRoute();
const isIndex = ref(false);

onMounted(() => {
  watchEffect(() => {
    isIndex.value = route.path === site.value.base;
  })
})
</script>