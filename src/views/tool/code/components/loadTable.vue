<template>
  <a-modal fullscreen v-model:visible="visible" :on-before-ok="loadTable" :align-center="false" unmount-on-close>
    <template #title>装载数据表</template>
    <a-alert class="mb-3" closable>
      1、支持thinkorm配置多数据源；
      2、载入表[sa_shop_category]会自动处理为[SaShopCategory]类，可以在载入后对类名进行修改[ShopCategory]
    </a-alert>
    <sa-table
      ref="crudRef"
      :options="options"
      :columns="columns"
      :searchForm="searchForm"
      @selection-change="handlerSelection">
      <!-- 搜索表单 start -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item field="name" label="表名称">
            <a-input v-model="searchForm.name" placeholder="请输入数据表名称" allow-clear />
          </a-form-item>
        </a-col>
      </template>
      <!-- 搜索表单 end -->
      <template #tableBeforeButtons>
        <a-input-group>
          <a-select
            placeholder="切换数据源"
            v-model="sourceName"
            :options="dataSourceList"
            style="width: 300px"></a-select>
          <a-button type="primary" @click="switchSource">确定切换</a-button>
        </a-input-group>
      </template>
    </sa-table>
  </a-modal>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import api from '@/api/system/database'
import generate from '@/api/tool/generate'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const selecteds = ref([])
const visible = ref(false)
const sourceName = ref('mysql')
const newName = ref({})
const newComment = ref({})
const emit = defineEmits(['success'])

const searchForm = ref({
  name: '',
  source: '',
})

const dataSourceList = ref([])

const switchSource = () => {
  searchForm.value.source = sourceName.value
  options.api = api.getPageList
  crudRef.value.refresh()
}

const loadTable = async (done) => {
  if (selecteds.value.length < 1) {
    Message.info('至少要选择一条数据')
    done(false)
    return
  }
  let names = []
  crudRef.value.getTableData().filter((item) => {
    if (selecteds.value.includes(item.name)) {
      names.push({ name: item.name, comment: item.comment, sourceName: item.name })
    }
  })
  names.map((item) => {
    if (newComment.value[item.sourceName]) {
      item.comment = newComment.value[item.sourceName]
    }
    if (newName.value[item.name]) {
      item.name = newName.value[item.name]
    }
  })
  const response = await generate.loadTable({ source: sourceName.value, names })
  if (response.code === 200) {
    Message.success('装载成功')
    emit('success')
    selecteds.value = []
    done(true)
  }
}

const handlerSelection = (name) => {
  selecteds.value = name
}

const open = async () => {
  visible.value = true
  const response = await api.getDataSource()
  dataSourceList.value = response.data.map((item) => {
    return { label: item, value: item }
  })
  sourceName.value = dataSourceList.value[0] ? dataSourceList.value[0].value : ''
  nextTick(() => {
    switchSource()
  })
}

const options = reactive({
  pk: 'name',
  api: api.getPageList,
  height: 670,
  showIndex: true,
  showSort: false,
  operationColumn: false,
  rowSelection: { showCheckedAll: true, key: 'name', onlyCurrent: true },
})

const columns = reactive([
  { title: '表名称', dataIndex: 'name', align: 'left', width: 200 },
  { title: '表注释', dataIndex: 'comment', align: 'left', width: 180 },
  { title: '引擎', dataIndex: 'engine', width: 150 },
  { title: '编码', dataIndex: 'collation', width: 180 },
  { title: '创建时间', dataIndex: 'create_time' },
])

defineExpose({ open })
</script>
