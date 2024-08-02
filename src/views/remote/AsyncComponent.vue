<template>
  <div class="async-component">
    <component :is="asyncComponent" v-bind="$attrs" />
  </div>
</template>

<script setup>
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader/dist/vue3-sfc-loader.esm.js'
import { defineAsyncComponent } from 'vue'
import { Message } from '@arco-design/web-vue'
import { request } from '@/utils/request.js'
const props = defineProps({
  url: String,
})
const options = {
  moduleCache: {
    vue: Vue,
    request: request,
    Message: Message,
  },
  async getFile(url) {
    const res = await fetch(url)
    if (!res.ok) {
      Message.error(`组件 ${url} 加载失败。 [提示：${res.statusText}]`)
      return false
    }
    return {
      getContentData: (asBinary) => (asBinary ? res.arrayBuffer() : res.text()),
    }
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent })
    const ref = document.head.getElementsByTagName('style')[0] || null
    document.head.insertBefore(style, ref)
  },
}
const asyncComponent = defineAsyncComponent(() => loadModule(props.url, options))
</script>
<style>
.async-component {
  width: 100%;
}
</style>
