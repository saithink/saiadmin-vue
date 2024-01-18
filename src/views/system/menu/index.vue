<template>
	<div class="ma-content-block lg:flex justify-between p-4">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef">
			<!-- 图标列 -->
			<template #icon="{ record }">
				<component :is="record.icon" v-if="record.icon" />
			</template>
			<!-- 状态列 -->
			<template #status="{ record }">
				<a-switch :checked-value="1" unchecked-value="2" @change="changeStatus($event, record.id)" :default-checked="record.status == 1" />
			</template>

			<!-- 操作前置扩展 -->
			<template #operationBeforeExtend="{ record }">
				<a-link @click="openAdd(record.id)" v-if="record.type === 'M'" v-auth="['system:menu:save']"><icon-plus /> 新增</a-link>
			</template>
		</ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import menu from '@/api/system/menu'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const currentParentId = ref()

const menuType = [
	{ label: '菜单', value: 'M' },
	{ label: '按钮', value: 'B' },
	{ label: '外链', value: 'L' },
	{ label: 'iFrame', value: 'I' },
]

const changeStatus = async (status, id) => {
	const response = await menu.changeStatus({ id, status })
	if (response.code === 200) {
		Message.success(response.message)
	}
}

const openAdd = (id) => {
	columns[1].addDefaultValue = id
	crudRef.value.crudFormRef.add()
}

const crud = reactive({
	api: menu.getList,
	recycleApi: menu.getRecyclePageList,
	showIndex: false,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 200,
	add: { show: true, api: menu.save, auth: ['/core/menu/save'] },
	edit: { show: true, api: menu.update, auth: ['/core/menu/update'] },
	delete: { show: true, api: menu.deletes, auth: ['/core/menu/destroy'] },
	recovery: { show: true, api: menu.recoverys, auth: ['/core/menu/recovery'] },
	formOption: { viewType: 'drawer', width: 600 },
	isExpand: true,
	beforeOpenAdd: () => {
		columns[1].addDefaultValue = 0
		return true
	},
	beforeEdit: (params) => {
		delete params.children
		return true
	},
})

const columns = reactive([
	{ title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
	{
		title: '上级菜单',
		dataIndex: 'parent_id',
		hide: true,
		formType: 'tree-select',
		dict: { url: '/core/menu/index?tree=true' },
		addDefaultValue: 0,
		editDefaultValue: (record) => {
			return record.parent_id == 0 ? undefined : record.parent_id
		},
	},
	{
		title: '菜单名称',
		dataIndex: 'name',
		search: true,
		commonRules: [{ required: true, message: '菜单名称必填' }],
		width: 180,
	},
	{
		title: '菜单类型',
		dataIndex: 'type',
		formType: 'radio',
		addDefaultValue: 'M',
		width: 100,
		dict: {
			data: menuType,
			translation: true,
			tagColors: { M: 'blue', B: 'green', L: 'orangered', I: 'pinkpurple' },
		},
		control: (value) => {
			if (value == 'B') {
				return {
					icon: { display: false },
					route: { display: false },
					component: { display: false },
					redirect: { display: false },
					sort: { display: false },
					is_hidden: { display: false },
				}
			} else if (value == 'I' || value == 'L') {
				return {
					icon: { display: true },
					route: { display: true },
					component: { display: false },
					redirect: { display: false },
					sort: { display: true },
					is_hidden: { display: true },
				}
			} else {
				return {
					icon: { display: true },
					route: { display: true },
					component: { display: true },
					redirect: { display: true },
					sort: { display: true },
					is_hidden: { display: true },
				}
			}
		},
	},
	{ title: '图标', dataIndex: 'icon', width: 80, formType: 'icon-picker', style: { width: '100%' } },
	{
		title: '菜单标识',
		dataIndex: 'code',
		search: true,
		commonRules: [{ required: true, message: '菜单标识必填' }],
		width: 200,
	},
	{ title: '路由地址', dataIndex: 'route', width: 150 },
	{ title: '视图组件', dataIndex: 'component', width: 200 },
	{ title: '重定向', dataIndex: 'redirect', hide: true },
	{
		title: '排序',
		dataIndex: 'sort',
		formType: 'input-number',
		addDefaultValue: 1,
		width: 180,
		min: 0,
		max: 1000,
	},
	{
		title: '隐藏',
		dataIndex: 'is_hidden',
		search: true,
		formType: 'radio',
		dict: {
			data: [
				{ label: '是', value: '1' },
				{ label: '否', value: '2' },
			],
			translation: true,
		},
		addDefaultValue: '2',
		editDefaultValue: (form) => form.is_hidden.toString(),
		width: 80,
	},
	{
		title: '状态',
		dataIndex: 'status',
		search: true,
		formType: 'radio',
		dict: { name: 'data_status', props: { label: 'label', value: 'value' } },
		addDefaultValue: '1',
		width: 120,
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
		width: 180,
	},
])
</script>

<script>
export default { name: 'system:menu' }
</script>

<style scoped>
.icon {
	width: 1em;
}
</style>
