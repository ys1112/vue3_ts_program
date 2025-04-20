<template>
  <div :class="currentClass">
    <!-- wangEditor结构 -->
    <Toolbar :style="`width: ${width}px;border-bottom: 1px solid #ccc`" :editor="editorRef"
      :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor :style="`height: ${height}px; overflow-y: hidden;`" v-model="valueHtml" @onBlur="handleBlur"
      @onChange="handleChange" @onFocus="handleFocus" :defaultConfig="editorConfig" :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>

<script lang="ts" setup name="EditorInput">

// 封装富文本编辑器组件

import { ref, watch, shallowRef, onBeforeUnmount, onMounted, nextTick } from 'vue';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useDebounce } from "@/hooks/useDebounce";
import { useFormItem } from 'element-plus'
// 获取 el-form-item 上下文 实现校验的重点
const { formItem } = useFormItem()
const apiUrl = import.meta.env.VITE_API_URL
const props = defineProps(['editValue', 'width', 'height'])
const emit = defineEmits(['update:editValue'])
const currentClass = ref('editor-default')

// -------------------------------------编辑器配置

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
onMounted(() => {
  nextTick(() => {
    valueHtml.value = props.editValue
  })
})
// mode
const mode = ref('default')

// 内容 HTML
const valueHtml = ref('')

// 工具栏配置
const toolbarConfig: ({ [key: string]: any }) = {
  excludeKeys: []
}
type InsertFnType = (url: string) => void

// 初始化 MENU_CONF 属性
const editorConfig = {
  placeholder: '请输入内容...',
  html: '',
  autoFocus: false,
  MENU_CONF: {
    uploadImage: {
      //上传图片配置
      server: apiUrl + '/set/uploadCompanyPicture', //上传接口地址
      fieldName: 'file', //上传文件名
      methods: 'post',
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      // meta: {
      //   token: 'xxx',
      //   otherKey: 'yyy',
      // },
      metaWithUrl: true, // 参数拼接到 url 上
      // 单个文件上传成功之后
      // onSuccess(file, res) {
      // },
      // 自定义插入图片
      customInsert(res: any, insertFn: InsertFnType) {
        insertFn(res.url)
      },
    },
  }
}
toolbarConfig.excludeKeys = [
  'blockquote',
  'bgColor',
  'color',
  'group-more-style',
  'fontFamily',
  'bulletedList',
  'numberedList',
  'lineHeight',
  'todo',
  'emotion',
  'insertLink',
  'group-video',
  'insertTable',
  'codeBlock',
  'divider',
  'fullScreen',
  // 'group-image',

  // 排除菜单组，写菜单组 key 的值即可
]

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
// 记录 editor 实例，重要
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// -------------------------------------编辑器配置



// 值变化
const handleChange = useDebounce(() => {
  emit('update:editValue', valueHtml.value)
  formItem?.validate('change').catch(() => { })

}, 300)
// 失去焦点
const handleBlur = () => {
  formItem?.validate('blur').catch(() => { })
}
// 聚焦
const handleFocus = () => {
  formItem?.validate('focus').catch(() => { })
  if (formItem?.validateState == 'error') {
    return
  }
  currentClass.value = 'editor-focus'
}

// 监听外部校验状态变化
watch(
  () => formItem?.validateState,
  (newVal) => {
    currentClass.value = newVal == 'error' ? 'editor-error' : 'editor-default'
  }
)

</script>

<style lang="scss" scoped>
.editor-default {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
}

.editor-focus {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #409eff;
  transition: border-color 0.2s;
}

.editor-default:hover {
  border-color: #c0c4cc;
  transition: border-color 0.2s;
}

.editor-error {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #f56c6c;
}
</style>