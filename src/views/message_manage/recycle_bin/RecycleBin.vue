<template>
  <div class="common-wrapper">
    <div class="common-content recycle-bin-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchMsg" style="width: 240px" placeholder="输入公告主题进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" @click="refreshData">刷新</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="recycleData" :key="tableKey" max-height="600" border style="width: 100%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="message_title" label="公告主题" show-overflow-tooltip min-width="120" />
            <el-table-column prop="message_category" label="所属类别" min-width="120" />
            <el-table-column prop="message_publish_name" label="发布人" min-width="120" />
            <el-table-column prop="message_publish_department" label="发布部门" min-width="120">
              <template #default="scope">
                {{ scope.row.message_publish_department || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="message_receipt_object" label="接收对象" min-width="120" />
            <el-table-column prop="message_delete_time" label="删除日期" min-width="120">
              <template #default="scope">
                {{ scope.row.message_delete_time.split('.')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" fixed="right" width="200">
              <template #default="scope">
                <el-button type="success" @click="restoreMessage(scope.row.id)">还原</el-button>
                <el-button type="danger" @click="deleteData(scope.row.id)">删除</el-button>
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

<script lang="ts" setup name="RecycleBin">
import { onMounted, reactive, ref, markRaw, h, toRefs, watchEffect } from 'vue';
import { ElMessage, type TabsPaneContext, ElMessageBox } from "element-plus"
import { getRecycleMsg, restoreMsg, deleteRecycleMsg } from '@/api/message';
import { useDebounce } from '@/hooks/useDebounce'
import { QuestionFilled, WarnTriangleFilled } from '@element-plus/icons-vue'
import { useMessageStore } from "@/store/useMessageStore";
const { isMessageUpdate } = toRefs(useMessageStore())

onMounted(async () => {
  const flag = await getMsg()
  flag && ElMessage({
    type: 'success',
    message: '获取回收站消息列表成功',
  })
})
const tableKey = ref(0);
// 搜索关键字
const searchValue = ref('')
// 产品列表
const recycleData = ref([] as { [key: string]: any })
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

const getMsg = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    keyword: searchValue.value
  }
  const res = await getRecycleMsg(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo.total = res.data.total || 0
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    recycleData.value = res.data.results
    return true
  }
}
// 输入账号进行搜索

const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getMsg()
}
const handleCurrentChange = (val: number) => {
  getMsg()
}

const refreshData = async () => {
  const flag = await getMsg()
  flag && ElMessage({
    type: 'success',
    message: '刷新成功',
  })
}

const searchMsg = useDebounce(async () => {
  if (searchValue.value.trim() || !searchValue.value) {
    getMsg()
  }
}, 800)
const restoreMessage = (id: string) => {
  const params = {
    id: +id
  }
  ElMessageBox(
    {
      title: '还原消息操作',
      message: h('div', { class: 'delete-tip', innerHTML: '请确认是否将消息恢复展示到消息列表中？' }),
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
          const res = await restoreMsg(params)
          if (res.data.status == 0) {
            ElMessage({
              type: 'success',
              message: '还原成功',
            })
            isMessageUpdate.value = true
          } else {
            ElMessage.error('还原消息失败，请稍后再试')
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
const deleteData = (id: string) => {
  const params = {
    id: +id
  }
  ElMessageBox(
    {
      title: '删除操作',
      message: h('div', { class: 'delete-tip', innerHTML: '请慎重操作,删除该消息记录后将无法恢复' }),
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
          const res = await deleteRecycleMsg(params)
          if (res.data.status == 0) {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            isMessageUpdate.value = true
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
watchEffect(() => {
  if (isMessageUpdate.value) {
    getMsg()
    isMessageUpdate.value = !isMessageUpdate.value
  }
})
</script>

<style lang="scss" scoped>
.recycle-bin-content {
  height: 100%;
}
</style>
