// 修改密码对话框
import { reactive, ref } from "vue"
import { type UploadProps, ElMessage } from "element-plus"
// pinia存储用户的数据
import { useUserInfoStore } from "@/store/userInfoStore"
// 修改用户数据的接口
import { bindAccount, updateName, updateGender, updateEmail } from "@/api/user"

export default function () {
  const infoStore = useUserInfoStore()
  const { userInfo } = reactive(infoStore)
  // 修改密码弹窗实例
  const resetDialogRef = ref()
  const options = [
    {
      value: "男",
      label: "男",
    },
    {
      value: "女",
      label: "女",
    },
  ]


  // 重新定义用户名，防止输入框数据双向绑定，欢迎语中姓名改变
  const userName = ref(userInfo.name)
  // 用于对比是否修改，确定是否发起修改操作
  const originUserInfo = Object.assign({}, userInfo)

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
    }
    return true
  }

  // 修改密码
  const resetPassword = () => {
    resetDialogRef.value.open()
  }

  // 修改用户姓名
  const resetName = async () => {
    // 对比是否修改用户名
    if (userName.value == originUserInfo.name) {
      return ElMessage.error("修改姓名与原姓名一致，请重新修改")
    }
    if (userName.value && userInfo.id) {
      const id = {
        id: userInfo.id,
      }
      const uName = {
        name: userName.value,
      }
      // 调用更新姓名接口
      const res = await updateName(id, uName)
      if (res.data.status == 0) {
        // 修改成功对比文件重新赋值
        originUserInfo.name = userName.value
        // pinia更新用户数据
        userInfo.name = userName.value
        ElMessage({
          message: "修改姓名成功",
          type: "success",
        })
      } else {
        if (res.data.message.includes("pattern"))
          return ElMessage.error("修改姓名失败,请检查姓名格式")
      }
    } else {
      ElMessage.error("修改姓名失败，请稍后再试")
    }
  }
  // 修改用户性别
  const resetGender = async () => {
    if (userInfo.gender == originUserInfo.gender) {
      return ElMessage.error("修改性别与原性别一致，请重新修改")
    }
    if (userInfo.gender && userInfo.id) {
      const id = {
        id: userInfo.id,
      }
      const gender = {
        gender: userInfo.gender,
      }
      // 调用更新性别接口
      const res = await updateGender(id, gender)
      if (res.data.status == 0) {
        originUserInfo.gender = userInfo.gender
        ElMessage({
          message: "修改性别成功",
          type: "success",
        })
      } else {
        ElMessage.error("修改性别失败")
      }
    } else {
      ElMessage.error("修改性别失败")
    }
  }

  // 修改用户邮箱
  const resetEmail = async () => {
    if (userInfo.email == originUserInfo.email) {
      return ElMessage.error("修改邮箱与原邮箱一致，请重新修改")
    }
    if (userInfo.gender && userInfo.id) {
      const id = {
        id: userInfo.id,
      }
      const email = {
        email: userInfo.email,
      }
      // 调用更新邮箱接口
      const res = await updateEmail(id, email)
      if (res.data.status == 0) {
        originUserInfo.email = userInfo.email
        ElMessage({
          message: "修改邮箱成功",
          type: "success",
        })
      } else {
        if (res.data.message.includes("pattern"))
          return ElMessage.error("修改邮箱失败,请检查邮箱格式")
      }
    } else {
      ElMessage.error("修改邮箱失败，请稍后再试")
    }
  }
  // 向外部提供东西
  return {
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
  }
}
