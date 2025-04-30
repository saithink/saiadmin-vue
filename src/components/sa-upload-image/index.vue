<template>
  <div class="upload-image flex" :class="props.rounded ? 'rounded-full' : ''">
    <!-- 单图 -->
    <a-space wrap>
      <div :class="'image-list ' + (props.rounded ? 'rounded-full' : '')" v-if="!props.multiple && currentItem?.url">
        <a-button class="delete" @click="removeSignImage()">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
        <a-image width="130" height="130" :class="props.rounded ? 'rounded-full' : ''" :src="currentItem.url" />
      </div>
      <!-- 多图显示 -->
      <template v-else-if="props.multiple">
        <div :class="'image-list ' + (props.rounded ? 'rounded-full' : '')" v-for="(image, idx) in showImgList" :key="idx">
          <a-button class="delete" @click="removeImage(idx)">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
          <a-image width="130" height="130" :class="props.rounded ? 'rounded-full' : ''" :src="image.url" />
        </div>
      </template>

      <a-upload
        :custom-request="uploadImageHandler"
        :show-file-list="false"
        :accept="props.accept ?? '.jpg,.jpeg,.gif,.png,.svg,.bpm'"
        :disabled="props.disabled"
        :tip="props.tip">
        <template #upload-button>
          <slot name="customer">
            <div :class="'upload-skin ' + (props.rounded ? 'rounded-full' : 'rounded-sm')" v-if="!props.modelValue || props.multiple">
              <div class="icon text-3xl">
                <component :is="props.icon" />
              </div>
              <div class="title">
                {{ props.title }}
              </div>
            </div>
          </slot>
        </template>
      </a-upload>
    </a-space>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { isArray } from 'lodash'
import file2md5 from 'file2md5'
import commonApi from '@/api/common'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: () => {},
  },
  rounded: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '本地上传' },
  icon: { type: String, default: 'icon-plus' },
  size: { type: Number, default: 4 * 1024 * 1024 },
  limit: { type: Number, default: 0 },
  mode: { type: String, default: 'system' },
  tip: { type: String, default: undefined },
  accept: { type: String, default: '.jpg,.jpeg,.gif,.png,.svg,.bpm' },
})
const emit = defineEmits(['update:modelValue'])

const showImgList = ref([])
const signImage = ref()
const currentItem = ref({})

const uploadImageHandler = async (options) => {
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
    if (showImgList.value.length >= props.limit) {
      Message.warning('最多上传' + props.limit + '张图片')
      currentItem.value = {}
      isCheck = false
    }
  }

  if (isCheck) {
    const hash = await file2md5(file)
    const dataForm = new FormData()
    dataForm.append('image', file)
    dataForm.append('isChunk', false)
    dataForm.append('hash', hash)
    if (props.mode === 'local') {
      dataForm.append('mode', 'local')
    }
    const resp = await commonApi.uploadImage(dataForm)
    const result = resp.data
    if (result) {
      if (!props.multiple) {
        signImage.value = result['url']
        emit('update:modelValue', signImage.value)
      } else {
        showImgList.value.push(result)
        let files = []
        files = showImgList.value.map((item) => {
          return item['url']
        })
        emit('update:modelValue', files)
      }
    }
  }
}

const removeSignImage = () => {
  currentItem.value = {}
  signImage.value = undefined
  emit('update:modelValue', null)
}

const removeImage = (idx) => {
  showImgList.value.splice(idx, 1)
  let files = []
  files = showImgList.value.map((item) => {
    return item['url']
  })
  emit('update:modelValue', files)
}

const initData = async () => {
  if (props.multiple) {
    if (isArray(props.modelValue) && props.modelValue.length > 0) {
      showImgList.value = props.modelValue.map((url) => {
        return { url }
      })
    } else {
      showImgList.value = []
    }
  } else if (props.modelValue) {
    signImage.value = props.modelValue
    currentItem.value.url = props.modelValue
    currentItem.value.percent = 100
    currentItem.value.status = 'complete'
  } else {
    removeSignImage()
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
.upload-skin {
  background-color: var(--color-fill-2);
  border: 1px dashed var(--color-fill-4);
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .icon,
  .title {
    color: var(--color-text-3);
  }
}

.image-list {
  cursor: pointer;
  position: relative;
  background-color: var(--color-fill-2);
  width: 130px;
  height: 130px;

  .delete {
    position: absolute;
    z-index: 99;
    right: 3px;
    top: 3px;
    display: none;
  }

  .progress {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}

.image-list:hover {
  .delete {
    display: block;
  }
}

.upload-skin:hover {
  border: 1px dashed rgb(var(--primary-6));
}
// .arco-upload-hide {
//   display: block !important;
// }
</style>
