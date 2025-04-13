<template>
  <el-dialog v-model="showMsgDetailVisible" :title="detailInfo?.message_category" center style="height: 640px;"
    width="800" :before-close="handleClose" :destroy-on-close="true">
    <div class="dialog-body">
      <el-container>
        <el-aside width="72%" style="height: 100%;">
          <div class="msg-title">公告主题：{{ detailInfo.message_title }}</div>
          <div v-html="detailInfo.message_content"></div>
        </el-aside>
        <el-main>
          <el-descriptions :column="1">
            <el-descriptions-item label="发布部门：">{{ detailInfo.message_publish_department || "系统" }}</el-descriptions-item>
            <el-descriptions-item label="发布人：">{{ detailInfo.message_publish_name }}</el-descriptions-item>
            <el-descriptions-item label="类别：">{{ detailInfo.message_category }}</el-descriptions-item>
            <el-descriptions-item label="等级：">
              <el-tag size="small" v-if="detailInfo.message_level == '必要'" type="danger">必要</el-tag>
              <el-tag size="small" v-if="detailInfo.message_level == '重要'" type="warning">重要</el-tag>
              <el-tag size="small" v-if="detailInfo.message_level == '一般'" type="primary">一般</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发布时间：">
              {{ detailInfo?.message_create_time ? detailInfo?.message_create_time.split(' ')[0] : '--' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-main>
      </el-container>
    </div>
    <template #footer>
      <div>
        <el-button type="primary" @click="comfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ShowMsgDetailDialog">
import { onMounted, onUnmounted, reactive, ref, toRefs, watchEffect } from 'vue';
// 对话框显示控制
const showMsgDetailVisible = ref(false)
const detailInfo = ref()
const msgTitle=ref()
onMounted(() => {
})


// 在组件卸载时解绑set-info事件
const comfirm = () => {
  showMsgDetailVisible.value = false;
};
const handleClose = (done: () => void) => {
  done()
}
const open = (row: any) => {
  msgTitle.value = row.message_category
  detailInfo.value = row
  showMsgDetailVisible.value = true
}

watchEffect(() => {

})
// 向父组件暴露打开弹窗事件
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.dialog-body {
  height: 500px;

  .msg-title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #CDD0D6;
    font-size: 16px;
    color: #303133;
    font-weight: 700;
  }
}

.el-container {
  height: 100%;
  padding: 8px 32px;
}

:deep(.el-table__row) {
  cursor: pointer;
}

.el-main {
  border-left: 1px solid #CDD0D6;
  padding: 0 16px;
}
:deep(.el-descriptions__cell) {
  border-bottom: 1px solid #CDD0D6;
  padding-top: 8px;
}
:deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
  padding-bottom: 8px;
}
</style>
<style></style>