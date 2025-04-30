<template>
  <div class="ma-content-block">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item field="name" label="部门名称">
            <a-input v-model="searchForm.name" placeholder="请输入部门名称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="create_time" label="时间范围">
            <a-range-picker v-model="searchForm.create_time" />
          </a-form-item>
        </a-col>
      </template>
      <!-- 搜索区 end -->

      <!-- Table 自定义渲染 -->
      <template #leader="{ record }">
        <div v-if="record.leader.length > 0">
          <a-tag v-for="item in record.leader" :key="item.id" class="ml-2">{{ item.username }}</a-tag>
        </div>
        <div v-else></div>
      </template>
      <!-- 操作列 -->
      <template #operationCell="{ record }">
        <div v-if="record.disabled"></div>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link v-if="!record.disabled" v-auth="['/core/dept/leaders']" @click="openLeaderModal(record)">
          <icon-user /> 领导列表
        </a-link>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />

    <!-- 领导列表 -->
    <leader-list ref="leaderRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import LeaderList from './leader.vue'
import api from '@/api/system/dept'

// 引用定义
const crudRef = ref()
const editRef = ref()
const leaderRef = ref()

// 打开领导列表设置
const openLeaderModal = (record) => {
  leaderRef.value.open(record)
}

// 搜索表单
const searchForm = ref({
  name: '',
  create_time: [],
})

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  isExpand: true,
  operationColumnWidth: 220,
  add: {
    show: true,
    auth: ['/core/dept/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/dept/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/dept/destroy'],
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
  { title: '部门名称', dataIndex: 'name', width: 180 },
  { title: '领导列表', dataIndex: 'leader' },
  { title: '排序', dataIndex: 'sort', width: 100 },
  { title: '状态', dataIndex: 'status', type: 'dict', dict: 'data_status', width: 120 },
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
