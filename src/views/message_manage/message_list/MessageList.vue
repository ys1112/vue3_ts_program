<template>
  <div class="common-wrapper">
    <div class="common-content message-list-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <!-- 公告管理 -->
        <el-tab-pane label="公告管理" name="messageList">
          <!-- 结构顶部搜索框和按钮区域 -->
          <div class="table-header">
            <!-- 结构顶部左侧select搜索 -->
            <div class="table-header-left">
              <el-select clearable v-model="fliterData.message_publish_department" @change="filterMessage" placeholder="选择部门进行筛选"
                size="default" style="height: 32px; width: 240px">
                <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
              <el-radio-group @change="filterMessage" v-model="fliterData.message_level" style="margin-left: 40px;">
                <el-radio value="一般" size="default">一般</el-radio>
                <el-radio value="重要" size="default">重要</el-radio>
                <el-radio value="必要" size="default">必要</el-radio>
              </el-radio-group>
            </div>
            <!-- 结构顶部右侧按钮区域 -->
            <div class="table-header-right">
              <el-button type="primary" :plain="true" @click="getAllList">全部公告</el-button>
              <el-button type="primary" @click="publishMsg">发布公告</el-button>
            </div>
          </div>
          <!-- 表格主体 -->
          <div class="message-table">
            <!-- 表格内容部分 -->
            <div class="message-table-body">
              <el-table :data="corpMsgData" border style="width: 100%" :scrollbar-always-on="true">
                <el-table-column prop="id" label="id" width="48" />
                <el-table-column prop="message_title" label="公告主题" />
                <el-table-column prop="message_category" label="消息类别" width="128" />
                <el-table-column prop="message_publish_department" label="发布部门" width="128" />
                <el-table-column prop="message_publish_name" label="发布人" width="96" />
                <el-table-column prop="message_receipt_object" label="接收对象" width="120" />
                <el-table-column prop="message_level" label="公告等级" width="128">
                  <template #default="scope">
                    <el-tag v-if="scope.row.message_level == '必要'" type="danger">必要</el-tag>
                    <el-tag v-if="scope.row.message_level == '重要'" type="warning">重要</el-tag>
                    <el-tag v-if="scope.row.message_level == '一般'" type="primary">一般</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="message_create_time" label="发布时间" width="164">
                  <template #default="scope">
                    {{ scope?.row.message_create_time ? scope?.row.message_create_time.split('.')[0] : '--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="message_update_time" label="最新编辑时间" width="164">
                  <template #default="scope">
                    {{ scope?.row.message_update_time ? scope?.row.message_update_time.split('.')[0] : '--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="message_click_number" label="阅读人数" width="128" />
                <el-table-column prop="operate" label="操作" fixed="right" width="200">
                  <template #default="scope">
                    <el-button type="success">修改</el-button>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="message-table-footer">
              <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                layout="total, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </div>
        </el-tab-pane>
        <!-- 系统消息 -->
        <el-tab-pane label="系统消息" name="systemList">
          <!-- 结构顶部搜索框和按钮区域 -->
          <div class="table-header" >
            <!-- 结构顶部左侧搜索框域 -->
            <div class="table-header-left">
            </div>
            <!-- 结构顶部右侧按钮区域 -->
            <div class="table-header-right">
              <el-button type="primary">发布系统消息</el-button>
            </div>
          </div>
          <!-- 表格主体 -->
          <div class="message-table">
            <!-- 表格内容部分 -->
            <div class="message-table-body">
              <el-table :data="systemData" border style="width: 100%" :scrollbar-always-on="true">
                <el-table-column prop="id" label="id" width="48" />
                <el-table-column prop="message_title" label="公告主题" width="280" />
                <el-table-column prop="message_publish_name" label="发布者" min-width="100"/>
                <el-table-column prop="message_click_number" label="阅读人数" min-width="100" />
                <el-table-column prop="message_create_time" label="发布时间" width="240">
                  <template #default="scope">
                    {{ scope?.row.message_create_time ? scope?.row.message_create_time.split('.')[0] : '--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作" fixed="right" width="240">
                  <template #default="scope">
                    <el-button type="success">修改</el-button>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="message-table-footer">
              <el-pagination v-model:current-page="pageInfo1.currentPage" :page-size="pageInfo1.pageSize"
                layout="total, prev, pager, next" :total="pageInfo1.total" :hide-on-single-page="pageInfo1.isSinglePage"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <PublishMsgDialog ref="publishMsgRef"></PublishMsgDialog>
</template>

<script lang="ts" setup name="MessageList">
import PublishMsgDialog from "../components/PublishMsgDialog.vue";
import { onMounted, reactive, ref, h, watchEffect, toRefs, markRaw } from 'vue';
import { ElMessage, type TabsPaneContext, ElMessageBox } from "element-plus"
import { getCorpMsg, getSysMsg,filterMsg } from "@/api/message";
import { useSettingStore } from "@/store/settingInfoStore";
const activeName = ref('messageList')
const publishMsgRef = ref()
onMounted(() => {
  getCropMsgList()
})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName == 'systemList') {
    // 获取系统消息列表
    getSysMsgList()
  } else {
    // 获取公告管理列表
    getCropMsgList()
  }
}
// 公告管理
// 搜索关键字
const fliterData = reactive({
  message_publish_department: '',
  message_level: ''
})
const { departmentInfo } = useSettingStore()
const departmentOptions = departmentInfo.map(item => {
  return {
    value: item,
    label: item
  }
})
// 公告列表
const corpMsgData = ref([] as { [key: string]: any })
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
// 筛选公司消息
const filterMessage = async() => {
  fliterData.message_publish_department = fliterData.message_publish_department || ''
  const res = await filterMsg(fliterData)
  if (res.data.status == 0) {
    ElMessage({
      type: 'success',
      message: '筛选公司消息列表成功',
    })
    const list = res.data.results
    pageInfo.total = list.length
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    corpMsgData.value = res.data.results
  }
}

// 发布消息
const publishMsg = ()=>{
  publishMsgRef.value.open(1)
}

const getAllList = () =>{
  fliterData.message_publish_department= ''
  fliterData.message_level= ''
  getCropMsgList()
}
// 获取公司消息列表
const getCropMsgList = async () => {
  const res = await getCorpMsg()
  if (res.data.status == 0) {
    ElMessage({
      type: 'success',
      message: '获取公司公告列表成功',
    })
    const list = res.data.results
    pageInfo.total = list.length
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    corpMsgData.value = res.data.results
  }
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}


// 系统消息
const systemData = ref([] as { [key: string]: any })
// 分页数据
const pageInfo1 = reactive({
  // 当前页
  currentPage: 1,
  // 每页数据数量
  pageSize: 10,
  // 数据总数
  total: 0,
  // 隐藏
  isSinglePage: false,
})

// 获取系统消息列表
const getSysMsgList = async () => {
  const res = await getSysMsg()
  if (res.data.status == 0) {
    ElMessage({
      type: 'success',
      message: '获取系统消息列表成功',
    })
    const list = res.data.results
    pageInfo1.total = list.length
    pageInfo1.isSinglePage = pageInfo1.total / pageInfo1.pageSize > 1
    systemData.value = res.data.results
  }
}

</script>

<style lang="scss" scoped>
.message-list-content {
  height: 100%;

  .table-header-left {
    display: flex;
  }

  .message-table {
    height: 656px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;

    .message-table-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>