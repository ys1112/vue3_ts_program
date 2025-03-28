<template>
  <el-dialog v-model="resetDialogVisible" title="重置密码" width="420" :before-close="handleClose">
    <el-form :model="resetData" :rules="rules" ref="resetFormRef" label-position="top" class="login-form"
      style="max-width: 600px">
      <el-form-item label="请输入您的原密码" prop="password">
        <el-input type="password" show-password v-model="resetData.password" style="width: 300px"
          placeholder="请输入您的新密码">
        </el-input>
      </el-form-item>
      <el-form-item label="请输入您的新密码" prop="newPassword">
        <el-input type="password" show-password v-model="resetData.newPassword" style="width: 300px"
          placeholder="请输入您的新密码">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="toResetPassword(resetFormRef)">
          重置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="ResetDialog">
import { useRouter } from 'vue-router'
import { updatePassword } from "@/api/user";
import { reactive, ref, } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance } from 'element-plus'

// 密码数据接口
interface resetForm {
  password: string
  newPassword: string
}
const router = useRouter()
// 对话框显示控制
const resetDialogVisible = ref(false)

// resetFormRef表单实例对象
const resetFormRef = ref<FormInstance>()
// 密码数据
const resetData: resetForm = reactive({
  password: '',
  newPassword: ''
})
// 接受父组件传递的id,用于重置密码
const props = defineProps(['userId'])
// 密码校验正则表达式
const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9-_!?@]{6,16}$/
// 自定义原密码校验规则
const validatePassword = (rule: any, value: any, callback: any) => {
  if (resetData.password !== '') {
    if (!regPassword.test(resetData.password)) {
      callback(new Error("请确认密码格式，必须包含字母和数字，长度6-16位含-_?!@"))
    } else {
      callback()
    }
  }
}
// 自定义新密码校验规则
const validateNewPassword = (rule: any, value: any, callback: any) => {
  if (resetData.password == resetData.newPassword) {
    callback(new Error("新密码和旧密码相同，请重新输入新密码"))
  }
  if (resetData.password !== '') {
    if (!regPassword.test(resetData.password)) {
      callback(new Error("请确认密码格式，必须包含字母和数字，长度6-16位含-_?!@"))
    } else {
      callback()
    }
  }
}

// 表单校验规则
const rules = reactive<FormRules<resetForm>>({
  password: [
    { required: true, message: '请输入您的原密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入您的新密码', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
})
// 重置密码按钮事件
const toResetPassword = (formEl: FormInstance | undefined) => {
  // 表单整体校验
  if (!formEl) return
  // 表单校验
  formEl.validate(async (valid) => {
    if (valid) {
      const id = {
        id: props.userId
      }
      const data = {
        password: resetData.password,
        newPassword: resetData.newPassword,
      }
      // 调用登录后重置密码接口
      const res = await updatePassword(id, data)
      if (res.data.status == 0) {
        ElMessage({
          message: '重置密码成功',
          type: 'success',
        })
        // 重置密码成功，清除缓存，跳转至登陆页面
        localStorage.clear()
        sessionStorage.clear()
        router.replace('/login')
      } else {
        if (res.data.message == '原密码错误') ElMessage.error(res.data.message)
      }
    } else {
      console.log('error submit!')
    }
  })
}

function handleClose(done: () => void) {
  resetFormRef.value?.resetFields()
  done()
}
const open = () => {
  resetDialogVisible.value = true
}
// 向父组件暴露打开弹窗事件
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