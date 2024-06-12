<template>
	<div class="ma-content-block lg:flex justify-between p-4">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" @row-click="openDetails" ref="crudRef"></ma-crud>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import operLog from '@/api/system/operLog'

const crudRef = ref()

const crud = reactive({
	api: operLog.getPageList,
	showIndex: false,
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	requestParams: { orderBy: 'create_time', orderType: 'desc' },
	delete: { show: true, api: operLog.deletes, auth: ['/core/logs/deleteLoginLog'] },
})

const columns = reactive([
	{ title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
	{ title: '登录用户', dataIndex: 'username', search: true, width: 150 },
	{ title: '业务名称', dataIndex: 'service_name', search: true, width: 150 },
	{ title: '路由', dataIndex: 'router', width: 240 },
	{ title: '登录IP', dataIndex: 'ip', width: 150, search: true },
	{ title: '登录地点', dataIndex: 'ip_location', width: 150 },
	{ title: '操作时间', dataIndex: 'create_time', width: 180, search: true, formType: 'range' },
])
</script>

<script>
export default { name: 'system:operLog' }
</script>

<style scoped>
:deep(.arco-collapse-item-content) {
	padding-left: 10px;
	padding-right: 10px;
}
</style>
