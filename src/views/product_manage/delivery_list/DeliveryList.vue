<template>
  <div class="common-wrapper">
    <div class="common-content delivery-ist-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable @input="searchAccount" style="width: 240px"
            placeholder="输入出库编号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary" @click="getOuts()">刷新</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="productData" :key="tableKey" max-height="600" border style="width: 100%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="product_out_id" label="出库编号" width="128" />
            <el-table-column prop="product_out_name" label="出库产品名称" width="128" />
            <el-table-column prop="product_out_number" label="出库数量" width="120" />
            <el-table-column prop="product_single_price" label="产品单价(单位)" width="128" />
            <el-table-column prop="product_out_price" label="出库总价" width="128" />
            <el-table-column prop="product_out_apply_person" label="出库申请人" width="120" />
            <el-table-column prop="product_audit_time" label="审核时间" width="188">
              <template #default="scope">
                {{ scope.row.product_audit_time.split('.')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="product_out_audit_person" label="审核人" width="120" />
            <el-table-column prop="audit_memo" label="审核备注" show-overflow-tooltip />
            <el-table-column prop="operate" label="操作" fixed="right" width="200">
              <template #default="scope">
                <!-- <el-button type="success">同意</el-button> -->
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

<script lang="ts" setup name="DeliveryList">
import { onMounted, reactive, ref, markRaw, h, toRefs, watchEffect } from 'vue';
import { ElMessage, type TabsPaneContext, ElMessageBox } from "element-plus"
import { getOutProducts, deleteDelivery } from '@/api/product';
import { useDebounce } from '@/hooks/useDebounce'
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { useProductStore } from "@/store/useProductStore";
const { isProductUpdate } = toRefs(useProductStore())

onMounted(async () => {
  const flag = await getOuts()
  if (flag) {
    ElMessage({
      type: 'success',
      message: '获取已审核出库申请列表成功',
    })
  }
})
const tableKey = ref(0);
// 搜索关键字
const searchValue = ref('')
// 产品列表
const productData = ref([] as { [key: string]: any })
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

const getOuts = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    keyword: searchValue.value
  }
  const res = await getOutProducts(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo.total = res.data.total || 0
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    productData.value = res.data.results
    return true
  }
}
// 输入账号进行搜索
const searchAccount = useDebounce(async () => {
  if (searchValue.value.trim() || !searchValue.value) {
    getOuts()
  }
}, 800)
const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getOuts()
}
const handleCurrentChange = (val: number) => {
  getOuts()
}
const deleteData = (id: string) => {
  const params = {
    id: +id
  }
  ElMessageBox(
    {
      title: '删除操作',
      message: h('div', { class: 'delete-tip', innerHTML: '请慎重操作,删除该出库记录后将无法恢复' }),
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
          const res = await deleteDelivery(params)
          if (res.data.status == 0) {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            isProductUpdate.value = true
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
  if (isProductUpdate.value) {
    getOuts()
    isProductUpdate.value = !isProductUpdate.value
  }
})
</script>

<style lang="scss" scoped>
.delivery-ist-content {
  height: 100%;
}
</style>