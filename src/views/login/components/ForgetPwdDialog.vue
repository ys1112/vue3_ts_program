<template>
  <!-- 忘记密码对话框 -->
  <el-dialog v-model="state.forgetDialogVisible" title="忘记密码" width="420" :before-close="handleClose">
    <el-form :rules="rules" label-position="top" class="login-form"  style="max-width: 600px">
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
        <el-button @click="state.forgetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="openResetDialog">
          下一步
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 重置密码对话框 -->
  <el-dialog v-model="state.resetDialogVisible" title="重置密码" width="420" :before-close="handleClose">
    <el-form :rules="rules" label-position="top" class="login-form"  style="max-width: 600px">
      <el-form-item label="请输入您的新密码" prop="password">
        <el-input v-model="forgetData.password" style="width: 300px" placeholder="请输入您的新密码">
        </el-input>
      </el-form-item>
      <el-form-item label="请再次输入您的新密码" prop="confirmPassword">
        <el-input v-model="forgetData.confirmPassword" style="width: 300px" placeholder="请再次输入您的新密码">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.resetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="state.resetDialogVisible = false">
          下一步
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ForgetPwdDialog">
import { reactive, ref, } from 'vue';
import { ElMessageBox, type FormRules, type FormInstance } from 'element-plus'
// 对话框状态
const state = reactive({
  forgetDialogVisible:false,
  resetDialogVisible:false
})
const ruleFormRef = ref<FormInstance>()
interface ForgetForm {
  account: string
  email: string
  password:string
  confirmPassword:string
}
const forgetData: ForgetForm = reactive({
  account: '',
  email: '',
  password:'',
  confirmPassword:''
})
const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const validateAccount = (rule: any, value: any, callback: any) => {

}
const validateEmail = (rule: any, value: any, callback: any) => {
  if (forgetData.email === '') {
    callback(new Error('请输入您的注册邮箱'))
  } else {
    if (forgetData.email !== '') {
      if (regEmail.test(forgetData.email)) return
      callback(new Error("请输入正确的邮箱格式"))
    }
    callback()
  }
}
const rules = reactive<FormRules<ForgetForm>>({
  account: [
    { required: true, message: '请输入您的注册账号', trigger: 'blur' },
    // { validator: validateAccount, trigger: 'blur' }
  ],
  email: [
    // { required: true, message: '请输入您的邮箱', trigger: 'blur' },
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的新密码', trigger: 'blur' },
    // { validator: validateAccount, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入您的新密码', trigger: 'blur' },
    // { validator: validateAccount, trigger: 'blur' }
  ],
})

function handleClose(done: () => void) {
  ElMessageBox.confirm('确认关闭当前对话框？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const open = () => {
  state.forgetDialogVisible = true
}
const openResetDialog = () =>{
  state.forgetDialogVisible = false
  state.resetDialogVisible = true
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.el-form {
  padding-left: 42px;
}
</style>