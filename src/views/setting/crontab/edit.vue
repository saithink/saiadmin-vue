<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="600"
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
      <a-form-item label="定时规则" field="rule" extra="例如：30 */5 * * * *，代表每隔5分钟的第30秒执行任务">
        <a-input v-model="formData.rule" placeholder="请输入定时规则" />
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
import api from '@/api/setting/crontab'

const emit = defineEmits(['success'])

// 引用定义
const formRef = ref()
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

// 表单信息
const formData = reactive({
  id: '',
  name: '',
  type: '',
  rule: '',
  target: '',
  parameter: '',
  status: 1,
  remark: '',
})

// 验证规则
const rules = {
  name: [{ required: true, message: '任务名称不能为空' }],
  type: [{ required: true, message: '任务类型不能为空' }],
  rule: [{ required: true, message: '定时规则不能为空' }],
  target: [{ required: true, message: '调用目标不能为空' }],
}

// 打开弹框
const open = async (type = 'add') => {
  mode.value = type
  visible.value = true
  formRef.value.resetFields()
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
