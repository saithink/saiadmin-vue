<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="800"
    title="上传插件包-安装插件"
    :mask-closable="false"
    :footer="false">
    <div class="flex flex-col items-center mb-24">
      <div class="w-[400px]">
        <div class="text-lg text-red-500 font-bold">
          请您务必确认模块包文件来自官方渠道或经由官方认证的模块作者，否则系统可能被破坏，因为：
        </div>
        <div class="text-red-500">1. 模块可以修改和新增系统文件</div>
        <div class="text-red-500">2. 模块可以执行sql命令和代码</div>
        <div class="text-red-500">3. 模块可以安装新的前后端依赖</div>
      </div>
      <div class="mt-10 w-[600px]" v-if="appInfo && appInfo.app">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="应用标识"> {{ appInfo?.app }}</a-descriptions-item>
          <a-descriptions-item label="应用名称"> {{ appInfo?.title }}</a-descriptions-item>
          <a-descriptions-item label="应用描述"> {{ appInfo?.about }}</a-descriptions-item>
          <a-descriptions-item label="作者"> {{ appInfo?.author }}</a-descriptions-item>
          <a-descriptions-item label="版本"> {{ appInfo?.version }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="mt-10 w-[600px]" v-else>
        <a-upload :custom-request="uploadFileHandler" :show-file-list="false" accept=".zip,.rar" :draggable="true">
          <template #upload-button>
            <slot name="customer">
              <div
                style="background-color: var(--color-fill-2); border: 1px dashed var(--color-fill-4)"
                class="rounded text-center p-7 w-full">
                <div>
                  <icon-upload class="text-3xl text-gray-400" />
                  <div>将插件包文件拖到此处，或<span style="color: #3370ff; margin-left: 10px">点击上传</span></div>
                </div>
              </div>
            </slot>
          </template>
        </a-upload>
      </div>
    </div>
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import file2md5 from 'file2md5'
import { Message, Modal } from '@arco-design/web-vue'
import saipackage from '@/api/tool/saipackage'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)

const uploadSize = 8 * 1024 * 1024

const initialApp = {
  app: '',
  title: '',
  about: '',
  author: '',
  version: '',
  state: 0,
  update: 0,
}

const appInfo = reactive({ ...initialApp })

const uploadFileHandler = async (options) => {
  if (!options.fileItem) return
  let isCheck = true
  const file = options.fileItem.file
  if (file.size > uploadSize) {
    Message.warning(file.name + '超出文件大小限制')
    isCheck = false
  }
  if (isCheck) {
    const hash = await file2md5(file)
    const dataForm = new FormData()
    dataForm.append('file', file)
    dataForm.append('hash', hash)
    const res = await saipackage.uploadApp(dataForm)
    if (res.code == 200) {
      Object.assign(appInfo, res.data)
      Message.success('上传成功')
      emit('success')
    }
  }
}

// 打开弹框
const open = async () => {
  visible.value = true
  Object.assign(appInfo, initialApp)
  await initPage()
}

// 初始化页面数据
const initPage = async () => {}

defineExpose({ open })
</script>
