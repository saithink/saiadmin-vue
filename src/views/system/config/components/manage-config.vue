<template>
  <a-modal fullscreen v-model:visible="visible" :footer="false" @close="handleClose">
    <template #title>管理配置</template>
    <div class="h-full">
      <!-- CRUD 组件 -->
      <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
        <!-- 搜索区 start -->
        <template #tableSearch>
          <a-col :span="8">
            <a-form-item field="name" label="配置标题">
              <a-input v-model="searchForm.name" placeholder="请输入配置标题" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="key" label="配置标识">
              <a-input v-model="searchForm.key" placeholder="请输入配置标识" allow-clear />
            </a-form-item>
          </a-col>
        </template>
      </sa-table>

      <!-- 编辑表单 -->
      <EditForm ref="editRef" @success="refresh" />
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import api from '@/api/system/config'
import EditForm from './edit.vue'

const emit = defineEmits(['close'])

const visible = ref(false)
const crudRef = ref()
const editRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  key: '',
  group_id: '',
  orderBy: 'sort',
  orderType: 'desc',
})

// 关闭窗口
const handleClose = () => {
  visible.value = false
}

// 刷新页面
const refresh = async () => {
  crudRef.value?.refresh()
  emit('close')
}

// 打开窗口
const open = (id) => {
  searchForm.value.group_id = id
  visible.value = true
  crudRef.value?.refresh()
}

// SaTable 基础配置
const options = reactive({
  api: api.getConfigList,
  rowSelection: { showCheckedAll: true },
  singleLine: true,
  add: {
    show: true,
    auth: ['/core/config/save'],
    func: async () => {
      editRef.value?.open()
      editRef.value?.setFormData({ group_id: searchForm.value.group_id })
    },
  },
  edit: {
    show: true,
    auth: ['/core/config/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/core/config/destroy'],
    func: async (params) => {
      const resp = await api.destroy(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '配置标题', dataIndex: 'name', width: 220 },
  { title: '配置标识', dataIndex: 'key', width: 180 },
  { title: '配置值', dataIndex: 'value', width: 200 },
  { title: '排序', dataIndex: 'sort', width: 200 },
  { title: '输入组件', dataIndex: 'input_type', width: 180 },
  { title: '配置说明', dataIndex: 'remark', width: 180 },
])

defineExpose({ open })
</script>
