<template>
  <component
    is="a-drawer"
    v-model:visible="visible"
    :width="600"
    :title="title"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="上级菜单" field="parent_id">
        <a-tree-select
          v-model="formData.parent_id"
          :data="menuData"
          :field-names="{ key: 'id', title: 'name', children: 'children', icon: 'customIcon' }"
          allow-clear
          placeholder="请选择上级菜单">
        </a-tree-select>
      </a-form-item>
      <a-form-item label="菜单名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入菜单名称" />
      </a-form-item>
      <a-form-item label="菜单类型" field="type">
        <sa-radio v-model="formData.type" dict="menu_type" placeholder="请选择菜单类型" />
      </a-form-item>
      <a-form-item label="图标" field="icon" v-if="formData.type != 'B'">
        <sa-icon-picker v-model="formData.icon" placeholder="请选择图标" />
      </a-form-item>
      <a-form-item :label="formData.type == 'B' ? '接口地址' : '菜单标识'" field="code">
        <a-input v-model="formData.code" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item label="路由地址" field="route" v-if="formData.type != 'B'">
        <a-input v-model="formData.route" placeholder="请输入路由地址" />
      </a-form-item>
      <a-form-item label="组件地址" field="component" v-if="formData.type == 'M'">
        <a-auto-complete
          v-model="formData.component"
          :data="componentList"
          @search="querySearch"
          allow-clear
          placeholder="请输入组件地址" />
      </a-form-item>
      <a-form-item label="排序数字" field="sort">
        <a-input-number v-model="formData.sort" placeholder="请输入排序数字" />
      </a-form-item>
      <a-form-item label="是否隐藏" field="is_hidden" v-if="formData.type != 'B'">
        <sa-radio v-model="formData.is_hidden" dict="yes_or_no" placeholder="请选择是否隐藏" />
      </a-form-item>
      <a-form-item label="继承Layout" field="is_layout" v-if="formData.type != 'B'">
        <sa-radio v-model="formData.is_layout" dict="yes_or_no" placeholder="请选择是否继承Layout" />
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
import api from '@/api/system/menu'

const emit = defineEmits(['success'])

// 引用定义
const visible = ref(false)
const loading = ref(false)
const mode = ref('')
const formRef = ref()
const menuData = ref([])
const componentList = ref([])

let title = computed(() => {
  return '菜单管理' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单初始值
const initialFormData = {
  id: '',
  parent_id: '',
  name: '',
  type: 'M',
  icon: '',
  code: '',
  route: '',
  component: '',
  sort: 100,
  is_hidden: 2,
  is_layout: 1,
  status: 1,
  remark: '',
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  name: [{ required: true, message: '菜单名称不能为空' }],
  code: [{ required: true, message: '菜单标识不能为空' }],
}

const modules = import.meta.glob('/src/views/**/*.vue')

// 搜索组件文件
const querySearch = (value) => {
  const list = Object.keys(modules).map((item) => item.replace('/src/views/', '').replace('.vue', ''))
  componentList.value = list
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
  const resp = await api.getList()
  menuData.value = resp.data
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
