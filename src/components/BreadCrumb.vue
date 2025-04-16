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
  padding: 16px 10px 0 16px;
  display: flex;
  background-color: #e6e6e6;
  align-items: center;
}
.el-breadcrumb {
  font-size: 16px;
  margin-left: 4px;
}

</style>