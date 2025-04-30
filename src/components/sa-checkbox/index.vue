<template>
  <a-checkbox-group v-model="value" :direction="props.direction" :disabled="props.disabled" @change="handleChangeEvent($event)">
    <template v-for="(item, index) in dictList[props.dict] ?? []">
      <a-checkbox :value="item.value">{{ item.label }}</a-checkbox>
    </template>
  </a-checkbox-group>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDictStore } from '@/store'

const dictList = useDictStore().data
const emit = defineEmits(['update:modelValue', 'change'])
const value = ref()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  dict: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  direction: { type: String, default: 'horizontal' },
})

watch(
  () => props.modelValue,
  (vl) => {
    value.value = vl
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
