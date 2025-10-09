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
      <div class="file-list mt-2" v-if="!props.multiple  && props.showList && currentItem?.percent">
        <a-progress 
          v-if="currentItem.percent < 100" 
          :percent="currentItem.percent" 
          animation 
          class="progress">
          <template v-slot:text="scope" >
            {{(scope.percent * 100).toFixed(2)}}%
          </template>
        </a-progress>
        <a-tooltip content="点击文件名预览/下载" position="tr">
          <a
            :href="currentItem.url"
            v-if="currentItem?.url && currentItem.percent === 100 && currentItem?.status === 'complete'"
            class="file-name"
            target="_blank"
            >{{ currentItem.name }}</a
          >
        </a-tooltip>
        <a-button type="text" size="small" @click="removeSignFile()" v-if="currentItem.percent === 100">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
      </div>
  
      <!-- 多文件 -->
      <div v-if="props.showList" class="file-list mt-2" v-for="(file, idx) in showFileList" :key="idx">
        <a-progress
          v-if="file.percent < 100"
          :percent="file.percent"
          animation 
          class="progress">
          <template v-slot:text="scope" >
            {{(scope.percent * 100).toFixed(2)}}%
          </template>
        </a-progress>
        <a-tooltip content="点击文件名预览/下载" position="tr">
          <a 
            :href="file.url" 
            v-if="file?.url && file.percent === 100 && file?.status === 'complete'" 
            class="file-name" 
            target="_blank"
            >{{ file.name }}</a>
        </a-tooltip>
  
        <a-button type="text" size="small" v-if="file.percent === 100" @click="removeFile(idx)">
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
    size: { type: Number, default: 100 * 1024 * 1024 },
    chunkSize: { type: Number, default: 1 * 1024 * 1024 },
    limit: { type: Number, default: 0 },
    mode: { type: String, default: 'system' },
    tip: { type: String, default: undefined },
    accept: { type: String, default: '*' },
  })
  const emit = defineEmits(['update:modelValue'])
  const showFileList = ref([])
  const signFile = ref()
  const currentItem = ref({})
  const uploading = ref(false)

  const isDisabled = computed(() => {
  if (props.disabled) {
    return true 
  } else {
    if (!props.multiple) {
      if (currentItem.value && currentItem.value.percent) {
        return true
      }
    }
    return false
  }
})
  
  const uploadFileHandler = async (options) => {
    if (uploading.value) {
      Message.warning('正在上传中，请稍后上传')
      return
    }
    let idx
    if (!props.multiple) {
      currentItem.value = options.fileItem
    } else {
      showFileList.value.push(options.fileItem)
      idx = showFileList.value.length - 1
    }
    let isCheck = true
    const file = options.fileItem.file
    if(!file.type) {
      Message.error('获取文件类型失败，无法上传')
      return
    }
    if (file.size > props.size) {
      Message.warning(file.name + '超出文件大小限制')
      currentItem.value = {}
      isCheck = false
    }
    
    if (props.multiple && props.limit > 0) {
      if (showFileList.value.length > props.limit) {
        Message.warning('最多上传' + props.limit + '个文件')
        currentItem.value = {}
        showFileList.value.pop()
        isCheck = false
      }
    }
    uploading.value = true
    if (isCheck) {
      const hash = await file2md5(file)

      const chunks = Math.ceil(file.size / props.chunkSize)
      for(let currentChunk = 0; currentChunk < chunks; currentChunk++) {
        const start = currentChunk * props.chunkSize
        const end = (start + props.chunkSize >= file.size)
          ? file.size
          : start + props.chunkSize
        const dataForm = new FormData()
        dataForm.append('package', file.slice(start, end))
        dataForm.append('hash', hash)
        dataForm.append('total', chunks)
        dataForm.append('name', file.name)
        dataForm.append('type', file.type)
        dataForm.append('size', file.size)
        dataForm.append('index', currentChunk + 1)
        dataForm.append('ext', /[^.]+$/g.exec(file.name)[0])

        const res = await commonApi.chunkUpload(dataForm)

        if(res.data && res.data.hash) {
          if(props.multiple) {
            showFileList.value[idx].percent = 100
            showFileList.value[idx].status = 'complete'
            showFileList.value[idx].url = res.data.url
            let files = []
            files = showFileList.value.map(item => {
              return item.url
            })
            emit('update:modelValue', files)
          } else {
            signFile.value = res.data['url']
            emit('update:modelValue', signFile.value)
            currentItem.value.url = res.data.url
            currentItem.value.percent = 99
            setTimeout(() => {
              currentItem.value.status = 'complete'
              currentItem.value.percent = 100
            }, 1000)
          }
          break
        }
        if(res.data && res.data.status && res.data.status === 'resume') {
          currentChunk = res.data.chunk - 2
          const percent = (Math.floor((1 / chunks) * 10000) / 10000) * (res.data.chunk - 1);
          if (props.multiple) {
            showFileList.value[idx].percent = percent
          } else {
            currentItem.value.percent = percent
          }
          continue
        }
        if(res.data && res.data.status && res.data.status === 'success') {
          const percent = Math.floor((1 / chunks) * 10000) / 10000;
          if (props.multiple) {
            showFileList.value[idx].percent += percent
          } else {
            currentItem.value.status = 'uploading'
            currentItem.value.percent += percent
          }
        }
      }
    }
    uploading.value = false
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
          return { url, name: url.substring(url.lastIndexOf('/') + 1), percent: 100, status: 'complete' }
        })
      } else {
        showFileList.value = []
      }
    } else if (props.modelValue) {
      signFile.value = props.modelValue
      currentItem.value.url = props.modelValue
      currentItem.value.name = props.modelValue.substring(props.modelValue.lastIndexOf('/') + 1)
      currentItem.value.percent = 100
      currentItem.value.status = 'complete'
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

    .progress {
      width: 200px;
      display: block;
      margin: 0 5px;
    }
  
    .file-name {
      margin: 0 5px;
      overflow: hidden;
      color: #165dff;
    }
  }
  </style>
  