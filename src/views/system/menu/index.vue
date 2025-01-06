<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="name" label="菜单名称">
            <a-input v-model="searchForm.name" placeholder="请输入菜单名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="code" label="菜单标识">
            <a-input v-model="searchForm.code" placeholder="请输入菜单标识" />
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
      <!-- 状态列 -->
      <template #status="{ record }">
        <sa-switch v-model="record.status" @change="changeStatus($event, record.id)"></sa-switch>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link @click="openAdd(record.id)" v-if="record.type === 'M' && !isRecovery" v-auth="['/core/menu/save']"> <icon-plus /> 新增 </a-link>
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

const searchForm = ref({
  name: '',
  code: '',
  status: '',
})

let isRecovery = computed(() => (crudRef.value ? crudRef.value.isRecovery : false))

const changeStatus = async (status, id) => {
  const response = await api.changeStatus({ id, status })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

const openAdd = (id) => {
  editRef.value?.open()
  editRef.value?.setFormData({ parent_id: id })
}

const options = reactive({
  api: api.getList,
  recycleApi: api.getRecyclePageList,
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
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/core/menu/realDestroy'],
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
    auth: ['/core/menu/recovery'],
    func: async (params) => {
      const resp = await api.recovery(params)
      if (resp.code === 200) {
        Message.success(`恢复成功！`)
        crudRef.value?.refresh()
      }
    },
  },
  isExpand: true,
})

const columns = reactive([
  { title: '菜单名称', dataIndex: 'name', width: 180 },
  { title: '菜单类型', dataIndex: 'type', dict: 'menu_type', width: 100 },
  { title: '图标', dataIndex: 'icon', width: 80 },
  { title: '菜单标识', dataIndex: 'code', width: 150 },
  { title: '路由地址', dataIndex: 'route', width: 150 },
  { title: '视图组件', dataIndex: 'component', width: 200 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '隐藏', dataIndex: 'is_hidden', dict: 'yes_or_no', width: 80 },
  { title: '状态', dataIndex: 'status', dict: 'data_status', width: 120 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
])

const initPage = async () => {}

const refresh = async () => {
  crudRef.value?.refresh()
}

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
