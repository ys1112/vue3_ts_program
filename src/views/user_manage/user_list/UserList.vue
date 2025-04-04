<template>
  <div class="common-wrapper">
    <div class="common-content user-list-content">
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" @input="searchAccount" style="width: 240px" placeholder="输入账号进行搜索" />
          <el-select @change="selectToFilter" clearable v-model="departmentSelected" placeholder="请选择部门进行筛选"
            style="width: 240px;margin-left: 16px;">
            <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" :plain="isPlain.freezeUsers" @click="showFreezeOrAll(1)">筛选冻结用户</el-button>
          <el-button type="primary" :plain="isPlain.allUsers" @click="showFreezeOrAll(0)">显示全部用户</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="userData.userList" border style="width: 100%;" @row-dblclick="showDetail">
            <el-table-column prop="id" label="id" width="48" />
            <el-table-column prop="account" label="账号" width="180" />
            <el-table-column prop="name" label="姓名" width="160" />
            <el-table-column prop="gender" label="性别" width="160" />
            <el-table-column prop="identity" label="身份" width="160" />
            <el-table-column prop="department" label="部门" width="160" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="status" label="状态" width="160">
              <template #default="scope">
                <el-tag v-if="scope.row.status == '0'" type="success">正常</el-tag>
                <el-tag v-if="scope.row.status == '1'" type="danger">冻结</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间">
              <template #default="scope">
                {{ scope.row.create_time.split('.')[0] }}
              </template>
            </el-table-column>

            <el-table-column prop="operate" label="操作">
              <template #default="scope">
                <el-button type="primary" :disabled="scope.row.status == 1"
                  @click="frozenUser(scope.row.id)">冻结</el-button>
                <el-button type="success" :disabled="scope.row.status == 0"
                  @click="thawUser(scope.row.id)">解冻</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 表格底部分页栏 -->
        <div class="table-content-footer">
          <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
            layout="total, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
  <ShowDetailDialog ref="detailDialogRef" @close="handleClose"></ShowDetailDialog>
  <EditUserDialog :identity="identity" ref="editDialogRef"></EditUserDialog>
</template>

<script lang="ts" setup name="UserList">
import { onBeforeMount, reactive, ref, h,toRefs,watchEffect } from 'vue';
import { useDebounce } from '@/hooks/useDebounce'
import useUserManage from '@/hooks/useUserManage'
import { useUserInfoStore } from "@/store/userInfoStore";
import { ElMessage, ElMessageBox, ElButton } from "element-plus"
import { freezeUser, unfreezeUser, empowerUser, deleteUser } from '@/api/user';
import ShowDetailDialog from "../components/ShowDetailDialog.vue";
import EditUserDialog from "../components/EditUserDialog.vue";
interface getUserListData {
  identity: string
  department?: string
  status?: string
  search_value?: string
}
const { isUsersUpdate } = toRefs(useUserInfoStore())
const detailDialogRef = ref()
const editDialogRef = ref()
const departmentOptions = [
  {
    value: "总裁办",
    label: "总裁办",
  },
  {
    value: "产品部",
    label: "产品部",
  },
  {
    value: "销售部",
    label: "销售部",
  },
  {
    value: "组织部",
    label: "组织部",
  },
  {
    value: "企管部",
    label: "企管部",
  },
]
const identity = ref('用户')
const isPlain = reactive({
  freezeUsers: true,
  allUsers: true
})

const freezingThawingInfo = reactive({
  freeze: {
    isFreeze: 0,
    title: '提示',
    tip: '是否冻结该用户？',
  },
  thaw: {
    isFreeze: 1,
    title: '提示',
    tip: '是否解冻该用户？',
  }
})

const { getList } = useUserManage()

const departmentSelected = ref('')
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
const userData = reactive({
  userList: [] as { [key: string]: any }
})

onBeforeMount(async () => {
  const params = {
    identity: identity.value
  }
  getAdminList(params)
})

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

const selectToFilter = (value: string) => {
  if (value) {
    const params = {
      identity: identity.value,
      department: value
    }
    getAdminList(params)
  } else {
    const params = {
      identity: identity.value
    }
    getAdminList(params)
  }
}

const showFreezeOrAll = (isFreeze: number) => {
  if (isFreeze) {
    if (isPlain.freezeUsers) {
      const params = {
        identity: identity.value,
        status: isFreeze + ''
      }
      getAdminList(params)
    }
    isPlain.allUsers = true
    isPlain.freezeUsers = false

  } else {
    if (isPlain.allUsers) {
      const params = {
        identity: identity.value,
      }
      getAdminList(params)
    }
    isPlain.allUsers = false
    isPlain.freezeUsers = true
  }
}

// 获取用户列表事件
const getAdminList = async (params: getUserListData) => {
  const userList = await getList(params)
  pageInfo.total = userList.length
  pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
  userData.userList = userList
}

const frozenUser = (id: string) => {
  useMessageBox(freezingThawingInfo.freeze, id)
}

const thawUser = (id: string) => {
  useMessageBox(freezingThawingInfo.thaw, id)
}

const useMessageBox = (info: { [key: string]: any }, id: string) => {
  ElMessageBox(
    {
      title: info.title,
      message: h('div', { class: 'operate-info', innerHTML: info.tip }, []),
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      showCancelButton: true,
    }
  )
    .then(async () => {
      const params = {
        id: +id
      }
      if (info.isFreeze == 0) {
        const res = await freezeUser(params)
        if (res.data.status == 0) {
          isUsersUpdate.value = true
          ElMessage({
            type: 'success',
            message: '冻结用户成功',
          })
        } else {
          ElMessage.error('冻结用户失败')
        }
      }
      if (info.isFreeze == 1) {
        const res = await unfreezeUser(params)
        if (res.data.status == 0) {
          isUsersUpdate.value = true
          ElMessage({
            type: 'success',
            message: '解冻用户成功',
          })
        } else {
          ElMessage.error('解冻用户失败')
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const showDetail = (row: any, column: any, event: Event) => {
  detailDialogRef.value.open(row, editDialogRef.value)
}

const handleClose = (value:boolean) =>{
  // 若数据修改，重新获取列表
  console.log(value);
  
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
</script>

<style lang="scss" scoped>
.user-list-content {
  height: 100%;
}
</style>
<style>
.operate-info {
  height: 48px;
  line-height: 48px;
  font-size: 16px;
}
</style>