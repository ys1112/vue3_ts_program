<template>
  <div class="common-wrapper">
    <!-- 消息管理员主体 -->
    <div class="common-content message-manager-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchAccount" style="width: 240px" placeholder="输入账号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" @click="addMessageManager">添加消息管理员</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="userData.userList" :key="tableKey" max-height="600" border style="width: 100%">
            <el-table-column type="index" label="id" width="50" />
            <el-table-column prop="account" label="账号" width="180" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="create_time" label="创建时间">
              <template #default="scope">
                {{ scope.row.create_time.split('.')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间">
              <template #default="scope">
                {{ scope?.row.update_time ? scope?.row.update_time.split('.')[0] : '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="180">
              <template #default="scope">
                <el-button type="success" @click="editUserInfo(scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteUserInfo(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 表格底部分页栏 -->
        <div class="table-content-footer">
          <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>

    </div>
  </div>
  <CreateAdminDialog :identity="identity" ref="createDialogRef"></CreateAdminDialog>
  <EditUserDialog :identity="identity" ref="editDialogRef"></EditUserDialog>
</template>

<script lang="ts" setup name="MessageManager">
import { onMounted, reactive, ref, markRaw, h, watch, toRefs, watchEffect } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus"
import { useDebounce } from '@/hooks/useDebounce'
import useUserManage from '@/hooks/useUserManage'
import CreateAdminDialog from "./components/CreateAdminDialog.vue";
import EditUserDialog from "./components/EditUserDialog.vue";
import emitter from "@/utils/emitter";
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from "@/store/userInfoStore";
import { trackRecord } from "@/utils/tracker";
import { downgradeAdmin } from "@/api/user";
onMounted(async () => {
  const flag = await getAdminList()
  if (flag) {
    ElMessage({
      message: "获取消息管理员列表成功",
      type: "success",
    })
  }
})
const identity = ref('消息管理员')
const { isUsersUpdate } = toRefs(useUserInfoStore())
// 通过 key 强制表格在分页时重新渲染
const tableKey = ref(0);

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
})

const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getAdminList()
}

const handleCurrentChange = (val: number) => {
  getAdminList()
}

const userData = reactive({
  userList: [] as { [key: string]: any }
})

// 获取用户列表事件
const getAdminList = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    identity: identity.value,
    keyword: searchValue.value
  }
  const data = await getList(params)
  pageInfo.total = data.total
  pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
  userData.userList = data.results
  tableKey.value++
  return true
}

// 输入账号进行搜索
const searchAccount = useDebounce(() => {
  if (searchValue.value.trim() || !searchValue.value) {
    getAdminList()
  }
}, 800)

// 添加消息管理员
const addMessageManager = () => {
  createDialogRef.value.open()
}
const editUserInfo = (scope: any) => {
  emitter.emit('editInfo', scope)
  editDialogRef.value.open()
}
const deleteUserInfo = (row: any) => {
  const params = {
    id: +row.id
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
            await trackRecord('user', 'downgrade', row.account, identity.value)
            ElMessage({
              type: 'success',
              message: '降级操作成功',
            })
            isUsersUpdate.value = true
          } else {
            ElMessage.error('降级操作失败，请稍后再试')
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
    getAdminList()
    isUsersUpdate.value = !isUsersUpdate.value
  }
})

// const stopWatch = watch(isUsersUpdate,(newVal,oldVal)=>{
//   console.log('isUsersUpdate变化了',newVal,oldVal);
// },{deep:true})

</script>

<style lang="scss" scoped>
.message-manager-content {
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