<template>
  <el-dialog v-model="editMsgVisible" align-center title="编辑消息" width="50%" :before-close="handleClose"
    :destroy-on-close="true">
    <el-form :model="editSysMsgData" :rules="rules" ref="editSysMsgFormRef" :label-position="labelPosition"
      label-width="auto" class="edit-form">
      <el-form-item label="主题" prop="message_title">
        <el-input v-model="editSysMsgData.message_title" style="width: 240px" placeholder="请输入主题">
        </el-input>
      </el-form-item>
      <el-form-item label="发布人" prop="message_publish_name">
        <el-input disabled v-model="message_publish_name" style="width: 240px" placeholder="请输入发布人">
        </el-input>
      </el-form-item>
      <el-form-item label="内容" prop="message_content">
        <EditorInput v-model:editValue="editSysMsgData.message_content" :width="575" :height="320" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit(editSysMsgFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toEdit(editSysMsgFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="EditSysMsgDialog">
import { onMounted, reactive, ref, toRefs, watch } from 'vue';
import EditorInput from "@/components/EditorInput.vue";
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { updateSysMsg } from "@/api/message";
import { useSettingStore } from "@/store/settingInfoStore";
import { useMessageStore } from "@/store/useMessageStore";
const { isMessageUpdate } = toRefs(useMessageStore())
const { departmentInfo } = useSettingStore()
const departmentOptions = departmentInfo.map(item => {
  return {
    value: item,
    label: item
  }
})
const labelPosition = ref<FormProps['labelPosition']>('right')


const editMsgVisible = ref(false)
const editSysMsgFormRef = ref<FormInstance>()
interface editSysData {
  id:string
  message_title: string
  message_content: string
}
const editSysMsgData: editSysData = reactive({
  id:'',
  message_title: '',
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
const isEditorContentEmpty = (html:any) => {
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
const rules = reactive<FormRules<editSysData>>({
  message_title: [
    { required: true, message: '请输入主题', trigger: 'blur' },
  ],
  message_content: [
    // { required: true, message: '请输入内容', trigger: 'blur' },
    { required: true,validator: validateContent, trigger: 'blur' },
  ],
})
const handleClose = (done: () => void) => {
  editSysMsgFormRef.value?.resetFields()
  done()
}

const open = (info:any) => {
  console.log(info);
  editSysMsgData.id = info.id
  message_publish_name.value = info.message_publish_name
  editMsgVisible.value = true
  Object.keys(editSysMsgData).forEach((key) => {
    if (info.hasOwnProperty(key)) {
      editSysMsgData[key as keyof typeof editSysMsgData] = info[key] || ''
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
      const params = editSysMsgData
      const res = await updateSysMsg(params)
      if (res.data.status == 0) {
        editSysMsgFormRef.value?.resetFields()
        ElMessage({
          message: "编辑系统消息成功",
          type: "success",
        })
        editMsgVisible.value = false
        isMessageUpdate.value = true
      } else if (res.data.status == 1) {
        ElMessage.error(res.data.message)
      } else {
        ElMessage.error("编辑系统消息失败，请稍后再试")
        editSysMsgFormRef.value?.resetFields()
        editMsgVisible.value = false
      }

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
  display: flex;
  padding: 16px 120px;
  flex-direction: column;
}
</style>