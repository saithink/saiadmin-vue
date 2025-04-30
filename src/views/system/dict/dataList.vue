<template>
  <div>
    <a-modal v-model:visible="visible" fullscreen :footer="false">
      <template #title>维护 {{ currentRow.name }} 字典数据</template>
      <!-- CRUD 组件 -->
      <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
        <!-- 搜索区 tableSearch -->
        <template #tableSearch>
          <a-col :sm="8" :xs="24">
            <a-form-item field="label" label="字典标签">
              <a-input v-model="searchForm.label" placeholder="请输入字典标签" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :xs="24">
            <a-form-item field="value" label="字典键值">
              <a-input v-model="searchForm.value" placeholder="请输入字典键值" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :xs="24">
            <a-form-item field="status" label="状态">
              <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" />
            </a-form-item>
          </a-col>
        </template>
        <!-- Table 自定义渲染 -->
        <template #status="{ record }">
          <sa-switch v-model="record.status" @change="changeStatus($event, record.id)"></sa-switch>
        </template>
      </sa-table>
    </a-modal>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { dict } from '@/api/system/dict'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit-data.vue'

const crudRef = ref()
const editRef = ref()
const visible = ref(false)
const currentRow = ref({})

// 搜索表单
const searchForm = ref({
  code: '',
  type_id: null,
  label: '',
  value: '',
  status: '',
  orderBy: 'sort',
  orderType: 'desc',
})

// 修改状态
const changeStatus = async (status, id) => {
  const response = await dict.changeStatus({ id, status })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

// 打开弹框
const open = (row) => {
  currentRow.value = row
  searchForm.value.code = row.code
  searchForm.value.type_id = row.id
  crudRef.value?.refresh()
  visible.value = true
}

// SaTable 基础配置
const options = reactive({
  api: dict.getPageList,
  rowSelection: { showCheckedAll: true },
  singleLine: true,
  add: {
    show: true,
    auth: ['/core/dictType/save'],
    func: async () => {
      editRef.value?.open()
      editRef.value?.setFormData({ type_id: searchForm.value.type_id, code: searchForm.value.code })
    },
  },
  edit: {
    show: true,
    auth: ['/core/dictType/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/dictType/destroy'],
    func: async (params) => {
      const resp = await dict.destroyDictData(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '字典标签', dataIndex: 'label', width: 220 },
  { title: '字典键值', dataIndex: 'value', width: 220 },
  { title: '排序', dataIndex: 'sort', width: 180 },
  { title: '状态', dataIndex: 'status', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
])

// SaTable 数据请求
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
defineExpose({ open })
</script>

<style scoped></style>
