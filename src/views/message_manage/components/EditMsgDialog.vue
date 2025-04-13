<template>
  <el-dialog v-model="editMsgVisible" align-center title="编辑消息" width="50%" :before-close="handleClose"
    :destroy-on-close="true">
    <el-form :model="editMsgData" :rules="rules" ref="editRuleFormRef" :label-position="labelPosition"
      label-width="auto" class="edit-form">
      <el-form-item label="主题" prop="message_title">
        <el-input v-model="editMsgData.message_title" style="width: 240px" placeholder="请输入主题">
        </el-input>
      </el-form-item>
      <el-form-item label="发布部门" prop="message_publish_department">
        <el-select v-model="editMsgData.message_publish_department" placeholder="请选择发布部门" style="width: 240px">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="message_publish_name">
        <el-input disabled v-model="message_publish_name" style="width: 240px" placeholder="请输入发布人">
        </el-input>
      </el-form-item>
      <el-form-item label="接收部门" prop="message_receipt_object">
        <el-select @change="handleChange" v-model="editMsgData.message_receipt_object" placeholder="请选择接收部门"
          style="width: 240px">
          <el-option v-for="item in receiveDepartOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="公告等级" prop="message_level">
        <el-select v-model="editMsgData.message_level" placeholder="请选择公告等级" style="width: 240px">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="message_content">
        <EditorInput v-model:editValue="editMsgData.message_content" :width="575" :height="320" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit(editRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toEdit(editRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="EditMsgDialog">
import { watchEffect, reactive, ref, toRefs, watch } from 'vue';
import EditorInput from "@/components/EditorInput.vue";
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { updateCorpMsg } from "@/api/message";
import { useSettingStore } from "@/store/settingInfoStore";
import { useMessageStore } from "@/store/useMessageStore";
import { addUnreadMsg } from "@/api/department"
const { isMessageUpdate } = toRefs(useMessageStore())
const { departmentInfo } = useSettingStore()
const departmentOptions = departmentInfo.map(item => {
  return {
    value: item,
    label: item
  }
})
const receiveDepartOptions = departmentInfo.map(item => {
  return {
    value: item,
    label: item
  }
})
const labelPosition = ref<FormProps['labelPosition']>('right')

const levelOptions = [
  {
    value: "一般",
    label: "一般",
  },
  {
    value: "重要",
    label: "重要",
  },
  {
    value: "必要",
    label: "必要",
  },
]


const editMsgVisible = ref(false)
const editRuleFormRef = ref<FormInstance>()
interface EditData {
  id: string
  message_title: string
  message_publish_department: string
  message_receipt_object: string
  message_level: string
  message_content: string
}
const editMsgData: EditData = reactive({
  id: '',
  message_title: '',
  message_publish_department: '',
  message_receipt_object: '',
  message_level: '',
  message_content: '',
})
const message_publish_name = ref('')
// 自定义检验
const validateContent = (rule: any, value: any, callback: any) => {
  const isEmpty = isEditorContentEmpty(value)
  isEmpty ? callback(new Error('请输入内容')) : callback()
  // if (value == '' || value === '<p><br></p>') {
  //   editMsgData.message_content = ''
  //   callback(new Error('请输入内容'))
  // } else {
  //   callback()
  // }
}
// 判断编辑器内容是否为空
const isEditorContentEmpty = (html: any) => {
  if (!html) return true

  // 创建临时容器解析HTML
  const div = document.createElement('div')
  div.innerHTML = html

  // 移除空白字符和换行
  const text = div.textContent?.replace(/[\s\n]/g, '') || ''

  // 检查图片等多媒体内容
  const hasMedia = div.querySelector('img, video, audio')

  // 最终判断逻辑
  return text.length === 0 && !hasMedia
}

// 校验规则
const rules = reactive<FormRules<EditData>>({
  message_title: [
    { required: true, message: '请输入主题', trigger: 'blur' },
  ],
  message_publish_department: [
    { required: true, message: '请选择发布部门', trigger: 'change' },
  ],
  message_receipt_object: [
    { required: true, message: '请选择接收部门', trigger: 'change' },
  ],
  message_level: [
    { required: true, message: '请选择公告等级', trigger: 'change' },
  ],
  message_content: [
    // { required: true, message: '请输入内容', trigger: 'blur' },
    { required: true, validator: validateContent, trigger: 'blur' },
  ],
})
const handleClose = (done: () => void) => {
  editRuleFormRef.value?.resetFields()
  done()
}
const handleChange = () => {
  editMsgData.message_receipt_object = editMsgData.message_receipt_object || ''
}
const open = (info: any) => {
  editMsgData.id = info.id
  message_publish_name.value = info.message_publish_name
  editMsgVisible.value = true
  Object.keys(editMsgData).forEach((key) => {
    if (info.hasOwnProperty(key)) {
      editMsgData[key as keyof typeof editMsgData] = info[key] || ''
    }
  })
}

const cancelEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editMsgVisible.value = false
}

const toEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 添加操作
      const params = editMsgData
      const res = await updateCorpMsg(params)
      if (res.data.status == 0) {
        if (editMsgData.message_receipt_object && editMsgData.message_receipt_object != '全体成员') {
          const params = {
            id: +editMsgData.id,
            department: editMsgData.message_receipt_object
          }
          await addUnreadMsg(params)
        }
        editRuleFormRef.value?.resetFields()
        ElMessage({
          message: "编辑公司消息成功",
          type: "success",
        })
        editMsgVisible.value = false
        isMessageUpdate.value = true
      } else if (res.data.status == 1) {
        ElMessage.error(res.data.message)
      } else {
        ElMessage.error("编辑公司消息失败，请稍后再试")
        editRuleFormRef.value?.resetFields()
        editMsgVisible.value = false
      }

    } else {
      console.log('error submit!')
    }
  })

}
watchEffect(() => {
  receiveDepartOptions.unshift({
    value: '全体成员',
    label: '全体成员'
  })
})
defineExpose({
  open
})

</script>

<style lang="scss" scoped>
.edit-form {
  display: flex;
  padding: 16px 120px;
  flex-direction: column;
}
</style>