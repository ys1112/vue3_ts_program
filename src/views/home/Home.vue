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
            <el-table :data="tableData" style="width: 100%" max-height="200">
              <el-table-column prop="title" label="公司公告" />
              <el-table-column prop="necessary" width="100" align="center">
                <template #default="scope">
                  <el-tag v-if="scope.row.necessary == '1'" type="danger">必要</el-tag>
                  <el-tag v-if="scope.row.necessary == '0'" type="primary">非必要</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="department" align="center" />
              <el-table-column prop="date" />
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="announced-wrapper">
            <el-table :data="systemData" style="width: 100%" max-height="200">
              <el-table-column prop="title" label="系统消息" />
              <el-table-column prop="date" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <ShowDetailDialog ref="detailDialogRef"></ShowDetailDialog>
</template>

<script lang="ts" setup name="Home">
import ShowDetailDialog from "@/views/home/showDetailDialog/ShowDetailDialog.vue";
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { CompanyInfoEnum } from '@/contants/CompanyInfoEnum'
// pinia存储的公司信息和首页轮播图数据
import { useSettingStore } from "@/store/settingInfoStore"
import emitter from '@/utils/emitter'
const detailDialogRef = ref()
const settingStore = useSettingStore()
// pinia存储的数据
const { swipers, companyInfo } = reactive(settingStore)
// const getImageUrl = (name: string) => {
//   return new URL(`/src/assets/images/${name}`, import.meta.url).href;
// };
// const companyInfos: { [key: string]: any } = reactive({ list: [] })
// 公司信息
const getCompanyTitle = (item: string) => {
  return CompanyInfoEnum[item as keyof typeof CompanyInfoEnum]
}
// onMounted( () => {
//   setTimeout(()=>{
//     companyInfos.list = companyInfo.conmapyData.filter((item: any, index) => { return index > 0 })
//   },10)
// })
const tableData = reactive([
  {
    title: '下班后开会',
    necessary: '1',
    department: '总裁部',
    date: '2025-05-03',
  },
  {
    title: '部门会议',
    necessary: '1',
    department: '总裁部',
    date: '2025-05-03',
  },
])

const systemData = reactive([
  {
    title: '手机1已出库',
    date: '2025-06-01',
  },
  {
    title: '电脑2已入库',
    date: '2025-05-02',
  },
  {
    title: '平板3已出库',
    date: '2025-04-01',
  },
  {
    title: '耳机4已入库',
    date: '2025-03-02',
  },
  {
    title: '手表5已出库',
    date: '2025-02-01',
  },
  {
    title: '屏幕6已入库',
    date: '2025-01-02',
  },
])

// 打开编辑弹窗
const openDetailDialog = (item: any) => {
  emitter.emit('detail', item)
  detailDialogRef.value.open()
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
}

:deep(.el-table .cell) {
  color: #303133;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.4);
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
  background-color: #606266;
}

:deep(.el-carousel__indicators--outside button:hover) {
  background-color: #606266;
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
</style>