<template>
  <div class="common-wrapper">
    <div class="common-content login-log-content">
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchLog" style="width: 240px" placeholder="输入登录账号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" :disabled="isClearDisabled" @click="clearLog">清空登录日志</el-button>
          <el-button type="primary" @click="refreshData">刷新</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="loginData" :key="tableKey" max-height="600" border style="width: 100%">
            <el-table-column type="index" label="id" width="50" />
            <el-table-column prop="account" label="登录账号" min-width="240" />
            <el-table-column prop="identity" label="身份" min-width="240" />
            <el-table-column prop="name" label="姓名" min-width="240" />
            <el-table-column prop="email" label="联系方式" min-width="240" />
            <el-table-column prop="login_time" label="登录时间" min-width="240">
              <template #default="scope">
                {{ scope.row.login_time.split('.')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" fixed="right" width="160">
              <template #default="scope">
                <el-button type="danger" @click="deleteLog(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 表格底部分页栏 -->
        <div class="table-content-footer">
          <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next" :total="pageInfo.total"
            :hide-on-single-page="pageInfo.isSinglePage" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="LoginLog">
import { onMounted, reactive, ref, markRaw, h, toRefs, watchEffect } from 'vue';
import { ElMessage, type TabsPaneContext, ElMessageBox } from "element-plus"
import { getLoginLog, deleteLoginLog, clearLoginLog } from '@/api/login_log';
import { useDebounce } from '@/hooks/useDebounce'
import { QuestionFilled, WarnTriangleFilled } from '@element-plus/icons-vue'

const isLogChange = ref(false)
onMounted(async () => {
  const flag = await getLoginList()
  flag && ElMessage({
    type: 'success',
    message: '获取操作日志列表成功',
  })
})
const tableKey = ref(0);
// 搜索关键字
const searchValue = ref('')
// 产品列表
const loginData = ref([] as { [key: string]: any })
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
const isClearDisabled = ref(false)

const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getLoginList()
}
const handleCurrentChange = (val: number) => {
  getLoginList()
}

const getLoginList = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    keyword: searchValue.value
  }
  const res = await getLoginLog(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo.total = res.data.total || 0
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    loginData.value = res.data.results
    return true
  }
}

// 清空记录
const clearLog = async () => {
  ElMessageBox(
    {
      title: '清空登录日志记录',
      message: h('div', { class: 'delete-tip', innerHTML: '请慎重操作,清空登录日志记录后将无法恢复' }),
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
          const res = await clearLoginLog()
          if (res.data.status == 0) {
            getLoginList()
            ElMessage({
              type: 'success',
              message: res.data.message,
            })
            isLogChange.value = true
          } else {
            ElMessage.error('清空失败，请稍后再试')
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

// 搜索记录
const searchLog = useDebounce(async () => {
  if (searchValue.value.trim() || !searchValue.value) {
    getLoginList()
  }
}, 800)

// 删除单条记录
const deleteLog = (id: string) => {
  const params = {
    id: +id
  }
  ElMessageBox(
    {
      title: '删除登录日志记录',
      message: h('div', { class: 'delete-tip', innerHTML: '请注意删除该条记录后将无法恢复' }),
      customClass: 'custom-message-box',
      showCancelButton: true,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      icon: markRaw(QuestionFilled),
      dangerouslyUseHTMLString: true,
      beforeClose: async (action: any, instance: any, done: any) => {
        if (action === 'confirm') {
          const res = await deleteLoginLog(params)
          if (res.data.status == 0) {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            isLogChange.value = true
          } else {
            ElMessage.error('删除失败，请稍后再试')
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

const refreshData = useDebounce(async()=>{
  const flag = await getLoginList()
  flag && ElMessage({
    type: 'success',
    message: '获取操作日志列表成功',
  })
},500)

watchEffect(() => {
  if (isLogChange.value) {
    getLoginList()
    isLogChange.value = !isLogChange.value
  }
  isClearDisabled.value = pageInfo.total == 0 ? true : false
})
</script>

<style lang="scss" scoped>
.login-log-content {
  height: 100%;
}
</style>