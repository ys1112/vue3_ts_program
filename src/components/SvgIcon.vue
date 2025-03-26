<template>
  <svg aria-hidden="true" :style="{ width: size + 'px', height: size + 'px' }">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup name="SvgIcon">
import { computed } from 'vue';
// 封装SvgIcon使用svg，即可使用iconfont等svg图标库
// 1.安装vite-plugin-svg-icons   fast-glob
// 2.新建src/assets/svgs  目录中新建.svg图标文件 将需要的svg代码复制到.svg图标文件中
// 3.vite.config.js中进行配置
// 4.main.ts中 import 'virtual:svg-icons-register'
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#333'
  },
  size: {
    type: [Number, String],
    default: 18
  }
})
const symbolId = computed(() => `#icon-${props.iconName}`);

</script>

<style lang="scss" scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
}
</style>