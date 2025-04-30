<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="800"
    :title="'参数配置' + (mode == 'add' ? '-新增' : '-编辑')"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="配置组" field="group_id">
        <a-select
          v-model="formData.group_id"
          :options="groupData"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择配置组"
          disabled />
      </a-form-item>
      <a-form-item label="配置标题" field="name">
        <a-input v-model="formData.name" placeholder="请输入配置标题" />
      </a-form-item>
      <a-form-item label="配置标识" field="key">
        <a-input v-model="formData.key" placeholder="请输入配置标识" />
      </a-form-item>
      <a-form-item label="配置值" field="value">
        <a-textarea v-model="formData.value" placeholder="请输入配置值" />
      </a-form-item>
      <a-form-item label="排序" field="sort">
        <a-input-number v-model="formData.sort" :min="0" :max="999" placeholder="请输入排序" />
      </a-form-item>
      <a-form-item label="输入组件" field="input_type">
        <a-select v-model="formData.input_type" :options="inputComponent" placeholder="请选择输入组件" />
      </a-form-item>
      <a-form-item label="配置说明" field="remark">
        <a-textarea v-model="formData.remark" placeholder="请输入备注" />
      </a-form-item>
      <a-form-item
        v-if="['select', 'radio'].includes(formData.input_type)"
        label="配置数据"
        field="config_select_data"
        extra='用于配置下拉、单选、复选的数据，格式例子：[{"label":"数据一", "value":"shuju1"},...]'>
        <ma-codeEditor v-model="formData.config_select_data" :height="200" placeholder="请输入配置数据" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '@/api/system/config'
import { inputComponent } from './js/inputType.js'
import MaCodeEditor from '@/components/ma-codeEditor/index.vue'

const emit = defineEmits(['success'])

// 引用定义
const visible = ref(false)
const loading = ref(false)
const mode = ref('')
const formRef = ref()
const groupData = ref([])

// 表单初始值
const initialFormData = {
  id: null,
  group_id: '',
  name: '',
  key: '',
  value: '',
  input_type: 'input',
  config_select_data: '',
  sort: 100,
  remark: '',
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  group_id: [{ required: true, message: '所属组不能为空' }],
  name: [{ required: true, message: '配置标题不能为空' }],
  key: [{ required: true, message: '配置标识不能为空' }],
  input_type: [{ required: true, message: '组件类型不能为空' }],
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
const initPage = async () => {
  const resp = await api.getConfigGroupList()
  groupData.value = resp.data
}

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
      if (data.config_select_data && typeof data.config_select_data === 'string') {
        data.config_select_data = data.config_select_data.replace(/\r|\n|\s/g, '')
        data.config_select_data = data.config_select_data.replace(',]', ']')
      }
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
