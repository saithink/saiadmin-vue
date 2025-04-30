<template>
  <a-layout-content class="flex flex-col lg:h-full relative w-full">
    <a-card :bordered="false">
      <div ref="crudHeaderRef">
        <template v-if="showSearch">
          <a-row v-if="tool.getDevice() === 'mobile'">
            <a-col :xs="24" :sm="8">
              <a-form :model="searchForm" ref="searchFormRef" :auto-label-width="true">
                <a-row :gutter="10">
                  <slot name="tableSearch"></slot>
                </a-row>
              </a-form>
            </a-col>
            <a-col :xs="24" :sm="8" :style="{ textAlign: 'right', marginBottom: '15px' }">
              <a-space direction="horizontal" :size="20">
                <a-button type="primary" @click="search">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ options.searchText || '搜索' }}
                </a-button>
                <a-button @click="resetSearch">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ options.resetText || '重置' }}
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-row v-else>
            <a-col :flex="1">
              <a-form :model="searchForm" ref="searchFormRef" :auto-label-width="true">
                <a-row :gutter="10">
                  <slot name="tableSearch"></slot>
                </a-row>
              </a-form>
            </a-col>
            <a-divider v-if="!singleLine" style="height: 84px" direction="vertical" />
            <a-col :flex="singleLine ? '185px' : '80px'" :style="{ textAlign: 'right' }">
              <a-space :direction="!singleLine ? 'vertical' : 'horizontal'" :size="singleLine ? 10 : 20">
                <a-button type="primary" @click="search">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ options.searchText || '搜索' }}
                </a-button>
                <a-button @click="resetSearch">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ options.resetText || '重置' }}
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-divider style="margin-top: 0; margin-bottom: 15px" />
        </template>
      </div>
      <div class="_crud-content">
        <a-row style="margin-bottom: 10px" v-if="!options.pageSimple">
          <a-col :xs="24" :sm="18">
            <a-space :wrap="true">
              <slot name="tableBeforeButtons"></slot>
              <a-button type="primary" v-if="options.add.show" v-auth="options.add.auth || []" @click="addAction">
                <template #icon> <icon-plus /> </template> {{ options.add.text || '新增' }}
              </a-button>
              <a-popconfirm
                content="确定要删除数据吗?"
                position="bottom"
                @ok="deletesMultipleAction"
                v-if="options.delete.show && options.rowSelection">
                <a-button type="primary" status="danger" v-auth="options.delete.auth || []">
                  <template #icon> <icon-delete /> </template> {{ options.delete.text || '删除' }}
                </a-button>
              </a-popconfirm>
              <a-button v-if="options.import.show" v-auth="options.import.auth || []" @click="importAction">
                <template #icon> <icon-upload /> </template> {{ options.import.text || '导入' }}
              </a-button>
              <a-button
                v-if="options.export.show"
                :loading="isExport"
                v-auth="options.export.auth || []"
                @click="exportAction">
                <template #icon> <icon-download /> </template> {{ options.export.text || '导出' }}
              </a-button>
              <a-button type="secondary" @click="handlerExpand" v-if="options.isExpand">
                <template #icon>
                  <icon-expand v-if="!expandState" />
                  <icon-shrink v-else />
                </template>
                {{ expandState ? ' 折叠' : ' 展开' }}
              </a-button>
              <slot name="tableAfterButtons"></slot>
            </a-space>
          </a-col>
          <a-col
            :xs="24"
            :sm="6"
            :style="{ textAlign: 'right', marginTop: tool.getDevice() === 'mobile' ? '15px' : '0' }">
            <a-space v-if="options.showTools">
              <slot name="tools"></slot>
              <a-tooltip content="刷新表格" @click="refresh">
                <a-button shape="circle"><icon-refresh /></a-button>
              </a-tooltip>
              <a-tooltip content="显隐搜索">
                <a-button shape="circle" @click="searchChange"><icon-search /> </a-button>
              </a-tooltip>
              <a-tooltip content="打印表格"
                ><a-button shape="circle" @click="printTable"><icon-printer /></a-button
              ></a-tooltip>
              <a-tooltip content="字段排序" v-if="options.showSort">
                <a-popover trigger="click" position="br">
                  <a-button shape="circle"><icon-sort /></a-button>
                  <template #content>
                    <div id="tableSetting">
                      <div v-for="(item, index) in columns" :key="item.dataIndex" class="setting">
                        <div style="margin-right: 4px">
                          <icon-sort-ascending />
                        </div>
                        <div>
                          <a-checkbox v-model="item.checked" @change="handleChange($event, item, index)"> </a-checkbox>
                        </div>
                        <div class="title">
                          {{ item.title === '#' ? '序列号' : item.title }}
                        </div>
                      </div>
                    </div>
                  </template>
                </a-popover>
              </a-tooltip>
            </a-space>
          </a-col>
        </a-row>
        <div ref="crudContentRef">
          <slot name="crudContent" v-bind="tableData">
            <a-table
              v-bind="$attrs"
              ref="tableRef"
              :key="options.pk"
              :rowSelection="options.rowSelection ?? undefined"
              :row-key="options.rowSelection?.key ?? options.pk"
              :pagination="false"
              :columns="columns"
              :loading="loading"
              :size="options.size"
              :stripe="options.stripe"
              :data="tableData.data"
              :scroll="{ x: '100%', y: '100%' }"
              :bordered="options.bordered"
              :default-expand-all-rows="options.expandAllRows"
              :summary="options.showSummary && __summary"
              @selection-change="setSelecteds"
              @sorter-change="handlerSort">
              <template #columns>
                <template v-for="(row, index) in columns" :key="index">
                  <template v-if="row.children">
                    <a-table-column :title="row.title">
                      <template v-for="(rowChild, indexChild) in row.children">
                        <a-table-column
                          :title="rowChild.title"
                          :data-index="rowChild.dataIndex"
                          :width="rowChild.width"
                          :min-width="rowChild.minWidth"
                          :ellipsis="rowChild.ellipsis ?? true"
                          :filterable="rowChild.filterable"
                          :cell-class="rowChild.cellClass"
                          :header-cell-class="rowChild.headerCellClass"
                          :body-cell-class="rowChild.bodyCellClass"
                          :summary-cell-class="rowChild.summaryCellClass"
                          :cell-style="rowChild.cellStyle"
                          :header-cell-style="rowChild.headerCellStyle"
                          :body-cell-style="rowChild.bodyCellStyle"
                          :summary-cell-style="rowChild.summaryCellStyle"
                          :tooltip="rowChild.dataIndex === '__operation' ? false : rowChild.tooltip ?? true"
                          :align="rowChild.align || options.columnAlign"
                          :fixed="rowChild.fixed"
                          :sortable="rowChild.sortable">
                          <template #cell="{ record, column, rowIndex }">
                            <template v-if="rowChild.dataIndex === '__index'">
                              <span>{{ getIndex(rowIndex) }}</span>
                            </template>
                            <template v-else-if="rowChild.dataIndex === '__operation'">
                              <a-scrollbar type="track" style="overflow: auto">
                                <a-space size="mini">
                                  <slot name="operationBeforeExtend" v-bind="{ record, column, rowIndex }"></slot>
                                  <slot name="operationCell" v-bind="{ record, column, rowIndex }">
                                    <a-link
                                      v-if="options.edit.show"
                                      v-auth="options.edit.auth || []"
                                      type="primary"
                                      @click="editAction(record)">
                                      <icon-edit />{{ options.edit.text || '编辑' }}
                                    </a-link>
                                    <a-popconfirm
                                      v-if="options.delete.show"
                                      content="确定要删除该数据吗?"
                                      position="bottom"
                                      @ok="deleteAction(record)">
                                      <a-link type="primary" v-auth="options.delete.auth || []">
                                        <icon-delete /> {{ options.delete.text || '删除' }}
                                      </a-link>
                                    </a-popconfirm>
                                  </slot>
                                  <slot name="operationAfterExtend" v-bind="{ record, column, rowIndex }"></slot>
                                </a-space>
                              </a-scrollbar>
                            </template>
                            <slot
                              v-else-if="rowChild.type === 'dict'"
                              :name="rowChild.dataIndex"
                              v-bind="{ record, column, rowIndex }">
                              <sa-dict
                                :value="record[rowChild.dataIndex]"
                                :render="rowChild.render || 'tag'"
                                :colors="rowChild.colors || []"
                                :dict="rowChild.dict || []"
                                :options="rowChild.options ?? []">
                              </sa-dict>
                            </slot>
                            <template v-else-if="rowChild.type === 'image'">
                              <a-avatar
                                @click="imageSee(rowChild, record, rowChild.dataIndex)"
                                :size="row.size || 64"
                                shape="square">
                                <img
                                  :src="imageView(record[rowChild.dataIndex])"
                                  style="object-fit: contain; cursor: pointer" />
                              </a-avatar>
                            </template>
                            <slot v-else :name="rowChild.dataIndex" v-bind="{ record, column, rowIndex }">
                              <span>{{ filterColumn(rowChild.dataIndex, record) }}</span>
                            </slot>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table-column>
                  </template>
                  <a-table-column
                    v-else
                    :title="row.title"
                    :data-index="row.dataIndex"
                    :width="row.width"
                    :ellipsis="row.ellipsis ?? true"
                    :filterable="row.filterable"
                    :cell-class="row.cellClass"
                    :header-cell-class="row.headerCellClass"
                    :body-cell-class="row.bodyCellClass"
                    :summary-cell-class="row.summaryCellClass"
                    :cell-style="row.cellStyle"
                    :header-cell-style="row.headerCellStyle"
                    :body-cell-style="row.bodyCellStyle"
                    :summary-cell-style="row.summaryCellStyle"
                    :tooltip="row.dataIndex === '__operation' ? false : row.tooltip ?? true"
                    :align="row.align || options.columnAlign"
                    :fixed="row.fixed"
                    :sortable="row.sortable">
                    <template #cell="{ record, column, rowIndex }">
                      <template v-if="row.dataIndex === '__index'">
                        <span>{{ getIndex(rowIndex) }}</span>
                      </template>
                      <template v-else-if="row.dataIndex === '__operation'">
                        <a-scrollbar type="track" style="overflow: auto">
                          <a-space size="mini">
                            <slot name="operationBeforeExtend" v-bind="{ record, column, rowIndex }"></slot>
                            <slot name="operationCell" v-bind="{ record, column, rowIndex }">
                              <a-link
                                v-if="options.view.show"
                                v-auth="options.view.auth || []"
                                type="primary"
                                @click="viewAction(record)">
                                <icon-eye />{{ options.view.text || '查看' }}
                              </a-link>
                              <a-link
                                v-if="options.edit.show"
                                v-auth="options.edit.auth || []"
                                type="primary"
                                @click="editAction(record)">
                                <icon-edit />{{ options.edit.text || '编辑' }}
                              </a-link>
                              <a-popconfirm
                                v-if="options.delete.show"
                                content="确定要删除该数据吗?"
                                position="bottom"
                                @ok="deleteAction(record)">
                                <a-link type="primary" v-auth="options.delete.auth || []">
                                  <icon-delete /> {{ options.delete.text || '删除' }}
                                </a-link>
                              </a-popconfirm>
                            </slot>
                            <slot name="operationAfterExtend" v-bind="{ record, column, rowIndex }"></slot>
                          </a-space>
                        </a-scrollbar>
                      </template>
                      <slot v-else-if="row.type === 'dict'" :name="row.dataIndex" v-bind="{ record, column, rowIndex }">
                        <sa-dict
                          :value="record[row.dataIndex]"
                          :render="row.render || 'tag'"
                          :colors="row.colors || []"
                          :dict="row.dict || []"
                          :options="row.options ?? []">
                        </sa-dict>
                      </slot>
                      <template v-else-if="row.type === 'image'">
                        <a-avatar @click="imageSee(row, record, row.dataIndex)" :size="row.size || 64" shape="square">
                          <img :src="imageView(record[row.dataIndex])" style="object-fit: contain; cursor: pointer" />
                        </a-avatar>
                      </template>
                      <slot v-else :name="row.dataIndex" v-bind="{ record, column, rowIndex }">
                        <span>{{ filterColumn(row.dataIndex, record) }}</span>
                      </slot>
                    </template>
                  </a-table-column>
                </template>
              </template>
              <template #summary-cell="{ column, record, rowIndex }" v-if="options.showSummary">
                <slot name="summaryCell" v-bind="{ record, column, rowIndex }">{{ record[column.dataIndex] }}</slot>
              </template>
            </a-table>
          </slot>
        </div>
      </div>
      <div class="mt-2 text-right" v-if="tableData.total > 0">
        <a-pagination
          :total="tableData.total"
          show-total
          show-jumper
          show-page-size
          :page-size-options="options.pageSizeOption"
          @page-size-change="pageSizeChangeHandler"
          @change="pageChangeHandler"
          v-model:current="requestParams['page']"
          :page-size="requestParams['limit']"
          style="display: inline-flex" />
      </div>
    </a-card>

    <sa-import ref="crudImportRef" @success="refresh" />

    <a-image-preview-group
      :srcList="imgUrl"
      v-model:visible="imgVisible"
      v-if="typeof imgUrl === 'object' && imgUrl !== null" />
    <a-image-preview :src="imgUrl" v-model:visible="imgVisible" v-else />
  </a-layout-content>
</template>

<script setup>
import { ref, reactive, watch, provide, nextTick, onMounted, onUnmounted } from 'vue'
import { isArray, isFunction, isObject, isUndefined, cloneDeep, get } from 'lodash'
import defaultOptions from './defaultOptions'
import tool from '@/utils/tool'
import Print from '@/utils/print'
import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import { useDictStore } from '@/store'
import SaImport from './import.vue'

const props = defineProps({
  // 表格数据
  data: { type: [Function, Array], default: () => null },
  // 表格设置
  options: { type: Object, default: {} },
  // 字段
  columns: { type: Array, default: [] },
  // 搜索表单
  searchForm: { type: Object, default: () => {} },
})

const emit = defineEmits(['resetSearch'])

const searchFormRef = ref()
const crudHeaderRef = ref()
const crudContentRef = ref()
const headerHeight = ref(0)
const crudImportRef = ref()
const loading = ref(false)
const showSearch = ref(true)
const singleLine = ref(true)
const currentApi = ref()
const expandState = ref(false)
const selecteds = ref([])
const tableRef = ref()
const isSort = ref(false)
const isExport = ref(false)

const imgVisible = ref(false)
const imgUrl = ref(import.meta.env.VITE_APP_BASE + 'not-image.png')

const options = ref(Object.assign(JSON.parse(JSON.stringify(defaultOptions)), props.options))

const requestParams = ref({
  page: 1,
  limit: options.value.pageSize,
})

const searchForm = ref(props.searchForm)
const columns = ref(props.columns)

const tableData = reactive({
  total: 0,
  data: [],
})

provide('options', options.value)

const filterColumn = (index, record) => {
  return index.indexOf('.') > -1 ? get(record, index) : record[index]
}

const clearSelected = () => {
  tableRef.value?.selectAll(false)
}

const setSelecteds = (key) => {
  selecteds.value = key
}

const getTableData = () => {
  return tableData.data
}

const getTableTotal = () => {
  return tableData.total
}

const __summary = ({ data }) => {
  if (options.value.showSummary && isArray(options.value.summary)) {
    const summary = options.value.summary
    let summaryData = {}
    let summaryPrefixText = {}
    let summarySuffixText = {}
    let length = data.length || 0
    summary.map((item) => {
      if (item.action && item.action === 'text') {
        summaryData[item.dataIndex] = item.text
      } else {
        summaryData[item.dataIndex] = 0
        summaryPrefixText[item.dataIndex] = item?.prefixText ?? ''
        summarySuffixText[item.dataIndex] = item?.suffixText ?? ''
        data.map((record) => {
          if (record[item.dataIndex]) {
            if (item.action && item.action === 'sum') {
              summaryData[item.dataIndex] += parseFloat(record[item.dataIndex])
            }
            if (item.action && item.action === 'avg') {
              summaryData[item.dataIndex] += parseFloat(record[item.dataIndex]) / length
            }
          }
        })
      }
    })

    for (let i in summaryData) {
      if (/^\d+(\.\d+)?$/.test(summaryData[i])) {
        summaryData[i] = summaryPrefixText[i] + tool.groupSeparator(summaryData[i].toFixed(2)) + summarySuffixText[i]
      }
    }
    return [summaryData]
  }
}

const getIndex = (rowIndex) => {
  const index = rowIndex + 1
  if (requestParams.value['page'] === 1) {
    return index
  } else {
    return (requestParams.value['page'] - 1) * requestParams.value['limit'] + index
  }
}

// 页码变化
const pageChangeHandler = async (currentPage) => {
  requestParams.value['page'] = currentPage
  await refresh()
}

// 每页数量变化
const pageSizeChangeHandler = async (pageSize) => {
  requestParams.value['page'] = 1
  requestParams.value['limit'] = pageSize
  await refresh()
}

// 搜索
const search = async () => {
  await refresh()
}

// 重置
const resetSearch = async () => {
  searchFormRef.value?.resetFields()
  emit('resetSearch')
  await refresh()
}

// 折叠/展开
const handlerExpand = () => {
  expandState.value = !expandState.value
  expandState.value ? tableRef.value.expandAll(true) : tableRef.value.expandAll(false)
}

// 排序
const handlerSort = async (name, type) => {
  if (type) {
    requestParams.value.orderBy = name
    requestParams.value.orderType = type === 'ascend' ? 'asc' : 'desc'
    isSort.value = true
  } else {
    requestParams.value.orderBy = undefined
    requestParams.value.orderType = undefined
    isSort.value = false
  }
  await refresh()
}

// 切换显示搜素框
const searchChange = async () => {
  showSearch.value = !showSearch.value
  await nextTick(() => {
    headerHeight.value = crudHeaderRef.value.offsetHeight
    options.value.pageLayout === 'fixed' && settingFixedPage()
  })
}

// 打印表格
const printTable = () => {
  new Print(crudContentRef.value)
}

// 排序
const handleChange = (checked, column, index) => {
  if (column.dataIndex == '__operation') {
    return
  }
  if (checked) {
    column.sortable = {
      sortDirections: ['ascend', 'descend'],
    }
  } else {
    column.sortable = undefined
  }
}

// 初始化
const init = async () => {
  // 设置 组件id
  if (isUndefined(options.value.id)) {
    options.value.id = 'SaCrud_' + Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
  }

  // 设置序列号
  if (options.value.showIndex && columns.value.length > 0 && columns.value[0].dataIndex !== '__index') {
    columns.value.unshift({
      title: options.value.indexLabel,
      dataIndex: '__index',
      width: options.value.indexColumnWidth,
      fixed: options.value.indexColumnFixed,
    })
  }

  // 收集数据
  if (
    columns.value.length > 0 &&
    columns.value[columns.value.length - 1].dataIndex !== '__operation' &&
    options.value.operationColumn
  ) {
    columns.value?.push({
      title: options.value.operationColumnText || '操作',
      dataIndex: '__operation',
      slotName: '__operation',
      align: 'center',
      fixed: 'right',
      width: options.value.operationColumnWidth ?? 150,
    })
  }
  columns.value.forEach((element) => {
    if (element.sortable) {
      element.checked = true
    }
  })
  if (isSort.value) {
    const fromSearch = cloneDeep(searchForm.value)
    if (!isUndefined(fromSearch.orderBy)) {
      delete fromSearch.orderBy
      delete fromSearch.orderType
    }
    requestParams.value = Object.assign(requestParams.value, fromSearch)
  } else {
    requestParams.value = Object.assign(requestParams.value, searchForm.value)
  }
  if (options.value.singleLine) {
    singleLine.value = options.value.singleLine
  } else {
    singleLine.value = Object.getOwnPropertyNames(props.searchForm).length > 3 ? false : true
  }
  currentApi.value = options.value.api
}

const refresh = async () => {
  await requestData()
  //tableRef.value?.selectAll(false)
}

const requestData = async () => {
  loading.value = true
  init()
  if (isFunction(currentApi.value)) {
    const response = await currentApi.value(requestParams.value)
    if (response.data && response.data.data) {
      tableData.total = response.data.total
      tableData.data = response.data.data
    } else {
      tableData.total = 0
      tableData.data = response.data
    }
  } else {
    console.error(`sa-table error：crud.api is not Function.`)
  }
  loading.value = false
}

// 添加操作
const addAction = () => {
  if (options.value.add.func && isFunction(options.value.add.func)) {
    options.value.add.func()
  } else {
    console.error(`sa-table error：crud.add.func is not Function.`)
  }
}

// 编辑操作
const editAction = (record) => {
  if (options.value.edit.func && isFunction(options.value.edit.func)) {
    options.value.edit.func(record)
  } else {
    console.error(`sa-table error：crud.edit.func is not Function.`)
  }
}

// 查看操作
const viewAction = (record) => {
  if (options.value.view.func && isFunction(options.value.view.func)) {
    options.value.view.func(record)
  } else {
    console.error(`sa-table error：crud.view.func is not Function.`)
  }
}

// 删除操作
const deleteAction = async (record) => {
  const params = { ids: [record[options.value.pk]] }
  if (options.value.delete.func && isFunction(options.value.delete.func)) {
    options.value.delete.func(params)
  } else {
    console.error(`sa-table error：crud.delete.func is not Function.`)
  }
}

// 批量删除
const deletesMultipleAction = async () => {
  const params = { ids: selecteds.value }
  if (selecteds.value && selecteds.value.length > 0) {
    // 删除
    if (options.value.delete.func && isFunction(options.value.delete.func)) {
      options.value.delete.func(params)
      tableRef.value?.selectAll(false)
    } else {
      console.error(`sa-table error：crud.delete.func is not Function.`)
    }
  } else {
    Message.error('至少选择一条数据')
  }
}

// 导入
const importAction = () => crudImportRef.value.open()

// 导出
const exportAction = () => {
  Message.info('请求服务器下载文件中...')
  const data = requestParams.value
  const download = (url) => request({ url, data, method: 'post', timeout: 60 * 1000, responseType: 'blob' })
  isExport.value = true
  download(options.value.export.url)
    .then((res) => {
      if (res && res.status == 200) {
        tool.download(res)
        Message.success('请求成功，文件开始下载')
      } else {
        Message.error('请前往服务端安装Excel导出库')
      }
    })
    .catch(() => {
      Message.error('请求服务器错误，下载失败')
    })
    .finally(() => {
      isExport.value = false
    })
}

const imageSee = async (row, record, dataIndex) => {
  imgUrl.value = record[dataIndex]
  imgVisible.value = true
}

const imageView = (url) => {
  if (typeof url === 'string' && url !== null) {
    return url
  } else {
    if (url !== null) {
      return url[0]
    } else {
      return import.meta.env.VITE_APP_BASE + 'not-image.png'
    }
  }
}

const resizeHandler = () => {
  headerHeight.value = crudHeaderRef.value.offsetHeight
  settingFixedPage()
}

const settingFixedPage = () => {
  const workAreaHeight = options.value.height ? options.value.height : document.querySelector('.work-area').offsetHeight
  let tableHeight = workAreaHeight - headerHeight.value - 160 + (!showSearch.value ? 15 : 0)
  crudContentRef.value.style.height = tableHeight + 'px'
}

onMounted(async () => {
  showSearch.value = options.value.showSearch ?? true
  if (options.value.pageLayout === 'fixed') {
    await nextTick(() => {
      window.addEventListener('resize', resizeHandler, false)
      headerHeight.value = crudHeaderRef.value.offsetHeight
      settingFixedPage()
    })
  }
})

onUnmounted(() => {
  if (options.value.pageLayout === 'fixed') {
    window.removeEventListener('resize', resizeHandler, false)
  }
})

defineExpose({
  requestData,
  refresh,
  setSelecteds,
  clearSelected,
  tableRef,
  getTableData,
  getTableTotal,
})
</script>

<style lang="less" scoped>
.setting {
  display: flex;
  align-items: center;
  width: 150px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
