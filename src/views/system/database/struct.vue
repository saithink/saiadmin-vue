<template>
  <a-modal v-model:visible="visible" :width="tool.getDevice() === 'mobile' ? '100%' : '900px'" :footer="false">
    <template #title>表结构信息</template>
    <!-- CRUD 组件 -->
    <sa-table
      ref="tableRef"
      :options="tableCrud"
      :searchForm="tableForm"
      :columns="[
        { title: '字段名称', dataIndex: 'column_name', width: '180' },
        { title: '字段类型', dataIndex: 'column_type', width: '100' },
        { title: '索引', dataIndex: 'column_key', type: 'dict', render: 'tag', options: optionData, width: '100' },
        { title: '默认值', dataIndex: 'default_value', width: '100' },
        { title: '字段注释', dataIndex: 'column_comment', width: '180' },
      ]" />
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import tool from '@/utils/tool'
import api from '@/api/system/database'

const visible = ref(false)
const tableRef = ref()

const optionData = ref([
  { label: '主键', value: 'PRI' },
  { label: '唯一键', value: 'UNI' },
  { label: '普通索引', value: 'MUL' },
  { label: '', value: '' },
])

// 搜索表单
const tableForm = ref({
  table: '',
})

// SaTable 基础配置
const tableCrud = reactive({
  api: api.getDetailed,
  pageSimple: true,
  showSearch: false,
  operationColumn: false,
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

defineExpose({ open })
</script>
