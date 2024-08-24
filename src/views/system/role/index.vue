<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="name" label="角色名称">
            <a-input v-model="searchForm.name" placeholder="请输入角色名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="code" label="角色标识">
            <a-input v-model="searchForm.code" placeholder="请输入角色标识" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="status" label="状态">
            <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" alow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 操作列 -->
      <template #operationCell="{ record }">
        <div v-if="record.disabled"></div>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini" v-if="record.id > 1 && !record.disabled && !isRecovery">
          <a-link v-auth="['/core/role/menuPermission']" @click="openMenuList(record)"><icon-menu /> 菜单权限</a-link>
          <a-link v-auth="['/core/role/dataPermission']" @click="openDataScopeList(record)"><icon-layers /> 数据权限</a-link>
        </a-space>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
    <!-- 菜单权限 -->
    <menu-permission ref="mpRef" @success="refresh" />
    <!-- 数据权限 -->
    <data-permission ref="dpRef" @success="refresh" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/system/role'
import { Message } from '@arco-design/web-vue'
import MenuPermission from './components/menuPermission.vue'
import DataPermission from './components/dataPermission.vue'
import EditForm from './edit.vue'

const crudRef = ref()
const editRef = ref()
const mpRef = ref()
const dpRef = ref()

const searchForm = ref({
  name: '',
  code: '',
  status: '',
})

let isRecovery = computed(() => (crudRef.value ? crudRef.value.isRecovery : false))

const openMenuList = (record) => {
  mpRef.value.open(record)
}

const openDataScopeList = (record) => {
  dpRef.value.open(record)
}

const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  isExpand: true,
  operationColumnWidth: 300,
  add: {
    show: true,
    auth: ['/core/role/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/role/update'],
    func: async (record) => {
      if (record.id === 1) {
        Message.error('超级管理员角色不可编辑')
        return false
      }
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/role/destroy'],
    func: async (params) => {
      if (params.ids.includes(1)) {
        Message.error('超级管理员角色不可删除')
        return false
      }
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/core/role/realDestroy'],
    realFunc: async (params) => {
      const resp = await api.realDestroy(params)
      if (resp.code === 200) {
        Message.success(`销毁成功！`)
        crudRef.value?.refresh()
      }
    },
  },
  recovery: {
    show: true,
    auth: ['/core/role/recovery'],
    func: async (params) => {
      const resp = await api.recovery(params)
      if (resp.code === 200) {
        Message.success(`恢复成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

const columns = reactive([
  { title: '角色名称', dataIndex: 'name', width: 220 },
  { title: '角色标识', dataIndex: 'code', width: 180 },
  { title: '数据权限', dataIndex: 'data_scope', dict: 'data_scope', width: 200 },
  { title: '排序', dataIndex: 'sort', width: 150 },
  { title: '状态', dataIndex: 'status', dict: 'data_status', width: 100 },
])

const initPage = async () => {}

const refresh = async () => {
  crudRef.value?.refresh()
}

onMounted(() => {
  initPage()
  refresh()
})
</script>

<style scoped></style>
