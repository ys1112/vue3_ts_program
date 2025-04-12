<template>
  <el-dialog v-model="createDialogVisible" title="创建产品" width="560" :before-close="handleClose" :destroy-on-close="true">
    <el-form :model="createData" :rules="rules" ref="createRuleFormRef" style="max-width: 560px"
      :label-position="labelPosition" label-width="auto" class="create-form">
      <el-form-item label="入库编号" prop="product_id">
        <el-input v-model="createData.product_id" style="width: 240px" placeholder="请输入入库编号">
        </el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="product_name">
        <el-input v-model="createData.product_name" style="width: 240px" placeholder="请输入产品名称">
        </el-input>
      </el-form-item>
      <el-form-item label="产品类别" prop="product_category">
        <el-select v-model="createData.product_category" :multiple="false" filterable allow-create default-first-option
          :reserve-keyword="false" placeholder="请选择产品类别" style="width: 240px">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品单位" prop="product_unit">
        <el-select v-model="createData.product_unit" filterable allow-create default-first-option
          :reserve-keyword="false" placeholder="请选择产品单位" style="width: 240px">
          <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存数量" prop="product_inwarehouse_number">
        <el-input v-model.number="createData.product_inwarehouse_number" style="width: 240px" placeholder="请输入入库数量">
        </el-input>
      </el-form-item>
      <el-form-item label="产品单价" prop="product_single_price">
        <el-input v-model.number="createData.product_single_price" style="width: 240px" placeholder="请输入产品单价">
        </el-input>
      </el-form-item>
      <el-form-item label="入库负责人" prop="product_create_person">
        <el-input v-model="createData.product_create_person" style="width: 240px" placeholder="请输入入库负责人姓名">
        </el-input>
      </el-form-item>
      <el-form-item label="入库备注" prop="in_memo">
        <el-input v-model="createData.in_memo" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea" placeholder="请输入备注">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelCreate(createRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toCreate(createRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="CreateProductDialog">
import { reactive, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { createProduct } from "@/api/product";
import { trackRecord } from "@/utils/tracker";
import { useSettingStore } from "@/store/settingInfoStore";
const labelPosition = ref<FormProps['labelPosition']>('right')
const {productInfo} = useSettingStore()
const categoryOptions = productInfo.map(item => {
  return {
    value: item,
    label: item
  }
})
const unitOptions = [
  {
    value: "台",
    label: "台",
  },
  {
    value: "件",
    label: "件",
  },
  {
    value: "个",
    label: "个",
  },
  {
    value: "支",
    label: "支",
  },
  {
    value: "桶",
    label: "桶",
  },
  {
    value: "箱",
    label: "箱",
  }
]

// const categoryOptions = [
//   {
//     value: "通讯类‌",
//     label: "通讯类‌",
//   },
//   {
//     value: "影音类",
//     label: "影音类",
//   },
//   {
//     value: "办公类",
//     label: "办公类",
//   },
//   {
//     value: "摄影摄像类",
//     label: "摄影摄像类",
//   },
//   {
//     value: "家居类",
//     label: "家居类",
//   },
//   {
//     value: "娱乐类",
//     label: "娱乐类",
//   },
// ]

const createDialogVisible = ref(false)
const { isProductUpdate } = toRefs(useProductStore())
const createRuleFormRef = ref<FormInstance>()
interface createProductData {
  product_id: string
  product_name: string
  product_category: string
  product_unit: string
  product_inwarehouse_number: string
  product_single_price: string
  product_create_person: string
  in_memo: string
}
const createData: createProductData = reactive({
  product_id: '',
  product_name: '',
  product_category: '',
  product_unit: '',
  product_inwarehouse_number: '',
  product_single_price: '',
  product_create_person: '',
  in_memo: '',
})

const rules = reactive<FormRules<createProductData>>({
  product_id: [
    { required: true, message: '请输入入库编号', trigger: 'blur' },
    { min: 1, max: 12, message: '请输入入库编号', trigger: 'blur' },
  ],
  product_name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
  ],
  product_category: [
    { required: true, message: '请选择产品类别', trigger: 'change' },
  ],
  product_unit: [
    { required: true, message: '请选择产品单位', trigger: 'change' },
  ],
  product_inwarehouse_number: [
    { required: true, message: '请输入入库数量', trigger: 'blur' },
    { type: 'number', message: '请输入数字类型' }
  ],
  product_single_price: [
    { required: true, message: '请输入产品单价', trigger: 'blur' },
    { type: 'number', message: '请输入数字类型' }
  ],
  product_create_person: [
    { required: true, message: '请输入入库负责人姓名', trigger: 'blur' },

  ],
  in_memo: [
    { required: true, message: '请输入备注', trigger: 'blur' },
  ],

})
const handleClose = (done: () => void) => {
  createRuleFormRef.value?.resetFields()
  done()
}
const open = () => {
  createDialogVisible.value = true
}

const cancelCreate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  createDialogVisible.value = false
}

const toCreate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 添加操作
      const params = createData
      const res = await createProduct(params)
      if (res.data.status == 0) {
        await trackRecord('product', 'create', createData.product_name)
        createRuleFormRef.value?.resetFields()
        ElMessage({
          message: "添加产品成功",
          type: "success",
        })
        createDialogVisible.value = false
        isProductUpdate.value = true
      } else if (res.data.status == 1) {
        ElMessage.error(res.data.message)
      } else {
        ElMessage.error("添加产品失败，请稍后再试")
        createRuleFormRef.value?.resetFields()
        createDialogVisible.value = false
      }

    } else {
      console.log('error submit!')
    }
  })
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.create-form {
  height: 560px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>