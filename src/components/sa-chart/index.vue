<template>
  <v-charts v-if="renderChart" :option="options" :autoresize="autoresize" :style="{ width, height }" />
</template>

<script setup>
import { ref, nextTick } from 'vue'
import VCharts from 'vue-echarts'
import 'echarts/lib/component/title'

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {}
    },
  },
  autoresize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})

const renderChart = ref(false)

nextTick(() => {
  renderChart.value = true
})
</script>

<style scoped lang="less"></style>
