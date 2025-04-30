<template>
  <a-drawer v-model:visible="visible" :width="tool.getDevice() === 'mobile' ? '100%' : '70%'" :footer="false">
    <template #title>回收站数据 【{{ tableForm.table }}】</template>
    <a-space class="pl-4">
      <a-popconfirm content="确定要批量销毁数据吗?" position="bottom" @ok="batchDeleteAction">
        <a-button type="primary" status="danger" v-auth="['/core/database/delete']">
          <template #icon> <icon-delete /> </template> 批量销毁
        </a-button>
      </a-popconfirm>
      <a-popconfirm content="确定要批量恢复数据吗?" position="bottom" @ok="batchRecoveryAction">
        <a-button type="primary" status="success" v-auth="['/core/database/recovery']">
          <template #icon> <icon-undo /> </template> 批量恢复
        </a-button>
      </a-popconfirm>
    </a-space>
    <!-- CRUD 组件 -->
    <sa-table
      ref="tableRef"
      :options="tableCrud"
      :searchForm="tableForm"
      @selectionChange="selectChange"
      :columns="[
        { title: '删除时间', dataIndex: 'delete_time', width: 180 },
        { title: '数据详情', dataIndex: 'json_data', width: 300 },
      ]">
      <!-- 数据详情插槽 -->
      <template #json_data="{ record }">
        {{ JSON.stringify(record) }}
      </template>
      <!-- 操作 -->
      <template #operationCell="{ record }">
        <a-popconfirm content="确定要销毁该数据吗?" position="bottom" @ok="deleteAction(record)">
          <a-link type="primary" v-auth="['/core/database/delete']"> <icon-delete /> 销毁 </a-link>
        </a-popconfirm>
        <a-popconfirm content="确定要恢复该数据吗?" position="bottom" @ok="recoveryAction(record)">
          <a-link type="primary" v-auth="['/core/database/recovery']"> <icon-undo /> 恢复 </a-link>
        </a-popconfirm>
      </template>
    </sa-table>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import tool from '@/utils/tool'
import { Message } from '@arco-design/web-vue'
import api from '@/api/system/database'

const visible = ref(false)
const tableRef = ref()
const selecteds = ref([])
const tableForm = ref({
  table: '',
})

// 选中数据
const selectChange = (val) => (selecteds.value = val)

// SaTable 基础配置
const tableCrud = reactive({
  api: api.getRecycle,
  rowSelection: { showCheckedAll: true, key: 'id' },
  pageSimple: true,
  showSearch: false,
})

// 页面数据初始化
const initPage = async () => {
  tableRef.value?.refresh()
}

// 打开弹框
const open = async (tablename) => {
  tableForm.value.table = tablename
  visible.value = true
  await initPage()
}

// 批量销毁置
const batchDeleteAction = async () => {
  console.log(selecteds.value)
  if (selecteds.value && selecteds.value.length > 0) {
    const params = { table: tableForm.value.table, ids: selecteds.value }
    const resp = await api.delete(params)
    if (resp.code === 200) {
      Message.success(`销毁成功！`)
      tableRef.value?.clearSelected()
      tableRef.value?.refresh()
    }
  } else {
    Message.error('至少选择一条数据')
  }
}

// 批量恢复数据
const batchRecoveryAction = async () => {
  if (selecteds.value && selecteds.value.length > 0) {
    const params = { table: tableForm.value.table, ids: selecteds.value }
    const resp = await api.recovery(params)
    if (resp.code === 200) {
      Message.success(`恢复成功！`)
      selecteds.value = []
      tableRef.value?.clearSelected()
      tableRef.value?.refresh()
    }
  } else {
    Message.error('至少选择一条数据')
  }
}

// 销毁数据
const deleteAction = async (record) => {
  const params = { table: tableForm.value.table, ids: [record.id] }
  const resp = await api.delete(params)
  if (resp.code === 200) {
    Message.success(`销毁成功！`)
    tableRef.value?.refresh()
  }
}

// 恢复数据
const recoveryAction = async (record) => {
  const params = { table: tableForm.value.table, ids: [record.id] }
  const resp = await api.recovery(params)
  if (resp.code === 200) {
    Message.success(`恢复成功！`)
    tableRef.value?.refresh()
  }
}

defineExpose({ open })
</script>
