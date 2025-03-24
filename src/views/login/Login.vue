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
              <el-tabs v-model="activeName" class="demo-tabs" stretch>
                <el-tab-pane label="登录" name="first">
                  <el-form class="login-form" style="max-width: 600px">
                    <el-form-item label="账号">
                      <el-input v-model="loginData.account" style="width: 300px" placeholder="请输入账号">
                        <template #prefix>
                          <el-icon>
                            <User />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                      <el-input v-model="loginData.password" style="width: 300px" placeholder="请输入密码" type="password"
                        show-password>
                        <template #prefix><el-icon>
                            <Lock />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>
                    <div class="login-btn-wrapper">
                      <div class="forget-wrapper">
                        <a href="#" class="forget-btn" @click="forgetPwd">忘记密码</a>
                      </div>
                      <div class="login-btn-wrapper">
                        <el-button type="primary" class="login-btn" @click="toMenuHome">登录</el-button>
                      </div>
                      <div class=" to-register-wrapper">还没有账号？ <a href="#" class="to-register-btn">马上注册</a></div>
                    </div>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="注册" name="second">
                  <el-form label-width="auto" class="register-form" style="max-width: 600px">
                    <el-form-item label="账号">
                      <el-input v-model="registerData.account" style="width: 300px" placeholder="账号长度6-12位">
                        <template #prefix>
                          <el-icon>
                            <User />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="密码">
                      <el-input v-model="registerData.password" style="width: 300px" placeholder="密码长度6-16位含字母数字_?!@"
                        type="password" show-password>
                        <template #prefix><el-icon>
                            <Lock />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>

                    <el-form-item label="确认密码">
                      <el-input v-model="registerData.confirmPassword" style="width: 300px" placeholder="请再次输入密码"
                        type="password" show-password>
                        <template #prefix><el-icon>
                            <Lock />
                          </el-icon></template>
                      </el-input>
                    </el-form-item>
                    <div class="register-wrapper">
                      <el-button type="primary" class="register-btn" @click="toRegister">注册</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import forgetDialog from './components/ForgetPwdDialog.vue'
import { useRouter } from 'vue-router'
import { login, register } from "@/api/login";
const router = useRouter()
const activeName = ref('first')
const forgetDialogRef = ref()
function forgetPwd() {
  forgetDialogRef.value.open()
}

interface formData {
  account: string
  password: string
  confirmPassword?: string
}
const loginData: formData = reactive({
  account: '',
  password: ''
})
const registerData: formData = reactive({
  account: '',
  password: '',
  confirmPassword: ''
})
const toMenuHome = () => {
  login(loginData).then(res => {
    console.log(res);

  })
  // router.push('/menu/home')
}
const toRegister = () => {
  if (registerData.password == registerData.confirmPassword) {
    const { account, password } = registerData
    register({ account, password }).then(res => {
      console.log(res);
    })
  }
}
</script>

<style lang="scss" scoped>
.common-layout {
  color: #fff;
  height: 100vh;
  background-image: url('@/assets/bgc.jpg');
  background-size: 100%;

  .header-wrapper {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1200px;
      margin: 0 auto;

      span {
        font-size: 14px;
      }
    }
  }

  .login-wrapper {
    height: 600px;

    .login-content {
      position: relative;
      width: 1200px;
      height: 600px;
      margin: 0 auto;

      .box-login {
        position: absolute;
        top: 50%;
        right: 0;
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
      width: 1200px;
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