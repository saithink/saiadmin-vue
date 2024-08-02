<template>
  <a-drawer :footer="false" v-model:visible="visible" width="850px">
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
import api from '@/api/setting/crontab'
import { Modal } from '@arco-design/web-vue'

const crudRef = ref()
const crontabId = ref()
const visible = ref(false)

const searchForm = ref({
  orderBy: 'create_time',
  orderType: 'desc',
  crontab_id: '',
})

const open = (id) => {
  crontabId.value = id
  searchForm.value.crontab_id = id
  visible.value = true
  crudRef.value.refresh()
}

const lookException = (row) => {
  const info = row.exception_info
  Modal.info({
    simple: false,
    title: '异常信息',
    content: info == '' ? '无异常信息' : info,
  })
}

const options = reactive({
  autoRequest: false,
  api: api.getLogPageList,
  showSearch: false,
  showTools: false,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 100,
  delete: {
    show: true,
    auth: ['/core/crontab/deleteLog'],
    func: async (params) => {
      const resp = await api.deleteLog(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

const columns = reactive([
  { title: '执行时间', dataIndex: 'create_time', width: 180 },
  { title: '执行目标', dataIndex: 'target', width: 240 },
  { title: '执行结果', dataIndex: 'status', width: 100 },
  { title: '异常信息', dataIndex: 'exception_info', width: 100 },
])

defineExpose({ open })
</script>
