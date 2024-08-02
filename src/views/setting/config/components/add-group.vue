<template>
  <a-modal v-model:visible="visible" draggable width="600px" :ok-loading="loading" @cancel="close" @before-ok="submit">
    <template #title>添加配置组</template>
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="组名称（中文）" field="name">
        <a-input v-model="formData.name" placeholder="请输入组名称" />
      </a-form-item>
      <a-form-item label="组标识（英文）" field="code">
        <a-input v-model="formData.code" placeholder="请输入组标识" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-textarea v-model="formData.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import config from '@/api/setting/config'

const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const emit = defineEmits(['success'])

const open = () => {
  visible.value = true
  formRef.value.resetFields()
}

// 表单信息
const formData = reactive({
  name: '',
  code: '',
  remark: '',
})

// 验证规则
const rules = {
  name: [{ required: true, message: '组名称不能为空' }],
  code: [{ required: true, message: '组标识不能为空' }],
}

// 数据保存
const submit = async (done) => {
  const validate = await formRef.value?.validate()
  if (!validate) {
    loading.value = true
    let data = { ...formData }
    const result = await config.saveConfigGroup(data)
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

defineExpose({ open })
</script>
