<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item field="name" label="角色名称">
            <a-input v-model="searchForm.name" placeholder="请输入角色名称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="code" label="角色标识">
            <a-input v-model="searchForm.code" placeholder="请输入角色标识" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
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
        <a-space size="mini" v-if="record.id > 1 && !record.disabled">
          <a-link v-auth="['/core/role/menuPermission']" @click="openMenuList(record)"> <icon-menu /> 菜单权限 </a-link>
        </a-space>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
    <!-- 菜单权限 -->
    <menu-permission ref="mpRef" @success="refresh" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/system/role'
import { Message } from '@arco-design/web-vue'
import MenuPermission from './components/menuPermission.vue'
import EditForm from './edit.vue'

const crudRef = ref()
const editRef = ref()
const mpRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  code: '',
  status: '',
})

// 打开菜单权限
const openMenuList = (record) => {
  mpRef.value.open(record)
}

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  isExpand: true,
  operationColumnWidth: 220,
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
  { title: '角色名称', dataIndex: 'name', width: 220 },
  { title: '角色标识', dataIndex: 'code', width: 180 },
  { title: '排序', dataIndex: 'sort', width: 150 },
  { title: '状态', dataIndex: 'status', type: 'dict', dict: 'data_status', width: 100 },
])

// 页面数据初始化
const initPage = async () => {}

// SaTable 数据刷新
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
onMounted(() => {
  initPage()
  refresh()
})
</script>

<style scoped></style>
