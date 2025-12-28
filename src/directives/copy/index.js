import useClipboard from 'vue-clipboard3'
import { Message } from '@arco-design/web-vue'

const handlerMap = new WeakMap()

const copy = (el, binding) => {
  const { value } = binding
  
  const oldHandler = handlerMap.get(el)
  if (oldHandler) {
    el.removeEventListener('click', oldHandler)
  }
  
  const newHandler = async () => {
    if (value && value !== '') {
      try {
        await useClipboard().toClipboard(value)
        Message.success('已成功复制到剪切板')
      } catch(e) {
        Message.error('复制失败')
      }
    } else {
      throw new Error(`need for copy content! Like v-copy="Hello World"`)
    }
  }
  
  el.addEventListener('click', newHandler)

  handlerMap.set(el, newHandler)
}

export default {
  mounted(el, binding) {
    copy(el, binding)
  },
  updated(el, binding) {
    copy(el, binding)
  },
  unmounted(el) {
    const handler = handlerMap.get(el)
    if (handler) {
      el.removeEventListener('click', handler)
      handlerMap.delete(el)
    }
  }
}
