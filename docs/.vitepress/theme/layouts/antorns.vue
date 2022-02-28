<template>
  <div class="layout-antorns">
    <div class="antorns-wrap">
      <div class="antorn-container">
        <div class="antorn-line">
          <span :style="{ top: `${inkTop}px` }" class="antorn-line-i"></span>
        </div>
        <ul class="antorn-list">
          <li
            v-for="item in antorns"
            :key="item.text"
            :class="isActive(item.link)"
          >
            <a
              :data-href="item.link"
              :href="item.link"
              @click.prevent="chooseLink(item)"
              >{{ item.text }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Antorn",
};
</script>
<script setup>
import { onBeforeUnmount, ref, computed, onMounted } from "vue";
import { useData } from "vitepress";

const { page } = useData();

const mapHeaders = function (headers) {
  return headers.map((header) => {
    return {
      text: header.title,
      link: `#${header.slug}`,
    };
  });
};

const antorns = computed(() => mapHeaders(page.value.headers));

const inkTop = ref(8);
const animating = ref(false);
const currentLink = ref("");

const isActive = function (link) {
  return currentLink.value && currentLink.value === link ? "active" : "";
};

function scrollTop(el, from = 0, to, duration = 500, endCallback) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  function scroll(start, end, step) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, step);
}

const chooseLink = function (current) {
  currentLink.value = current.link;
  const currentId = current.link.split("#").pop();
  const anchor = document.getElementById(currentId);
  if (!anchor) return;

  const offsetTop = anchor.offsetTop - 100;
  animating.value = true;
  const currentPos = window.pageYOffset || window.scrollTop;
  scrollTop(window, currentPos, offsetTop, 1000, () => {
    animating.value = false;
  });
  this.handleSetInkTop(offsetTop);
};

const handleSetInkTop = function (offsetTop = 0) {
  const currentLinkElementA = document.querySelector(
    `a[data-href="${currentLink.value}"]`
  );
  if (!currentLinkElementA) return;

  const elementATop = currentLinkElementA.offsetTop;
  inkTop.value = elementATop < 0 ? offsetTop : elementATop;
};

const getCurrentScrollAtTitleId = function (scrollTop) {
  let i = -1;
  let titleItem = "";
  const len = antorns.value.length;

  while (++i < len) {
    const currentEle = antorns.value[i];
    const currentOffset = document.querySelector(
      `.content.chestnut-doc a.header-anchor[href="${currentEle.link}"]`
    ).offsetTop;
    const nextEle = antorns.value[i + 1];
    const nextOffset =
      nextEle &&
      document.querySelector(
        `.content.chestnut-doc a.header-anchor[href="${nextEle.link}"]`
      ).offsetTop;
    if (
      scrollTop >= currentOffset &&
      scrollTop < ((nextEle && nextOffset) || Infinity)
    ) {
      titleItem = currentEle;
      break;
    }
  }

  currentLink.value = titleItem ? titleItem.link : antorns.value[0].link;
  handleSetInkTop();
};

const handleScroll = function () {
  if (animating.value) return;

  const scrollTop = window.pageYOffset || window.scrollTop;
  getCurrentScrollAtTitleId(scrollTop);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, false);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll, false);
});
</script>
