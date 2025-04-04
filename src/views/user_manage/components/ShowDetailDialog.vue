<template>
  <el-dialog v-model="detailDialogVisible" align="center" title="用户信息" width="640" :before-close="handleClose"
    destroy-on-close>
    <div class="user-info-body">
      <el-row :gutter="16">
        <el-col :span="10">
          <div class="user-info-avatar">
            <el-image class="avatar-img" :src="userInfo.image_url || circleUrl" fit="cover" />
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
        <el-button size="large" @click="toDeleteUser" type="primary" link>
          删除用户
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ShowDetailDialog">
import { ref, h, markRaw, toRefs, watchEffect } from 'vue';
import { ElMessage, ElMessageBox, ElRadio, ElRadioGroup, ElButton } from "element-plus"
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from "@/store/userInfoStore";
import { empowerUser, deleteUser } from "@/api/user";
import emitter from '@/utils/emitter'
import { id } from 'element-plus/es/locale/index.mjs';
import ShowDetailDialog from '@/views/home/showDetailDialog/ShowDetailDialog.vue';
const { isUsersUpdate } = toRefs(useUserInfoStore())
const detailDialogVisible = ref(false)
const selectedValue = ref('用户管理员')
const circleUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
const editRef = ref()
const userInfo = ref({} as { [key: string]: any })
const handleClose = (done: () => void) => {
  done()
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
  if (isUsersUpdate.value) {
    detailDialogVisible.value = false
  }
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
              h(
                ElRadio,
                { value: '消息管理员' },
                () => '消息管理员'
              ),
            ]
          }
        ),
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: true,
      beforeClose: async (action: any, instance: any, done: any) => {
        if (action === 'confirm') {
          if (!selectedValue.value) {
            return ElMessage({
              message: '请选择管理员类型',
              type: 'warning',
            })
          }
          // 处理赋权操作
          // 1.赋权失败提示 2.赋权成功提示，关闭弹窗，重新获取列表
          const params = {
            id: userInfo.value.id,
            identity: selectedValue.value
          }
          const res = await empowerUser(params)
          if (res.data.status == 0) {
            ElMessage({
              message: `赋权为${selectedValue.value}成功`,
              type: "success",
            })
            detailDialogVisible.value = false
            isUsersUpdate.value = true
          } else {
            ElMessage('赋权失败，请稍后再试')
          }
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
// 删除用户
const toDeleteUser = () => {
  const params = {
    id: +userInfo.value.id,
    account: userInfo.value.account
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
      beforeClose: async (action: any, instance: any, done: any) => {
        if (action === 'confirm') {
          // 删除
          const res = await deleteUser(params)
          if (res.data.status == 0) {
            detailDialogVisible.value = false
            isUsersUpdate.value = true
            ElMessage({
              type: 'success',
              message: '删除用户成功',
            })
          } else {
            ElMessage('删除用户失败，请稍后再试')
          }
          done()
        } else {
          done()
        }
      },
    }
  )
    .then(() => {

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}
watchEffect(() => {
  console.log(isUsersUpdate.value);

  if (!isUsersUpdate.value) {
    console.log(123);

    detailDialogVisible.value = false
  }
})
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

.el-image__inner {
  width: 200px;
}
</style>