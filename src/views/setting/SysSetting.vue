<template>
  <div class="common-wrapper">
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <!-- 账号详情 -->
        <el-tab-pane label="账号详情" name="accountInfo">
          <div class="setting-info-wrapper">
            <div class="setting-info-content">
              <span class="setting-info-item">用户头像：</span>
              <!-- 1.头像上传 -->
              <el-upload class="avatar-uploader" :action="`http://127.0.0.1:3001/user/uploadAvatar?id=${userInfo.id}`"
                :show-file-list="false" :auto-upload="true" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" :data="{ id: userInfo.id }">
                <img v-if="userInfo.image_url" :src="userInfo.image_url" @error="handleImageError" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户账号:</span>
              <!-- 2.用户账号 -->
              <el-input v-model="userInfo.account" style="width: 240px" disabled />
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户密码:</span>
              <!-- 3.用户密码 -->
              <el-button type="primary" @click="resetPassword">修改密码</el-button>
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户姓名:</span>
              <!-- 4.用户姓名 -->
              <el-input v-model="userName" style="width: 240px" class="setting-info-item" />
              <el-button type="primary" @click="resetName">保存</el-button>
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户性别:</span>
              <!-- 5.用户性别 -->
              <el-select v-model="userInfo.gender" placeholder="请选择性别" style="width: 240px" class="setting-info-item">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button type="primary" @click="resetGender">保存</el-button>
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户身份:</span>
              <!-- 6.用户身份 -->
              <el-input v-model="userInfo.identity" style="width: 240px" disabled />
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户部门:</span>
              <!-- 7.用户部门 -->
              <el-input v-model="userInfo.department" style="width: 240px" disabled />
            </div>
            <div class="setting-info-content">
              <span class="setting-info-item">用户邮箱:</span>
              <!-- 8.用户邮箱 -->
              <el-input v-model="userInfo.email" style="width: 240px" class="setting-info-item" />
              <el-button type="primary" @click="resetEmail">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <!-- 公司信息 -->
        <el-tab-pane label="公司信息" name="companyInfo">
          <div class="setting-info-wrapper">
            <div class="setting-info-content" v-for="item in conmapyData" :key="item.id">
              <span class="setting-info-item">{{ getCompanyTitle(item.set_name) }}:</span>
              <!-- 公司名称 -->
              <el-input v-if="item.set_name == 'company_name'" v-model="item.set_value" style="width: 240px"
                class="setting-info-item" />
              <el-button v-if="item.set_name == 'company_name'" type="primary"
                @click="setCompanyName(item)">编辑公司名称</el-button>
              <el-button v-else type="success" @click="openSetInfoDialog(item)">编辑{{ getCompanyTitle(item.set_name)
              }}</el-button>
            </div>
          </div>
        </el-tab-pane>
        <!-- 首页管理 -->
        <el-tab-pane label="首页管理" name="homeSetting">
          <div class="home-info-wrapper">
            <span class="upload-tip">提示：点击图片框上传首页轮播图</span>
            <div class="home-info-content" v-for="item in swiperData" :key="item.id">
              <span class="home-info-item">{{ getSwiperTitle(item.set_name) }}：</span>
              <el-upload class="upload-demo" action="http://127.0.0.1:3001/set/setSwiper" list-type="picture"
                :auto-upload="true" :show-file-list="false"
                :on-success="handleSwiperSuccess" :before-upload="beforeSwiperUpload"
                :data="{ set_name: item.set_name }">
                <img class="swiper-item" v-if="item.set_value" :src="item.set_value" @error="handleImageError" />
                <div v-else class="swiper-item">
                  <SvgIcon icon-name="upload" size="24" class="bread-crumb-icon" color="#2c2c2c"></SvgIcon>
                </div>
              </el-upload>
            </div>
          </div>
        </el-tab-pane>
        <!-- 其他设置 -->
        <el-tab-pane label="其他设置" name="otherSetting">其他设置</el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <ResetDialog :userId="userInfo.id" ref="resetDialogRef"></ResetDialog>
  <SetInfoDialog ref="setInfoDialogRef"></SetInfoDialog>
</template>

<script lang="ts" setup name="Setting">
import { reactive, ref } from "vue"
import { type UploadProps, ElMessage } from "element-plus"
import { CompanyInfoEnum } from '@/contants/CompanyInfoEnum'
import { SwiperEnum } from '@/contants/SwiperEnum'
import ResetDialog from "@/views/setting/resetPassword/ResetDialog.vue";
import SetInfoDialog from "@/views/setting/setCompanyInfo/SetInfoDialog.vue";
import emitter from '@/utils/emitter'
import SvgIcon from "@/components/SvgIcon.vue"
import { setCompanyInfo } from "@/api/setting";
// 引入防抖函数
import { useDebounce } from '@/hooks/useDebounce'

// 使用账号详情hooks
import useAccountInfo from '@/hooks/useAoocuntInfo'
// 使用公司信息和首页轮播图hooks
// import useHomeSetting from '@/hooks/useHomeSetting'

// pinia存储的公司信息和首页轮播图数据
import { useSettingStore } from "@/store/settingInfo"
// 打开修改对话框
const setInfoDialogRef = ref()
const settingStore = useSettingStore()
// pinia存储的数据
const { swipers:{swiperData},companyInfo:{conmapyData} } = reactive(settingStore)
interface setInfoForm {
  id?: number
  set_name: string
  set_value: string
}


// 账号详情
const {
  userInfo,
  resetDialogRef,
  options,
  userName,
  handleAvatarSuccess,
  handleImageError,
  beforeAvatarUpload,
  resetPassword,
  resetName,
  resetGender,
  resetEmail,
} = useAccountInfo()
// tab初始项
const activeName = ref("accountInfo")


// 公司信息
const getCompanyTitle = (item: string) => {
  return CompanyInfoEnum[item as keyof typeof CompanyInfoEnum]
}
// 修改公司名称按钮函数  使用防抖函数
const setCompanyName = useDebounce(async (item: setInfoForm) => {
  const data = {
    set_name: item.set_name,
    set_value: item.set_value
  }

  const res = await setCompanyInfo(data)

  if (res.data.status == 0) {
    return ElMessage({
      message: "修改公司名称成功",
      type: 'success',
    })
  }
  ElMessage.error('修改公司名称失败,请检查网络后重试')
},500)

// 打开编辑弹窗
const openSetInfoDialog = (item: setInfoForm) => {
  emitter.emit('setInfo', item)
  setInfoDialogRef.value.open()
}


// 首页管理
// 轮播图标题
const getSwiperTitle = (item: string) => {
  return SwiperEnum[item as keyof typeof SwiperEnum]
}
// 轮播图上传
const handleSwiperSuccess: UploadProps["onSuccess"] = async (
  response,
  uploadFile,
) => {
  if (response.status == 0) {
    // console.log(response);
    swiperData.forEach((item: setInfoForm,index) => {
      if (response.set_name == item.set_name) {
        swiperData[index].set_value = response.url
      }
    })
    ElMessage({
      message: "修改轮播图成功",
      type: 'success',
    })
  }

  // userInfo.image_url = response.url

}

// 上传文件限制
const beforeSwiperUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!")
    return false
  }
  return true
}

</script>

<style lang="scss" scoped>
.setting-info-wrapper {
  .setting-info-content {
    display: flex;
    align-items: center;
    margin: 32px;

    .setting-info-item {
      margin-right: 32px;
    }

  }
}

.home-info-wrapper {
  .home-info-content {
    display: flex;
    align-items: center;
    margin: 16px 32px 0;

    .home-info-item {
      margin-right: 20px;
    }

    .swiper-item {
      width: 280px;
      height: 88px;
      text-align: center;
      line-height: 88px;
      border: 1px dashed var(--el-border-color);
    }

    .swiper-item:hover {
      border-color: var(--el-color-primary);
    }
  }

  .upload-tip {
    margin-left: 32px;
    font-weight: 700;
    color: var(--el-color-primary);
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