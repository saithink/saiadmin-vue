<template>
  <a-modal v-model:visible="visible" fullscreen :footer="false" @close="handleClose">
    <template #title>部门领导列表</template>
    <a-alert>部门的领导人可以跨部门设置</a-alert>
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item field="username" label="用户名">
            <a-input v-model="searchForm.username" placeholder="请输入用户名" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="nickname" label="用户昵称">
            <a-input v-model="searchForm.nickname" placeholder="请输入用户昵称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item field="status" label="状态">
            <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" allow-clear />
          </a-form-item>
        </a-col>
      </template>
      <!-- 操作前置扩展 -->
      <template #tableBeforeButtons>
        <sa-user text="新增领导" :onlyId="false" :isEcho="false" v-model="users" @success="selectedSuccess" />
      </template>
    </sa-table>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/api/system/dept'
import { Message } from '@arco-design/web-vue'

const emit = defineEmits(['success'])

const visible = ref(false)
const crudRef = ref()
const deptId = ref()
const users = ref([])

// 搜索表单
const searchForm = ref({
  username: '',
  nickname: '',
  dept_id: null,
  status: '',
})

// 打开弹框
const open = (row) => {
  deptId.value = row.id
  visible.value = true
  searchForm.value.dept_id = deptId.value
  crudRef.value?.refresh()
}

// 成功添加
const selectedSuccess = async () => {
  const data = users.value.map((item) => {
    return { user_id: item.id, username: item.username }
  })
  const response = await api.addLeader({ id: deptId.value, users: data })
  if (response.code === 200) {
    users.value = []
    crudRef.value?.refresh()
  }
}

const handleClose = async () => {
  emit('success', true)
}

// SaTable 基础配置
const options = reactive({
  api: api.getLeaderList,
  rowSelection: { showCheckedAll: true },
  singleLine: true,
  delete: {
    show: true,
    auth: ['/core/dept/destroy'],
    func: async (params) => {
      params.id = deptId.value
      const resp = await api.delLeader(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '用户名', dataIndex: 'username' },
  { title: '用户昵称', dataIndex: 'nickname' },
  { title: '手机', dataIndex: 'phone' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '状态', dataIndex: 'status', width: 100, type: 'dict', dict: 'data_status' },
])

defineExpose({ open })
</script>
