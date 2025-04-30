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
      <a-form-item field="parent_id" label="上级部门">
        <a-tree-select
          v-model="formData.parent_id"
          :data="deptData"
          :field-names="{ key: 'value', title: 'label' }"
          allow-clear
          placeholder="请选择上级部门">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="部门名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入部门名称" />
      </a-form-item>
      <a-form-item label="排序数字" field="sort">
        <a-input-number v-model="formData.sort" placeholder="请输入排序数字" />
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
import { useUserStore } from '@/store'
import commonApi from '@/api/common'
import tool from '@/utils/tool'
import api from '@/api/system/dept'

const emit = defineEmits(['success'])

// 引用定义
const formRef = ref()
const mode = ref('')
const visible = ref(false)
const loading = ref(false)
const userStore = useUserStore()
const userInfo = reactive({
  ...userStore.user,
})
const deptData = ref([])

let title = computed(() => {
  return '部门管理' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单初始值
const initialFormData = {
  id: '',
  parent_id: '',
  level: '',
  name: '',
  status: 1,
  sort: 100,
  remark: '',
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  parent_id: [{ required: true, message: '上级部门不能为空' }],
  name: [{ required: true, message: '部门名称不能为空' }],
}

// 初始化页面数据
const initPage = async () => {
  const resp = await await commonApi.commonGet('/core/dept/index?tree=true&filter=false')
  if (userInfo.id === 1) {
    deptData.value = [{ label: '无上级部门', value: 0, children: resp.data }]
  } else {
    deptData.value = resp.data
  }
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
