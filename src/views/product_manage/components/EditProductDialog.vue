<template>
  <el-dialog v-model="editDialogVisible" title="编辑产品" width="560" :before-close="handleClose" destroy-on-close>
    <el-form :model="editData" :rules="rules" ref="editRuleFormRef" style="max-width: 560px"
      :label-position="labelPosition" label-width="auto" class="edit-form">
      <el-form-item label="入库编号" prop="product_id">
        <el-input disabled v-model="product_id" style="width: 240px">
        </el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="product_name">
        <el-input v-model="editData.product_name" style="width: 240px" placeholder="请输入产品名称">
        </el-input>
      </el-form-item>
      <el-form-item label="产品类别" prop="product_category">
        <el-select v-model="editData.product_category" :multiple="false" filterable allow-edit default-first-option
          :reserve-keyword="false" placeholder="请选择产品类别" style="width: 240px">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="产品单位" prop="product_unit">
        <el-select v-model="editData.product_unit" filterable allow-edit default-first-option :reserve-keyword="false"
          placeholder="请选择产品单位" style="width: 240px">
          <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="库存数量" prop="product_inwarehouse_number">
        <el-input v-model.number="editData.product_inwarehouse_number" style="width: 240px" placeholder="请输入入库数量">
        </el-input>
      </el-form-item>
      <el-form-item label="产品单价" prop="product_single_price">
        <el-input v-model.number="editData.product_single_price" style="width: 240px" placeholder="请输入产品单价">
        </el-input>
      </el-form-item>
      <el-form-item label="入库负责人" prop="product_edit_person">
        <el-input disabled v-model="product_create_person" style="width: 240px">
        </el-input>
      </el-form-item>
      <el-form-item label="入库备注" prop="in_memo">
        <el-input v-model="editData.in_memo" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
          placeholder="请输入备注">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit(editRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toEdit(editRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="EditProductDialog">
import { reactive, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { updateProduct } from "@/api/product";
const labelPosition = ref<FormProps['labelPosition']>('right')

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

const categoryOptions = [
  {
    value: "通讯类‌",
    label: "通讯类‌",
  },
  {
    value: "影音类",
    label: "影音类",
  },
  {
    value: "办公类",
    label: "办公类",
  },
  {
    value: "摄影摄像类",
    label: "摄影摄像类",
  },
  {
    value: "家居类",
    label: "家居类",
  },
  {
    value: "娱乐类",
    label: "娱乐类",
  },
]

const editDialogVisible = ref(false)
const { isProductUpdate } = toRefs(useProductStore())
const editRuleFormRef = ref<FormInstance>()

const product_id = ref('')
const product_create_person = ref('')

interface updateProductData {
  id: string
  product_name: string
  product_category: string
  product_unit: string
  product_inwarehouse_number: string
  product_single_price: string
  in_memo: string
}
const editData: updateProductData = reactive({
  id: '',
  product_name: '',
  product_category: '',
  product_unit: '',
  product_inwarehouse_number: '',
  product_single_price: '',
  in_memo: '',
})
const validateCate = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择产品类别'))
  } else {
    callback()
  }
}
const validateUnit = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请选择产品单位'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<updateProductData>>({
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
  in_memo: [
    { required: true, message: '请输入备注', trigger: 'blur' },
  ],

})
const handleClose = (done: () => void) => {
  editRuleFormRef.value?.resetFields()
  done()
}
const open = (info: any) => {
  product_id.value = info.product_id
  product_create_person.value = info.product_create_person
  Object.keys(editData).forEach((key) => {
    if (info.hasOwnProperty(key)) {
      editData[key as keyof typeof editData] = info[key] || ''
    }
  })
  editDialogVisible.value = true
}

const cancelEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editDialogVisible.value = false
}

const toEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 添加操作
      const params = editData
      const res = await updateProduct(params)
      if (res.data.status == 0) {
        isProductUpdate.value = true
        ElMessage({
          message: "修改产品信息成功",
          type: "success",
        })
      } else {
        ElMessage.error("修改产品失败，请稍后再试")
      }
      editDialogVisible.value = false
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
.edit-form {
  height: 560px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>