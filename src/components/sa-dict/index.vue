<template>
  <a-tag :color="tool.getColor(value, dictList[props.dict] ?? [], props.colors || [])">{{ tool.getLabel(value, dictList[props.dict] ?? []) }}</a-tag>
</template>

<script setup>
import { ref, watch } from 'vue'
import tool from '@/utils/tool'
import { useDictStore } from '@/store'

const dictList = useDictStore().data
const emit = defineEmits(['update:modelValue', 'change'])
const value = ref()

const props = defineProps({
  modelValue: { type: [String, Number] },
  dict: { type: String, default: '' },
  colors: { type: Array, default: [] },
})

watch(
  () => props.modelValue,
  (vl) => {
    value.value = vl
  },
  { immediate: true }
)
</script>
