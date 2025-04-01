<template>
  <el-dialog v-model="detailDialogVisible" :title="detaiTitle" width="600" :before-close="handleClose" destroy-on-close>
    <div class="dialog-body">
      <div v-html="detailInfo.set_value"></div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="comfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ShowDetailDialog">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { CompanyInfoEnum } from '@/contants/CompanyInfoEnum'
import emitter from '@/utils/emitter'
// 对话框显示控制
const detailDialogVisible = ref(false)
const detailInfo = ref()
const detaiTitle = ref()
// 公司信息
const getCompanyTitle = (item: string) => {
  return CompanyInfoEnum[item as keyof typeof CompanyInfoEnum]
}
onMounted(() => {
  emitter.on('detail', (value: any) => {
    detailInfo.value = value
    detaiTitle.value = getCompanyTitle(value.set_name)
  })
})
// 在组件卸载时解绑set-info事件
onUnmounted(() => {
  emitter.off('detail')
})
const comfirm = () => {
  detailDialogVisible.value = false;
};
function handleClose(done: () => void) {
  done()
}
const open = () => {
  detailDialogVisible.value = true
}
// 向父组件暴露打开弹窗事件
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.dialog-body {
  min-height: 560px;
  padding: 15px;
  border: 1px dashed #CDD0D6;
}
</style>
<style>
.el-dialog__title {
  font-weight: 700;
}
</style>