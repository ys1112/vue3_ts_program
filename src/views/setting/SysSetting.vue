<template>
  <div class="common-wrapper">
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="账号详情" name="accountInfo">
          <div class="account-info-wrapper">
            <div class="account-info-content">
              <span class="account-info-item">用户头像：</span>
              <!-- 1.头像上传 -->
              <el-upload class="avatar-uploader" action="http://127.0.0.1:3001/user/uploadAvatar"
                :show-file-list="false" :auto-upload="true" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="userInfo.image_url" :src="userInfo.image_url" @error="handleImageError" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户账号:</span>
              <!-- 2.用户账号 -->
              <el-input v-model="userInfo.account" style="width: 240px" disabled />
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户密码:</span>
              <!-- 3.用户密码 -->
              <el-button type="primary" @click="resetPassword">修改密码</el-button>
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户姓名:</span>
              <!-- 4.用户姓名 -->
              <el-input v-model="userName" style="width: 240px" class="account-info-item" />
              <el-button type="primary" @click="resetName">保存</el-button>
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户性别:</span>
              <!-- 5.用户性别 -->
              <el-select v-model="userInfo.gender" placeholder="请选择性别" style="width: 240px" class="account-info-item">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button type="primary" @click="resetGender">保存</el-button>
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户身份:</span>
              <!-- 6.用户身份 -->
              <el-input v-model="userInfo.identity" style="width: 240px" disabled />
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户部门:</span>
              <!-- 7.用户部门 -->
              <el-input v-model="userInfo.department" style="width: 240px" disabled />
            </div>
            <div class="account-info-content">
              <span class="account-info-item">用户邮箱:</span>
              <!-- 8.用户邮箱 -->
              <el-input v-model="userInfo.email" style="width: 240px" class="account-info-item" />
              <el-button type="primary" @click="resetEmail">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="companyInfo">公司信息</el-tab-pane>
        <el-tab-pane label="首页管理" name="homeSetting">首页管理</el-tab-pane>
        <el-tab-pane label="其他设置" name="otherSetting">其他设置</el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <ResetDialog :userId="userInfo.id" ref="resetDialogRef"></ResetDialog>
</template>

<script lang="ts" setup name="Setting">
import ResetDialog from "@/views/setting/resetPassword/ResetDialog.vue";
import { onMounted, reactive, ref } from 'vue'
import { type UploadFile, type TabsPaneContext, type UploadProps, ElMessage } from 'element-plus'
import { useInfoStore } from '@/store/userInfo'
import { bindAccount, updateName, updateGender, updateEmail } from "@/api/user";
const infoStore = useInfoStore()
const { userInfo } = reactive(infoStore)
const resetDialogRef = ref()
const options = [
  {
    value: '男',
    label: '男',
  },
  {
    value: '女',
    label: '女',
  }
]
const activeName = ref('accountInfo')

// 重新定义用户名，防止输入框数据双向绑定，欢迎语中姓名改变
const userName = ref(userInfo.name)

const originUserInfo = Object.assign({},userInfo)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(async () => {
  
})
// 头像上传
const handleAvatarSuccess: UploadProps['onSuccess'] = async (
  response,
  uploadFile
) => {
  userInfo.image_url = response.url
  const bindData = {
    url: response.url,
    only_id: response.only_id,
    account: userInfo.account
  }
  const res = await bindAccount(bindData)
  if (res.data.status == 0) {
    ElMessage({
      message: '绑定头像成功',
      type: 'success',
    })
  }
}
const handleImageError = (event:any)=>{
  console.log('图片加载失败', event)
  userInfo.image_url = ''
}
// 上传文件限制
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

// 修改密码
const resetPassword = () => {
  resetDialogRef.value.open()
}

// 修改用户姓名
const resetName = async() => {
  // 对比是否修改用户名
  if(userName.value == originUserInfo.name) {
    return ElMessage.error('修改姓名与原姓名一致，请重新修改')
  }
  if (userName.value && userInfo.id) {
    const id = {
      id: userInfo.id
    }
    const uName = {
      name: userName.value
    }
    // 调用更新姓名接口
    const res = await updateName(id, uName)
    if (res.data.status == 0) {
      // 修改成功对比文件重新赋值
      originUserInfo.name = userName.value
      // pinia更新用户数据
      userInfo.name = userName.value
      ElMessage({
        message: '修改姓名成功',
        type: 'success',
      })
    } else {
      if(res.data.message.includes('pattern')) 
      return ElMessage.error('修改姓名失败,请检查姓名格式')
    }
  } else {
    ElMessage.error('修改姓名失败，请稍后再试')
  }
}
// 修改用户性别
const resetGender = async () => {
  if(userInfo.gender == originUserInfo.gender) {
    return ElMessage.error('修改性别与原性别一致，请重新修改')
  }
  if (userInfo.gender && userInfo.id) {
    const id = {
      id: userInfo.id
    }
    const gender = {
      gender: userInfo.gender
    }
    // 调用更新性别接口
    const res = await updateGender(id, gender)
    if (res.data.status == 0) {
      originUserInfo.gender = userInfo.gender
      ElMessage({
        message: '修改性别成功',
        type: 'success',
      })
    } else {
      ElMessage.error('修改性别失败')
    }
  } else {
    ElMessage.error('修改性别失败')
  }
}

// 修改用户邮箱
const resetEmail = async() => {
  if(userInfo.email == originUserInfo.email) {
    return ElMessage.error('修改邮箱与原邮箱一致，请重新修改')
  }
  if (userInfo.gender && userInfo.id) {
    const id = {
      id: userInfo.id
    }
    const email = {
      email: userInfo.email
    }
    // 调用更新邮箱接口
    const res = await updateEmail(id, email)
    if (res.data.status == 0) {
      originUserInfo.email = userInfo.email
      ElMessage({
        message: '修改邮箱成功',
        type: 'success',
      })
    } else {
      if(res.data.message.includes('pattern')) 
      return ElMessage.error('修改邮箱失败,请检查邮箱格式')
    }
  } else {
    ElMessage.error('修改邮箱失败，请稍后再试')
  }
}

</script>

<style lang="scss" scoped>
.account-info-wrapper {
  .account-info-content {
    display: flex;
    align-items: center;
    margin: 28px;
    .account-info-item {
      margin-right: 20px;
    }
  }
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>