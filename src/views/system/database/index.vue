<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table
      ref="crudRef"
      :options="options"
      :columns="columns"
      :searchForm="searchForm"
      @selectionChange="selectChange">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="12" :xs="24">
          <a-form-item field="name" label="表名称">
            <a-input v-model="searchForm.name" placeholder="请输入表名称" allow-clear />
          </a-form-item>
        </a-col>
      </template>
      <!-- 表格操作按钮扩展 -->
      <template #tableBeforeButtons>
        <a-button @click="operate('optimize')" type="primary" status="success" v-auth="['/core/database/optimize']">
          <template #icon><icon-tool /></template>优化表
        </a-button>

        <a-button @click="operate('clear')" type="primary" status="success" v-auth="['/core/database/fragment']">
          <template #icon><icon-experiment /></template>清理碎片
        </a-button>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link v-auth="['/core/database/detailed']" @click="tableStruct(record.name)"> <icon-layers /> 表结构 </a-link>
        <a-link v-auth="['/core/database/recycle']" @click="tableRecycle(record.name)">
          <icon-storage /> 回收站
        </a-link>
      </template>
    </sa-table>

    <!-- 表结构 -->
    <struct-table ref="structTableRef" @success="refresh" />

    <!-- 回收站 -->
    <recycle-table ref="tableRecycleRef" @success="refresh" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import api from '@/api/system/database'
import RecycleTable from './recycle.vue'
import StructTable from './struct.vue'

const crudRef = ref()
const structTableRef = ref()
const tableRecycleRef = ref()
const selecteds = ref([])

const searchForm = reactive({
  name: '',
})

// 选中数据
const selectChange = (val) => (selecteds.value = val)

// 打开表结构
const tableStruct = async (tableName) => {
  structTableRef.value?.open(tableName)
}

// 打开回收站
const tableRecycle = async (tableName) => {
  tableRecycleRef.value?.open(tableName)
}

// 操作方法
const operate = async (op) => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条数据')
    return
  }
  let response
  if (op === 'optimize') {
    response = await api.optimize({ tables: selecteds.value })
  }

  if (op === 'clear') {
    response = await api.fragment({ tables: selecteds.value })
  }
  if (response.code == 200) {
    Message.success(response.message)
    crudRef.value?.refresh()
  }
}

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true, key: 'name' },
  operationColumnWidth: 180,
})

// SaTable 列配置
const columns = reactive([
  { title: '表名称', dataIndex: 'name', width: 200, align: 'left' },
  { title: '表注释', dataIndex: 'comment', width: 180 },
  { title: '表引擎', dataIndex: 'engine', width: 120 },
  { title: '数据更新时间', dataIndex: 'update_time', width: 180 },
  { title: '总行数', dataIndex: 'rows', width: 120 },
  { title: '碎片大小', dataIndex: 'data_free', width: 120 },
  { title: '数据大小', dataIndex: 'data_length', width: 120 },
  { title: '索引大小', dataIndex: 'index_length', width: 120 },
  { title: '字符集', dataIndex: 'collation', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
])

// 页面数据初始化
const initPage = async () => {}

// SaTable 数据刷新
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
onMounted(async () => {
  initPage()
  refresh()
})
</script>
