<template>
  <el-dialog v-model="setInfoDialogVisible" :title="setTitle" width="600" :before-close="handleClose"
    :destroy-on-close="true">
    <div style="border: 1px solid #ccc">
      <!-- wangEditor结构 -->
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="setInfo()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="SetInfoDialog">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { setCompanyInfo } from "@/api/setting";
import { reactive, ref, shallowRef, onUnmounted, onBeforeUnmount, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { CompanyInfoEnum } from '@/contants/CompanyInfoEnum'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { trackRecord } from "@/utils/tracker";
import emitter from '@/utils/emitter'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const apiUrl = import.meta.env.VITE_API_URL

// mode
const mode = ref('default')
// 内容 HTML
const valueHtml = ref()

// // 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//   }, 1500)
// })

// 工具栏配置
const toolbarConfig: ({ [key: string]: any }) = {
  excludeKeys: []
}
type InsertFnType = (url: string) => void
// 初始化 MENU_CONF 属性
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      //上传图片配置
      server: apiUrl + '/api/system/uploadCompanyPicture', //上传接口地址
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

const handleCreated = (editor: any) => {
  editor.focus()
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 对话框显示控制
const setInfoDialogVisible = ref(false)

// 接受父组件传递的数据
const setInfoData = ref()

// 标题
const setTitle = ref('')
// 修改公司信息按钮事件
const setInfo = async () => {
  const data = {
    set_name: setInfoData.value.set_name,
    set_value: valueHtml.value
  }
  const res = await setCompanyInfo(data)
  if (res.data.status == 0) {
    await trackRecord('setting', 'corp', CompanyInfoEnum[setInfoData.value.set_name as keyof typeof CompanyInfoEnum])
    setInfoData.value.set_value = valueHtml.value
    setInfoDialogVisible.value = false;
    return ElMessage({
      message: setTitle.value + '成功',
      type: 'success',
    })
  }
  ElMessage.error(setTitle.value + '失败,' + '请检查网络后重试')
}

const handleClose = (done: () => void) => {
  done()
}

const open = () => {
  setInfoDialogVisible.value = true
  setTitle.value = '编辑' + CompanyInfoEnum[setInfoData.value.set_name as keyof typeof CompanyInfoEnum] + '信息'
  valueHtml.value = setInfoData.value.set_value || ''
}
const cancel = () => {
  setInfoDialogVisible.value = false;
};
// 在组件挂载时绑定setInfo事件
onMounted(() => {
  emitter.on('setInfo', (value: any) => {
    setInfoData.value = value
  })
})
// 在组件卸载时解绑set-info事件
onUnmounted(() => {
  emitter.off('setInfo')
})
// 向父组件暴露打开弹窗事件
defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>