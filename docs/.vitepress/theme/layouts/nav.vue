<template>
  <header class="layout-header-wrap clearfix">
    <div class="logo">
      <a :href="base">Chestnut-CLI</a>
    </div>
    <ul class="menu-navs clearfix">
      <li class="nav-item">
        <a :href="`${base}guide/introduction`">指南</a>
      </li>
      <li class="nav-item">
        <a :href="`${base}guide/quickstart`">功能</a>
      </li>
    </ul>
  </header>
</template>
<script>
export default {
  name: "LayoutNav",
};
</script>
<script setup>
import { useData } from "vitepress";
const { site } = useData();
const { base } = site.value;
</script>
