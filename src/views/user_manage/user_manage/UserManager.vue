<template>
  <div class="common-wrapper">
    <!-- 用户管理员主体 -->
    <div class="common-content user-manager-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchAccount" style="width: 240px" placeholder="输入账号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" @click="addUserManager">添加用户管理员</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="userData.userList" border style="width: 100%">
            <el-table-column prop="id" label="id" width="48" />
            <el-table-column prop="account" label="账号" width="180" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="operate" label="操作">
              <template #default="scope">
                <el-button type="success" @click="editUserInfo(scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteUserInfo(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 表格底部分页栏 -->
        <div class="table-content-footer">
          <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
            layout="total, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
            @size-change="handleSizeChange" :background="pageInfo.background" @current-change="handleCurrentChange" />
        </div>
      </div>

    </div>
  </div>
  <CreateAdminDialog :identity="identity" ref="createDialogRef"></CreateAdminDialog>
  <EditUserDialog :identity="identity" ref="editDialogRef"></EditUserDialog>
</template>

<script lang="ts" setup name="UserManager">
import { onBeforeMount, reactive, ref, markRaw, h, watch, toRefs, watchEffect } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus"
import { useDebounce } from '@/hooks/useDebounce'
import useUserManage from '@/hooks/useUserManage'
import CreateAdminDialog from "../components/CreateAdminDialog.vue";
import EditUserDialog from "../components/EditUserDialog.vue";
import emitter from "@/utils/emitter";
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from "@/store/userInfoStore";
import { downgradeAdmin } from "@/api/user";
interface getUserListData {
  identity: string
  department?: string
  status?: string
  search_value?: string
}
const identity = ref('用户管理员')
const { isUsersUpdate } = toRefs(useUserInfoStore())

const createDialogRef = ref()
const editDialogRef = ref()
const { getList } = useUserManage()
// 搜索关键字
const searchValue = ref('')
// 分页数据
const pageInfo = reactive({
  // 当前页
  currentPage: 1,
  // 每页数据数量
  pageSize: 10,
  // 数据总数
  total: 0,
  // 隐藏
  isSinglePage: false,
  background: false
})

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const userData = reactive({
  userList: [] as { [key: string]: any }
})
onBeforeMount(async () => {
  const params = {
    identity: identity.value
  }
  getAdminList(params)
})

// 获取用户列表事件
const getAdminList = async (params: getUserListData) => {
  const userList = await getList(params)
  pageInfo.total = userList.length
  pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
  userData.userList = userList
}

// 输入账号进行搜索
const searchAccount = useDebounce(() => {
  if (searchValue.value.trim() || !searchValue.value) {
    const params = {
      identity: identity.value,
      search_value: searchValue.value
    }
    getAdminList(params)
  }
}, 800)

// 添加用户管理员
const addUserManager = () => {
  createDialogRef.value.open()
}
const editUserInfo = (scope: any) => {
  emitter.emit('editInfo', scope)
  editDialogRef.value.open()
}
const deleteUserInfo = (id: any) => {
  const params = {
    id: +id
  }
  ElMessageBox(
    {
      title: '删除操作',
      message: h('div', { class: 'delete-tip', innerHTML: '是否去掉此用户的管理员职位？删除后此用户将重新展现在用户列表中。' }),
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
          // 降级操作
          const res = await downgradeAdmin(params)
          if (res.data.status == 0) {
            ElMessage({
              type: 'success',
              message: '降级操作成功',
            })
            isUsersUpdate.value = true
          } else {
            ElMessage('降级操作失败，请稍后再试')
          }
          done()
        } else {
          done()
        }
      },
    }
  )
    .then(() => {
      // 降级操作
      // const res = await downgradeAdmin(params)
      // if (res.data.status == 0) {
      //   ElMessage({
      //     type: 'success',
      //     message: '降级操作成功',
      //   })
      //   isUsersUpdate.value = true
      // }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

watchEffect(() => {
  if (isUsersUpdate.value) {
    const params = {
      identity: identity.value
    }
    getAdminList(params)
    isUsersUpdate.value = !isUsersUpdate.value
  }
})

// const stopWatch = watch(isUsersUpdate,(newVal,oldVal)=>{
//   console.log('isUsersUpdate变化了',newVal,oldVal);
// },{deep:true})

</script>

<style lang="scss" scoped>
.user-manager-content {
  height: 100%;
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