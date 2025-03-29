<template>
  <div class="common-wrapper">
    <!-- 轮播图 -->
    <div class="common-content">
      <div class="carousel-wrapper">
        <el-carousel :interval="4000" indicator-position="outside" :autoplay="false" type="card" height="255px">
          <el-carousel-item v-for="item in carouselData" :key="item.id">
            <el-image class="carousel-img" :src="getImageUrl(item.url)" fit="cover" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="common-content">
      <div class="layout-wrapper">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="company-wrapper">
              <span class="company-wrapper-title">
                公司介绍
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="company-wrapper">
              <span class="company-wrapper-title">
                公司架构
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="company-wrapper">
              <span class="company-wrapper-title">
                公司战略
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="company-wrapper">
              <span class="company-wrapper-title">
                公司高层
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="common-content">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="announced-wrapper">
            <el-table :data="tableData" style="width: 100%" max-height="160">
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
</template>

<script lang="ts" setup name="Home">
import { reactive, ref } from 'vue';
const getImageUrl = (name: string) => {
  return new URL(`/src/assets/images/${name}`, import.meta.url).href;
};
const isNecessary = ref()
const carouselData = reactive([
  {
    id: 1,
    url: 'swiper1.png'
  },
  {
    id: 2,
    url: 'swiper2.png'
  },
  {
    id: 3,
    url: 'swiper3.png'
  },
  {
    id: 4,
    url: 'swiper4.png'
  },
])

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
    title: '苹果已出库',
    date: '2025-06-01',
  },
  {
    title: '香蕉已入库',
    date: '2025-05-02',
  },
  {
    title: '梨子已出库',
    date: '2025-04-01',
  },
  {
    title: '芒果已入库',
    date: '2025-03-02',
  },
  {
    title: '橙子已出库',
    date: '2025-02-01',
  },
  {
    title: '橘子已入库',
    date: '2025-01-02',
  },
])


</script>

<style lang="scss" scoped>
.carousel-img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.layout-wrapper {
  .company-wrapper {
    height: 200px;
    padding: 8px;
    border-radius: 8px;
    background-color: #F0F2F5;
    cursor: pointer;

    .company-wrapper-title {
      text-decoration: underline solid #337ecc 1px;
      text-underline-offset: 4px;
      color: #303133;
      font-weight: 700;
    }
  }

  .company-wrapper:hover {
    background-color: #d9ecff;
  }
}

.announced-wrapper {
  height: 200px;
  padding: 8px;
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
    background-color: #000;
    opacity: .28;
    border-radius: 4px;
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