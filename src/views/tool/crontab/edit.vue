<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="tool.getDevice() === 'mobile' ? '100%' : '700px'"
    :title="title"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="任务名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入任务名称" />
      </a-form-item>
      <a-form-item label="任务类型" field="type">
        <a-select v-model="formData.type" :options="types" placeholder="请选择任务类型" />
      </a-form-item>
      <a-form-item label="定时规则" field="task_style">
        <a-space>
          <a-select v-model="formData.task_style" :style="{ width: '100px' }">
            <a-option :value="1">每天</a-option>
            <a-option :value="2">每小时</a-option>
            <a-option :value="3">N小时</a-option>
            <a-option :value="4">N分钟</a-option>
            <a-option :value="5">N秒</a-option>
            <a-option :value="6">每周</a-option>
            <a-option :value="7">每月</a-option>
            <a-option :value="8">每年</a-option>
          </a-select>
          <template v-if="formData.task_style == 8">
            <a-input-number v-model="formData.month" :precision="0" :min="1" :max="12" :style="{ width: '80px' }" />
            <span>月</span>
          </template>
          <template v-if="formData.task_style > 6">
            <a-input-number v-model="formData.day" :precision="0" :min="1" :max="31" :style="{ width: '80px' }" />
            <span>日</span>
          </template>
          <a-select v-if="formData.task_style == 6" v-model="formData.week" :style="{ width: '80px' }">
            <a-option :value="1">周一</a-option>
            <a-option :value="2">周二</a-option>
            <a-option :value="3">周三</a-option>
            <a-option :value="4">周四</a-option>
            <a-option :value="5">周五</a-option>
            <a-option :value="6">周六</a-option>
            <a-option :value="0">周日</a-option>
          </a-select>
          <template v-if="[1, 3, 6, 7, 8].includes(formData.task_style)">
            <a-input-number v-model="formData.hour" :precision="0" :min="0" :max="23" :style="{ width: '80px' }" />
            <span>时</span>
          </template>
          <template v-if="formData.task_style != 5">
            <a-input-number v-model="formData.minute" :precision="0" :min="0" :max="59" :style="{ width: '80px' }" />
            <span>分</span>
          </template>
          <template v-if="formData.task_style == 5">
            <a-input-number v-model="formData.second" :precision="0" :min="0" :max="59" :style="{ width: '80px' }" />
            <span>秒</span>
          </template>
        </a-space>
      </a-form-item>
      <a-form-item label="调用目标" field="target">
        <a-textarea v-model="formData.target" placeholder="请输入调用目标" />
      </a-form-item>
      <a-form-item label="任务参数" field="parameter">
        <a-textarea v-model="formData.parameter" placeholder="请输入任务参数" />
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
import api from '@/api/tool/crontab'

const emit = defineEmits(['success'])

// 引用定义
const formRef = ref()
const cronRef = ref()
const mode = ref('')
const visible = ref(false)
const loading = ref(false)

let title = computed(() => {
  return '定时任务' + (mode.value == 'add' ? '-新增' : '-编辑')
})

const types = [
  { label: 'URL任务GET', value: 1 },
  { label: 'URL任务POST', value: 2 },
  { label: '类任务', value: 3 },
]

// 表单初始值
const initialFormData = {
  id: '',
  name: '',
  type: '',
  rule: '',
  task_style: 1,
  month: 1,
  day: 1,
  week: 1,
  hour: 1,
  minute: 1,
  second: 1,
  target: '',
  parameter: '',
  status: 1,
  remark: '',
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  name: [{ required: true, message: '任务名称不能为空' }],
  type: [{ required: true, message: '任务类型不能为空' }],
  task_style: [{ required: true, message: '定时规则不能为空' }],
  target: [{ required: true, message: '调用目标不能为空' }],
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

// 提取数字
const extractNumber = (str) => {
  const match = str.match(/\d+/)
  return match ? Number.parseInt(match[0]) : 0
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
  const words = formData['rule'].split(' ')
  formData['second'] = extractNumber(words[0])
  formData['minute'] = extractNumber(words[1])
  formData['hour'] = extractNumber(words[2])
  formData['day'] = extractNumber(words[3])
  formData['month'] = extractNumber(words[4])
  formData['week'] = extractNumber(words[5])
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
