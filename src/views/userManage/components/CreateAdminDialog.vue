<template>
  <el-dialog v-model="createDialogVisible" :title="`创建${identity}`" width="560" :before-close="handleClose"
    :destroy-on-close="true">
    <el-form :model="createData" :rules="rules" ref="createRuleFormRef" label-position="left" class="create-form">
      <el-form-item label="账号" prop="account">
        <el-input v-model="createData.account" style="width: 240px" placeholder="请输入账号">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" show-password v-model="createData.password" style="width: 240px" placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="createData.name" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="createData.gender" placeholder="请选择性别" style="width: 240px">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="createData.email" style="width: 240px" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select v-model="createData.department" placeholder="请选择部门" style="width: 240px">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelCreate(createRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toCreate(createRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="CreateAdimnDialog">
import { reactive, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance } from 'element-plus'
import useUserManage from "@/hooks/useUserManage";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useSettingStore } from "@/store/settingInfoStore";
import { createAdmin } from "@/api/user";
import { trackRecord } from "@/utils/tracker";
const props = defineProps(['identity'])
const { validateEmail, validatePassword, validateName } = useUserManage()
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
const { departmentInfo } = useSettingStore()
const departmentOptions = departmentInfo.map(item=>{
  return {
    value:item,
    label:item
  }
})
// const departmentOptions = [
//   {
//     value: "总裁办",
//     label: "总裁办",
//   },
//   {
//     value: "产品部",
//     label: "产品部",
//   },
//   {
//     value: "销售部",
//     label: "销售部",
//   },
//   {
//     value: "组织部",
//     label: "组织部",
//   },
//   {
//     value: "企管部",
//     label: "企管部",
//   },
// ]
const createDialogVisible = ref(false)
const { isDataUpdate } = toRefs(useUserInfoStore())
const createRuleFormRef = ref<FormInstance>()
interface CreateAdminData {
  account: string
  password: string
  name: string
  gender: string
  email: string
  identity: string
  department: string
}
const createData: CreateAdminData = reactive({
  account: '',
  password: '',
  name: '',
  gender: '',
  email: '',
  identity: props.identity,
  department: '',
})

const rules = reactive<FormRules<CreateAdminData>>({
  account: [
    { required: true, message: '请输入账号名称', trigger: 'blur' },
    { min: 6, max: 12, message: '请确认账号名称，长度6-12位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
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
  department: [
    { required: true, message: '请选择部门', trigger: 'blur' }
  ],
})
const handleClose = (done: () => void) => {
  createRuleFormRef.value?.resetFields()
  done()
}
const open = () => {
  createDialogVisible.value = true
}

const cancelCreate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  createDialogVisible.value = false
}

const toCreate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 添加操作
      const params = createData
      const res = await createAdmin(params)
      if (res.data.status == 0) {
      await trackRecord('user','create',createData.account,props.identity)
      createDialogVisible.value = false
      ElMessage({
          message: `添加${props.identity}成功`,
          type: "success",
        })
      } else {
        ElMessage.error(`添加${props.identity}失败，请稍后再试`)
      }
      isDataUpdate.value = true
    } else {
      console.log('error submit!')
    }
  })
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.create-form {
  height: 416px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

</style>