<template>
  <div class="common-wrapper">
    <div class="common-content contract-manage-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchFileName" style="width: 240px"
            placeholder="输入文件名进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-upload :headers="uploadHeaders" class="upload-demo" :action="apiUrl + '/api/files/uploadFile'" :limit="1"
            :data="{ upload_person }" :show-file-list="false" :before-upload="beforeFileUpload"
            :on-success="handleFileSuccess">
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="fileData" :key="tableKey" max-height="600" border style="width: 100%">
            <el-table-column type="index" label="id" width="50" />
            <el-table-column prop="file_name" label="合同名">
              <template #default="scope">
                <el-link type="primary" @click="updateDownloadNum(scope.row.id); scope.row.download_number++"
                  :href="scope.row.file_url" target="_blank">{{ scope.row.file_name
                  }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="file_size" label="合同文件大小" />
            <el-table-column prop="upload_person" label="上传用户" />
            <el-table-column prop="download_number" label="下载次数" />
            <el-table-column prop="upload_time" label="上传时间" min-width="88">
              <template #default="scope">
                {{ scope.row.upload_time.split('.')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" fixed="right" width="240">
              <template #default="scope">
                <el-button type="success" @click="downloadContract(scope.row)">下载文件</el-button>
                <el-button type="danger" @click="deleteFile(scope.row)">删除</el-button>
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

<script lang="ts" setup name="ContractManage">
import { onMounted, reactive, ref, markRaw, h, toRefs, watchEffect } from 'vue';
import { ElMessage, type UploadProps, type TabsPaneContext, ElMessageBox } from "element-plus"
import { getContract, deleteContract, updateDownload } from '@/api/contract';
import { useDebounce } from '@/hooks/useDebounce'
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from "@/store/userInfoStore";
import { downloadFile } from '@/utils/downloader';
import { trackRecord } from "@/utils/tracker";
const { userInfo: { name: upload_person }, } = useUserInfoStore()
const { isDataUpdate } = toRefs(useUserInfoStore())
const apiUrl = import.meta.env.VITE_API_URL
const uploadHeaders = ref({
  Authorization: localStorage.getItem('token')
});
onMounted(async () => {
  // 第一次进页面提示,后续改动调用接口刷新页面,不提示,更友好
  const flag = await getFiles()
  if (flag) {
    ElMessage({
      type: 'success',
      message: '获取合同列表成功',
    })
  }
})
const tableKey = ref(0);
// 搜索关键字
const searchValue = ref('')
// 用于判断是否下载成功还是点击取消下载
const isSuccess = ref(true)
// 产品列表
const fileData = ref([] as { [key: string]: any })
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

const getFiles = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    keyword: searchValue.value
  }
  const res = await getContract(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo.total = res.data.total || 0
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    fileData.value = res.data.results
    return true
  } else {
    ElMessage.error('获取合同列表失败')
    return false
  }
}
// 输入文件进行搜索
const searchFileName = useDebounce(async () => {
  if (searchValue.value.trim() || !searchValue.value) {
    getFiles()
  }
}, 800)

const beforeFileUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小超过2MB!")
    return false
  }
  return true
}

const handleFileSuccess: UploadProps["onSuccess"] = async (
  response,
  uploadFile,
) => {
  if (response.status == 0) {
    await trackRecord('contract', 'upload', response.fileName)
    ElMessage({
      message: "上传文件成功",
      type: 'success',
    })
    isDataUpdate.value = true
  } else if (response.status == 1) {
    ElMessage.error(response.message)
  }
}

const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getFiles()
}
const handleCurrentChange = (val: number) => {
  getFiles()
}

// 下载,封装下载函数,可以实现用户选择下载位置
const downloadContract = async (info: any) => {
  isSuccess.value = await downloadFile(info.file_url, info.file_name, localStorage.getItem('token') as string,isSuccess.value);
  // 判断是否更新下载次数
  if (isSuccess.value) {
    updateDownloadNum(info.id)
    info.download_number++
  }
  isSuccess.value = true
}


// 删除
const deleteFile = (row: any) => {
  const params = {
    id: +row.id
  }
  ElMessageBox(
    {
      title: '删除文件操作',
      message: h('div', { class: 'delete-tip', innerHTML: '请慎重操作,删除该文件后将无法恢复' }),
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
          const res = await deleteContract(params)
          if (res.data.status == 0) {
            await trackRecord('contract', 'delete', row.file_name)
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            isDataUpdate.value = true
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
  if (isDataUpdate.value) {
    getFiles()
    isDataUpdate.value = !isDataUpdate.value
  }
})
// 更新下载数量数
const updateDownloadNum = async (id: number) => {
  const params = {
    id
  }
  const res = await updateDownload(params)
  if (res.data.status == 0) {
    ElMessage({
      message: "下载成功",
      type: 'success',
    })
  }
}
</script>

<style lang="scss" scoped>
.contract-manage-content {
  height: 100%;
}
</style>