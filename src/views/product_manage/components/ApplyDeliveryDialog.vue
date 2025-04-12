<template>
  <el-dialog v-model="applyDialogVisible" title="申请出库" width="560" :before-close="handleClose" :destroy-on-close="true">
    <el-form :model="applyData" :rules="rules" ref="applyRuleFormRef" style="max-width: 560px"
      :label-position="labelPosition" label-width="auto" class="apply-form">
      <el-form-item label="申请出库编号" prop="product_out_id">
        <el-input v-model="applyData.product_out_id" style="width: 240px" placeholder="请输入出库编号">
        </el-input>
      </el-form-item>
      <el-form-item label="出库数量" prop="product_out_number">
        <el-input v-model.number="applyData.product_out_number" style="width: 240px" placeholder="请输入出库数量">
        </el-input>
      </el-form-item>
      <el-form-item label="出库申请人" prop="product_out_apply_person">
        <el-input disabled v-model="applyData.product_out_apply_person" style="width: 240px" placeholder="请输入出库申请人">
        </el-input>
      </el-form-item>
      <el-form-item label="出库申请备注" prop="apply_memo">
        <el-input v-model="applyData.apply_memo" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea" placeholder="请输入出库申请备注">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelApply(applyRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toApply(applyRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ApplyProductDialog">
import { reactive, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { applyDelivery } from "@/api/product";
import { trackRecord } from "@/utils/tracker";
import { useUserInfoStore } from "@/store/userInfoStore";
const labelPosition = ref<FormProps['labelPosition']>('right')
const { userInfo } = toRefs(useUserInfoStore())

const applyDialogVisible = ref(false)
const { isProductUpdate } = toRefs(useProductStore())
const applyRuleFormRef = ref<FormInstance>()
const productName = ref('')

interface applyOutData {
  id: string
  product_out_id: string
  product_out_number: string
  product_out_apply_person: string
  apply_memo: string
}
const applyData: applyOutData = reactive({
  id: '',
  product_out_id: '',
  product_out_number: '',
  product_out_apply_person: userInfo.value.name,
  apply_memo: '',
})

const rules = reactive<FormRules<applyOutData>>({
  product_out_id: [
    { required: true, message: '请输入出库编号', trigger: 'blur' },
  ],
  product_out_number: [
    { required: true, message: '请输入出库数量', trigger: 'blur' },
    { type: 'number', message: '请输入数字类型' }
  ],
  product_out_apply_person: [
    { required: true, message: '请输入出库申请人', trigger: 'blur' },
  ],
  apply_memo: [
    { required: true, message: '请输入出库申请备注', trigger: 'blur' },
  ],

})
const handleClose = (done: () => void) => {
  applyRuleFormRef.value?.resetFields()
  done()
}
const open = (row: any) => {
  applyData.id = row.id
  productName.value = row.product_name
  applyDialogVisible.value = true
}

const cancelApply = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  applyDialogVisible.value = false
}

const toApply = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 添加操作
      const params = applyData
      const res = await applyDelivery(params)
      if (res.data.status == 0) {
        await trackRecord('product', 'apply', productName.value)
        ElMessage({
          message: "申请出库成功",
          type: "success",
        })
        isProductUpdate.value = true
        applyDialogVisible.value = false
      } else if (res.data.status == 1) {
        ElMessage.error(res.data.message)
      } else {
        ElMessage.error("申请出库失败，请稍后再试")
        applyRuleFormRef.value?.resetFields()
        applyDialogVisible.value = false
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
.apply-form {
  min-height: 320px;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>