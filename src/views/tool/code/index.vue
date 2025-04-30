<template>
  <div class="ma-content-block">
    <sa-table
      ref="crudRef"
      :options="options"
      :columns="columns"
      :searchForm="searchForm"
      @selection-change="selectionChange">
      <!-- 搜索表单 start -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="table_name" label="表名称">
            <a-input v-model="searchForm.table_name" placeholder="请输入数据表名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="source" label="数据源">
            <a-input v-model="searchForm.source" placeholder="请输入数据源名称" />
          </a-form-item>
        </a-col>
      </template>
      <!-- 搜索表单 end -->
      <!-- 表格按钮后置扩展 start -->
      <template #tableAfterButtons>
        <a-button type="outline" @click="batchGenerate">
          <template #icon><icon-code /></template>生成代码
        </a-button>
        <a-button @click="() => loadTableRef.open()" type="outline" status="success">
          <template #icon><icon-export /></template>装载数据表
        </a-button>
      </template>
      <!-- 表格按钮后置扩展 end -->
      <template #operationBeforeExtend="{ record }">
        <a-link @click="previewRef.open(record.id)"><icon-eye /> 预览</a-link>
        <a-popconfirm content="同步会自动同步数据库字段，确定同步吗?" position="bottom" @ok="syncTable(record.id)">
          <a-link><icon-sync /> 同步</a-link>
        </a-popconfirm>
      </template>
      <template #operationAfterExtend="{ record }">
        <a-dropdown trigger="hover" @select="selectOperation($event, record.id)">
          <a-link><icon-double-right /> 生成</a-link>
          <template #content>
            <a-doption value="generateFile">生成到项目</a-doption>
            <a-doption value="generateCode">代码下载</a-doption>
          </template>
        </a-dropdown>
      </template>
      <!-- Table 自定义渲染 start -->
      <template #tpl_category="{ record }">
        <a-tag v-if="record.tpl_category == 'single'" color="green">单表CRUD</a-tag>
        <a-tag v-else color="red">树表CRUD</a-tag>
      </template>
      <template #form_type="{ record }">
        <a-tag v-if="record.form_type == 'a-modal'" color="blue">Modal</a-tag>
        <a-tag v-else color="orange">Drawer</a-tag>
      </template>
      <!-- Table 自定义渲染 end -->
    </sa-table>

    <load-table ref="loadTableRef" @success="refresh" />

    <preview ref="previewRef" />

    <edit-info ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import api from '@/api/tool/generate'

import LoadTable from './components/loadTable.vue'
import Preview from './components/preview.vue'
import EditInfo from './components/editInfo.vue'

const crudRef = ref()
const editRef = ref()
const previewRef = ref()
const loadTableRef = ref()
const selections = ref([])

const selectionChange = (row) => (selections.value = row)

const selectOperation = async (value, id) => {
  if (value === 'generateCode') {
    generateCode(id)
    return
  }
  if (value === 'generateFile') {
    Modal.info({
      title: '提示',
      content: '生成到项目将会覆盖原有文件，确定要生成吗？',
      simple: false,
      onBeforeOk: (done) => {
        generateFile(id)
        done(true)
      },
    })
    return
  }
}

const generateCode = async (ids) => {
  Message.info('代码生成下载中，请稍后')
  const response = await api.generateCode({
    ids: ids.toString().split(','),
  })
  if (response) {
    tool.download(response, 'saiadmin.zip')
    Message.success('代码生成成功，开始下载')
  } else {
    Message.error('文件下载失败')
  }
}

const syncTable = async (id) => {
  const response = await api.sync(id)
  response.code === 200 && Message.success(response.message)
}

const generateFile = async (id) => {
  const response = await api.generateFile({ id })
  response.code === 200 && Message.success(response.message)
}

const batchGenerate = () => {
  if (selections.value.length === 0) {
    Message.error('至少要选择一条数据')
    return
  }
  generateCode(selections.value.join(','))
}

const searchForm = ref({
  table_name: '',
  source: '',
})

const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 300,
  edit: {
    show: true,
    func: async (record) => {
      editRef.value.open(record.id)
    },
  },
  delete: {
    show: true,
    func: async (params) => {
      await api.destroy(params)
      Message.success(`删除成功！`)
      crudRef.value?.refresh()
    },
  },
})

const columns = reactive([
  { title: '表名称', dataIndex: 'table_name', width: 180, align: 'left' },
  { title: '表描述', dataIndex: 'table_comment', width: 150, align: 'left' },
  { title: '应用类型', dataIndex: 'template', width: 120 },
  { title: '应用名称', dataIndex: 'namespace', width: 120 },
  { title: '模板类型', dataIndex: 'stub', width: 120 },
  { title: '生成类型', dataIndex: 'tpl_category', width: 120 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
])

const refresh = async () => {
  crudRef.value?.refresh()
}

onMounted(async () => {
  refresh()
})
</script>
