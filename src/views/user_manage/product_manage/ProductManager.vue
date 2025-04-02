<template>
  <div class="common-wrapper">
    <!-- 产品管理员主体 -->
    <div class="common-content product-manager-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" @input="searchAccount" style="width: 240px" placeholder="输入账号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" @click="addProductManager">添加产品管理员</el-button>
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
            <el-table-column prop="operate" label="操作" align="center">
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
  <DeleteUserDialog :deleteInfo="deleteInfo" ref="deleteDialogRef"></DeleteUserDialog>
</template>

<script lang="ts" setup name="ProductManager">
import { onBeforeMount, reactive, ref } from 'vue';
import { ElMessage } from "element-plus"
import { useDebounce } from '@/hooks/useDebounce'
import useUserManage from '@/hooks/useUserManage'
import CreateAdminDialog from "../components/CreateAdminDialog.vue";
import EditUserDialog from "../components/EditUserDialog.vue";
import DeleteUserDialog from "../components/DeleteUserDialog.vue";
import emitter from "@/utils/emitter";
interface getUserListData {
  identity: string
  department?: string
  status?: string
  search_value?: string
}
const identity = ref('产品管理员')
const deleteInfo = reactive({
  id:0,
  tip:'是否去掉此用户的管理员职位？删除后此用户将重新展现在用户列表中。'
})
const createDialogRef = ref()
const editDialogRef = ref()
const deleteDialogRef = ref()
const {getList} = useUserManage()
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
    identity: '用户'
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
      identity: '用户',
      search_value: searchValue.value
    }
    getAdminList(params)
  }
}, 800)

// 添加产品管理员
const addProductManager = () => { 
  createDialogRef.value.open()
}
const editUserInfo = (scope:any)=>{
  emitter.emit('editInfo', scope)
  editDialogRef.value.open()
}
const deleteUserInfo = (scope:any)=>{
  deleteInfo.id = scope
  deleteDialogRef.value.open()
}
</script>

<style lang="scss" scoped>
.product-manager-content {
  height: 100%;
}
</style>