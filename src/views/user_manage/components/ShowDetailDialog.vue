<template>
  <el-dialog v-model="detailDialogVisible" align="center" title="用户信息" width="640" @close="handleClose"
    destroy-on-close>
    <div class="user-info-body">
      <el-row :gutter="16">
        <el-col :span="10">
          <div class="user-info-avatar">
            <el-image class="avatar-img" :src="userInfo.image_url" fit="cover" />
          </div>
        </el-col>
        <el-col :span="14">
          <div class="user-info-content">
            <el-descriptions :column="1">
              <el-descriptions-item label="账号：">{{ userInfo.account }}</el-descriptions-item>
              <el-descriptions-item label="姓名：">{{ userInfo.name }}</el-descriptions-item>
              <el-descriptions-item label="性别：">{{ userInfo.gender }}</el-descriptions-item>
              <el-descriptions-item label="部门：">{{ userInfo.department }}</el-descriptions-item>
              <el-descriptions-item label="邮箱：">{{ userInfo.email }}</el-descriptions-item>
              <el-descriptions-item label="状态：">{{ userInfo.status == 0 ? '正常' : '冻结' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="editUser" type="primary" link>
          编辑
        </el-button>
        <el-button size="large" @click="weightOperate" type="primary" link>
          赋权
        </el-button>
        <el-button size="large" @click="deleteUser" type="primary" link>
          删除用户
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ShowDetailDialog">
import { ref, h, defineEmits, markRaw } from 'vue';
import { ElMessage, ElMessageBox, ElRadio, ElRadioGroup, ElButton } from "element-plus"
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import emitter from '@/utils/emitter'
const detailDialogVisible = ref(false)
const selectedValue = ref('用户管理员')
const editRef = ref()
const isModifyData = ref(false)
const userInfo = ref({} as { [key: string]: any })
const emit = defineEmits(['close'])
const handleClose = (done: () => void) => {
  emit('close', isModifyData.value)
  // done()
}
const open = (item: any, ref: any) => {
  detailDialogVisible.value = true
  userInfo.value = item
  editRef.value = ref
}


defineExpose({
  open
})
// 编辑用户
const editUser = () => {
  emitter.emit('editInfo', userInfo.value)
  editRef.value.open()
}

// 赋权操作弹窗
const weightOperate = () => {
  ElMessageBox(
    {
      title: '赋权操作',
      message: () =>
        h(
          ElRadioGroup,
          {
            modelValue: selectedValue.value,        // 绑定值
            'onUpdate:modelValue': (val) => {  // 监听值更新
              selectedValue.value = val as string
            }
          },
          {
            // 通过函数返回子节点 插槽名 default 对应默认插槽
            default: () => [
              h(
                ElRadio,
                { value: '用户管理员' },
                // 通过函数返回子节点 
                () => '用户管理员'
              ),
              h(
                ElRadio,
                { value: '产品管理员' },
                () => '产品管理员'
              ),
            ]
          }
        ),
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: true,
      beforeClose: (action: any, instance: any, done: any) => {
        if (action === 'confirm') {
          if (!selectedValue.value) {
            return ElMessage({
              message: '请选择管理员类型',
              type: 'warning',
            })
          }
          // 处理赋权操作
          // 1.赋权失败提示
          // 2.赋权成功提示，关闭弹窗，重新获取列表
          detailDialogVisible.value = false
          isModifyData.value = true
          done()
        } else {
          done()
        }
      },
    }
  )
    .then((action) => {

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}
const deleteUser = () => {
  const params = {
    id: userInfo.value.id
  }
  ElMessageBox(
    {
      title: '删除操作',
      message: h('div', { class: 'delete-tip', innerHTML: '请慎重操作,删除后此用户将永久失去登录资格' }),
      customClass: 'custom-message-box',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      icon: markRaw(WarnTriangleFilled),
      dangerouslyUseHTMLString: true,
    }
  )
    .then(() => {
      // 降级操作

      detailDialogVisible.value = false
      isModifyData.value = true
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}
</script>

<style lang="scss" scoped>
.avatar-img {
  border-radius: 8px;
}

.user-info-body {
  height: 240px;
  padding-top: 24px;

  .user-info-avatar {
    height: 100%;
  }

  .user-info-content {
    height: 100%;
    padding-left: 32px;
  }
}

.dialog-footer {
  margin-right: 24px;
}
</style>
<style>
.custom-message-box {
  min-width: 600px;
  text-align: center;
}

.delete-tip {
  height: 64px;
  line-height: 64px;
  font-size: 16px;
}
</style>