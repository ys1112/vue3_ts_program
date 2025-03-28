<template>
  <div class="bread">
    <SvgIcon icon-name="location" size="18" class="bread-crumb-icon" color="#1296db"></SvgIcon>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item>{{ breadItems.first }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="breadItems.second">{{ breadItems.second }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup name="Breadcrumb">
import { ArrowRight } from '@element-plus/icons-vue'
import SvgIcon from "@/components/SvgIcon.vue"
defineProps(['breadItems'])

</script>

<style lang="scss" scoped>
.bread {
  padding: 10px 10px 0 10px;
  display: flex;
  background-color: #e6e6e6;
  align-items: center;
}
.el-breadcrumb {
  font-size: 14px;
  margin-left: 4px;
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner) {
  font-weight: 700;
}
:deep(.el-breadcrumb__item .el-breadcrumb__inner:hover) {
  font-weight: 700;
}
</style>