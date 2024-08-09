<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="title" label="公告标题">
            <a-input v-model="searchForm.title" placeholder="请输入公告名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="type" label="公告类型">
            <sa-select v-model="searchForm.type" dict="backend_notice_type" placeholder="请选择公告类型" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="create_time" label="创建时间">
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
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import api from '@/api/system/notice'

const crudRef = ref()
const editRef = ref()

const searchForm = ref({
  title: '',
  type: '',
  create_time: [],
})

const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/core/notice/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/notice/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/notice/destroy'],
    func: async (params) => {
      const resp = await api.deletes(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/core/notice/realDestroy'],
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
    auth: ['/core/notice/recovery'],
    func: async (params) => {
      const resp = await api.recoverys(params)
      if (resp.code === 200) {
        Message.success(`恢复成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

const columns = reactive([
  { title: '公告标题', dataIndex: 'title', width: 500 },
  { title: '公告类型', dataIndex: 'type', dict: 'backend_notice_type', width: 180 },
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
