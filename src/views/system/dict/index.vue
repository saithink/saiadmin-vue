<template>
  <div class="ma-content-block lg:flex justify-between">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item field="name" label="名称">
            <a-input v-model="searchForm.name" placeholder="请输入名称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="code" label="标识">
            <a-input v-model="searchForm.code" placeholder="请输入标识" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="status" label="状态">
            <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 字典标识列 -->
      <template #code="{ record }">
        <a-tooltip content="点击查看字典数据">
          <a-link @click="openDictList(record)">{{ record.code }}</a-link>
        </a-tooltip>
      </template>
      <!-- 状态开关 -->
      <template #status="{ record }">
        <sa-switch v-model="record.status" @change="changeStatus($event, record.id)"></sa-switch>
      </template>

      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link v-auth="['/core/dictType/save']" @click="openDictList(record)"><icon-list /> 字典数据</a-link>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />

    <!-- 数据列表 -->
    <data-list ref="datalist" />
  </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { dictType } from '@/api/system/dict'
import EditForm from './edit.vue'
import DataList from './dataList.vue'

const crudRef = ref()
const datalist = ref()
const editRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  code: '',
  status: '',
})

// 修改状态
const changeStatus = async (status, id) => {
  const response = await dictType.changeStatus({ id, status })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

// 字典数据列表
const openDictList = async (row) => {
  datalist.value.open(row)
}

// SaTable 基础配置
const options = reactive({
  api: dictType.getPageList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 240,
  add: {
    show: true,
    auth: ['/core/dictType/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/dictType/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/dictType/destroy'],
    func: async (params) => {
      const resp = await dictType.destroy(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '字典名称', dataIndex: 'name', width: 220, align: 'left' },
  { title: '字典标识', dataIndex: 'code', width: 260, align: 'left' },
  { title: '状态', dataIndex: 'status', width: 180 },
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
