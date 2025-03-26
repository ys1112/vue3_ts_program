<template>
  <!-- 忘记密码对话框 -->
  <el-dialog v-model="state.forgetDialogVisible" title="忘记密码" width="420" :before-close="handleClose">
    <el-form :model="forgetData" :rules="rules" ref="ruleFormRef" label-position="top" class="login-form"
      style="max-width: 600px">
      <el-form-item label="请输入您的个人账号" prop="account">
        <el-input v-model="forgetData.account" style="width: 300px" placeholder="请输入账号">
        </el-input>
      </el-form-item>
      <el-form-item label="请输入您的注册邮箱" prop="email">
        <el-input v-model="forgetData.email" style="width: 300px" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelReset(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="openResetDialog(ruleFormRef)">
          下一步
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 重置密码对话框 -->
  <el-dialog v-model="state.resetDialogVisible" title="重置密码" width="420" :before-close="handleClose">
    <el-form :model="forgetData" :rules="rules" ref="confirmFormRef" label-position="top" class="login-form"
      style="max-width: 600px">
      <el-form-item label="请输入您的新密码" prop="password">
        <el-input type="password" show-password v-model="forgetData.password" style="width: 300px"
          placeholder="请输入您的新密码">
        </el-input>
      </el-form-item>
      <el-form-item label="请再次输入您的新密码" prop="confirmPassword">
        <el-input type="password" show-password v-model="forgetData.confirmPassword" style="width: 300px"
          placeholder="请再次输入您的新密码">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="toResetPassword(confirmFormRef)">
          重置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ForgetPwdDialog">
import { reactive, ref, } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance } from 'element-plus'
import { verifyAccount, resetPassword } from '@/api/login'
// 对话框状态
const state = reactive({
  forgetDialogVisible: false,
  resetDialogVisible: false
})
const ruleFormRef = ref<FormInstance>()
const confirmFormRef = ref<FormInstance>()
interface ForgetForm {
  account: string
  email: string
  password: string
  confirmPassword: string
}
const forgetData: ForgetForm = reactive({
  account: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9-_!?@]{6,16}$/
const validateEmail = (rule: any, value: any, callback: any) => {
  if (forgetData.email === '') {
    return callback(new Error('请输入您的注册邮箱'))
  } else {
    if (forgetData.email !== '') {
      if (!regEmail.test(forgetData.email)) {
        callback(new Error("请输入正确的邮箱格式"))
      } else {
        callback()
      }
    }
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (forgetData.password !== '') {
    if (!regPassword.test(forgetData.password)) {
      callback(new Error("请确认新密码，必须包含字母和数字，长度6-16位含-_?!@"))
    } else {
      callback()
    }
  }
}
const validateConfirmPwd = (rule: any, value: any, callback: any) => {
  if (forgetData.password == '') {
    return callback(new Error("请先输入您的新密码"))
  }
  if (forgetData.password !== forgetData.confirmPassword) {
    return callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<ForgetForm>>({
  account: [
    { required: true, message: '请输入您的注册账号', trigger: 'blur' },
    { min: 6, max: 12, message: '请确认账号，长度6-12位', trigger: 'blur' },
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入您的新密码', trigger: 'blur' },
    { validator: validateConfirmPwd, trigger: 'blur' }
  ],
})

function handleClose(done: () => void) {
  confirmFormRef.value?.resetFields()
  ruleFormRef.value?.resetFields()
  done()
}
const open = () => {
  state.forgetDialogVisible = true
}
const cancelReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  state.forgetDialogVisible = false
}

const openResetDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await verifyAccount({
        account: forgetData.account,
        email: forgetData.email,
      })
      if (res.data.status == 0) {
        sessionStorage.setItem('resetId',res.data.id)
        formEl.resetFields()
        state.forgetDialogVisible = false
        state.resetDialogVisible = true
      } else {
        ElMessage.error('请检查账号和邮箱')
      }

    } else {
      console.log('error submit!')
    }
  })
}

const toResetPassword = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await resetPassword({
        id: sessionStorage.getItem('resetId') || '',
        newPassword: forgetData.password,
      })
      if (res.data.status == 0) {
        ElMessage({
          message: '重置密码成功',
          type: 'success',
        })
        formEl.resetFields()
        state.resetDialogVisible = false
      } else {
        ElMessage.error('重置密码失败')
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
.el-form {
  padding-left: 42px;
}

.dialog-footer {
  padding-right: 48px;
}
</style>