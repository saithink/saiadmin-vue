
<template>
  <table
    v-if="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="['table-container', props.component?.customClass]"
    :style="props.component?.style"
  > 
    <tbody>
      <tr
        v-for="(row, rowIndex) in (props.component?.rows ?? [])"
        :key="rowIndex"
        :class="['table-row', row?.customClass]"
        :style="row?.style"
      >
        <template v-for="(col, colIndex) in (row.cols ?? [])" :key="colIndex">
          <ma-table-cell :component="col">
            <template v-for="slot in Object.keys($slots)" #[slot]="component">
              <slot :name="slot" v-bind="component" />
            </template>
          </ma-table-cell>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted } from 'vue'
import MaTableCell from './table-cell.vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>

<style lang="less">
table.table-container {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  .table-cell {
    border: 1px solid var(--color-neutral-3);
    padding: 0.2em;
  }
}
</style>