<template>
  <el-dialog v-model="publishDialogVisible" align-center :title="msgCate? '公司公告' : '系统消息'" width="50%" :before-close="handleClose"
    destroy-on-close>
    <el-form :model="publishMsgData" :rules="rules" ref="publishRuleFormRef" :label-position="labelPosition"
      label-width="auto" class="publish-form">
      <el-form-item label="主题" prop="message_title">
        <el-input v-model="publishMsgData.message_title" style="width: 240px" placeholder="请输入主题">
        </el-input>
      </el-form-item>
      <el-form-item v-if="msgCate" label="发布部门" prop="message_publish_department">
        <el-select v-model="publishMsgData.message_publish_department" placeholder="请选择发布部门" style="width: 240px">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="message_publish_name">
        <el-input v-model="publishMsgData.message_publish_name" style="width: 240px" placeholder="请输入发布人">
        </el-input>
      </el-form-item>
      <el-form-item label="消息类别" prop="message_category">
        <el-select v-model="publishMsgData.message_category" placeholder="请选择消息类别" style="width: 240px">
          <el-option v-for="item in msgCateOptions" :disabled="item.disabled" :key="item.value" :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="msgCate" label="接收部门" prop="message_receipt_object">
        <el-select v-model="publishMsgData.message_receipt_object" :multiple="false" filterable allow-create default-first-option
        :reserve-keyword="false" placeholder="请选择接收部门" style="width: 240px">
          <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="msgCate" label="公告等级" prop="message_level">
        <el-select v-model="publishMsgData.message_level" placeholder="请选择公告等级" style="width: 240px">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="message_content">
        <EditorInput v-model:editValue="publishMsgData.message_content" :width="575" :height="320" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelPublish(publishRuleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="toPublish(publishRuleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="PublishMsgDialog">
import { onMounted, reactive, ref, toRefs, watch } from 'vue';
import EditorInput from "@/components/EditorInput.vue";
import { ElMessage, ElMessageBox, type FormRules, type FormInstance, type FormProps } from 'element-plus'
import { useProductStore } from "@/store/useProductStore";
import { publishMsg } from "@/api/message";
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

const msgCate = ref(0)
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

const msgCateOptions = [
  {
    value: "公司公告",
    label: "公司公告",
    disabled: false
  },
  {
    value: "系统消息",
    label: "系统消息",
    disabled: false
  },
]

const publishDialogVisible = ref(false)
const publishRuleFormRef = ref<FormInstance>()
interface publishData {
  message_title: string
  message_publish_department?: string
  message_publish_name: string
  message_category: string
  message_receipt_object?: string
  message_level?: string
  message_content: string
}
const publishMsgData: publishData = reactive({
  message_title: '',
  message_publish_department: '',
  message_publish_name: '',
  message_category: '',
  message_receipt_object: '',
  message_level: '',
  message_content: '',
})

// 自定义检验
const validateContent = (rule: any, value: any, callback: any) => {
  const isEmpty = isEditorContentEmpty(value)
  isEmpty ? callback(new Error('请输入内容')) : callback()
  // if (value == '' || value === '<p><br></p>') {
  //   publishMsgData.message_content = ''
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
const rules = reactive<FormRules<publishData>>({
  message_title: [
    { required: true, message: '请输入主题', trigger: 'blur' },
  ],
  message_publish_department: [
    { required: true, message: '请选择发布部门', trigger: 'change' },
  ],
  message_publish_name: [
    { required: true, message: '请输入发布人', trigger: 'blur' },
  ],
  message_category: [
    { required: true, message: '请选择消息类别', trigger: 'change' },
  ],
  message_receipt_object: [
    { required: true, message: '请选择接收部门', trigger: 'change' },
  ],
  message_level: [
    { required: true, message: '请选择公告等级', trigger: 'change' },
  ],
  message_content: [
    // { required: true, message: '请输入内容', trigger: 'blur' },
    { required: true,validator: validateContent, trigger: 'blur' },
  ],
})
const handleClose = (done: () => void) => {
  publishRuleFormRef.value?.resetFields()
  done()
}
const open = (type: number) => {
  msgCate.value = type 
  if (type) {
    msgCateOptions[1].disabled = true
    msgCateOptions[0].disabled = false
  } else {
    msgCateOptions[1].disabled = false
    msgCateOptions[0].disabled = true
  }
  publishDialogVisible.value = true
}

const cancelPublish = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  publishDialogVisible.value = false
}

const toPublish = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log(publishMsgData);

      // 添加操作
      const params = publishMsgData
      const res = await publishMsg(params)
      if (res.data.status == 0) {
        publishRuleFormRef.value?.resetFields()
        ElMessage({
          message: "发布消息成功",
          type: "success",
        })
        publishDialogVisible.value = false
        isMessageUpdate.value = true
      } else if (res.data.status == 1) {
        ElMessage.error(res.data.message)
      } else {
        ElMessage.error("发布消息失败，请稍后再试")
        publishRuleFormRef.value?.resetFields()
        publishDialogVisible.value = false
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
.publish-form {
  display: flex;
  padding: 16px 120px;
  flex-direction: column;
}
</style>