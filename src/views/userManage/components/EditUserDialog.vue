<template>
  <el-dialog v-model="editDialogVisible" :title="`编辑${identity}`" width="560" :before-close="handleClose" :destroy-on-close="true">
    <el-form :model="editData" :rules="rules" ref="editRuleFormRef" label-position="left" class="edit-form">
      <el-form-item style="margin-left: 12px;" label="账号" prop="account">
        <el-input disabled v-model="account" style="width: 240px">
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="editData.name" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="editData.gender" placeholder="请选择性别" style="width: 240px">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editData.email" style="width: 240px" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select v-model="editData.department" placeholder="请选择部门" style="width: 240px">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit(editRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toEdite(editRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="EditAdimnDialog">
import { reactive, ref, onMounted, onUnmounted, toRefs } from 'vue';
import { ElMessage, ElMessageBox, type FormRules, type FormInstance } from 'element-plus'
import emitter from '@/utils/emitter'
import useUserManage from "@/hooks/useUserManage";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useSettingStore } from "@/store/settingInfoStore";
import { updateUser } from "@/api/user";
defineProps(['identity'])
const { validateEmail, validateName } = useUserManage()
const { isUsersUpdate,userInfo } = toRefs(useUserInfoStore())
const {getUnreadNum} = useUserInfoStore()
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
const editDialogVisible = ref(false)
const editRuleFormRef = ref<FormInstance>()
interface EditAdminData {
  id: string,
  name: string
  gender: string
  email: string
  identity: string
  department: string
}
const account = ref('')
const editData: EditAdminData = reactive({
  id: '',
  name: '',
  gender: '',
  email: '',
  identity: '',
  department: '',
})

const rules = reactive<FormRules<EditAdminData>>({
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

// 在组件挂载时绑定setInfo事件
onMounted(() => {
  emitter.on('editInfo', (value: any) => {
    account.value = value.account
    Object.keys(editData).forEach((key) => {
      if (value.hasOwnProperty(key)) {
        editData[key as keyof typeof editData] = value[key] || ''
      }
    })
  })
})
// 在组件卸载时解绑set-info事件
onUnmounted(() => {
  emitter.off('editInfo')
})
const handleClose = (done:()=>void) => {
  editRuleFormRef.value?.resetFields()
  done()
}
const open = () => {
  editDialogVisible.value = true
}

const cancelEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editDialogVisible.value = false
}

const toEdite = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 编辑操作
      const params = editData
      const res = await updateUser(params)
      if (res.data.status == 0) {
        // 如果编辑的是当前用户，则更新未读消息
        if(account.value == userInfo.value.account) {
          userInfo.value.department = editData.department
          await getUnreadNum()
        }
        ElMessage({
          message: "编辑用户信息成功",
          type: "success",
        })
        editDialogVisible.value = false
        isUsersUpdate.value = true
      } else {
        ElMessage.error("编辑用户信息失败，请稍后再试")
      }
      console.log('submit!')
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
.edit-form {
  height: 352px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

</style>