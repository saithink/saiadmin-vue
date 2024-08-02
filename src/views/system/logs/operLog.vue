<template>
  <div class="ma-content-block">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="username" label="操作用户">
            <a-input v-model="searchForm.username" placeholder="请输入操作用户" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="router" label="操作路由">
            <a-input v-model="searchForm.router" placeholder="请输入操作路由" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="ip" label="操作IP">
            <a-input v-model="searchForm.ip" placeholder="请输入登录IP" />
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <a-form-item field="create_time" label="操作时间">
            <a-range-picker v-model="searchForm.create_time" showTime style="width: 100%" />
          </a-form-item>
        </a-col>
      </template>
    </sa-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import operLog from '@/api/system/operLog'

const crudRef = ref()

const searchForm = ref({
  name: '',
  status: '',
  login_time: [],
  orderBy: 'create_time',
  orderType: 'desc',
})

const options = reactive({
  api: operLog.getPageList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 100,
  delete: {
    show: true,
    auth: ['/core/logs/deleteOperLog'],
    func: async (params) => {
      const resp = await operLog.deletes(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

const columns = reactive([
  { title: '操作用户', dataIndex: 'username', width: 150 },
  { title: '业务名称', dataIndex: 'service_name', width: 150 },
  { title: '路由', dataIndex: 'router', width: 240 },
  { title: '操作IP', dataIndex: 'ip', width: 150 },
  { title: '操作地点', dataIndex: 'ip_location', width: 150 },
  { title: '操作时间', dataIndex: 'create_time', width: 180 },
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
:deep(.arco-collapse-item-content) {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
