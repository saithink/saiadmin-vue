<template>
  <template v-if="value.indexOf(':') === -1">
    <component :is="value" :size="props.size"></component>
  </template>
  <template v-else>
    <Icon :icon="value" class="iconify-icon" :style="{ fontSize: props.size + 'px' }" />
  </template>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
const value = ref('')

const props = defineProps({
  icon: { type: String },
  size: { type: Number, default: 24 },
})

watch(
  () => props.icon,
  (vl) => {
    if (vl) {
      value.value = vl
    }
  },
  { immediate: true }
)
</script>
