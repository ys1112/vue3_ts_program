<template>
  <el-dialog v-model="deleteDialogVisible" title="删除操作" width="560" center :before-close="handleClose" destroy-on-close>
    <p class="delete-tip">{{ deleteInfo.tip }}</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="DeleteUserDialog">
import { ref } from 'vue'

const deleteDialogVisible = ref(false)
const props = defineProps(['deleteInfo'])
const handleClose = (done: () => void) => {
  deleteDialogVisible.value = false
}
const open = () => {
  deleteDialogVisible.value = true
}

const confirmDelete = () => {
  console.log(props.deleteInfo.id);
  
  // deleteDialogVisible.value = false
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.delete-tip {
  text-align: center;
}
</style>