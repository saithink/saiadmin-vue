<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm" @selectionChange="selectChange">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="12">
          <a-form-item field="name" label="表名称">
            <a-input v-model="searchForm.name" placeholder="请输入表名称" />
          </a-form-item>
        </a-col>
      </template>
      <!-- 表格操作按钮扩展 -->
      <template #tableBeforeButtons>
        <a-button @click="operate('optimize')" type="primary" status="success" v-auth="['/core/dataMaintain/optimize']">
          <template #icon><icon-tool /></template>优化表
        </a-button>

        <a-button @click="operate('clear')" type="primary" status="success" v-auth="['/core/dataMaintain/fragment']">
          <template #icon><icon-experiment /></template>清理碎片
        </a-button>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link @click="tableStruct(record.name)"> <icon-eye /> 查看 </a-link>
      </template>
    </sa-table>

    <a-modal v-model:visible="visible" width="900px" :footer="false">
      <template #title>表结构数据</template>
      <sa-table
        ref="tableRef"
        :options="tableCrud"
        :searchForm="tableForm"
        :columns="[
          { title: '字段名称', dataIndex: 'column_name' },
          { title: '字段类型', dataIndex: 'column_type' },
          { title: '字段注释', dataIndex: 'column_comment' },
        ]" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/system/dataMaintain'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const tableRef = ref()
const selecteds = ref([])
const visible = ref(false)

const selectChange = (val) => (selecteds.value = val)

const operate = async (op) => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条数据')
    return
  }
  let response
  if (op === 'optimize') {
    response = await api.optimize(selecteds.value)
  }

  if (op === 'clear') {
    response = await api.fragment(selecteds.value)
  }

  response.code === 200 && Message.success(response.message)
}

const tableStruct = (name) => {
  tableForm.value.table = name
  visible.value = true
  tableRef.value?.refresh()
}

// 搜索表单
const searchForm = ref({
  name: '',
})

const tableForm = ref({
  table: '',
})

const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true, key: 'name' },
  operationColumnWidth: 100,
})

const columns = reactive([
  { title: '表名称', dataIndex: 'name', width: 200, align: 'left' },
  { title: '表引擎', dataIndex: 'engine', width: 120 },
  { title: '总行数', dataIndex: 'rows', width: 120 },
  { title: '碎片大小', dataIndex: 'data_free', width: 150 },
  { title: '数据大小', dataIndex: 'data_length', width: 150 },
  { title: '索引大小', dataIndex: 'index_length', width: 150 },
  { title: '字符集', dataIndex: 'collation', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '表注释', dataIndex: 'comment', width: 180 },
])

const tableCrud = reactive({
  api: api.getDetailed,
  pageSimple: true,
  showSearch: false,
  operationColumn: false,
})

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
