<template>
  <a-select
    v-model="value"
    :size="props.size"
    :options="dictList[props.dict] ?? []"
    :placeholder="props.placeholder"
    :style="props.style"
    :disabled="props.disabled"
    :allow-clear="props.allowClear"
    @change="handleChangeEvent($event)">
  </a-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDictStore } from '@/store'

const dictList = useDictStore().data
const emit = defineEmits(['update:modelValue', 'change'])
const value = ref()

const props = defineProps({
  modelValue: { type: [String, Number] },
  fieldNames: { type: Object, default: { value: 'value', label: 'label' } },
  size: { type: String, default: 'medium' },
  style: { type: Object, default: {} },
  dict: { type: String, default: '' },
  placeholder: { type: String, default: '请选择' },
  disabled: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true },
})

watch(
  () => props.modelValue,
  (vl) => {
    if (props.dict !== '') {
      value.value = vl + ''
    } else {
      value.value = vl
    }
  },
  { immediate: true }
)
watch(
  () => value.value,
  (v) => {
    emit('update:modelValue', value.value)
  }
)

const handleChangeEvent = async (val) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>
