<template>
  <div class="ma-content-block">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item field="from" label="发件人">
            <a-input v-model="searchForm.from" placeholder="请输入发件人" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="email" label="收件人">
            <a-input v-model="searchForm.email" placeholder="请输入收件人" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="code" label="验证码">
            <a-input v-model="searchForm.code" placeholder="请输入验证码" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="发送状态" field="status">
            <a-select
              v-model="searchForm.status"
              :field-names="{ label: 'label', value: 'value' }"
              :options="optionData"
              placeholder="请选择发送状态"
              allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="16" :xs="24">
          <a-form-item field="create_time" label="操作时间">
            <a-range-picker v-model="searchForm.create_time" showTime style="width: 100%" />
          </a-form-item>
        </a-col>
      </template>
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status === 'success'">成功</a-tag>
        <a-tag color="red" v-if="record.status === 'failure'">失败</a-tag>
      </template>
    </sa-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import api from '@/api/system/emailLog'

const crudRef = ref()
const optionData = ref([
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failure' },
])

// 搜索表单
const searchForm = ref({
  from: '',
  email: '',
  code: '',
  status: '',
  create_time: [],
  orderBy: 'create_time',
  orderType: 'desc',
})

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 100,
  delete: {
    show: true,
    auth: ['/core/email/destroy'],
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
  { title: '服务Host', dataIndex: 'gateway', width: 120 },
  { title: '发件人', dataIndex: 'from', width: 180 },
  { title: '收件人', dataIndex: 'email', width: 180 },
  { title: '验证码', dataIndex: 'code', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '发送结果', dataIndex: 'response', width: 180 },
  { title: '发送时间', dataIndex: 'create_time', width: 180 },
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
