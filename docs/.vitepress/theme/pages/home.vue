<template>
  <div class="home">
    <div class="banner">
      <div class="banner-desc">
        <h1>前端项目工程化</h1>
      </div>
    </div>
    <div class="split"></div>
    <div class="cards">
      <ul class="container">
        <li>
          <div class="card">
            <h3>快捷</h3>
            <p>只需要输命令，选择对应的配置，即可自动完成项目配置，无需关注配置流程，更专注于项目业务开发。</p>
          </div>
        </li>
        <li>
          <div class="card">
            <h3>方便</h3>
            <p>一站式全套配置，从编码风格，代码检测，代码格式化，Git提交规范到项目版本号管理，全方位提供。</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
};
</script>
<style lang="less" scoped>
@import '../styles/common/variables.less';
.split {
  margin-top: 19px;
  margin-bottom: 24px;
  height: 1px;
  background: #eee;
  width: 100%;
}
.banner {
  text-align: center;
  &-desc {
    padding-top: 30px;

    h1 {
      font-size: @font-size-h1;
      line-height: 44px;
      margin: 0;
      color: @header-color;
    }

    p {
      font-size: @font-size-large;
      line-height: 28px;
      margin: 20px 0 5px;
      color: @text-color;
    }
  }
}

.cards {
  margin: 0 auto 110px;
  .container {
    width: auto;
    margin: 60px 120px;
    padding: 0;
    &::before,
    &::after {
      content: '';
      display: table;
    }
    &::after {
      clear: both;
    }
  }

  li {
    float: left;
    box-sizing: border-box;
    width: 50%;
    padding: 0 19px;
    list-style: none;
  }

  .card {
    position: relative;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: center;

    h3 {
      font-size: @font-size-h3;
      font-weight: normal;
      text-align: left;

      margin: 0;
      color: @header-color;
    }

    p {
      font-size: @font-size-base;
      line-height: 20px;
      text-align: left;
      color: @text-color;
    }

    a {
      font-size: @font-size-base;
      line-height: 52px;
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 53px;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      text-decoration: none;
      color: @primary;
      border: 0;
      border-top: 1px solid @border-color;
      border-radius: 0 0 5px 5px;
      background-color: #fff;
    }
  }
}
</style>
