
<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-switch
          :checked-value="1"
          unchecked-value="2"
          @change="changeStatus($event, record.id)"
          :default-checked="record.status == 1"
        />
      </template>

      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-popconfirm content="确定立刻执行一次?" position="bottom" @ok="run(record)" >
          <a-link v-auth="['/core/crontab/run']"><icon-caret-right /> 执行一次</a-link>
        </a-popconfirm>
        <a-link @click="openLogModal(record)"><icon-history /> 日志 </a-link>
      </template>
    </ma-crud>

    <log-list ref="logsRef" />
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import crontab from '@/api/setting/crontab'
  import LogList from './logList.vue'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()
  const logsRef = ref()

  const types = [
    { label: 'URL任务GET', value: 1 },
    { label: 'URL任务POST', value: 2} ,
    { label: '类任务', value: 3 },
  ]

  const changeStatus = async (status, id) => {
    const response = await crontab.changeStatus({ id, status })
    if (response.code === 200) {
      Message.success(response.message)
    }
  }

  const run = async (row) => {
    const response = await crontab.run({ id: row.id })
    response.code === 200 && Message.success(response.message)
  }

  const openLogModal = (row) => {
    logsRef.value.open(row.id)
  }

  const crud = reactive({
    api: crontab.getPageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 280,
    add: { show: true, api: crontab.save, auth: ['/core/crontab/save'] },
    edit: { show: true, api: crontab.update, auth: ['/core/crontab/update'] },
    delete: { show: true, api: crontab.deletes, auth: ['/core/crontab/destroy'] },
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
      title: '任务名称', dataIndex: 'name', search: true, commonRules: [{ required: true, message: '任务名称必填' }],
      width: 200,
    },
    {
      title: '任务类型', dataIndex: 'type', search: true, commonRules: [{ required: true, message: '任务类型必选' }],
      dict: { data: types, translation: true }, formType: 'select', width: 150,
    },
    {
      title: '定时规则', dataIndex: 'rule', commonRules: [{ required: true, message: '定时规则必填' }],
      extra: '例如：30 */5 * * * *，代表每隔5分钟的第30秒执行任务', width: 150
    },
    {
      title: '调用目标', dataIndex: 'target', formType: 'textarea', commonRules: [{ required: true, message: '调用目标必填' }],
      width: 260,
    },
    {
      title: '任务参数', dataIndex: 'parameter', formType: 'textarea', width: 200, hide: true,
    },
    {
      title: '单次执行', dataIndex: 'singleton', formType: 'radio', addDefaultValue: 2,
      dict: { data: [{ label: '是', value: 1 }, { label: '否', value: 2 }]}, hide: true
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'label', value: 'value' } },
      addDefaultValue: 1, width: 120
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'create_time', addDisplay: false, editDisplay: false,
      search: true, formType: 'range', width: 180
    },
  ])
</script>

<script>
export default { name: 'system:crontab' }
</script>

<style scoped>

</style>
