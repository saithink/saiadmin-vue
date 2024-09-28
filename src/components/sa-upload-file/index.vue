<template>
  <div>
    <div class="upload-file w-full">
      <a-upload
        :custom-request="uploadFileHandler"
        :show-file-list="false"
        :multiple="props.multiple"
        :accept="props.accept"
        :disabled="isDisabled"
        :tip="props.tip"
        :draggable="props.draggable">
        <template #upload-button v-if="props.draggable">
          <slot name="customer">
            <div style="background-color: var(--color-fill-2); border: 1px dashed var(--color-fill-4)" class="rounded text-center p-7 w-full">
              <div>
                <icon-upload class="text-5xl text-gray-400" />
                <div class="text-red-600 font-bold">
                  {{ props.title }}
                </div>
                将文件拖到此处，或<span style="color: #3370ff">点击上传</span>
              </div>
            </div>
          </slot>
        </template>
      </a-upload>
    </div>
    <!-- 单文件 -->
    <div class="file-list mt-2" v-if="!props.multiple && currentItem?.url && props.showList">
      <a-tooltip content="点击文件名预览/下载" position="tr">
        <a :href="currentItem.url" v-if="currentItem?.url" class="file-name" target="_blank">{{ currentItem.name }}</a>
      </a-tooltip>

      <a-button type="text" size="small" @click="removeSignFile()">
        <template #icon>
          <icon-delete />
        </template>
      </a-button>
    </div>

    <!-- 多文件 -->
    <div v-if="props.showList" class="file-list mt-2" v-for="(file, idx) in showFileList" :key="idx">
      <a-tooltip content="点击文件名预览/下载" position="tr">
        <a :href="file.url" v-if="file?.url" class="file-name" target="_blank">{{ file.name }}</a>
      </a-tooltip>

      <a-button type="text" size="small" @click="removeFile(idx)">
        <template #icon>
          <icon-delete />
        </template>
      </a-button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { isArray } from 'lodash'
import file2md5 from 'file2md5'
import commonApi from '@/api/common'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: () => {},
  },
  showList: { type: Boolean, default: true },
  draggable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '本地上传' },
  icon: { type: String, default: 'icon-plus' },
  size: { type: Number, default: 4 * 1024 * 1024 },
  limit: { type: Number, default: 0 },
  mode: { type: String, default: 'system' },
  tip: { type: String, default: undefined },
  accept: { type: String, default: '*' },
})
const emit = defineEmits(['update:modelValue'])
const showFileList = ref([])
const signFile = ref()
const currentItem = ref({})

const isDisabled = computed(() => {
  if (props.disabled) {
    return true
  } else {
    if (!props.multiple) {
      if (currentItem.value && currentItem.value.url) {
        return true
      }
    }
    return false
  }
})

const uploadFileHandler = async (options) => {
  if (!options.fileItem) return
  if (!props.multiple) {
    currentItem.value = options.fileItem
  }
  let isCheck = true
  const file = options.fileItem.file
  if (file.size > props.size) {
    Message.warning(file.name + '超出文件大小限制')
    currentItem.value = {}
    isCheck = false
  }
  if (props.multiple && props.limit > 0) {
    if (showFileList.value.length >= props.limit) {
      Message.warning('最多上传' + props.limit + '个文件')
      currentItem.value = {}
      isCheck = false
    }
  }

  if (isCheck) {
    const hash = await file2md5(file)
    const dataForm = new FormData()
    dataForm.append('file', file)
    dataForm.append('hash', hash)
    if (props.mode === 'local') {
      dataForm.append('mode', 'local')
    }
    const resp = await commonApi.uploadFile(dataForm)
    const result = resp.data
    if (result) {
      if (!props.multiple) {
        signFile.value = result['url']
        emit('update:modelValue', signFile.value)
      } else {
        showFileList.value.push(result)
        let files = []
        files = showFileList.value.map((item) => {
          return item['url']
        })
        emit('update:modelValue', files)
      }
    }
  }
}

const removeSignFile = () => {
  currentItem.value = {}
  signFile.value = undefined
  emit('update:modelValue', null)
}

const removeFile = (idx) => {
  showFileList.value.splice(idx, 1)
  let files = []
  files = showFileList.value.map((item) => {
    return item['url']
  })
  emit('update:modelValue', files)
}

const initData = async () => {
  if (props.multiple) {
    if (isArray(props.modelValue) && props.modelValue.length > 0) {
      showFileList.value = props.modelValue.map((url) => {
        return { url, name: url.substring(url.lastIndexOf('/') + 1) }
      })
    } else {
      showFileList.value = []
    }
  } else if (props.modelValue) {
    signFile.value = props.modelValue
    currentItem.value.url = props.modelValue
    currentItem.value.name = props.modelValue.substring(props.modelValue.lastIndexOf('/') + 1)
  } else {
    removeSignFile()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    initData()
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style lang="less" scoped>
.file-list {
  background-color: var(--color-primary-light-1);
  border-radius: 4px;
  height: 36px;
  padding: 0 5px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .file-name {
    max-width: 90%;
    margin: 0 5px;
    overflow: hidden;
    color: #165dff;
  }
}
</style>
