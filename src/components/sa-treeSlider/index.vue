<template>
  <div class="flex flex-col w-full" :class="props.border ? 'slider-border p-2' : ''">
    <a-input-group class="mb-2 w-full" size="mini">
      <a-input :placeholder="props?.searchPlaceholder" allow-clear @input="changeKeyword" @clear="resetData" />
      <a-button
        @click="
          () => {
            isExpand ? saTree.expandAll(false) : saTree.expandAll(true)
            isExpand = !isExpand
          }
        "
        >{{ isExpand ? '折叠' : '展开' }}</a-button
      >
      <slot name="treeAfterButtons"></slot>
    </a-input-group>
    <a-tree
      blockNode
      ref="saTree"
      :data="treeData"
      class="h-full w-full"
      @select="handlerSelect"
      :field-names="props.fieldNames"
      v-model:selected-keys="modelValue"
      v-bind="$attrs">
      <template #icon v-if="props.icon"><component :is="props.icon" /></template>
      <template v-for="(_, name) in $slots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </a-tree>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const treeData = ref([])
const saTree = ref()
const isExpand = ref(false)

const emit = defineEmits(['update:modelValue', 'click'])

const props = defineProps({
  modelValue: { type: Array },
  data: { type: Array },
  border: { type: Boolean, default: true },
  searchPlaceholder: { type: String },
  fieldNames: {
    type: Object,
    default: () => {
      return { title: 'label', key: 'value' }
    },
  },
  icon: { type: String, default: undefined },
})

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(newVal) {
    emit('update:modelValue', newVal)
  },
})

watch(
  () => props.data,
  (val) => {
    treeData.value = val
  },
  { immediate: true, deep: true }
)

const handlerSelect = (item, data) => {
  modelValue.value = [item]
  emit('click', ...[item, data])
}

const resetData = () => (treeData.value = props.data)

const changeKeyword = (keyword) => {
  if (!keyword || keyword === '') {
    treeData.value = Object.assign(props.data, [])
    return false
  }
  treeData.value = searchNode(keyword)
}

const searchNode = (keyword) => {
  const loop = (data) => {
    let tree = []
    data.map((item) => {
      if (item[props.fieldNames['title']].indexOf(keyword) !== -1) {
        tree.push(item)
      } else if (item.children && item.children.length > 0) {
        const temp = loop(item.children)
        tree.push(...temp)
      }
      return tree
    })

    return tree
  }
  return loop(treeData.value)
}

defineExpose({ saTree })
</script>

<style scoped lang="less">
:deep(.arco-tree-node:hover) {
  background-color: var(--color-fill-2);
  border-radius: 3px;
}
:deep(.arco-tree-node-switcher) {
  margin-left: 2px;
}
.slider-border {
  border: 1px solid #ebebeb;
}
</style>
