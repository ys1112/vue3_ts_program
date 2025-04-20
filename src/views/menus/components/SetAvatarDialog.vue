<template>
  <el-dialog v-model="setAvatarDialogVisible" title="更改头像" width="600" :before-close="handleClose"
    :destroy-on-close="true">
    <div class="dialog-body">
      <span class="upload-tip">提示：点击图片框更换头像</span>
      <el-upload :headers="uploadHeaders" class="avatar-uploader" :action="`${apiUrl}/user/uploadAvatar?id=${userInfo.id}`"
        :show-file-list="false" :auto-upload="true" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload" :data="{ id: userInfo.id }">
        <img v-if="userInfo.image_url" :src="userInfo.image_url" @error="handleImageError" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="SetAvatarDialog">
import { ref, reactive } from 'vue';
import { type UploadProps, ElMessage } from "element-plus"
import { useUserInfoStore } from "@/store/userInfoStore"
import { bindAccount } from "@/api/user"
const { userInfo } = reactive(useUserInfoStore())
const apiUrl = import.meta.env.VITE_API_URL

const setAvatarDialogVisible = ref(false)
const handleClose = (done: () => void) => {
  done()
}
// 在组件卸载时解绑set-info事件
const cancel = () => {
  setAvatarDialogVisible.value = false;
};
const uploadHeaders = ref({
  Authorization: localStorage.getItem('token')
});
// 头像上传
const handleAvatarSuccess: UploadProps["onSuccess"] = async (
  response,
  uploadFile
) => {
  userInfo.image_url = response.url
  const bindData = {
    url: response.url,
    only_id: response.only_id,
    account: userInfo.account,
  }
  const res = await bindAccount(bindData)
  if (res.data.status == 0) {
    setAvatarDialogVisible.value = false;
    ElMessage({
      message: "绑定头像成功",
      type: "success",
    })
  }
}
// 处理图片加载失败
const handleImageError = (event: any) => {
  console.log("图片加载失败", event)
  userInfo.image_url = ""
}
// 上传文件限制
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!")
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!")
    return false
  } else if(!uploadHeaders.value.Authorization) {
    ElMessage.error('请先登录')
    return false
  }
  return true
}
const open = () => {
  setAvatarDialogVisible.value = true
}
// 向父组件暴露打开弹窗事件
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.dialog-body {
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-tip {
  margin-bottom: 32px;
  font-weight: 700;
  font-size: 16px;
  color: var(--el-color-primary);
}
</style>