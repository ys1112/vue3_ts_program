import { getUserList } from "@/api/user"
import { ElMessage } from "element-plus"
export default function () {
  const userName =
    /^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/
  const regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9-_!?@]{6,16}$/
  interface getUserListData {
    pageNum: number
    pageSize: number
    identity: string
    department?: string
    status?: string
    keyword?: string
  }
  const getList = async (params: getUserListData) => {
    const res = await getUserList(params)
    if (res.data.status == 0) {
      return res.data
    } else {
      ElMessage.error("获取用户列表失败")
    }
  }
  const validateEmail = (rule: any, value: any, callback: any) => {
    if (value === "") {
      return callback(new Error("请输入您的注册邮箱"))
    } else {
      if (value !== "") {
        if (!regEmail.test(value)) {
          callback(new Error("请输入正确的邮箱格式"))
        } else {
          callback()
        }
      }
    }
  }
  const validatePassword = (rule: any, value: any, callback: any) => {
    if (value !== "") {
      if (!regPassword.test(value)) {
        callback(
          new Error("请确认新密码，必须包含字母和数字，长度6-16位含-_?!@")
        )
      } else {
        callback()
      }
    }
  }
  const validateName = (rule: any, value: any, callback: any) => {
    if (value !== "") {
      if (!userName.test(value)) {
        callback(new Error("请输入合法姓名"))
      } else {
        callback()
      }
    }
  }
  return { getList, validateEmail, validatePassword, validateName }
}
