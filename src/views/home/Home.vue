<template>
  <div class="common-wrapper">
    <!-- 轮播图 -->
    <div class="common-content home-content">
      <div class="carousel-wrapper">
        <el-carousel :interval="4000" indicator-position="outside" :autoplay="false" type="card" height="240px">
          <el-carousel-item v-for="item in swipers.swiperData" :key="item.id">
            <el-image class="carousel-img" :src="item.set_value" fit="cover" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 公司信息 -->
    <div class="common-content home-content">
      <div class="layout-wrapper">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in companyInfo.mainContent" :key="item.id">
            <div class="company-wrapper" @click="openDetailDialog(item)">
              <span class="company-wrapper-title">
                {{ getCompanyTitle(item.set_name) }}
              </span>
              <div class="company-info" v-html="item.set_value"></div>
            </div>
          </el-col>

        </el-row>
      </div>
    </div>
    <!-- 公司公告 -->
    <div class="common-content home-content">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="announced-wrapper">
            <div class="msg-title">公司公告</div>
            <el-table :data="corpData" style="width: 100%" max-height="200" :show-header="false"
              @row-click="showDetail">
              <el-table-column prop="message_title" show-overflow-tooltip />
              <el-table-column prop="message_level" align="center">
                <template #default="scope">
                  <el-tag size="small" v-if="scope.row.message_level == '必要'" type="danger">必要</el-tag>
                  <el-tag size="small" v-if="scope.row.message_level == '重要'" type="warning">重要</el-tag>
                  <el-tag size="small" v-if="scope.row.message_level == '一般'" type="primary">一般</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="message_publish_department" align="center" />
              <el-table-column prop="message_create_time" align="center" min-width="160">
                <template #default="scope">
                  {{ scope?.row.message_create_time ? scope?.row.message_create_time.split('.')[0] : '--' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="announced-wrapper">
            <div class="msg-title">系统消息</div>
            <el-table :data="systemData" style="width: 100%" :show-header="false" max-height="200"
              @row-click="showDetail">
              <el-table-column prop="message_title" show-overflow-tooltip />
              <el-table-column prop="message_create_time">
                <template #default="scope">
                  {{ scope?.row.message_create_time ? scope?.row.message_create_time.split('.')[0] : '--' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <ShowDetailDialog ref="detailDialogRef"></ShowDetailDialog>
  <ShowMsgInfoDialog ref="msgDetailDialogRef"></ShowMsgInfoDialog>
</template>

<script lang="ts" setup name="Home">
import ShowDetailDialog from "@/views/home/components/ShowDetailDialog.vue";
import ShowMsgInfoDialog from "@/views/home/components/ShowMsgInfoDialog.vue";
import { updateClick } from "@/api/department"
import { onMounted, reactive, ref } from 'vue';
import { CompanyInfoEnum } from '@/contants/CompanyInfoEnum'
// pinia存储的公司信息和首页轮播图数据
import { useSettingStore } from "@/store/settingInfoStore"
import { getAllMemberMsg } from "@/api/message";
import emitter from '@/utils/emitter'
const detailDialogRef = ref()
const msgDetailDialogRef = ref()
const settingStore = useSettingStore()
// pinia存储的数据
const { swipers, companyInfo } = reactive(settingStore)
// const getImageUrl = (name: string) => {
//   return new URL(`/src/assets/images/${name}`, import.meta.url).href;
// };
// const companyInfos: { [key: string]: any } = reactive({ list: [] })
onMounted(() => {
  getSysAndMemberSys()
})
// 公司信息
const getCompanyTitle = (item: string) => {
  return CompanyInfoEnum[item as keyof typeof CompanyInfoEnum]
}
// onMounted(() => {
//   setTimeout(()=>{
//     companyInfos.list = companyInfo.conmapyData.filter((item: any, index) => { return index > 0 })
//   },10)
// })
const corpData = ref()

const systemData = ref()

// 打开编辑弹窗
const openDetailDialog = (item: any) => {
  emitter.emit('detail', item)
  detailDialogRef.value.open()
}
const getSysAndMemberSys = async () => {
  const res = await getAllMemberMsg()
  if (res.data.status == 0) {
    systemData.value = res.data.results.sysMsgs
    corpData.value = res.data.results.companyMsgs
  }
}
const showDetail = async (row: any, column: any, event: Event) => {
  const params = {
    id: row.id
  }
  await updateClick(params)
  msgDetailDialogRef.value.open(row)
}
</script>

<style lang="scss" scoped>
.carousel-img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.home-content {

  .layout-wrapper {
    .company-wrapper {
      height: 200px;
      padding: 8px;
      border-radius: 8px;
      background-color: #F0F2F5;
      cursor: pointer;
      overflow: hidden;

      .company-wrapper-title {
        text-decoration: underline solid #337ecc 1px;
        text-underline-offset: 4px;
        color: #303133;
        font-weight: 700;
      }

      .company-info {
        height: 160px;
        overflow: hidden;
      }
    }

    .company-wrapper:hover {
      background-color: #d9ecff;
    }
  }
}


.announced-wrapper {
  height: 192px;
  overflow: hidden;
  border-radius: 8px;

  .msg-title {
    padding-bottom: 4px;
    border-bottom: 1px solid #c45656;
    font-weight: 700;
    color: #303133;
  }
}

:deep(.el-table .cell) {
  color: #303133;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.25);
}

:deep(.el-table__body .el-table__row) {
  height: 20px;
}

:deep(.el-scrollbar__bar) {
  background-color: #CDD0D6;
}

:deep(.el-scrollbar__thumb) {
  background-color: #303133;
}

:deep(.el-carousel__indicators--outside button) {
  border-radius: 4px;
  background-color: rgba(96, 98, 102, 0.5);
}

:deep(.el-carousel__indicators--outside button:hover) {
  background-color: rgba(96, 98, 102, 0.5);
}

.el-carousel {
  --el-carousel-indicator-height: 4px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style>