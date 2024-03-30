<template>
	<div class="ma-content-block lg:flex justify-between p-4">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 状态列 -->
			<template #status="{ record }">
				<a-switch :checked-value="1" unchecked-value="2" @change="changeStatus($event, record.id)" :default-checked="record.status == 1" />
			</template>
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/news/category'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()

const changeStatus = async (status, id) => {
	const response = await api.changeStatus({ id, status })
	if (response.code === 200) {
		Message.success(response.message)
	}
}

const crud = reactive({
	api: api.getPageList,
	recycleApi: api.getRecyclePageList,
	showIndex: false,
	searchColNumber: 3,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 160,
	add: { show: true, api: api.save, auth: ['/news/category/save'] },
	edit: { show: true, api: api.update, auth: ['/news/category/update'] },
	delete: { show: true, api: api.delete, auth: ['/news/category/destroy'] },
	recovery: { show: true, api: api.recovery, auth: ['/news/category/recovery'] },
	formOption: { width: 800 },
})

const columns = reactive([
	{
		title: '编号',
		dataIndex: 'id',
		width: 180,
		search: false,
		addDisplay: false,
		editDisplay: false,
		hide: true,
		formType: 'input',
		commonRules: [{ required: true, message: '编号必填' }],
	},
	{
		title: '父级ID',
		dataIndex: 'parent_id',
		width: 100,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'treeSelect',
		dict: { url: '/news/category/index?tree=true' },
		editDefaultValue: (record) => {
			return record.parent_id == 0 ? undefined : record.parent_id
		},
	},
	{
		title: '分类标题',
		dataIndex: 'category_name',
		width: 180,
		search: true,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: true, message: '分类标题必填' }],
	},
	{
		title: '分类简介',
		dataIndex: 'describe',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'textarea',
		commonRules: [{ required: false, message: '分类简介必填' }],
	},
	{
		title: '分类图片',
		dataIndex: 'image',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'upload',
		type: 'image',
		returnType: 'url',
		multiple: false,
		commonRules: [{ required: false, message: '分类图片必填' }],
	},
	{
		title: '排序',
		dataIndex: 'sort',
		width: 180,
		search: false,
		addDisplay: true,
		addDefaultValue: 100,
		editDisplay: true,
		hide: false,
		formType: 'inputNumber',
		commonRules: [{ required: false, message: '排序必填' }],
	},
	{
		title: '状态',
		dataIndex: 'status',
		width: 100,
		search: false,
		addDisplay: true,
		addDefaultValue: 1,
		editDisplay: true,
		hide: false,
		dict: { name: 'data_status', props: { label: 'label', value: 'value' } },
		formType: 'radio',
		commonRules: [{ required: false, message: '状态必填' }],
	},
	{
		title: '创建者',
		dataIndex: 'created_by',
		width: 180,
		search: false,
		addDisplay: false,
		editDisplay: false,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '创建者必填' }],
	},
	{
		title: '更新者',
		dataIndex: 'updated_by',
		width: 180,
		search: false,
		addDisplay: false,
		editDisplay: false,
		hide: true,
		formType: 'input',
		commonRules: [{ required: false, message: '更新者必填' }],
	},
	{
		title: '创建时间',
		dataIndex: 'create_time',
		width: 180,
		search: true,
		addDisplay: false,
		editDisplay: false,
		hide: false,
		searchFormType: 'range',
		showTime: true,
		formType: 'date',
		commonRules: [{ required: false, message: '创建时间必填' }],
	},
	{
		title: '修改时间',
		dataIndex: 'update_time',
		width: 180,
		search: false,
		addDisplay: false,
		editDisplay: false,
		hide: true,
		searchFormType: 'range',
		showTime: true,
		formType: 'date',
		commonRules: [{ required: false, message: '修改时间必填' }],
	},
])
</script>
