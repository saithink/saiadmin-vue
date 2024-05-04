<template>
	<div class="ma-content-block lg:flex justify-between p-4">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef"> </ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/system/notice'

const crudRef = ref()

let isRecovery = computed(() => (crudRef.value ? crudRef.value.isRecovery : false))

const crud = reactive({
	api: api.getPageList,
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	searchColNumber: 3,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 160,
	add: { show: true, api: api.save, auth: ['/core/notice/save'] },
	edit: { show: true, api: api.update, auth: ['/core/notice/update'] },
	delete: { show: true, api: api.deletes, auth: ['/core/notice/destroy'], realApi: api.realDestroy, realAuth: ['/core/notice/realDestroy'] },
	recovery: { show: true, api: api.recoverys, auth: ['/core/notice/recovery'] },
	formOption: { width: 800 },
})

const columns = reactive([
	{ title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
	{
		title: '公告标题',
		dataIndex: 'title',
		search: true,
		width: 500,
		commonRules: [{ required: true, message: '公告标题必填' }],
	},
	{
		title: '公告类型',
		dataIndex: 'type',
		search: true,
		width: 180,
		commonRules: [{ required: true, message: '公告类型必选' }],
		formType: 'radio',
		dict: { name: 'backend_notice_type', props: { label: 'label', value: 'value' }, translation: true },
		addDefaultValue: 1,
	},
	{
		title: '接收用户',
		dataIndex: 'users',
		formType: 'user-select',
		editDisplay: false,
		hide: true,
		formExtra: '如不选择，默认将为所有用户发送',
	},
	{
		title: '公告内容',
		dataIndex: 'content',
		formType: 'editor',
		hide: true,
		commonRules: [{ required: true, message: '公告内容必填' }],
	},
	{
		title: '备注',
		dataIndex: 'remark',
		hide: true,
		formType: 'textarea',
	},
	{
		title: '创建时间',
		dataIndex: 'create_time',
		addDisplay: false,
		editDisplay: false,
		search: true,
		formType: 'range',
		width: 180,
	},
])
</script>

<script>
export default { name: 'system:post' }
</script>

<style scoped></style>
