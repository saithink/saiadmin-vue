<template>
  <a-layout-content>
    <div class="ma-content-block lg:flex p-4" v-if="cpu">
      <a-skeleton animation v-if="loading" class="w-full">
        <a-space direction="vertical" class="w-full" size="large">
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
      <div class="flex justify-between w-full redis-info mt-3" v-else>
        <a-descriptions :column="1" size="large" bordered title="CPU信息" class="lg:w-9/12 w-full">
          <a-descriptions-item label="型号">{{ cpu.name }}</a-descriptions-item>
          <a-descriptions-item label="核心数">{{ cpu.cores }}</a-descriptions-item>
          <a-descriptions-item label="缓存">{{ cpu.cache }}</a-descriptions-item>
          <a-descriptions-item label="使用率">{{ cpu.usage }}%</a-descriptions-item>
          <a-descriptions-item label="空闲率">{{ cpu.free }}%</a-descriptions-item>
        </a-descriptions>
        <div class="echarts hidden lg:block">
          <sa-chart :options="cpuOptions" width="350px" height="350px" />
        </div>
      </div>
    </div>

    <div class="ma-content-block lg:flex p-4 mt-3" v-if="memory">
      <a-skeleton animation v-if="loading" class="w-full">
        <a-space direction="vertical" class="w-full" size="large">
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
      <div class="flex justify-between w-full redis-info mt-3" v-else>
        <a-descriptions :column="1" size="large" bordered title="内存信息" class="lg:w-9/12 w-full">
          <a-descriptions-item label="总内存">{{ memory.total }}G</a-descriptions-item>
          <a-descriptions-item label="已使用内存">{{ memory.usage }}G</a-descriptions-item>
          <a-descriptions-item label="PHP使用内存">{{ memory.php }}M</a-descriptions-item>
          <a-descriptions-item label="空闲内存">{{ memory.free }}G</a-descriptions-item>
          <a-descriptions-item label="使用率">{{ memory.rate }}%</a-descriptions-item>
        </a-descriptions>
        <div class="echarts hidden lg:block">
          <sa-chart :options="memoryOptions" width="350px" height="350px" />
        </div>
      </div>
    </div>

    <div class="ma-content-block lg:flex p-4 mt-3" v-if="phpenv">
      <a-skeleton animation v-if="loading" class="w-full">
        <a-space direction="vertical" class="w-full" size="large">
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
      <div class="flex justify-between w-full redis-info mt-3" v-else>
        <a-descriptions :column="2" size="large" bordered title="PHP及环境信息" class="w-full">
          <a-descriptions-item label="操作系统">{{ phpenv.os }}</a-descriptions-item>
          <a-descriptions-item label="PHP版本">{{ phpenv.php_version }}</a-descriptions-item>
          <a-descriptions-item label="系统物理路径">{{ phpenv.project_path }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </a-layout-content>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import monitor from '@/api/system/monitor'

const cpuOptions = ref({})
const memoryOptions = ref({})
const cpu = ref({})
const memory = ref({})
const phpenv = ref({})
const disk = ref({})
const loading = ref(true)

// 获取基本信息
const getCacheInfo = async () => {
  loading.value = true
  const response = await monitor.getServerInfo()
  cpu.value = response.data?.cpu
  memory.value = response.data?.memory
  phpenv.value = response.data?.phpenv
  disk.value = response.data?.disk
  cpuOptions.value = {
    tooltip: { formatter: '{b} : {c}%' },
    series: [
      {
        name: 'CPU使用率',
        type: 'gauge',
        progress: { show: true },
        detail: { valueAnimation: true, formatter: '{value}' },
        data: [{ value: cpu.value.usage, name: 'CPU使用率' }],
      },
    ],
  }

  memoryOptions.value = {
    tooltip: { formatter: '{b} : {c}%' },
    series: [
      {
        name: '内存使用率',
        type: 'gauge',
        progress: { show: true },
        detail: { valueAnimation: true, formatter: '{value}' },
        data: [{ value: memory.value.rate, name: '内存使用率' }],
      },
    ],
  }

  loading.value = false
}

// 页面加载完成执行
onMounted(async () => {
  getCacheInfo()
})
</script>

<style scoped>
.redis-info {
  max-height: 260px;
  overflow: hidden;
}
.echarts {
  width: 350px;
  position: relative;
  top: -10px;
  right: -10px;
}
</style>
