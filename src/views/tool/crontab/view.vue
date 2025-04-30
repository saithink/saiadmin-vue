<template>
  <component
    is="a-drawer"
    v-model:visible="visible"
    :width="tool.getDevice() === 'mobile' ? '100%' : '60%'"
    title="查看详情"
    :footer="false">
    <!-- 详情 start -->
    <a-spin :loading="loading" class="w-full">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="编号">{{ formData?.id }}</a-descriptions-item>
        <a-descriptions-item label="岗位名称">{{ formData?.name }}</a-descriptions-item>
        <a-descriptions-item label="岗位标识">{{ formData?.code }}</a-descriptions-item>
        <a-descriptions-item label="排序">{{ formData?.sort }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <sa-dict :value="formData?.status" dict="data_status" render="span" />
        </a-descriptions-item>
        <a-descriptions-item label="备注">{{ formData?.remark }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <!-- 详情 end -->
  </component>
</template>

<script setup>
import { ref, reactive } from 'vue'
import tool from '@/utils/tool'
import api from '@/api/system/post'

const emit = defineEmits(['success'])

// 引用定义
const rowData = ref()
const formData = ref()
const visible = ref(false)
const loading = ref(false)

// 打开弹框
const open = async (record) => {
  rowData.value = record
  formData.value = {}
  visible.value = true
  await initPage()
}

// 初始化页面数据
const initPage = async () => {
  loading.value = true
  const resp = await api.read(rowData.value?.id)
  if (resp.code === 200) {
    formData.value = resp.data
  }
  loading.value = false
}

defineExpose({ open })
</script>
