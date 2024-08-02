<template>
  <a-modal v-model:visible="visible" :on-before-ok="save" width="600px" draggable top="50px" :align-center="false">
    <template #title>设置组件 - {{ row?.column_comment }}</template>
    <a-form :model="form">
      <!-- 编辑器相关 -->
      <div v-if="['codeEditor', 'editor', 'wangEditor'].includes(row.view_type)">
        <a-form-item label="编辑器高度" field="height" label-col-flex="auto" :label-col-style="{ width: '120px' }">
          <a-input-number v-model="form.height" :max="1000" :min="100" />
        </a-form-item>
      </div>
      <!-- 上传、资源选择器相关 -->
      <div v-if="['uploadImage', 'uploadFile'].includes(row.view_type)">
        <a-form-item label="是否可多选" field="multiple" label-col-flex="auto" :label-col-style="{ width: '100px' }">
          <a-radio-group v-model="form.multiple">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="form.multiple"
          label="数量限制"
          field="limit"
          label-col-flex="auto"
          :label-col-style="{ width: '100px' }"
          :extra="`多选模式下生效,限制上传数量`">
          <a-input-number v-model="form.limit" :max="10" :min="1" />
        </a-form-item>
      </div>
      <!-- 省市区联动 -->
      <div v-if="row.view_type == 'cityLinkage'">
        <a-alert title="提示">
          <p>级联选择器返回的数据类型为 String</p>
          <p>下拉框联动返回的数据类型为 Array</p>
        </a-alert>
        <a-form-item class="mt-3" label="组件类型" field="type" label-col-flex="auto" :label-col-style="{ width: '100px' }">
          <a-select v-model="form.type" placeholder="默认为下拉框联动" allow-clear>
            <a-option value="select">下拉框联动</a-option>
            <a-option value="cascader">级联选择器</a-option>
          </a-select>
        </a-form-item>
        <a-form-item class="mt-3" label="返回数据" field="mode" label-col-flex="auto" :label-col-style="{ width: '100px' }">
          <a-select v-model="form.mode" placeholder="默认为省市名称" allow-clear>
            <a-option value="name">省市名称</a-option>
            <a-option value="code">省市编码</a-option>
          </a-select>
        </a-form-item>
      </div>
      <!-- 日期、时间选择器 -->
      <div v-if="['date'].includes(row.view_type)">
        <a-form-item
          class="mt-3"
          label="选择器类型"
          field="formType"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          v-if="row.view_type == 'date'">
          <a-select v-model="form.mode" allow-clear>
            <a-option value="date">日期选择器</a-option>
            <a-option value="week">周选择器</a-option>
            <a-option value="month">月选择器</a-option>
            <a-option value="quarter">季度选择器</a-option>
            <a-option value="year">年选择器</a-option>
          </a-select>
        </a-form-item>

        <a-form-item
          class="mt-3"
          label="是否显示时间"
          field="showTime"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          v-if="form.mode == 'date'">
          <a-radio-group v-model="form.showTime">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confrim'])
const visible = ref(false)
const row = ref({})
const form = ref({})

const open = (record) => {
  row.value = record
  if (record.view_type == 'uploadImage' || record.view_type == 'uploadFile') {
    form.value = record.options ? record.options : { multiple: false }
  } else if (record.view_type == 'codeEditor' || record.view_type == 'editor' || record.view_type == 'wangEditor') {
    form.value = record.options ? record.options : { height: 400 }
  } else if (record.view_type == 'date') {
    form.value = record.options ? record.options : { mode: 'date', showTime: false }
  } else if (record.view_type == 'cityLinkage') {
    form.value = record.options ? record.options : { type: 'cascader', mode: 'code' }
  } else {
    form.value = record.options ? record.options : {}
  }
  visible.value = true
}

const save = (done) => {
  emit('confrim', row.value.column_name, form.value)
  done(true)
}

defineExpose({ open })
</script>

<style scoped>
.setdata-button {
  right: 15px;
  position: absolute;
}
</style>
