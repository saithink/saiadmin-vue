<template>
  <a-drawer :footer="false" v-model:visible="visible" :width="tool.getDevice() === 'mobile' ? '100%' : '60%'">
    <template #title>执行日志</template>
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <template #status="{ record }">
        <a-tag :color="`${record.status == 1 ? 'green' : 'red'}`">
          {{ record.status == 1 ? '成功' : '失败' }}
        </a-tag>
      </template>
      <template #exception_info="{ record }">
        <a-link @click="lookException(record)"><icon-eye /> 查看</a-link>
      </template>
    </sa-table>
  </a-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/api/tool/crontab'
import tool from '@/utils/tool'
import { Modal, Message } from '@arco-design/web-vue'

const crudRef = ref()
const crontabId = ref()
const visible = ref(false)

// 搜索表单
const searchForm = ref({
  orderBy: 'create_time',
  orderType: 'desc',
  crontab_id: '',
})

// 打开窗口
const open = (id) => {
  crontabId.value = id
  searchForm.value.crontab_id = id
  visible.value = true
  crudRef.value.refresh()
}

// 查看信息
const lookException = (row) => {
  const info = row.exception_info
  Modal.info({
    simple: false,
    width: tool.getDevice() === 'mobile' ? '100%' : '600px',
    title: '异常信息',
    content: info == '' ? '无异常信息' : info,
  })
}

// SaTable 基础配置
const options = reactive({
  autoRequest: false,
  api: api.getLogPageList,
  showSearch: false,
  showTools: false,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 140,
  view: {
    show: true,
    func: async (row) => {
      lookException(row)
    },
  },
  delete: {
    show: true,
    auth: ['/tool/crontab/deleteLog'],
    func: async (params) => {
      const resp = await api.deleteLog(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '执行时间', dataIndex: 'create_time', width: 180 },
  { title: '执行目标', dataIndex: 'target', width: 240 },
  { title: '执行结果', dataIndex: 'status', width: 100 },
])

defineExpose({ open })
</script>
