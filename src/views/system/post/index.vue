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
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import post from '@/api/system/post'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const changeStatus = async (status, id) => {
    const response = await post.changeStatus({ id, status })
    if (response.code === 200) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: post.getPageList,
    recycleApi: post.getRecyclePageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 200,
    add: { show: true, api: post.save, auth: ['/core/post/save'] },
    edit: { show: true, api: post.update, auth: ['/core/post/update'] },
    delete: {
      show: true,
      api: post.deletes, auth: ['/core/post/destroy'],
      realApi: post.realDestroy, realAuth: ['/core/menu/realDestroy']
    },
    recovery: { show: true, api: post.recoverys, auth: ['/core/post/recovery']},
    import: { show: true, url: '/core/post/import', templateUrl: '/core/post/downloadTemplate', auth: ['/core/post/import'] },
	  export: { show: true, url: '/core/post/export', auth: ['/core/post/export'] },
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { 
      title: '岗位名称', dataIndex: 'name', search: true, width: 150,
      commonRules: [{ required: true, message: '岗位名称必填' }]
    },
    { 
      title: '岗位标识', dataIndex: 'code', search: true, width: 150,
      commonRules: [{ required: true, message: '岗位标识必填' }],
    },
    {
      title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
      min: 0, max: 1000
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'label', value: 'value' } },
      addDefaultValue: '1', width: 150,
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'create_time', addDisplay: false, editDisplay: false,
      search: true, formType: 'range', width: 180,
    },
  ])
</script>

<script>
export default { name: 'system:post' }
</script>

<style scoped>

</style>