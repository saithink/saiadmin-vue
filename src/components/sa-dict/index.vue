<template>
  <div>
    <!-- 渲染 span -->
    <span v-if="props.render === 'span'">
      {{ tool.getLabel(value, props.options.length > 0 ? props.options : dictList[props.dict]) }}
    </span>
    <!-- 渲染 tag -->
    <a-tag
      v-if="props.render === 'tag' && value !== ''"
      :color="
        tool.getColor(value, props.options.length > 0 ? props.options : dictList[props.dict], props.colors || [])
      ">
      {{ tool.getLabel(value, props.options.length > 0 ? props.options : dictList[props.dict]) }}
    </a-tag>
    <span v-else></span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import tool from '@/utils/tool.js'
import { useDictStore } from '@/store'

const dictList = useDictStore().data
const value = ref()

const props = defineProps({
  value: { type: [String, Number] },
  render: { type: String, default: 'tag' },
  dict: { type: String, default: '' },
  options: { type: Array, default: [] },
  colors: { type: Array, default: [] },
})

watch(
  () => props.value,
  (vl) => {
    value.value = vl
  },
  { immediate: true }
)
</script>
