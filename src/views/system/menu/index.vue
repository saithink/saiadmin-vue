<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="name" label="菜单名称">
            <a-input v-model="searchForm.name" placeholder="请输入菜单名称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="code" label="菜单标识">
            <a-input v-model="searchForm.code" placeholder="请输入菜单标识" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="status" label="状态">
            <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" allow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 图标列 -->
      <template #icon="{ record }">
        <sa-icon :icon="record.icon" />
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link @click="openAdd(record.id)" v-if="record.type === 'M'" v-auth="['/core/menu/save']">
          <icon-plus /> 新增
        </a-link>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import api from '@/api/system/menu'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'

const crudRef = ref()
const editRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  code: '',
  status: '',
})

// 添加子菜单
const openAdd = (id) => {
  editRef.value?.open()
  editRef.value?.setFormData({ parent_id: id })
}

// SaTable 基础配置
const options = reactive({
  api: api.getList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 200,
  add: {
    show: true,
    auth: ['/core/menu/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/menu/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/menu/destroy'],
    func: async (params) => {
      const resp = await api.destroy(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
  isExpand: true,
})

// SaTable 列配置
const columns = reactive([
  { title: '菜单名称', dataIndex: 'name', width: 180 },
  { title: '菜单类型', dataIndex: 'type', dict: 'menu_type', width: 100 },
  { title: '图标', dataIndex: 'icon', width: 80 },
  { title: '菜单标识', dataIndex: 'code', width: 150 },
  { title: '路由地址', dataIndex: 'route', width: 150 },
  { title: '视图组件', dataIndex: 'component', width: 200 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '隐藏', dataIndex: 'is_hidden', type: 'dict', dict: 'yes_or_no', width: 80 },
  { title: '状态', dataIndex: 'status', type: 'dict', dict: 'data_status', width: 80 },
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

<style scoped>
.icon {
  width: 1em;
}
</style>
