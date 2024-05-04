<template>
	<div class="ma-content-block lg:flex justify-between p-4">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 状态列 -->
			<template #status="{ record }">
				<a-switch :checked-value="1" :unchecked-value="2" @change="changeStatus($event, record.id)" :default-checked="record.status == 1" />
			</template>
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import api from '@/api/news/article'
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
	add: { show: true, api: api.save, auth: ['/news/article/save'] },
	edit: { show: true, api: api.update, auth: ['/news/article/update'] },
	delete: { show: true, api: api.delete, auth: ['/news/article/destroy'], realApi: api.realDestroy, realAuth: ['/news/article/realDestroy'] },
	recovery: { show: true, api: api.recovery, auth: ['/news/article/recovery'] },
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
		title: '文章分类',
		dataIndex: 'category_id',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'treeSelect',
		dict: { url: '/news/category/index?tree=true' },
		validateTrigger: 'focus',
		commonRules: [{ required: true, message: '文章分类必填' }],
	},
	{
		title: '文章标题',
		dataIndex: 'title',
		width: 180,
		search: true,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: true, message: '文章标题必填' }],
	},
	{
		title: '文章作者',
		dataIndex: 'author',
		width: 180,
		search: true,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: true, message: '文章作者必填' }],
	},
	{
		title: '文章封面',
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
		commonRules: [{ required: false, message: '文章封面必填' }],
	},
	{
		title: '文章简介',
		dataIndex: 'describe',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'textarea',
		commonRules: [{ required: false, message: '文章简介必填' }],
	},
	{
		title: '文章内容',
		dataIndex: 'content',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: true,
		formType: 'editor',
		commonRules: [{ required: true, message: '文章内容必填' }],
	},
	{
		title: '浏览次数',
		dataIndex: 'views',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'inputNumber',
		commonRules: [{ required: false, message: '浏览次数必填' }],
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
		width: 180,
		search: false,
		addDisplay: true,
		addDefaultValue: 1,
		editDisplay: true,
		hide: false,
		checkedValue: 1,
		uncheckedValue: 2,
		formType: 'switch',
		commonRules: [{ required: false, message: '状态必填' }],
	},
	{
		title: '是否外链',
		dataIndex: 'is_link',
		width: 100,
		search: false,
		addDisplay: true,
		addDefaultValue: 2,
		editDisplay: true,
		hide: false,
		dict: {
			data: [
				{ label: '是', value: 1 },
				{ label: '否', value: 2 },
			],
			translation: true,
		},
		formType: 'radio',
		commonRules: [{ required: false, message: '是否外链必填' }],
	},
	{
		title: '链接地址',
		dataIndex: 'link_url',
		width: 180,
		search: false,
		addDisplay: true,
		editDisplay: true,
		hide: false,
		formType: 'input',
		commonRules: [{ required: false, message: '链接地址必填' }],
	},
	{
		title: '是否热门',
		dataIndex: 'is_hot',
		width: 100,
		search: false,
		addDisplay: true,
		addDefaultValue: 2,
		editDisplay: true,
		hide: false,
		dict: {
			data: [
				{ label: '是', value: 1 },
				{ label: '否', value: 2 },
			],
			translation: true,
		},
		formType: 'radio',
		commonRules: [{ required: false, message: '是否热门必填' }],
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
