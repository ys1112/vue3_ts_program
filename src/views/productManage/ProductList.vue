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
              <el-input v-model="searchValue" clearable @input="searchAccount" style="width: 240px"
                placeholder="输入入库编号进行搜索" />
            </div>
            <!-- 结构顶部右侧按钮区域 -->
            <div class="table-header-right">
              <el-button type="primary" @click="addProduct">添加产品</el-button>
            </div>
          </div>
          <!-- 表格主体 -->
          <div class="product-table">
            <!-- 表格内容部分 -->
            <div class="product-table-body">
              <el-table :data="productData" :key="tableKey" max-height="600" border style="width: 100%"
                :scrollbar-always-on="false">
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="product_id" label="入库编号" width="128" />
                <el-table-column prop="product_name" label="产品名称" width="128" />
                <el-table-column prop="product_category" label="产品类别" width="128" />
                <el-table-column prop="product_unit" label="单位" width="96" />
                <el-table-column prop="product_in_warehouse_number" label="库存数量" width="120" />
                <el-table-column prop="product_single_price" label="产品单价(单位)" width="128" />
                <el-table-column prop="product_all_price" label="库存总价" width="128" />
                <el-table-column prop="product_status" label="库存状态" width="128">
                  <template #default="scope">
                    <el-tag size="small" v-if="scope.row.product_status == '库存告急'" type="danger">库存告急</el-tag>
                    <el-tag size="small" v-if="scope.row.product_status == '库存正常'" type="primary">库存正常</el-tag>
                    <el-tag size="small" v-if="scope.row.product_status == '库存过剩'" type="warning">库存过剩</el-tag>
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
                    <el-button type="primary"
                      :disabled="scope.row.product_out_status == 1 || scope.row.product_out_status == 2"
                      @click="applyProduct(scope.row)">申请出库</el-button>
                    <el-button type="success"
                      :disabled="scope.row.product_out_status == 1 || scope.row.product_out_status == 2"
                      @click="editProduct(scope.row)">修改</el-button>
                    <el-button type="danger"
                      :disabled="scope.row.product_out_status == 1 || scope.row.product_out_status == 2"
                      @click="handleDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="product-table-footer">
              <el-pagination v-model:current-page="pageInfo.currentPage" :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next" :total="pageInfo.total"
                :hide-on-single-page="pageInfo.isSinglePage" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
            </div>
          </div>
        </el-tab-pane>
        <!-- 审核列表 -->
        <el-tab-pane label="审核列表" name="auditList">
          <!-- 结构顶部搜索框和按钮区域 -->
          <div class="table-header">
            <!-- 结构顶部左侧搜索框域 -->
            <div class="table-header-left">
              <el-input v-model="searchValue1" clearable @input="searchAccount1" style="width: 240px"
                placeholder="输入出库编号进行搜索" />
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
              <el-table :data="applyData" :key="tableKey" max-height="600" border style="width: 100%">
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="product_out_id" label="出库编号" width="160" />
                <el-table-column prop="product_name" label="出库产品名称" width="128" />
                <el-table-column prop="product_category" label="出库产品类别" width="128" />
                <el-table-column prop="product_unit" label="单位" width="96" />
                <el-table-column prop="product_out_number" label="出库数量" width="120" />
                <el-table-column prop="product_single_price" label="产品单价(单位)" width="120" />
                <el-table-column prop="product_out_price" label="出库总价" width="128" />
                <el-table-column prop="product_out_apply_person" label="出库申请人" width="120" />
                <el-table-column prop="product_apply_date" label="出库申请时间" width="188">
                  <template #default="scope">
                    {{ scope.row.product_apply_date.split('.')[0] }}
                  </template>
                </el-table-column>
                <el-table-column prop="apply_memo" label="出库申请备注" show-overflow-tooltip width="120" />
                <el-table-column prop="product_out_audit_person" label="审核人" width="120" />
                <el-table-column prop="product_audit_time" label="审核时间" width="188">
                  <template #default="scope">
                    {{ scope.row.product_apply_date.split('.')[0] }}
                  </template>
                </el-table-column>
                <el-table-column prop="audit_memo" label="审核备注" show-overflow-tooltip width="120" />

                <el-table-column prop="operate" label="操作" fixed="right" width="300">
                  <template #default="scope">
                    <el-button type="success" v-if="scope.row.product_out_status == 2"
                      @click="resubmitApply(scope.row)">再次提交</el-button>
                    <el-button type="success" v-if="scope.row.product_out_status == 1"
                      @click="approve(scope.row)">同意</el-button>
                    <el-button type="danger" v-if="scope.row.product_out_status == 1"
                      @click="reject(scope.row)">驳回</el-button>
                    <el-button type="primary"
                      v-if="scope.row.product_out_status == 1 || scope.row.product_out_status == 2"
                      @click="cancel(scope.row)">撤销申请</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 表格底部分页栏 -->
            <div class="product-table-footer">
              <el-pagination v-model:current-page="pageInfo1.currentPage" :page-size="pageInfo1.pageSize"
                layout="total, sizes, prev, pager, next" :total="pageInfo1.total"
                :hide-on-single-page="pageInfo1.isSinglePage" @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <CreateProductDialog ref="createProductRef"></CreateProductDialog>
  <EditProductDialog ref="editProductRef"></EditProductDialog>
  <ApplyProductDialog ref="applyProductRef"></ApplyProductDialog>
  <AuditApplyDialog ref="auditApplyRef"></AuditApplyDialog>
</template>

<script lang="ts" setup name="ProductList">
import { onMounted, reactive, ref, h, watchEffect, toRefs, markRaw } from 'vue';
import { ElMessage, type TabsPaneContext, ElMessageBox } from "element-plus"
import {
  getProductInfo,
  getApplyProducts,
  deleteProduct,
  cancelApply,
  resubmit,
} from '@/api/product';
import { useDebounce } from '@/hooks/useDebounce'
import CreateProductDialog from "./components/CreateProductDialog.vue";
import EditProductDialog from "./components/EditProductDialog.vue";
import ApplyProductDialog from "./components/ApplyDeliveryDialog.vue";
import AuditApplyDialog from "./components/AuditApplyDialog.vue";
import { WarnTriangleFilled } from '@element-plus/icons-vue'
import { trackRecord } from "@/utils/tracker";
import { useUserInfoStore } from "@/store/userInfoStore";
const activeName = ref('productList')
const createProductRef = ref()
const editProductRef = ref()
const applyProductRef = ref()
const auditApplyRef = ref()
const { isDataUpdate } = toRefs(useUserInfoStore())
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName == 'auditList') {
    // 获取出库申请审核列表
    const flag = await getOutList()
    flag && ElMessage({
      type: 'success',
      message: '获取出库申请列表成功',
    })
  } else {
    const flag = await getProductList()
    flag && ElMessage({
      type: 'success',
      message: '获取产品列表成功',
    })
  }
}
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



onMounted(async () => {
  const flag = await getProductList()
  flag && ElMessage({
    type: 'success',
    message: '获取产品列表成功',
  })
})
const getProductList = async () => {
  const params = {
    pageNum: pageInfo.currentPage,
    pageSize: pageInfo.pageSize,
    keyword: searchValue.value
  }
  const res = await getProductInfo(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo.total = res.data.total || 0
    pageInfo.isSinglePage = pageInfo.total / pageInfo.pageSize > 1
    productData.value = res.data.results
    return true
  }
}
const handleSizeChange = (val: number) => {
  pageInfo.pageSize = val
  getProductList()
}
const handleCurrentChange = (val: number) => {
  getProductList()
}



// 输入账号进行搜索
const searchAccount = useDebounce(async () => {
  if (searchValue.value.trim() || !searchValue.value) {
    getProductList()
  }
}, 800)
const addProduct = () => {
  createProductRef.value.open()
}
const editProduct = (info: any) => {
  editProductRef.value.open(info)
}
const applyProduct = (row: any) => {
  applyProductRef.value.open(row)
}
const handleDelete = (row: any) => {
  const params = {
    id: +row.id
  }
  ElMessageBox(
    {
      title: '删除操作',
      message: h('div', { class: 'delete-tip', innerHTML: '请慎重操作,删除该产品后将无法恢复' }),
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
          const res = await deleteProduct(params)
          if (res.data.status == 0) {
            await trackRecord('product', 'delete', row.product_name)
            ElMessage({
              type: 'success',
              message: '删除产品成功',
            })
            isDataUpdate.value = true
          } else {
            ElMessage.error('删除产品失败，请稍后再试')
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




// 出库申请列表
const getOutList = async () => {
  const params = {
    pageNum: pageInfo1.currentPage,
    pageSize: pageInfo1.pageSize,
    keyword: searchValue1.value
  }
  const res = await getApplyProducts(params)
  if (res.data.status == 0) {
    tableKey.value++
    pageInfo1.total = res.data.total || 0
    pageInfo1.isSinglePage = pageInfo1.total / pageInfo1.pageSize > 1
    applyData.value = res.data.results
    return true
  }
}


const handleSizeChange1 = (val: number) => {
  pageInfo1.pageSize = val
  getOutList()
}
const handleCurrentChange1 = (val: number) => {
  getOutList()
}

// 输入出库编号进行搜索
const searchAccount1 = useDebounce(async () => {
  if (searchValue1.value.trim() || !searchValue1.value) {
    getOutList()
  }
}, 800)
// 同意审批
const approve = (info: any) => {
  const key = 'approve'
  auditApplyRef.value.open(info, key)
}
// 驳回审批
const reject = (info: any) => {
  const key = 'reject'
  auditApplyRef.value.open(info, key)
}

const operateInfo = reactive({
  cancel: {
    type: 0,
    title: '提示',
    tip: '是否撤销出库申请？',
  },
  resubmit: {
    type: 1,
    title: '提示',
    tip: '是否重新提交出库申请？',
  }
})
// 撤销申请
const cancel = (row: any) => {
  useMessageBox(operateInfo.cancel, row)
}
// 再次申请
const resubmitApply = (row: any) => {
  useMessageBox(operateInfo.resubmit, row)
}

const useMessageBox = (info: { [key: string]: any }, row: any) => {
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
        id: +row.id
      }
      if (info.type == 0) {
        const res = await cancelApply(params)
        if (res.data.status == 0) {
          await trackRecord('product', 'cancel', row.product_name)
          isDataUpdate.value = true
          ElMessage({
            type: 'success',
            message: '取消申请成功',
          })
        } else {
          ElMessage.error('取消申请失败')
        }
      }
      if (info.type == 1) {
        const res = await resubmit(params)
        if (res.data.status == 0) {
          await trackRecord('product', 'resubmit', row.product_name)
          isDataUpdate.value = true
          ElMessage({
            type: 'success',
            message: '重新提交成功',
          })
        } else {
          ElMessage.error('重新提交失败')
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

watchEffect(() => {
  if (isDataUpdate.value) {
    if (activeName.value == 'auditList') {
      getOutList()
    } else {
      getProductList()
    }
    isDataUpdate.value = !isDataUpdate.value
  }
})
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
      // padding: 24px 0;
      // border-top: 2px solid #e4e7ed;
    }
  }
}
</style>