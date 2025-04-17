<template>
  <el-dialog v-model="setAccountVisible" title="编辑账号信息" width="560" :before-close="handleClose"
    :destroy-on-close="true">
    <el-form :model="setAccountData" :rules="rules" ref="setRuleFormRef" label-position="left" class="set-form">
      <el-form-item style="margin-left: 12px;" label="账号" prop="account">
        <el-input disabled v-model="userInfo.account" style="width: 240px">
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="setAccountData.name" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="setAccountData.gender" placeholder="请选择性别" style="width: 240px">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="setAccountData.email" style="width: 240px" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input disabled v-model="userInfo.department" style="width: 240px">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelSet(setRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toSet(setRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="SetAccountDialog">
import { reactive, ref, onMounted, onUnmounted, toRefs } from 'vue';
import { setAccount } from "@/api/user";
import { ElMessage, ElMessageBox, type FormRules, type FormInstance } from 'element-plus'
import { useUserInfoStore } from "@/store/userInfoStore";
import useUserManage from "@/hooks/useUserManage";
interface SetData {
  id: string,
  name: string
  gender: string
  email: string
}
const { validateEmail, validateName } = useUserManage()
const { userInfo } = toRefs(useUserInfoStore())
const setAccountVisible = ref(false)
const setRuleFormRef = ref<FormInstance>()
const setAccountData: SetData = reactive({
  id: '',
  name: '',
  gender: '',
  email: '',
})
const genderOptions = [
  {
    value: "男",
    label: "男",
  },
  {
    value: "女",
    label: "女",
  },
]
const rules = reactive<FormRules<SetData>>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'blur' },
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
})
onMounted(()=>{
  Object.keys(setAccountData).forEach((key) => {
      if (userInfo.value.hasOwnProperty(key)) {
        setAccountData[key as keyof typeof setAccountData] = userInfo.value[key] || ''
      }
    })
})
const handleClose = (done: () => void) => {
  setRuleFormRef.value?.resetFields()
  done()
}
const cancelSet = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  setAccountVisible.value = false
}

const toSet = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 编辑操作
      const params = setAccountData
      const res = await setAccount(params)
      if (res.data.status == 0) {
        userInfo.value.name = setAccountData.name
        ElMessage({
          message: "编辑账号信息成功",
          type: "success",
        })
        setAccountVisible.value = false
      } else {
        ElMessage.error("编辑账号信息失败，请稍后再试")
      }
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}
const open = () => {
  setAccountVisible.value = true
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.set-form {
  height: 352px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>