<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header-wrapper">
          <div class="header-content">
            <h2>通用后台管理系统</h2>
            <span>欢迎您的登录</span>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="login-wrapper">
          <div class="login-content">
            <el-card class="box-login">
              <el-tabs v-model="activeName" @tab-click="handleClick" class="demo-tabs" stretch>
                <el-tab-pane label="登录" name="first">
                  <el-form ref="ruleFormRef" :model="loginData" :rules="rules" class="login-form"
                    style="max-width: 600px">
                    <el-form-item label="账号" prop="account">
                      <el-input v-model="loginData.account" style="width: 280px" placeholder="请输入账号">
                        <template #prefix>
                          <el-icon>
                            <User />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="loginData.password" style="width: 280px" placeholder="请输入密码" type="password"
                        show-password>
                        <template #prefix><el-icon>
                            <Lock />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>
                    <div class="login-btn-wrapper">
                      <div class="forget-wrapper">
                        <span class="forget-btn" @click="forgetPwd">忘记密码</span>
                      </div>
                      <div class="login-btn-wrapper">
                        <el-button type="primary" class="login-btn" @click="toLogin(ruleFormRef)">登录</el-button>
                      </div>
                      <div class=" to-register-wrapper">还没有账号？ <span class="to-register-btn"
                          @click="activeName = 'second'">马上注册</span>
                      </div>
                    </div>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="注册" name="second">
                  <el-form ref="registerFormRef" :model="registerData" :rules="rules" label-width="90px"
                    class="register-form" style="max-width: 600px">
                    <el-form-item label="账号" prop="account">
                      <el-input v-model="registerData.account" style="width: 280px" placeholder="账号长度6-12位">
                        <template #prefix>
                          <el-icon>
                            <User />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                      <el-input v-model="registerData.password" style="width: 280px" placeholder="密码长度6-16位含字母数字_?!@"
                        type="password" show-password>
                        <template #prefix><el-icon>
                            <Lock />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="confirmPassword">
                      <el-input v-model="registerData.confirmPassword" style="width: 280px" placeholder="请再次输入密码"
                        type="password" show-password>
                        <template #prefix><el-icon>
                            <Lock />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>
                    <div class="register-wrapper">
                      <el-button type="primary" class="register-btn" @click="toRegister(registerFormRef)">注册</el-button>
                    </div>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class="footer-wrapper">
          <div class="footer-content">
            <span>Copyright @ Test Company 2025</span>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
  <forgetDialog ref="forgetDialogRef"></forgetDialog>
</template>

<script lang="ts" setup name="Login">
import { ElMessage, type FormInstance, type FormRules, type TabsPaneContext } from 'element-plus'
import { ref, reactive, onMounted, toRefs } from 'vue'
import forgetDialog from './components/ForgetPwdDialog.vue'
import { useRouter } from 'vue-router'
import { login, register } from "@/api/login";
import { recordLogin } from "@/api/login_log";
import { useUserInfoStore } from '@/store/userInfoStore'
import { useSettingStore } from '@/store/settingInfoStore'
import { getDepartMsg } from "@/api/department"
import { setCachedRoutes } from '@/utils/auth'
import { formatRoutes } from "@/router/asyncRoute";
import {clearStore} from "@/utils/clearStore"
const { getInfo, userInfo } = useUserInfoStore()
const { menuList } = toRefs(useUserInfoStore())
const { getSettingInfo, getDepartmentInfo, getProductInfo } = useSettingStore()
const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9-_!?@]{6,16}$/
onMounted(() => {
  localStorage.clear()
  sessionStorage.clear()
  clearStore()
})
const router = useRouter()
const activeName = ref('first')
// 表单验证规则
const ruleFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const forgetDialogRef = ref()

interface FormData {
  account: string
  password: string
  confirmPassword?: string
}
const loginData: FormData = reactive({
  account: 'admin1',
  password: 'a123123'
})
const registerData: FormData = reactive({
  account: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPwd = (rule: any, value: any, callback: any) => {
  if (value === '') {
    return callback(new Error("请再次输入您的新密码"))
  }
  if (registerData.password == '') {
    return callback(new Error("请先输入您的新密码"))
  }
  if (registerData.password !== registerData.confirmPassword) {
    return callback(new Error("两次密码不一致"))
  }
  callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value !== '') {
    if (!regPassword.test(value)) {
      callback(new Error("请确认密码，必须包含字母和数字，长度6-16位含-_?!@"))
    } else {
      callback()
    }
  }
}

const rules = reactive<FormRules<FormData>>({
  account: [
    { required: true, message: '请输入您账号', trigger: 'blur' },
    { min: 6, max: 12, message: '请确认账号，长度6-12位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入您的新密码', trigger: 'blur' },
    { validator: validateConfirmPwd, trigger: 'blur' }
  ],
})

const forgetPwd = () => {
  forgetDialogRef.value.open()
}

const toLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await login(loginData)
      if (res.data.status == 0) {
        const { token } = res.data
        localStorage.setItem('token', token)
        // 记录菜单
        handleMenus(res.data.results.menus)
        // 记录登录日志
        const params = {
          name: res.data.results.name,
          account: res.data.results.account,
          email: res.data.results.email,
          identity: res.data.results.identity
        }
        localStorage.setItem('userId', res.data.results.id)
        await recordLogin(params)
        ElMessage({
          message: '登录成功',
          type: 'success',
        })
        // 获取公司信息和轮播图
        getSettingInfo()
        // 获取部门设置
        getDepartmentInfo()
        // 获取产品类别设置
        getProductInfo()
        // 获取用户部门信息
        if (!res.data.results.read_status) {
          const params = {
            department: res.data.results.department,
            id: res.data.results.id,
          }
          const departRes = await getDepartMsg(params)
          if (departRes.data.status == 0) {
            userInfo.read_list = JSON.stringify(res.data.read_list)
          }
        }
        // 获取用户信息 存储用户信息
        await getInfo(res.data.results.id)
        router.push('/home')
      } else {
        ElMessage.error('登录失败')
      }
    } else {
      console.log('error submit!')
    }
  })
}

const handleMenus = (menuData: string) => {
  const routeList = formatRoutes(JSON.parse(menuData))
  routeList.forEach((route:any) => {
    router.addRoute('Menu', route) // 添加到Menu路由的children
  })
  // 存储到Store
  menuList.value = JSON.parse(menuData)
  // 记录菜单到storage
  setCachedRoutes(menuData)
}

const toRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await register(registerData)
      if (res.data.status == 0) {
        ElMessage({
          message: '注册成功',
          type: 'success',
        })
        formEl.resetFields()
        activeName.value = 'first'
      } else {
        ElMessage.error('注册失败,请检查账号密码是否合规')
      }
    } else {
      console.log('error submit!')
    }
  })

}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  ruleFormRef.value?.resetFields()
  registerFormRef.value?.resetFields()
}

</script>

<style lang="scss" scoped>
.common-layout {
  color: #fff;
  height: 100vh;
  background-image: url('@/assets/images/bgc.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  .header-wrapper {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      padding: 0 40px;

      span {
        font-size: 14px;
      }
    }
  }

  .login-wrapper {
      position: relative;
      height: 600px;

    .login-content {

      .box-login {
        position: absolute;
        top: 50%;
        right: 10%;
        transform: translateY(-50%);
        width: 450px;
        height: 320px;

        .login-btn-wrapper {
          width: 100%;

          .forget-wrapper {
            width: 100%;
            display: flex;
            justify-content: right;

            .forget-btn {
              margin-right: 20px;
              text-decoration: none;
              color: #409eff;
              font-size: 12px;
              cursor: pointer;
            }
          }

          .login-btn-wrapper {
            display: flex;
            justify-content: center;
            width: 100%;
            padding-top: 4px;

            .login-btn {
              width: 50%;
              height: 40px;
              font-size: 16px;
              letter-spacing: 4px;
            }
          }

          .to-register-wrapper {
            display: flex;
            justify-content: center;
            padding-top: 16px;
            width: 100%;
            font-size: 12px;

            .to-register-btn {
              cursor: pointer;
              text-decoration: none;
              color: #409eff;
            }
          }
        }

        .login-form {
          margin-left: 20px;
        }

        .register-form {
          margin-left: -16px;
        }

        .register-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;

          .register-btn {
            width: 50%;
            height: 40px;
            font-size: 16px;
            letter-spacing: 4px;
          }
        }
      }
    }
  }

  .footer-wrapper {
    margin-top: 160px;

    .footer-content {
      display: flex;
      justify-content: center;
      margin: 0 auto;
      font-size: 12px;
    }
  }
}



.el-form-item {
  margin-top: 4px;
  margin-left: 24px;
}

// 样式穿透，一般放在最下面
:deep(.el-tabs__item) {
  font-size: 18px;
  color: #494949;
}

:deep(.el-input__inner) {
  height: 36px;
}

:deep(.el-form-item__label) {
  height: 36px;
  line-height: 36px;
  font-size: 16px;
}
</style>