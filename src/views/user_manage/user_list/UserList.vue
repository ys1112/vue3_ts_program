<template>
  <div class="common-wrapper">
    <div class="common-content user-list-content">
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchAccount" style="width: 240px" placeholder="输入账号进行搜索" />
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
          <el-table :data="userData.userList" :key="tableKey" max-height="600" border style="width: 100%;" @row-dblclick="showDetail">
            <el-table-column type="index" width="50" />
            <el-table-column prop="account" label="账号" max-width="180" />
            <el-table-column prop="name" label="姓名" max-width="120"/>
            <el-table-column prop="gender" label="性别" max-width="120"/>
            <el-table-column prop="identity" label="身份" max-width="120"/>
            <el-table-column prop="department" label="部门" max-width="120"/>
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="status" label="状态" max-width="120">
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
            <el-table-column prop="update_time" label="更新时间">
              <template #default="scope">
                {{ scope?.row.update_time ? scope?.row.update_time.split('.')[0] : '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="176">
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
            layout="total, sizes, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
  <ShowDetailDialog ref="detailDialogRef"></ShowDetailDialog>
  <EditUserDialog :identity="identity" ref="editDialogRef"></EditUserDialog>
</template>

<script lang="ts" setup name="UserList">
import { onMounted, reactive, ref, h,toRefs,watchEffect } from 'vue';
import { useDebounce } from '@/hooks/useDebounce'
import useUserManage from '@/hooks/useUserManage'
import { useUserInfoStore } from "@/store/userInfoStore";
import { ElMessage, ElMessageBox, ElButton } from "element-plus"
import { freezeUser, unfreezeUser, empowerUser, deleteUser } from '@/api/user';
import ShowDetailDialog from "../components/ShowDetailDialog.vue";
import EditUserDialog from "../components/EditUserDialog.vue";
import { useSettingStore } from "@/store/settingInfoStore";
onMounted(async() => {
  getUserList()
  const flag = await getUserList()
  if (flag) {
    ElMessage({
      message: "获取用户列表成功",
      type: "success",
    })
  }
})
const { isUsersUpdate } = toRefs(useUserInfoStore())
const detailDialogRef = ref()
const editDialogRef = ref()
const { departmentInfo } = useSettingStore()
const departmentOptions = departmentInfo.map(item=>{
  return {
    value:item,
    label:item
  }
})
// 通过 key 强制表格在分页时重新渲染
const tableKey = ref(0);

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
// 用户数据
const userData = reactive({
  userList: [] as { [key: string]: any }
})
const userStatus = ref()


// 输入账号进行搜索
const searchAccount = useDebounce(() => {
  if (searchValue.value.trim() || !searchValue.value) {
    getUserList()
  }
}, 800)

const selectToFilter = () => {
  getUserList()
}

const showFreezeOrAll = (isFreeze: number) => {
  if (isFreeze) {
    if (isPlain.freezeUsers) {
      userStatus.value = isFreeze + ''
      getUserList()
    }
    isPlain.allUsers = true
    isPlain.freezeUsers = false

  } else {
    if (isPlain.allUsers) {
      userStatus.value = ''
      departmentSelected.value = ''
      searchValue.value = ''
      getUserList()
    }
    isPlain.allUsers = false
    isPlain.freezeUsers = true
  }
}

// 获取用户列表事件
const getUserList = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    identity: identity.value,
    keyword: searchValue.value,
    department:departmentSelected.value,
    status:userStatus.value
  }
  const data = await getList(params)
  pageInfo.total = data.total
  pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
  userData.userList = data.results
  tableKey.value++
  return true
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
  pageInfo.pageSize = val
  getUserList()
}

const handleCurrentChange = (val: number) => {
  getUserList()
}

const showDetail = (row: any, column: any, event: Event) => {
  detailDialogRef.value.open(row, editDialogRef.value)
}

watchEffect(() => {
  if (isUsersUpdate.value) {
    getUserList()
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