<template>
	<div class="ma-content-block lg:flex justify-between p-4">
		<!-- CRUD 组件 -->
		<ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="selectionChange">
			<!-- 表格按钮后置扩展 -->
			<template #tableAfterButtons>
				<a-button type="outline" @click="batchGenerate"
					><template #icon><icon-code /></template>生成代码</a-button
				>
				<a-button @click="() => loadTableRef.open()" type="outline" status="success"
					><template #icon><icon-export /></template>装载数据表</a-button
				>
			</template>
			<!-- 操作前置扩展 -->
			<template #operationBeforeExtend="{ record }" v-if="!isRecovery">
				<a-link @click="previewRef.open(record.id)"><icon-eye /> 预览</a-link>
				<a-popconfirm content="同步会重置字段配置生成信息，确定同步吗?" position="bottom" @ok="sync(record.id)">
					<a-link><icon-sync /> 同步</a-link>
				</a-popconfirm>
				<a-link @click="() => editRef.open(record.id)"><icon-edit /> 编辑</a-link>
				<a-link @click="generateCode(record.id)"><icon-code /> 生成代码</a-link>
			</template>
		</ma-crud>

		<load-table ref="loadTableRef" @success="selectSuccess" />

		<preview ref="previewRef" />

		<edit-info ref="editRef" @success="selectSuccess" />
	</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import generate from '@/api/setting/generate'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'

import LoadTable from './components/loadTable.vue'
import Preview from './components/preview.vue'
import EditInfo from './components/editInfo.vue'

const crudRef = ref()
const editRef = ref()
const previewRef = ref()
const loadTableRef = ref()
const selections = ref([])

const router = useRouter()

const types = [
	{ label: '单表CRUD', value: 'single' },
	{ label: '树表CRUD', value: 'tree' },
]

const selectSuccess = (result) => {
	result && crudRef.value.refresh()
}

const sync = async (id) => {
	const response = await generate.sync(id)
	response.code === 200 && Message.success(response.message)
}

const generateCode = async (ids) => {
	Message.info('代码生成下载中，请稍后')
	const response = await generate.generateCode({ ids: ids.toString().split(',') })
	if (response) {
		tool.download(response, 'saiadmin.zip')
		Message.success('代码生成成功，开始下载')
	} else {
		Message.error('文件下载失败')
	}
}

const batchGenerate = () => {
	if (selections.value.length === 0) {
		Message.error('至少要选择一条数据')
		return
	}
	generateCode(selections.value.join(','))
}

const selectionChange = (row) => (selections.value = row)

let isRecovery = computed(() => (crudRef.value ? crudRef.value.isRecovery : false))

const crud = reactive({
	api: generate.getPageList,
	recycleApi: generate.getRecyclePageList,
	beforeRequest: (params) => {
		params.orderBy = 'create_time'
		params.orderType = 'desc'
	},
	showIndex: false,
	searchColNumber: 3,
	searchLabelWidth: '75px',
	pageLayout: 'fixed',
	rowSelection: { showCheckedAll: true },
	operationColumn: true,
	operationColumnWidth: 350,
	delete: { show: true, api: generate.deletes, realApi: generate.realDestroy },
	recovery: { show: true, api: generate.recoverys },
})

const columns = reactive([
	{ title: '表名称', dataIndex: 'table_name', search: true, width: 200 },
	{ title: '表描述', dataIndex: 'table_comment', width: 200 },
	{
		title: '生成类型',
		dataIndex: 'tpl_category',
		formType: 'select',
		width: 120,
		dict: { data: types, translation: true },
	},
	{ title: '创建时间', dataIndex: 'create_time', width: 180 },
])
</script>

<script>
export default { name: 'setting:code' }
</script>

<style scoped></style>
