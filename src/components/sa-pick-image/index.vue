<template>
  <div class="upload-image flex">
    <!-- 单图 -->
    <a-space wrap>
      <div
        class="image-list"
        :style="{ width: props.small ? '60px' : '100px', height: props.small ? '60px' : '100px' }"
        v-if="!props.multiple && inputValue">
        <a-button class="delete" @click="removeSignImage()">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
        <a-image :width="props.small ? 60 : 100" :height="props.small ? 60 : 100" :src="inputValue" />
      </div>
      <!-- 多图显示 -->
      <template v-else-if="props.multiple">
        <div
          class="image-list"
          :style="{ width: props.small ? '60px' : '100px', height: props.small ? '60px' : '100px' }"
          v-for="(image, idx) in imageList"
          :key="idx">
          <a-button class="delete" @click="removeImage(idx)">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
          <a-image :width="props.small ? 60 : 100" :height="props.small ? 45 : 100" :src="image" />
        </div>
      </template>

      <div>
        <div
          class="upload-skin cursor-pointer"
          :style="{ width: props.small ? '60px' : '100px', height: props.small ? '60px' : '100px' }"
          v-if="props.multiple && imageList.length < props.limit"
          @click="openResourceSelector">
          <div class="icon text-3xl">
            <icon-image />
          </div>
          <div v-if="!props.small" class="title">选择图片</div>
        </div>
        <div
          class="upload-skin cursor-pointer"
          :style="{ width: props.small ? '60px' : '100px', height: props.small ? '60px' : '100px' }"
          v-if="!inputValue && !props.multiple"
          @click="openResourceSelector">
          <div class="icon text-3xl">
            <icon-image />
          </div>
          <div v-if="!props.small" class="title">选择图片</div>
        </div>
      </div>
    </a-space>
    <a-modal v-model:visible="visible" width="1100px" :footer="false" draggable>
      <template #title>资源选择器</template>
      <div class="w-full h-144 flex flex-col">
        <div class="lg:flex lg:justify-between">
          <div class="flex">
            <sa-upload-file
              :modelValue="fileValue"
              @update:modelValue="handleUpdate"
              :size="20 * 1024 * 1024"
              multiple
              :show-list="false" />
            <a-button class="ml-3" @click="openNetworkModal = true"> <icon-image /> 保存网络图片 </a-button>
            <a-radio-group type="button" v-model="defaultKey" @change="handlerClick" class="ml-4">
              <a-radio v-for="(item, index) in sliderData" :key="index" :value="item.value">{{ item.label }}</a-radio>
            </a-radio-group>
          </div>
          <a-input
            v-model="filename"
            class="input-search lg:mt-0 mt-2"
            placeholder="文件名搜索"
            allow-clear
            @press-enter="searchFile" />
        </div>
        <a-spin :loading="resourceLoading" tip="资源加载中" class="h-full">
          <div class="resource-list mt-4" ref="rl" v-if="attachmentList && attachmentList.length > 0">
            <div
              class="item rounded-sm"
              v-for="(item, index) in attachmentList"
              :key="item.hash"
              @click="selectFile(item, index)">
              <img :src="item.url" v-if="item.mime_type.indexOf('image') !== -1" />
              <div v-else class="text-3xl w-full h-full flex items-center justify-center">
                {{ `.${item.suffix}` }}
              </div>
              <a-tooltip position="bottom">
                <div class="file-name">
                  {{ item.origin_name }}
                </div>
                <template #content>
                  <div>存储名称：{{ item.object_name }}</div>
                  <div>存储目录：{{ item.storage_path }}</div>
                  <div>上传时间：{{ item.create_time }}</div>
                  <div>文件大小：{{ item.size_info }}</div>
                  <div>存储模式：{{ tool.getLabel(item.storage_mode, dictList['upload_mode']) }}</div>
                </template>
              </a-tooltip>
            </div>
          </div>
          <a-empty v-else class="mt-10" />
        </a-spin>
        <div class="lg:flex lg:justify-between">
          <a-pagination
            :total="pageInfo.total"
            v-model:current="pageInfo.currentPage"
            v-model:page-size="pageSize"
            @change="changePage" />
          <a-button type="primary" @click="selectComplete" class="mt-3 lg:mt-0">确定</a-button>
        </div>
        <a-modal v-model:visible="openNetworkModal" ok-text="保存" :on-before-ok="saveNetworkImg" draggable>
          <template #title>保存网络图片</template>
          <a-input v-model="networkImg" class="mb-3" placeholder="请粘贴网络图片地址" allow-clear />
          <a-image :src="networkImg" width="100%" style="min-height: 150px" />
        </a-modal>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import commonApi from '@/api/common'
import tool from '@/utils/tool'
import { Message } from '@arco-design/web-vue'
import { useDictStore } from '@/store'

const dictList = useDictStore().data

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: () => {},
  },
  multiple: { type: Boolean, default: false },
  limit: { type: Number, default: 3 },
  returnType: { type: String, default: 'url' },
  small: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'change'])

const sliderData = ref([])
const defaultKey = ref('all')
const resourceLoading = ref(false)
const pageSize = ref(21)
const filename = ref()
const selecteds = ref()
const rl = ref()
const attachmentList = ref([])
const openNetworkModal = ref(false)
const networkImg = ref()
const pageInfo = ref({
  total: 1,
  currentPage: 1,
})

const visible = ref(false)
const inputValue = ref(null)
const imageList = ref([])

const removeSignImage = () => {
  inputValue.value = null
  emit('update:modelValue', null)
}

const removeImage = (idx) => {
  imageList.value.splice(idx, 1)
  emit('update:modelValue', imageList.value || [])
}

// 打开资源选择器
const openResourceSelector = async () => {
  const elements = document.querySelectorAll('.item.active')
  elements.forEach((element) => {
    element.className = 'item rounded-sm'
  })
  selecteds.value = null
  inputValue.value = null
  visible.value = true
}

// 搜索分类
const handlerClick = async (val) => {
  defaultKey.value = val
  const type = val === 'all' ? undefined : val
  await getAttachmentList({ mime_type: type })
}

// 搜索文件名称
const searchFile = async () => {
  await getAttachmentList({ origin_name: filename.value })
}

// 选择文件
const selectFile = (item, index) => {
  const children = rl.value.children
  const className = 'item rounded-sm'
  if (children[index].className.indexOf('active') !== -1) {
    children[index].className = className
    if (props.multiple) {
      if (selecteds.value == null) {
        selecteds.value = []
      }
      selecteds.value.map((file, idx) => {
        selecteds.value.splice(idx, 1)
      })
    } else {
      selecteds.value = ''
    }
  } else {
    if (props.multiple) {
      children[index].className = className + ' active'
      if (selecteds.value == null) {
        selecteds.value = []
      }
      selecteds.value.push(item[props.returnType])
    } else {
      if (document.querySelectorAll('.item.active').length < 1) {
        children[index].className = className + ' active'
        selecteds.value = item[props.returnType]
      } else {
        const elements = document.querySelectorAll('.item.active')
        elements.forEach((element) => {
          element.className = className
        })
        children[index].className = className + ' active'
        selecteds.value = item[props.returnType]
      }
    }
  }
}

// 文件选择确定
const selectComplete = () => {
  if (props.multiple) {
    const value = Object.assign([], selecteds.value)
    imageList.value.push(...value)
    if (imageList.value.length > props.limit) {
      imageList.value.splice(5)
    }
    emit('update:modelValue', imageList.value)
  } else {
    inputValue.value = selecteds.value
    emit('update:modelValue', inputValue.value)
  }
  visible.value = false
}

// 页码变化
const changePage = async (page) => {
  await getAttachmentList({ page })
}

// 获取文件列表
const getAttachmentList = async (params = {}) => {
  const requestParams = Object.assign(params, { limit: pageSize.value })
  resourceLoading.value = true
  attachmentList.value = []
  const response = await commonApi.getResourceList(requestParams)
  pageInfo.value = {
    total: response?.data?.total ?? 0,
    currentPage: response?.data?.current_page ?? 21,
  }
  attachmentList.value = response?.data?.data
  resourceLoading.value = false
}

// 保存网络图片
const saveNetworkImg = async (done) => {
  if (!networkImg.value) {
    Message.error('输入地址不能为空')
    done(false)
    return
  }
  const response = await commonApi.saveNetWorkImage({ url: networkImg.value })
  if (response.code === 200) {
    Message.success(response.message)
    await getAttachmentList({ page: pageInfo.value.currentPage })
    networkImg.value = undefined
    done(true)
  } else {
    Message.error(response.message)
    done(false)
  }
}

const fileValue = ref()
const handleUpdate = async () => {
  getAttachmentList({ page: pageInfo.value.currentPage })
}

onMounted(async () => {
  const treeData = dictList['attachment_type']
  sliderData.value = [{ label: '所有', value: 'all' }, ...treeData]
  await getAttachmentList({ page: 1 })
})

watch(
  () => props.modelValue,
  (val) => {
    if (props.multiple) {
      imageList.value = val || []
    } else {
      inputValue.value = val
    }
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

.resource-container {
  min-height: 560px;
}
.input-search {
  width: 250px;
}
.resource-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
  .item {
    width: 138px;
    height: 138px;
    border: 2px solid var(--color-fill-1);
    margin-right: 10px;
    margin-bottom: 20px;
    background-color: var(--color-fill-1);
    cursor: pointer;
    position: relative;
    .file-name {
      position: absolute;
      bottom: 0px;
      height: 23px;
      width: 100%;
      background: rgba(100, 100, 100, 0.3);
      line-height: 23px;
      font-size: 12px;
      overflow: hidden;
      padding: 0 10px;
      text-align: center;
      text-overflow: ellipsis;
      color: #fff;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .item:hover {
    border: 2px solid rgb(var(--primary-6));
  }
  .item.active {
    border: 2px solid rgb(var(--primary-6));
  }
  .item.active::after {
    content: '';
    position: absolute;
    width: 134px;
    height: 134px;
    z-index: 2;
    top: 0;
    background: rgba(var(--primary-5), 0.2);
  }
}
</style>
