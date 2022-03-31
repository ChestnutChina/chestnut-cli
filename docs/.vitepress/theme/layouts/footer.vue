<template>
  <div class="footer">
    <div class="container">
      <div class="footer-main">
        <h5>Chestnut Design</h5>
        <a v-for="item in EcologicalData" :key="item.name" :href="item.link" class="footer-main-link" target="_blank">
          <span>{{ item.name }}</span>
          <span class="sub">&nbsp;-&nbsp;</span>
          <span class="sub">{{ item.subdes }}</span>
        </a>
      </div>
      <div class="footer-main">
        <h5>社区</h5>
        <a href="http://chestnut-china.gitee.io/chestnut-issue-helper?repo=chestnut-cli" class="footer-main-link" target="_blank">问题收集</a>
      </div>
      <div class="footer-main">
        <h5>友情链接</h5>
        <a href="https://vue3js.cn/docs/zh/" class="footer-main-link" target="_blank">Vue</a>
        <a href="https://cli.vuejs.org/" class="footer-main-link" target="_blank">Vue CLI</a>
      </div>
    </div>
    <p class="for-the-record">
      <img
        alt="NPM"
        src="https://img.shields.io/npm/l/chestnut-cli?color=%231890ff&registry_uri=https%3A%2F%2Fregistry.npmjs.com&style=flat-square"
      />
      <img
        alt="Copyright"
        src="https://img.shields.io/badge/©-Copyright 2021 Chestnut CLI-1890ff?style=flat-square&logo=copyright&logoColor=white"
      />
    </p>
  </div>
</template>
<script>
export default {
  name: 'LayoutFooter',
};
</script>
<script setup>
import EcologicalData from '../../json/ecological.json';
</script>
<style lang="less" scoped>
@import '../styles/common/variables.less';
.footer {
  &.component-footer {
    margin-left: 224px;
    width: auto;
    padding-left: 0;
    padding-right: 0;
  }
  box-sizing: border-box;
  width: 100%;
  padding: 40px 150px 20px 150px;

  background-color: @black;
  .container {
    box-sizing: border-box;
    width: auto;
    display: flex;
    margin: 0 auto;
    justify-content: space-evenly;
  }
  .footer-main {
    h5 {
      font-size: @font-size-h5;
      font-weight: 500;
      line-height: 1;
      margin: 0 0 15px 0;
      color: @white;
    }
    .footer-main-link {
      font-size: @font-size-base;
      line-height: 2;

      display: block;
      margin: 0;
      color: @white;

      .sub {
        color: #8c8c8c;
      }
    }
  }
  .for-the-record {
    color: @white;
    margin-top: 30px;
    text-align: center;
  }
}
</style>
