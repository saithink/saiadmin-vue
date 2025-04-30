<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="tool.getDevice() === 'mobile' ? '100%' : '600px'"
    :title="title"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="岗位名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入岗位名称" />
      </a-form-item>
      <a-form-item label="岗位标识" field="code">
        <a-input v-model="formData.code" placeholder="请输入岗位标识" />
      </a-form-item>
      <a-form-item label="排序" field="sort">
        <a-input-number v-model="formData.sort" placeholder="请输入排序" />
      </a-form-item>
      <a-form-item label="状态" field="status">
        <sa-radio v-model="formData.status" dict="data_status" placeholder="请选择状态" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-textarea v-model="formData.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import api from '@/api/system/post'

const emit = defineEmits(['success'])

// 引用定义
const formRef = ref()
const mode = ref('')
const visible = ref(false)
const loading = ref(false)

let title = computed(() => {
  return '岗位管理' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单初始值
const initialFormData = {
  id: '',
  name: '',
  code: '',
  sort: 100,
  status: 1,
  remark: '',
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  name: [{ required: true, message: '岗位名称不能为空' }],
  code: [{ required: true, message: '岗位标识不能为空' }],
}

// 打开弹框
const open = async (type = 'add') => {
  mode.value = type
  // 重置表单数据
  Object.assign(formData, initialFormData)
  formRef.value.clearValidate()
  visible.value = true
  await initPage()
}

// 初始化页面数据
const initPage = async () => {}

// 设置数据
const setFormData = async (data) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      formData[key] = data[key]
    }
  }
}

// 数据保存
const submit = async (done) => {
  const validate = await formRef.value?.validate()
  if (!validate) {
    loading.value = true
    let data = { ...formData }
    let result = {}
    if (mode.value === 'add') {
      // 添加数据
      data.id = undefined
      result = await api.save(data)
    } else {
      // 修改数据
      result = await api.update(data.id, data)
    }
    if (result.code === 200) {
      Message.success('操作成功')
      emit('success')
      done(true)
    }
    // 防止连续点击提交
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  done(false)
}

// 关闭弹窗
const close = () => (visible.value = false)

defineExpose({ open, setFormData })
</script>
