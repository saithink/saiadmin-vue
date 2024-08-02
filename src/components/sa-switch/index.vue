<template>
  <a-switch
    v-model="value"
    :size="props.size"
    :disabled="props.disabled"
    :loading="props.loading"
    :type="props.type"
    :checked-value="props.checkedValue"
    :unchecked-value="props.uncheckedValue"
    :checked-color="props.checkedColor"
    :unchecked-color="props.uncheckedColor"
    @change="handleChangeEvent($event)">
    <template #checked> {{ props.checkedText }} </template>
    <template #unchecked> {{ props.uncheckedText }} </template>
  </a-switch>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'change'])
const value = ref()

const props = defineProps({
  modelValue: { type: [String, Number, Boolean] },
  size: { type: String, default: 'medium' },
  type: { type: String, default: 'round' },
  valType: { type: String, default: 'string' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  checkedValue: { type: [String, Number, Boolean], default: '1' },
  uncheckedValue: { type: [String, Number, Boolean], default: '2' },
  checkedColor: { type: String, default: '' },
  uncheckedColor: { type: String, default: '' },
  checkedText: { type: String, default: '启用' },
  uncheckedText: { type: String, default: '禁用' },
})

watch(
  () => props.modelValue,
  (vl) => {
    if (props.valType === 'string') {
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

const handleChangeEvent = async (value) => {
  emit('change', value)
}
</script>
