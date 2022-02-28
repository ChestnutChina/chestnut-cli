<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h1>
          4
          <span></span>
          4
        </h1>
      </div>
      <h2>Page Not Be Found</h2>
      <p>
        Sorry but the page you are looking for does not exist, have been
        removed. name changed or is temporarily unavailable
      </p>
      <a :href="site.base">Back to homepage</a>
    </div>
  </div>
</template>
<script>
export default {
  name: "NotFound",
};
</script>
<script setup>
import { useData } from 'vitepress';
const { site } = useData();
</script>
<style lang="less" scoped>
#notfound {
  position: relative;
  height: 100vh;
}

#notfound .notfound {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.notfound {
  max-width: 520px;
  width: 100%;
  text-align: center;
  line-height: 1.4;
}

.notfound .notfound-404 {
  height: 190px;
}

.notfound .notfound-404 h1 {
  font-family: "Montserrat", sans-serif;
  font-size: 146px;
  font-weight: 700;
  margin: 0px;
  color: #232323;
}

.notfound .notfound-404 h1 > span {
  display: inline-block;
  width: 120px;
  height: 120px;
  background-image: url("../../assets/img/logo.png");
  background-size: cover;
  -webkit-transform: scale(1.4);
  -ms-transform: scale(1.4);
  transform: scale(1.4);
  z-index: -1;
}

.notfound h2 {
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  color: #232323;
}

.notfound p {
  font-family: "Montserrat", sans-serif;
  color: #787878;
  font-weight: 300;
}

.notfound a {
  font-family: "Montserrat", sans-serif;
  display: inline-block;
  padding: 12px 30px;
  font-weight: 700;
  background-color: #faad14;
  color: #fff;
  border-radius: 40px;
  text-decoration: none;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
}

.notfound a:hover {
  opacity: 0.8;
}
</style>
