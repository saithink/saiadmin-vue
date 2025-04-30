<template>
  <a-radio-group
    v-model="value"
    :direction="props.direction"
    :type="props.type"
    :disabled="props.disabled"
    @change="handleChangeEvent($event)">
    <a-radio v-if="props.allowNull" :value="props.nullValue">{{ props.nullLabel }}</a-radio>
    <template v-for="(item, index) in dictList[props.dict] ?? []">
      <a-radio :value="item.value">{{ item.label }}</a-radio>
    </template>
  </a-radio-group>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDictStore } from '@/store'

const dictList = useDictStore().data
const emit = defineEmits(['update:modelValue', 'change'])
const value = ref()

const props = defineProps({
  modelValue: { type: [String, Number] },
  type: { type: String, default: 'radio' },
  dict: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  direction: { type: String, default: 'horizontal' },
  allowNull: { type: Boolean, default: false },
  nullValue: { type: [String, Number], default: '' },
  nullLabel: { type: String, default: '全部' },
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

const handleChangeEvent = async (value) => {
  emit('change', value)
}
</script>
