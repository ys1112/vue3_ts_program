<template>
  <el-dialog v-model="showMsgDialogVisible" title="部门信息" center style="height: 640px;" width="800"
    :before-close="handleClose" ::destroy-on-close="true">
    <div class="dialog-body">
      <el-container>
        <el-aside width="50%" style="height: 100%;">
          <el-table :data="msgData" height="100%" class="dialog-table" @row-click="showDetail"
            :row-class-name="tableRowClassName">
            <el-table-column align="center" show-overflow-tooltip prop="message_title" label="主题" width="120" />
            <el-table-column align="center" prop="message_level" label="等级" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.message_level == '必要'" type="danger">必要</el-tag>
                <el-tag v-if="scope.row.message_level == '重要'" type="warning">重要</el-tag>
                <el-tag v-if="scope.row.message_level == '一般'" type="primary">一般</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="message_create_time" label="发布日期">
              <template #default="scope">
                {{ scope?.row.message_create_time ? scope?.row.message_create_time.split('.')[0] : '--' }}
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main>
          <div v-html="detailInfo"></div>
        </el-main>
      </el-container>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="comfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ShowMsgDialog">
import { onMounted, onUnmounted, reactive, ref, toRefs, watchEffect } from 'vue';
import { getAllDepartMsg, deleteReadMsg, updateClick } from "@/api/department"
import { useUserInfoStore } from '@/store/userInfoStore'
import { id } from 'element-plus/es/locale/index.mjs';
const infoStore = useUserInfoStore()
const { userInfo, unreadNum } = toRefs(infoStore)
// 对话框显示控制
const showMsgDialogVisible = ref(false)
const msgData = ref()
const detailInfo = ref('<div class="msg-tip">请点击左侧信息查看消息详情</div>')
onMounted(() => {
})

// 未读消息标红
const tableRowClassName = ({ row }: { row: any }) => {
  return JSON.parse(userInfo.value.read_list).includes(row.id) ? 'warning-row' : ''
}
// 在组件卸载时解绑set-info事件
const comfirm = () => {
  showMsgDialogVisible.value = false;
};
const handleClose = (done: () => void) => {
  done()
}
const open = async () => {
  await getMsg()
  showMsgDialogVisible.value = true
}
// 获取部门消息
const getMsg = async () => {
  const params = {
    department: userInfo.value.department
  }
  const res = await getAllDepartMsg(params)
  if (res.data.status == 0) {
    msgData.value = res.data.results
  }
}
// 查看部门消息详情
const showDetail = async (row: any, column: any, event: Event) => {
  detailInfo.value = row.message_content
  if (JSON.parse(userInfo.value.read_list).includes(row.id)) {
    // 删除已读
    const params = {
      user_id: userInfo.value.id,
      read_id: row.id
    }
    await deleteReadMsg(params)
    // 点击量加1
    const params1 = {
      id: row.id
    }
    await updateClick(params1)
    userInfo.value.read_list = JSON.stringify(JSON.parse(userInfo.value.read_list).filter((item: number) => item != row.id))
    unreadNum.value = JSON.parse(userInfo.value.read_list).filter((item: number) => item != row.id).length
  }
}
watchEffect(()=>{
  if(!showMsgDialogVisible.value){
    detailInfo.value='<div class="msg-tip">请点击左侧信息查看消息详情</div>'
  }
})
// 向父组件暴露打开弹窗事件
defineExpose({
  open
})
</script>

<style lang="scss" scoped>

.dialog-body {
  height: 500px;

  .dialog-table {
    width: 100%;
    // border-right: 1px solid #ebeef5;
  }
}

.el-container {
  height: 100%;
}
:deep(.el-table__row) {
  cursor: pointer;
}
</style>
<style>
.msg-tip {
  margin-top: 200px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
.el-dialog__title {
  font-weight: 700;
}

.el-table .warning-row {
  position: relative;
  background-image: linear-gradient(
  -90deg,
  rgb(253, 225.6, 225.6) 20%,
  #fff);
}

.el-table .warning-row::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 10px;
  height: 10px;
  background-color: #F56C6C;
  border-radius: 50%;
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>