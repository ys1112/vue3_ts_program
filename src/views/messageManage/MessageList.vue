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
              <el-select clearable v-model="fliterData.department" @change="filterMessage"
                placeholder="选择部门进行筛选" size="default" style="height: 32px; width: 240px">
                <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
              <el-radio-group @change="filterMessage" v-model="fliterData.messageLevel" style="margin-left: 40px;">
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
              <el-table :data="corpMsgData" :key="tableKey" max-height="600" border style="width: 100%" :scrollbar-always-on="false">
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="message_title" show-overflow-tooltip min-width="128" label="公告主题" />
                <el-table-column prop="message_category" label="消息类别" width="128" />
                <el-table-column prop="message_publish_department" label="发布部门" width="128" />
                <el-table-column prop="message_publish_name" label="发布人" width="96" />
                <el-table-column prop="message_receipt_object" label="接收对象" width="120" />
                <el-table-column prop="message_level" label="公告等级" align="center" width="128">
                  <template #default="scope">
                    <el-tag size="small" v-if="scope.row.message_level == '必要'" type="danger">必要</el-tag>
                    <el-tag size="small" v-if="scope.row.message_level == '重要'" type="warning">重要</el-tag>
                    <el-tag size="small" v-if="scope.row.message_level == '一般'" type="primary">一般</el-tag>
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
                    <el-button type="success" @click="editCorpMsg(scope.row)">修改</el-button>
                    <el-button type="danger" @click="deleteMessage(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="message-table-footer">
              <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </div>
        </el-tab-pane>
        <!-- 系统消息 -->
        <el-tab-pane label="系统消息" name="systemList">
          <!-- 结构顶部搜索框和按钮区域 -->
          <div class="table-header">
            <!-- 结构顶部左侧搜索框域 -->
            <div class="table-header-left">
            </div>
            <!-- 结构顶部右侧按钮区域 -->
            <div class="table-header-right">
              <el-button type="primary" @click="publishSysMsg">发布系统消息</el-button>
            </div>
          </div>
          <!-- 表格主体 -->
          <div class="message-table">
            <!-- 表格内容部分 -->
            <div class="message-table-body">
              <el-table :data="systemData" :key="tableKey" max-height="600" border style="width: 100%" :scrollbar-always-on="false">
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="message_title" label="公告主题" show-overflow-tooltip min-width="128" />
                <el-table-column prop="message_publish_name" label="发布者" min-width="100" />
                <el-table-column prop="message_click_number" label="阅读人数" min-width="100" />
                <el-table-column prop="message_create_time" label="发布时间" width="240">
                  <template #default="scope">
                    {{ scope?.row.message_create_time ? scope?.row.message_create_time.split('.')[0] : '--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="message_update_time" label="最新编辑时间" width="240">
                  <template #default="scope">
                    {{ scope?.row.message_update_time ? scope?.row.message_update_time.split('.')[0] : '--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作" fixed="right" width="240">
                  <template #default="scope">
                    <el-button type="success"@click="editSysMsg(scope.row)">修改</el-button>
                    <el-button type="danger" @click="deleteMessage(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="message-table-footer">
              <el-pagination v-model:current-page="pageInfo1.currentPage" :page-size="pageInfo1.pageSize"
                layout="total, sizes, prev, pager, next" :total="pageInfo1.total" :hide-on-single-page="pageInfo1.isSinglePage"
                @size-change="handleSizeChange1" @current-change="handleCurrentChange1" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <PublishMsgDialog ref="publishMsgRef"></PublishMsgDialog>
  <EditMsgDialog ref="editMsgRef"></EditMsgDialog>
  <EditSysMsgDialog ref="editSysMsgRef"></EditSysMsgDialog>
</template>

<script lang="ts" setup name="MessageList">
import PublishMsgDialog from "./components/PublishMsgDialog.vue";
import EditMsgDialog from "./components/EditMsgDialog.vue";
import EditSysMsgDialog from "./components/EditSysMsgDialog.vue";
import { onMounted, reactive, ref, h, watchEffect, toRefs, markRaw } from 'vue';
import { ElMessage, type TabsPaneContext, ElMessageBox } from "element-plus"
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { getCorpMsg, getSysMsg, deleteMsg } from "@/api/message";
import { useSettingStore } from "@/store/settingInfoStore";
import { useUserInfoStore } from "@/store/userInfoStore";
import { trackRecord } from "@/utils/tracker";
import { deleteUnreadMsg } from "@/api/department"
const { isDataUpdate } = toRefs(useUserInfoStore())
const activeName = ref('messageList')
const publishMsgRef = ref()
const editMsgRef = ref()
const editSysMsgRef = ref()
const tableKey = ref(0);
onMounted(async() => {
  const flag = await getCropMsgList()
    flag && ElMessage({
      type: 'success',
      message: '获取公司公告列表成功',
    })
})

const handleClick =async (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName == 'systemList') {
    // 获取系统消息列表
    const flag = await getSysMsgList()
    flag && ElMessage({
      type: 'success',
      message: '获取系统消息列表成功',
    })
  } else {
    // 获取公告管理列表
    const flag = await getCropMsgList()
    flag && ElMessage({
      type: 'success',
      message: '获取公司公告列表成功',
    })
  }
}

// 公告管理
// 搜索关键字
const fliterData = reactive({
  department: '',
  messageLevel: ''
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
const filterMessage = () => {
  getCropMsgList()
}

// 发布消息
const publishMsg = () => {
  publishMsgRef.value.open(true)
}
const editCorpMsg = (scope: any) => {
  editMsgRef.value.open(scope)
}
const editSysMsg = (scope:any)=>{
  editSysMsgRef.value.open(scope)
}
const deleteMessage = async (row: any) => {
  const params = {
    id: +row.id
  }
  ElMessageBox(
    {
      title: '删除操作',
      message: h('div', { class: 'delete-tip', innerHTML: '是否删除该消息,删除后此消息将展现在回收站中。' }),
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
          const res = await deleteMsg(params)
          if (res.data.status == 0) {
          await trackRecord('message', 'delete', row.message_title,row.message_category)
          if(row.message_receipt_object && row.message_receipt_object != '全体成员') {
            const params = {
              id:row.id,
              department:row.message_receipt_object
            }
            await deleteUnreadMsg(params)
          }
          ElMessage({
              type: 'success',
              message: '删除消息成功',
            })
            isDataUpdate.value = true
          } else {
            ElMessage.error('删除消息失败，请稍后再试')
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



// 获取所有公司信息按钮
const getAllList = () => {
  fliterData.department = ''
  fliterData.messageLevel = ''
  getCropMsgList()
}
// 获取公司消息列表
const getCropMsgList = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    department:fliterData.department,
    messageLevel:fliterData.messageLevel
  }
  const res = await getCorpMsg(params)
  if (res.data.status == 0) {
    
    tableKey.value++
    pageInfo.total = res.data.total || 0
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    corpMsgData.value = res.data.results
    return true
  }
}

const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getCropMsgList()
}
const handleCurrentChange = (val: number) => {
  getCropMsgList()
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
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
  }
  const res = await getSysMsg(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo1.total = res.data.total || 0
    pageInfo1.isSinglePage = pageInfo1.total / pageInfo1.pageSize > 1
    systemData.value = res.data.results
    return true
  }
}

const publishSysMsg = () => {
  publishMsgRef.value.open(false)
}

const handleSizeChange1 = (val: number) => {
  pageInfo1.pageSize = val
  getSysMsgList()
}
const handleCurrentChange1 = (val: number) => {
  getSysMsgList()
}

watchEffect(() => {
  if (isDataUpdate.value) {
    if (activeName.value == 'systemList') {
      getSysMsgList()
    } else {
      getCropMsgList()
    }
    isDataUpdate.value = !isDataUpdate.value
  }
})

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