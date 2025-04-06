<template>
  <div class="common-wrapper">
    <div class="common-content delivery-ist-content">
      <!-- 结构顶部搜索框和按钮区域 -->
      <div class="table-header">
        <!-- 结构顶部左侧搜索框域 -->
        <div class="table-header-left">
          <el-input v-model="searchValue" clearable style="width: 240px" placeholder="输入出库编号进行搜索" />
        </div>
        <!-- 结构顶部右侧按钮区域 -->
        <div class="table-header-right">
          <el-button type="primary">添加用户管理员</el-button>
        </div>
      </div>
      <!-- 表格主体 -->
      <div class="table-content">
        <!-- 表格内容部分 -->
        <div class="table-content-body">
          <el-table :data="productData" border style="width: 100%">
                <el-table-column prop="id" label="id" width="48" />
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
                    <el-button type="danger">驳回</el-button>
                    <el-button type="success">同意</el-button>
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

<script lang="ts" setup name="DeliveryList">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, type TabsPaneContext } from "element-plus"
import { getOutProducts,searchOutProducts } from '@/api/product';

onMounted(()=>{
  getOuts()
})
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

const getOuts = async ()=>{
  const res = await getOutProducts()
  if (res.data.status == 0) {
    ElMessage({
      type: 'success',
      message: '获取已审核出库申请列表成功',
    })
    const list = res.data.results
    pageInfo.total = list.length
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    productData.value = res.data.results
  }
  getOutProducts()
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style lang="scss" scoped>
.delivery-ist-content {
  height: 100%;
}
</style>