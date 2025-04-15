<template>
  <div class="common-wrapper">
    <div class="common-content set-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="changeTab">
        <!-- 账号详情 -->
        <el-tab-pane label="账号详情" name="accountInfo">
          <div class="setting-info-wrapper">
            <span class="upload-tip">提示：点击图片框更换头像</span>
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
          <div class="company-info-wrapper">
            <div class="company-info-content" v-for="item in conmapyData" :key="item.id">
              <span class="company-info-item">{{ getCompanyTitle(item.set_name) }}:</span>
              <!-- 公司名称 -->
              <el-input v-if="item.set_name == 'company_name'" v-model="item.set_value" style="width: 240px"
                class="company-info-item" />
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
                :auto-upload="true" :show-file-list="false" :on-success="handleSwiperSuccess"
                :before-upload="beforeSwiperUpload" :data="{ set_name: item.set_name }">
                <img class="swiper-item" v-if="item.set_value" :src="item.set_value" @error="handleImageError" />
                <div v-else class="swiper-item">
                  <SvgIcon icon-name="upload" size="24" color="#2c2c2c"></SvgIcon>
                </div>
              </el-upload>
            </div>
          </div>
        </el-tab-pane>
        <!-- 其他设置 -->
        <el-tab-pane label="其他设置" name="otherSetting">
          <div class="other-set-wrapper">
            <div class="set-info-content">
              <div class="set-item">
                <span class="set-title">部门设置：</span>
                <div class="set-content">
                  <el-tag v-for="tag in departmentTags" size="large" :key="tag" closable :disable-transitions="false"
                    @close="handleDepartmentClose(tag)">
                    {{ tag }}
                  </el-tag>
                  <el-input v-if="departmentVisible" ref="departmentInputRef" v-model="inputDepartmentValue" class="w85"
                    size="default" @keyup.enter="handleDepartmentConfirm" @blur="handleDepartmentConfirm" />
                  <el-button v-else class="button-new-tag" size="default" @click="showDepartmentInput">
                    + New Tag
                  </el-button>
                </div>
              </div>
            </div>

            <div class="set-info-content">
              <div class="set-item">
                <span class="set-title">产品设置：</span>
                <div class="set-content">
                  <el-tag v-for="tag in productTags" size="large" :key="tag" closable :disable-transitions="false"
                    @close="handleProductClose(tag)">
                    {{ tag }}
                  </el-tag>
                  <el-input v-if="productVisible" ref="productInputRef" v-model="inputProductValue" class="w85"
                    size="default" @keyup.enter="handleProductConfirm" @blur="handleProductConfirm" />
                  <el-button v-else class="button-new-tag" size="default" @click="showProductInput">
                    + New Tag
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <ResetDialog :userId="userInfo.id" ref="resetDialogRef"></ResetDialog>
  <SetInfoDialog ref="setInfoDialogRef"></SetInfoDialog>
</template>

<script lang="ts" setup name="Setting">
import { reactive, ref, nextTick } from "vue"
import { type UploadProps, ElMessage, type InputInstance, type TabsPaneContext } from "element-plus"
import { CompanyInfoEnum } from '@/contants/CompanyInfoEnum'
import { SwiperEnum } from '@/contants/SwiperEnum'
import ResetDialog from "@/views/setting/resetPassword/ResetDialog.vue";
import SetInfoDialog from "@/views/setting/setCompanyInfo/SetInfoDialog.vue";
import emitter from '@/utils/emitter'
import SvgIcon from "@/components/SvgIcon.vue"
import { trackRecord } from "@/utils/tracker";
import { setCompanyInfo, setDepartment, getDepartment, setProduct, getProduct } from "@/api/setting";
// 引入防抖函数
import { useDebounce } from '@/hooks/useDebounce'

// 使用账号详情hooks
import useAccountInfo from '@/hooks/useAoocuntInfo'
// 使用公司信息和首页轮播图hooks
// import useHomeSetting from '@/hooks/useHomeSetting'

// pinia存储的公司信息和首页轮播图数据
import { useSettingStore } from "@/store/settingInfoStore"
// 打开修改对话框
const setInfoDialogRef = ref()
const settingStore = useSettingStore()
// pinia存储的数据
const { swipers: { swiperData }, companyInfo: { conmapyData }, departmentInfo, productInfo, getDepartmentInfo, getProductInfo } = reactive(settingStore)
interface SetInfoForm {
  id?: number
  set_name: string
  set_value: string
}

// 其他设置数据
// 部门设置
const inputDepartmentValue = ref('')
const departmentTags = ref([] as string[])
const departmentVisible = ref(false)
const departmentInputRef = ref<InputInstance>()

// 产品设置 
const inputProductValue = ref('')
const productTags = ref([] as string[])
const productVisible = ref(false)
const productInputRef = ref<InputInstance>()

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
const setCompanyName = useDebounce(async (item: SetInfoForm) => {
  const data = {
    set_name: item.set_name,
    set_value: item.set_value
  }
  const res = await setCompanyInfo(data)
  if (res.data.status == 0) {
    await trackRecord('setting', 'corp', '公司名称')
    return ElMessage({
      message: "修改公司名称成功",
      type: 'success',
    })
  }
  ElMessage.error('修改公司名称失败,请检查网络后重试')
}, 500)

// 打开编辑弹窗
const openSetInfoDialog = (item: SetInfoForm) => {
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
    await trackRecord('setting', 'corp', getSwiperTitle(response.set_name))
    const index = swiperData.findIndex((item: SetInfoForm) => item.set_name == response.set_name)
    // swiperData[index].set_value = response.url
    // 服务端图片url不变内能改变导致不更新问题
    swiperData[index].set_value = `${response.url}?t=${Date.now()}`
    // swiperData.forEach((item: setInfoForm,index) => {
    //   if (response.set_name == item.set_name) {
    //     swiperData[index].set_value = response.url
    //   }
    // })
    ElMessage({
      message: "修改轮播图成功",
      type: 'success',
    })
  }
}

// 上传文件限制
const beforeSwiperUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小超过2MB!")
    return false
  }
  return true
}

const changeTab = (pane: TabsPaneContext, ev: Event) => {
  if (pane.paneName == 'otherSetting') {
    departmentTags.value = departmentInfo
    productTags.value = productInfo
  }
}

// 其他设置
// 删除部门标签的按钮事件
const handleDepartmentClose = async (tag: string) => {
  departmentTags.value.splice(departmentTags.value.indexOf(tag), 1)
  //删除操作
  const params = {
    department: JSON.stringify(departmentTags.value)
  }
  const res = await setDepartment(params)
  if (res.data.status == 0) {
    getDepartmentInfo()
    ElMessage({
      message: "删除成功",
      type: 'success',
    })
  } else {
    ElMessage.error('删除失败')
  }
}

const showDepartmentInput = () => {
  departmentVisible.value = true
  nextTick(() => {
    departmentInputRef.value!.input!.focus()
  })
}
// 输入框失去焦点或enter键
const handleDepartmentConfirm = async () => {
  if (inputDepartmentValue.value.trim() && !departmentTags.value.includes(inputDepartmentValue.value)) {
    departmentTags.value.push(inputDepartmentValue.value)
    // 新增操作
    const params = {
      department: JSON.stringify(departmentTags.value)
    }
    const res = await setDepartment(params)
    if (res.data.status == 0) {
      getDepartmentInfo()
      ElMessage({
        message: "添加成功",
        type: 'success',
      })
    } else {
      ElMessage.error('添加失败')
    }
    departmentVisible.value = false
    inputDepartmentValue.value = ''
  } else if (departmentTags.value.includes(inputDepartmentValue.value)) {
    ElMessage.error('部门名重复')
    nextTick(() => {
      departmentInputRef.value!.input!.focus()
    })
  } else {
    departmentVisible.value = false
    inputDepartmentValue.value = ''
  }
}




// 删除产品标签的按钮事件
const handleProductClose = async (tag: string) => {
  productTags.value.splice(productTags.value.indexOf(tag), 1)
  //删除操作
  const params = {
    product: JSON.stringify(productTags.value)
  }
  const res = await setProduct(params)
  if (res.data.status == 0) {
    getProductInfo()
    ElMessage({
      message: "删除成功",
      type: 'success',
    })
  } else {
    ElMessage.error('删除失败')
  }
}

const showProductInput = () => {
  productVisible.value = true
  nextTick(() => {
    productInputRef.value!.input!.focus()
  })
}
// 输入框失去焦点或enter键
const handleProductConfirm = async () => {
  if (inputProductValue.value.trim() && !productTags.value.includes(inputProductValue.value)) {
    productTags.value.push(inputProductValue.value)
    // 新增操作
    const params = {
      product: JSON.stringify(productTags.value)
    }
    const res = await setProduct(params)
    if (res.data.status == 0) {
      getProductInfo()
      ElMessage({
        message: "添加成功",
        type: 'success',
      })
    } else {
      ElMessage.error('添加失败')
    }
    productVisible.value = false
    inputProductValue.value = ''
  } else if (productTags.value.includes(inputProductValue.value)) {
    ElMessage.error('产品名重复')
    nextTick(() => {
      productInputRef.value!.input!.focus()
    })
  } else {
    productVisible.value = false
    inputProductValue.value = ''
  }
}

</script>

<style lang="scss" scoped>
.set-content {
  height: calc(100% + 1px);
}

.setting-info-wrapper {
  .setting-info-content {
    display: flex;
    align-items: center;
    margin: 28px 0 0 32px;

    .setting-info-item {
      margin-right: 32px;
    }

  }
}
.company-info-wrapper {
  .company-info-content {
    display: flex;
    align-items: center;
    margin: 40px 32px;

    .company-info-item {
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

}

.upload-tip {
  margin-left: 32px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.other-set-wrapper {
  .set-info-content {
    display: flex;
    align-items: center;
    margin: 32px 32px 0;

    .set-item {
      display: flex;

      .set-title {
        display: inline-block;
        width: 116px;
        line-height: 32px;
      }

      .set-content {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
    }
  }
}

.w85 {
  width: 85px;
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