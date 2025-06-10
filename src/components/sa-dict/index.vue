<template>
  <div>
    <!-- 渲染 span -->
    <span v-if="props.render === 'span'">
      <template v-if="Array.isArray(value)">
        {{
          value.map((v) => tool.getLabel(v, props.options.length > 0 ? props.options : dictList[props.dict])).join(', ')
        }}
      </template>
      <template v-else>
        {{ tool.getLabel(value, props.options.length > 0 ? props.options : dictList[props.dict]) }}
      </template>
    </span>
    <!-- 渲染 tag -->
    <template v-if="props.render === 'tag'">
      <template v-if="Array.isArray(value)">
        <a-tag
          v-for="(v, index) in value"
          :key="index"
          class="mr-2"
          :color="
            tool.getColor(v, props.options.length > 0 ? props.options : dictList[props.dict], props.colors || [])
          ">
          {{ tool.getLabel(v, props.options.length > 0 ? props.options : dictList[props.dict]) }}
        </a-tag>
      </template>
      <a-tag
        v-else-if="value !== ''"
        :color="
          tool.getColor(value, props.options.length > 0 ? props.options : dictList[props.dict], props.colors || [])
        ">
        {{ tool.getLabel(value, props.options.length > 0 ? props.options : dictList[props.dict]) }}
      </a-tag>
      <span v-else></span>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import tool from '@/utils/tool.js'
import { useDictStore } from '@/store'

const dictList = useDictStore().data
const value = ref()

const props = defineProps({
  value: { type: [String, Number, Array] },
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
