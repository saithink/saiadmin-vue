<template>
  <a-modal v-model:visible="visible" fullscreen :footer="false">
    <template #title>部门领导列表</template>
    <a-alert>部门的领导人可以跨部门设置</a-alert>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef" class="mt-3">
      <template #tableBeforeButtons>
        <ma-user text="新增领导" :onlyId="false" :isEcho="false" v-model="users" @success="selectedSuccess" />
      </template>
    </ma-crud>

  </a-modal>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import dept from '@/api/system/dept'

  const visible = ref(false)
  const crudRef = ref()
  const deptId = ref()
  const users = ref([])

  const open = (row) => {
    deptId.value = row.id
    visible.value = true
    crudRef.value.requestData()
  }

  const selectedSuccess = async () => {
    const data = users.value.map(item => {
      return { user_id: item.id, username: item.username }
    })
    const response = await dept.addLeader({ id: deptId.value, users: data })
    response.code === 200 && crudRef.value.refresh()
  }

  const crud = reactive({
    autoRequest: false,
    api: dept.getLeaderList,
    searchColNumber: 3,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 160,
    delete: { show: true, api: dept.delLeader, auth: ['/core/dept/destroy'] },
    beforeRequest: (params) => params.dept_id = deptId.value,
    beforeDelete: () => { return { id: deptId.value } }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: '用户名', dataIndex: 'username', search: true },
    { title: '用户昵称', dataIndex: 'nickname', search: true },
    { title: '手机', dataIndex: 'phone' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '状态', dataIndex: 'status', width: 100, search: true, formType: 'select',
      dict: { name: 'data_status', props: { label: 'label', value: 'value' }, translation: true,  tagColors: { 1: 'blue', 2: 'red' } },
      labelWidth: '86px'
    }
  ])

  defineExpose({ open })
</script>