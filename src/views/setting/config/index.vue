<template>
	<div>
		<div class="ma-content-block p-5 h-full">
			<a-tabs type="rounded" v-model:active-key="active" @delete="openDeleteModal" @change="handleChange" :updateable="true" auto-switch :editable="true">
				<template #extra>
					<a-space>
						<a-tooltip content="添加组">
							<a-button shape="round" @click="addGroupModal" type="primary" v-auth="['/core/config/save']">
								<template #icon><icon-plus /></template>
							</a-button>
						</a-tooltip>

						<a-tooltip content="管理该组配置">
							<a-button shape="round" @click="manageConfigModal" type="primary" v-auth="['/core/config/index']">
								<template #icon><icon-settings /></template>
							</a-button>
						</a-tooltip>
					</a-space>
				</template>
				<a-tab-pane v-for="(item, index) in configGroupData" :key="`${index}-${item.id}`" :title="item.name">
					<ma-form v-model="formArray[item.id]" :columns="optionsArray[item.id]" @onSubmit="submit" class="mt-3" ref="maFormRef" />
				</a-tab-pane>
			</a-tabs>
		</div>

		<a-modal v-model:visible="deleteVisible" type="warning" :on-before-ok="deleteConfigGroup">
			<template #title>危险操作</template>
			<div class="mb-2">
				确定要删除 <span class="text-red-500 underline font-black">{{ deleteGroupData.name }}</span> 配置组吗？
			</div>
			<div>
				此操作会删除组和所属组配置项，如果执行请在下面输入框输入：<span class="text-red-500">{{ deleteGroupData.name }}</span>
			</div>
			<a-input :placeholder="`请输入 ${deleteGroupData.name}`" class="mt-2" v-model="name" />
		</a-modal>

		<add-group ref="addGroupRef" @success="addGroupSuccess" />

		<manage-config ref="manageConfigRef" @close="getConfigGroupList" />
	</div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import config from '@/api/setting/config'
import { Message } from '@arco-design/web-vue'
import { auth } from '@/utils/common'
import AddGroup from './components/addGroup.vue'
import ManageConfig from './components/manageConfig.vue'

const isCreateNode = ref(false)
const active = ref('0-1')
const name = ref('')
const deleteGroupData = ref({ name: '' })
const maFormRef = ref()
const manageConfigRef = ref()
const addGroupRef = ref()
const formArray = ref([])
const optionsArray = ref([])
const configGroupData = ref([])
const deleteVisible = ref(false)

const openDeleteModal = (data) => {
	const id = data.split('-')[1]
	if (id == 1 || id == 2) {
		Message.info('该配置为系统核心配置，无法删除')
		return
	}
	deleteGroupData.value = configGroupData.value.find((item) => item.id == id)
	deleteVisible.value = true
}

const handleChange = (key) => {
	const params = key.split('-')
	maFormRef.value[params[0]].init()
	active.value = key
}

const getConfigGroupList = async () => {
	isCreateNode.value = false
	const response = await config.getConfigGroupList()
	configGroupData.value = response.data
	configGroupData.value.map(async (item) => {
		formArray.value[item.id] = {}
		optionsArray.value[item.id] = []
		await getConfigData(item.id)
	})
	isCreateNode.value = true
}

const getConfigData = async (id) => {
	const params = {
		group_id: id,
		orderBy: 'sort',
		orderType: 'desc',
	}
	const response = await config.getConfigList(params)
	let form = {}
	optionsArray.value[id] = response.data.map((item) => {
		let option = {
			title: item.name,
			dataIndex: item.key,
			formType: item.input_type,
			dict: {},
			labelWidth: '120px',
			extra: item.remark,
			tooltip: item.key,
		}
		if (item.key === 'upload_mode') {
			option = {
				title: item.name,
				dataIndex: item.key,
				formType: item.input_type,
				dict: {},
				labelWidth: '120px',
				extra: item.remark,
				tooltip: item.key,
				control: (val) => {
					if (val == 1) {
						return {
							local_root: { display: true },
							local_domain: { display: true },
							local_uri: { display: true },
							oss_accessKeyId: { display: false },
							oss_accessKeySecret: { display: false },
							oss_bucket: { display: false },
							oss_dirname: { display: false },
							oss_domain: { display: false },
							oss_endpoint: { display: false },
							qiniu_accessKey: { display: false },
							qiniu_secretKey: { display: false },
							qiniu_bucket: { display: false },
							qiniu_dirname: { display: false },
							qiniu_domain: { display: false },
							cos_secretId: { display: false },
							cos_secretKey: { display: false },
							cos_bucket: { display: false },
							cos_dirname: { display: false },
							cos_domain: { display: false },
							cos_region: { display: false },
							
						}
					}
					if (val == 2) {
						return {
							local_root: { display: false },
							local_domain: { display: false },
							local_uri: { display: false },
							oss_accessKeyId: { display: true },
							oss_accessKeySecret: { display: true },
							oss_bucket: { display: true },
							oss_dirname: { display: true },
							oss_domain: { display: true },
							oss_endpoint: { display: true },
							qiniu_accessKey: { display: false },
							qiniu_secretKey: { display: false },
							qiniu_bucket: { display: false },
							qiniu_dirname: { display: false },
							qiniu_domain: { display: false },
							cos_secretId: { display: false },
							cos_secretKey: { display: false },
							cos_bucket: { display: false },
							cos_dirname: { display: false },
							cos_domain: { display: false },
							cos_region: { display: false },
						}
					}
					if (val == 3) {
						return {
							local_root: { display: false },
							local_domain: { display: false },
							local_uri: { display: false },
							oss_accessKeyId: { display: false },
							oss_accessKeySecret: { display: false },
							oss_bucket: { display: false },
							oss_dirname: { display: false },
							oss_domain: { display: false },
							oss_endpoint: { display: false },
							qiniu_accessKey: { display: true },
							qiniu_secretKey: { display: true },
							qiniu_bucket: { display: true },
							qiniu_dirname: { display: true },
							qiniu_domain: { display: true },
							cos_secretId: { display: false },
							cos_secretKey: { display: false },
							cos_bucket: { display: false },
							cos_dirname: { display: false },
							cos_domain: { display: false },
							cos_region: { display: false },
						}
					}
					if (val == 4) {
						return {
							local_root: { display: false },
							local_domain: { display: false },
							local_uri: { display: false },
							oss_accessKeyId: { display: false },
							oss_accessKeySecret: { display: false },
							oss_bucket: { display: false },
							oss_dirname: { display: false },
							oss_domain: { display: false },
							oss_endpoint: { display: false },
							qiniu_accessKey: { display: false },
							qiniu_secretKey: { display: false },
							qiniu_bucket: { display: false },
							qiniu_dirname: { display: false },
							qiniu_domain: { display: false },
							cos_secretId: { display: true },
							cos_secretKey: { display: true },
							cos_bucket: { display: true },
							cos_dirname: { display: true },
							cos_domain: { display: true },
							cos_region: { display: true },
						}
					}
				}
			}
		}
		const allowDictType = ['select', 'radio', 'checkbox']
		if (allowDictType.includes(item.input_type)) {
			option.dict = { data: item.config_select_data }
		}
		if (item.input_type === 'switch') {
			switch (typeof item.value) {
				case 'string':
					option.checkedValue = 'true'
					option.uncheckedValue = 'false'
					break
				case 'number':
					option.checkedValue = 1
					option.uncheckedValue = 0
					break
			}
		}
		if (item.input_type === 'key-value') {
			item.value = JSON.parse(item.value)
		}
		if (/^\[/.test(item.value) && /\]$/.test(item.value) && item.input_type === 'checkbox') {
			item.value = JSON.parse(item.value)
		} else if (item.value && item.value.toString().indexOf(',') > -1 && item.input_type === 'checkbox') {
			item.value = item.value.split(',')
		}
		form[item.key] = item.value
		return option
	})
	formArray.value[id] = form
}

const manageConfigModal = () => {
	manageConfigRef.value.open(active.value.split('-')[1])
}

const addGroupModal = () => addGroupRef.value.open()
const addGroupSuccess = (result) => {
	if (result) {
		Message.success('配置组保存成功')
		getConfigGroupList()
		return
	}
	Message.success('配置组保存失败')
}

const deleteConfigGroup = async (done) => {
	if (name.value !== deleteGroupData.value.name) {
		Message.error(`输入错误，验证失败`)
		done(false)
		return
	}

	const response = await config.deleteConfigGroup({ ids: deleteGroupData.value.id })
	if (response.code === 200) {
		Message.success('配置删除成功')
		deleteGroupData.value = {}
		getConfigGroupList()
		done(true)
	}
}

const submit = async (data) => {
	if (!auth('/core/config/update')) {
		Message.info('没有权限修改配置')
		return
	}
	const response = await config.updateByKeys(data)
	if (response.code === 200) {
		Message.success(response.message)
	}
}

getConfigGroupList()
nextTick(() => maFormRef.value && maFormRef.value[0].init())
</script>
<script>
export default { name: 'setting:config' }
</script>

<style scoped></style>
