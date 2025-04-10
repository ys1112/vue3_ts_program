<template>
  <el-dialog v-model="auditDialogVisible" :title="`${isApprove == 'approve' ? '同意' : '驳回'}出库申请`" width="560"
    :before-close="handleClose" destroy-on-close>
    <el-form :model="auditData" :rules="rules" ref="auditRuleFormRef" style="max-width: 560px"
      :label-position="labelPosition" label-width="auto" class="audit-form">
      <el-form-item label="审核人" prop="product_out_audit_person">
        <el-input disabled v-model="auditData.product_out_audit_person" style="width: 240px" placeholder="请输入审核人姓名">
        </el-input>
      </el-form-item>
      <el-form-item label="审核出库备注" prop="audit_memo">
        <el-input v-model="auditData.audit_memo" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea" placeholder="请输入审核备注">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAudit(auditRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toAudit(auditRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="AuditApplyDialog">
import { reactive, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { approveApply, rejectApply } from "@/api/product";
import { trackRecord } from "@/utils/tracker";
import { useUserInfoStore } from "@/store/userInfoStore";
const labelPosition = ref<FormProps['labelPosition']>('right')
const { userInfo } = toRefs(useUserInfoStore())

const auditDialogVisible = ref(false)
const { isProductUpdate } = toRefs(useProductStore())
const auditRuleFormRef = ref<FormInstance>()
const isApprove = ref('')
const productName = ref('')

interface auditData {
  id: string
  product_out_audit_person: string
  audit_memo: string
}
const auditData: auditData = reactive({
  id: '',
  product_out_audit_person: userInfo.value.name,
  audit_memo: '',
})

const rules = reactive<FormRules<auditData>>({
  product_out_audit_person: [
    { required: true, message: '请输入审核人姓名', trigger: 'blur' },
  ],
  audit_memo: [
    { required: true, message: '请输入审核备注', trigger: 'blur' },
  ],

})
const handleClose = (done: () => void) => {
  auditRuleFormRef.value?.resetFields()
  done()
}
const open = (info: any, key: string) => {
  auditData.id = info.id
  productName.value = info.product_name
  isApprove.value = key
  auditDialogVisible.value = true
}

const cancelAudit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  auditDialogVisible.value = false
}

const toAudit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 添加操作
      const params = auditData
      if (isApprove.value == 'approve') {
        const res = await approveApply(params)
        if (res.data.status == 0) {
          await trackRecord('product', 'agree', productName.value)
          isProductUpdate.value = true
          ElMessage({
            message: "同意申请成功",
            type: "success",
          })
        } else {
          ElMessage.error("同意申请失败，请稍后再试")
        }
        auditRuleFormRef.value?.resetFields()
        auditDialogVisible.value = false
      } else {
        const res = await rejectApply(params)
        if (res.data.status == 0) {
          await trackRecord('product', 'reject', productName.value)
          isProductUpdate.value = true
          ElMessage({
            message: "驳回申请成功",
            type: "success",
          })
        } else {
          ElMessage.error("驳回申请失败，请稍后再试")
        }
        auditRuleFormRef.value?.resetFields()
        auditDialogVisible.value = false
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
.audit-form {
  min-height: 200px;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>