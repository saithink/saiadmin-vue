<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item field="name" label="任务名称">
            <a-input v-model="searchForm.name" placeholder="请输入任务名称" />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="type" label="任务类型">
            <a-select v-model="searchForm.type" :options="types" allow-clear placeholder="请选择任务类型" />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="status" label="状态">
            <sa-select v-model="searchForm.status" dict="data_status" allow-clear placeholder="请选择状态" />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 自定义规则 -->
      <template #rule="{ record }">
        <span>{{ record.rule }}</span>
      </template>
      <!-- 状态列 -->
      <template #status="{ record }">
        <sa-switch v-model="record.status" @change="changeStatus($event, record.id)"></sa-switch>
      </template>

      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-popconfirm content="确定立刻执行一次?" position="bottom" @ok="run(record)">
          <a-link v-auth="['/tool/crontab/run']"><icon-caret-right /> 执行一次</a-link>
        </a-popconfirm>
        <a-link @click="openLogModal(record)"><icon-history /> 日志 </a-link>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />

    <!-- 日志记录 -->
    <log-list ref="logsRef" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

import api from '@/api/tool/crontab'
import LogList from './logList.vue'
import EditForm from './edit.vue'

const crudRef = ref()
const editRef = ref()
const logsRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  type: '',
  status: '',
})

// 类型字典
const types = [
  { label: 'URL任务GET', value: 1 },
  { label: 'URL任务POST', value: 2 },
  { label: '类任务', value: 3 },
]

// 修改状态
const changeStatus = async (status, id) => {
  const response = await api.changeStatus({ id, status })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

// 执行
const run = async (row) => {
  const response = await api.run({ id: row.id })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

// 日志窗口
const openLogModal = (row) => {
  logsRef.value.open(row.id)
}

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 280,
  add: {
    show: true,
    auth: ['/tool/crontab/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/tool/crontab/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/tool/crontab/destroy'],
    func: async (params) => {
      const resp = await api.destroy(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '任务名称', dataIndex: 'name', width: 180 },
  { title: '任务类型', dataIndex: 'type', type: 'dict', options: types, width: 140 },
  { title: '定时规则', dataIndex: 'rule', width: 260 },
  { title: '调用目标', dataIndex: 'target', width: 260 },
  { title: '状态', dataIndex: 'status', dict: 'data_status', width: 120 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
])

// 页面数据初始化
const initPage = async () => {}

// SaTable 数据请求
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
onMounted(async () => {
  initPage()
  refresh()
})
</script>
