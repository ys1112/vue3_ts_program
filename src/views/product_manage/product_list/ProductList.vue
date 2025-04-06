<template>
  <div class="common-wrapper">
    <div class="common-content product-list-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <!-- 产品列表 -->
        <el-tab-pane label="产品列表" name="productList">
          <!-- 结构顶部搜索框和按钮区域 -->
          <div class="table-header">
            <!-- 结构顶部左侧搜索框域 -->
            <div class="table-header-left">
              <el-input v-model="searchValue" style="width: 240px" placeholder="输入入库编号进行搜索" />
            </div>
            <!-- 结构顶部右侧按钮区域 -->
            <div class="table-header-right">
              <el-button type="primary">添加产品</el-button>
            </div>
          </div>
          <!-- 表格主体 -->
          <div class="product-table">
            <!-- 表格内容部分 -->
            <div class="product-table-body">
              <el-table :data="productData" border style="width: 100%" max-height="250">
                <el-table-column prop="id" label="id" width="48" />
                <el-table-column prop="product_id" label="入库编号" width="128" />
                <el-table-column prop="product_name" label="产品名称" width="128" />
                <el-table-column prop="product_category" label="产品类别" width="128" />
                <el-table-column prop="product_unit" label="单位" width="96" />
                <el-table-column prop="product_inwarehouse_number" label="库存数量" width="120" />
                <el-table-column prop="product_single_price" label="产品单价(单位)" width="128" />
                <el-table-column prop="product_all_price" label="库存总价" width="128" />
                <el-table-column prop="product_status" label="库存状态" width="128">
                  <template #default="scope">
                    <el-tag v-if="scope.row.product_status == '库存告急'" type="danger">库存告急</el-tag>
                    <el-tag v-if="scope.row.product_status == '库存正常'" type="primary">库存正常</el-tag>
                    <el-tag v-if="scope.row.product_status == '库存过剩'" type="warning">库存过剩</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="product_create_person" label="入库负责人" width="120" />
                <el-table-column prop="product_create_time" label="入库时间" width="188">
                  <template #default="scope">
                    {{ scope.row.product_create_time.split('.')[0] }}
                  </template>
                </el-table-column>
                <el-table-column prop="product_update_time" label="最后修改时间" width="164">
                  <template #default="scope">
                    {{ scope?.row.product_update_time ? scope?.row.product_update_time.split('.')[0] : '--' }}
                  </template>
                </el-table-column>
                <el-table-column prop="in_memo" label="入库备注" show-overflow-tooltip width="180" />
                <el-table-column prop="operate" label="操作" fixed="right" width="300">
                  <template #default="scope">
                    <el-button type="primary" :disabled="scope.row.product_out_status == 1">申请出库</el-button>
                    <el-button type="success" :disabled="scope.row.product_out_status == 1">修改</el-button>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="product-table-footer">
              <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                layout="total, prev, pager, next" :total="pageInfo.total" :hide-on-single-page="pageInfo.isSinglePage"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </div>
        </el-tab-pane>
        <!-- 审核列表 -->
        <el-tab-pane label="审核列表" name="auditList">
          <!-- 结构顶部搜索框和按钮区域 -->
          <div class="table-header">
            <!-- 结构顶部左侧搜索框域 -->
            <div class="table-header-left">
              <el-input v-model="searchValue1" style="width: 240px" placeholder="输入入库编号进行搜索" />
            </div>
            <!-- 结构顶部右侧按钮区域 -->
            <div class="table-header-right">
              <el-button type="primary" @click="getOutList()">刷新</el-button>
            </div>
          </div>
          <!-- 表格主体 -->
          <div class="product-table">
            <!-- 表格内容部分 -->
            <!-- id, 出库id，出库数量，出库总价，申请人，申请时间，出库备注 -->
            <div class="product-table-body">
              <el-table :data="applyData" border style="width: 100%">
                <el-table-column prop="id" label="id" width="48" />
                <el-table-column prop="product_out_id" label="出库编号" width="128" />
                <el-table-column prop="product_name" label="出库产品名称" width="128" />
                <el-table-column prop="product_category" label="出库产品类别" width="128" />
                <el-table-column prop="product_unit" label="单位" width="96" />
                <el-table-column prop="product_out_number" label="出库数量" width="120" />
                <el-table-column prop="product_single_price" label="产品单价(单位)" width="128" />
                <el-table-column prop="product_out_price" label="出库总价" width="128" />
                <el-table-column prop="product_out_apply_person" label="出库申请人" width="120" />
                <el-table-column prop="product_apply_date" label="出库申请时间" width="188">
                  <template #default="scope">
                    {{ scope.row.product_apply_date.split('.')[0] }}
                  </template>
                </el-table-column>
                <el-table-column prop="apply_memo" label="出库申请备注" show-overflow-tooltip />
                <el-table-column prop="operate" label="操作" fixed="right" width="200">
                  <template #default="scope">
                    <el-button type="danger">驳回</el-button>
                    <el-button type="success">同意</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="product-table-footer">
              <el-pagination v-model:current-page="pageInfo1.currentPage" :page-size="pageInfo1.pageSize"
                layout="total, prev, pager, next" :total="pageInfo1.total" :hide-on-single-page="pageInfo1.isSinglePage"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup name="ProductList">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, type TabsPaneContext } from "element-plus"
import { getProductInfo, searchProductInfo, getApplyProducts, searchApplyProducts, } from '@/api/product';

const activeName = ref('productList')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName == 'auditList') {
    // 获取出库申请审核列表
    getOutList()
  } else {
    getProductList()
  }
}
interface searchData {
  search_value?: string
}
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


// 搜索关键字
const searchValue1 = ref('')
// 产品列表
const applyData = ref([] as { [key: string]: any })
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



onMounted(() => {
  getProductList()
})
const getProductList = async () => {
  const res = await getProductInfo()
  if (res.data.status == 0) {
    ElMessage({
      type: 'success',
      message: '获取产品列表成功',
    })
    const list = res.data.results
    pageInfo.total = list.length
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    productData.value = res.data.results
  }
}
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}



// 出库申请列表
const getOutList = async () => {
  const res = await getApplyProducts()
  if (res.data.status == 0) {
    ElMessage({
      type: 'success',
      message: '获取出库申请列表成功',
    })
    const list = res.data.results
    pageInfo1.total = list.length
    pageInfo1.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    applyData.value = res.data.results
  }
}
</script>

<style lang="scss" scoped>
.product-list-content {
  height: 100%;

  .product-table {
    height: 656px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px;

    .product-table-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>