<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="name" label="岗位名称">
            <a-input v-model="searchForm.name" placeholder="请输入岗位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="status" label="状态">
            <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="create_time" label="时间范围">
            <a-range-picker v-model="searchForm.create_time" style="width: 100%" />
          </a-form-item>
        </a-col>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import api from '@/api/system/post'

const crudRef = ref()
const editRef = ref()

const searchForm = ref({
  name: '',
  status: '',
  create_time: [],
})

const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/core/post/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/post/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/post/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/core/post/realDestroy'],
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
    auth: ['/core/post/recovery'],
    func: async (params) => {
      const resp = await api.recovery(params)
      if (resp.code === 200) {
        Message.success(`恢复成功！`)
        crudRef.value?.refresh()
      }
    },
  },
  import: { show: true, url: '/core/post/import', templateUrl: '/core/post/downloadTemplate', auth: ['/core/post/import'] },
  export: { show: true, url: '/core/post/export', auth: ['/core/post/export'] },
})

const columns = reactive([
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '岗位名称', dataIndex: 'name', width: 120 },
  { title: '岗位标识', dataIndex: 'code', width: 180 },
  { title: '排序', dataIndex: 'sort', width: 180 },
  { title: '状态', dataIndex: 'status', dict: 'data_status', width: 120 },
  { title: '备注', dataIndex: 'remark', width: 180 },
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
