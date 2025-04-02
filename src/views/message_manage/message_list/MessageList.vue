<template>
  <div class="common-wrapper">
    <div class="common-content message-list-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" style="width: 240px" placeholder="输入账号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary">添加产品管理员</el-button>
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
                <el-button type="success">编辑</el-button>
                <el-button type="danger">删除</el-button>
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
</template>

<script lang="ts" setup name="MessageList">
import { onBeforeMount, reactive, ref } from 'vue';
import { ElMessage } from "element-plus"
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
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const userData = reactive({
  userList: [] as { [key: string]: any }
})
</script>

<style lang="scss" scoped>
.message-list-content {
  height: 100%;
}
</style>