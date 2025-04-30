<template>
  <div class="ma-content-block lg:flex justify-between">
    <div class="lg:w-3/12 w-full h-full p-4 pr-2">
      <a-list :max-height="650" :scrollbar="true" size="small">
        <template #header>
          <div class="flex justify-between items-center" :style="{ height: '30px' }">
            <span>配置分组</span>
            <a-tooltip content="添加组">
              <a-button shape="round" size="small" @click="addGroupModal" type="primary" v-auth="['/core/config/save']">
                <template #icon><icon-plus /></template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
        <a-list-item v-for="(item, index) in configGroupData">
          <div class="flex justify-between items-center">
            <a-button :type="title == item.name ? 'outline' : ''" @click="getConfigData(item.id, item.name, item.code)">
              {{ item.name }}({{ item.code }})
            </a-button>
            <div class="flex">
              <a-link v-auth="['/core/config/update']" @click="editGroupModal(item)">
                <template #icon>
                  <icon-edit />
                </template>
              </a-link>
              <a-link v-auth="['/core/config/destroy']" @click="openDeleteModal(item)">
                <template #icon>
                  <icon-delete />
                </template>
              </a-link>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </div>

    <div class="lg:w-9/12 w-full p-4 pl-2">
      <!-- CRUD 组件 -->
      <a-card :title="title" :loading="loading" :header-style="{ height: '45px' }">
        <template #extra>
          <a-button type="primary" shape="circle" v-auth="['/core/config/index']" @click="manageConfigModal()">
            <icon-settings />
          </a-button>
        </template>
        <div class="pl-4 pr-4">
          <a-form :model="form" auto-label-width>
            <template v-for="(item, index) in formArray">
              <a-form-item :label="item.name" :field="item.key" :extra="item.remark" v-show="item.display">
                <template v-if="item.input_type === 'select'">
                  <a-select
                    v-model="item.value"
                    :options="item.config_select_data"
                    @change="handleSelect($event, item)"
                    :placeholder="'请选择' + item.name" />
                </template>
                <template v-if="item.input_type === 'input'">
                  <a-input v-model="item.value" :placeholder="'请输入' + item.name" />
                </template>
                <template v-if="item.input_type === 'radio'">
                  <a-radio-group v-model="item.value" :options="item.config_select_data" />
                </template>
                <template v-if="item.input_type === 'textarea'">
                  <a-textarea v-model="item.value" :placeholder="'请输入' + item.name" />
                </template>
                <template v-if="item.input_type === 'uploadImage'">
                  <sa-upload-image v-model="item.value" />
                </template>
                <template v-if="item.input_type === 'uploadFile'">
                  <sa-upload-file v-model="item.value" />
                </template>
                <template v-if="item.input_type === 'wangEditor'">
                  <ma-wangEditor v-model="item.value" />
                </template>
              </a-form-item>
            </template>
            <a-form-item v-if="formArray.length > 0">
              <a-button type="primary" @click="submit(formArray)">保存修改</a-button>
            </a-form-item>
            <a-form-item label="测试邮件" v-if="currentNode.code === 'email_config'">
              <a-input v-model="email" placeholder="请输入正确的邮箱接收地址" />
              <a-button type="primary" class="ml-2" @click="sendMail()">发送</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </div>

    <!-- 删除配置组 -->
    <a-modal v-model:visible="deleteVisible" type="warning" :on-before-ok="deleteConfigGroup">
      <template #title>危险操作</template>
      <div class="mb-2">
        确定要删除 <span class="text-red-500 underline font-black">{{ deleteGroupData.name }}</span> 配置组吗？
      </div>
      <div>
        此操作会删除组和所属组配置项，如果执行请在下面输入框输入：<span class="text-red-500">{{
          deleteGroupData.name
        }}</span>
      </div>
      <a-input :placeholder="`请输入 ${deleteGroupData.name}`" class="mt-2" v-model="name" />
    </a-modal>

    <!-- 添加配置组表单 -->
    <add-group ref="addGroupRef" @success="getConfigGroupList" />

    <!-- 管理配置组 -->
    <manage-config ref="manageConfigRef" @close="refresh" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { auth } from '@/utils/common'
import config from '@/api/system/config'
import AddGroup from './components/add-group.vue'
import ManageConfig from './components/manage-config.vue'

const manageConfigRef = ref()
const addGroupRef = ref()
const form = ref({})
const formArray = ref([])
const configGroupData = ref([])
const loading = ref(false)
const title = ref('')
const name = ref('')
const deleteGroupData = ref({ name: '' })
const deleteVisible = ref(false)
const currentNode = ref({})
const email = ref('')

// 刷新配置数据
const refresh = async () => {
  getConfigData(currentNode.value.id, currentNode.value.name, currentNode.value.code)
}

// 删除配置组
const openDeleteModal = (data) => {
  const id = data.id
  if (id == 1 || id == 2 || id == 3) {
    Message.info('该配置为系统核心配置，无法删除')
    return
  }
  deleteGroupData.value = configGroupData.value.find((item) => item.id == id)
  deleteVisible.value = true
}

// 获取配置组数据
const getConfigGroupList = async () => {
  const response = await config.getConfigGroupList()
  configGroupData.value = response.data
  const item = configGroupData.value[0]
  await getConfigData(item.id, item.name, item.code)
}

// 获取配置数据
const getConfigData = async (id, name, code) => {
  currentNode.value.id = id
  currentNode.value.name = name
  currentNode.value.code = code
  loading.value = true
  const params = {
    group_id: id,
    orderBy: 'sort',
    orderType: 'desc',
  }
  title.value = name
  const response = await config.getConfigList(params)
  response.data.map((item) => {
    if (
      item.key.indexOf('local_') !== -1 ||
      item.key.indexOf('qiniu_') !== -1 ||
      item.key.indexOf('cos_') !== -1 ||
      item.key.indexOf('oss_') !== -1 ||
      item.key.indexOf('s3_') !== -1
    ) {
      item.display = false
    } else {
      item.display = true
    }
    return item
  })
  formArray.value = response.data
  if (id === 2) {
    formArray.value.map((item) => {
      if (item.key === 'upload_mode') {
        handleSelect(item.value, item)
      }
    })
  }
  loading.value = false
}

// 自定义处理切换显示
const handleSelect = async (val, ele) => {
  if (ele.key === 'upload_mode') {
    if (val == 1) {
      formArray.value.map((item) => {
        if (item.key.indexOf('local_') !== -1) {
          item.display = true
        }
        if (
          item.key.indexOf('qiniu_') !== -1 ||
          item.key.indexOf('cos_') !== -1 ||
          item.key.indexOf('oss_') !== -1 ||
          item.key.indexOf('s3_') !== -1
        ) {
          item.display = false
        }
      })
    }
    if (val == 2) {
      formArray.value.map((item) => {
        if (item.key.indexOf('oss_') !== -1) {
          item.display = true
        }
        if (
          item.key.indexOf('qiniu_') !== -1 ||
          item.key.indexOf('cos_') !== -1 ||
          item.key.indexOf('local_') !== -1 ||
          item.key.indexOf('s3_') !== -1
        ) {
          item.display = false
        }
      })
    }
    if (val == 3) {
      formArray.value.map((item) => {
        if (item.key.indexOf('qiniu_') !== -1) {
          item.display = true
        }
        if (
          item.key.indexOf('local_') !== -1 ||
          item.key.indexOf('cos_') !== -1 ||
          item.key.indexOf('oss_') !== -1 ||
          item.key.indexOf('s3_') !== -1
        ) {
          item.display = false
        }
      })
    }
    if (val == 4) {
      formArray.value.map((item) => {
        if (item.key.indexOf('cos_') !== -1) {
          item.display = true
        }
        if (
          item.key.indexOf('qiniu_') !== -1 ||
          item.key.indexOf('local_') !== -1 ||
          item.key.indexOf('oss_') !== -1 ||
          item.key.indexOf('s3_') !== -1
        ) {
          item.display = false
        }
      })
    }
    if (val == 5) {
      formArray.value.map((item) => {
        if (item.key.indexOf('s3_') !== -1) {
          item.display = true
        }
        if (
          item.key.indexOf('qiniu_') !== -1 ||
          item.key.indexOf('cos_') !== -1 ||
          item.key.indexOf('local_') !== -1 ||
          item.key.indexOf('oss_') !== -1
        ) {
          item.display = false
        }
      })
    }
  }
}

// 修改配置
const submit = async (params) => {
  if (!auth('/core/config/save')) {
    Message.info('没有权限修改配置')
    return
  }
  const data = {
    group_id: currentNode.value.id,
    config: params,
  }
  const response = await config.batchUpdate(data)
  if (response.code === 200) {
    Message.success(response.message)
  }
}

// 发送测试邮件
const sendMail = async () => {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (!reg.test(email.value)) {
    Message.info('请输入正确的邮箱地址')
    return
  }
  const response = await config.testEmail({ email: email.value })
  if (response.code === 200) {
    Message.success(response.message)
  }
}

// 管理配置数据
const manageConfigModal = () => {
  const group_id = currentNode.value.id
  manageConfigRef.value.open(group_id)
}

// 添加配置分组
const addGroupModal = () => addGroupRef.value?.open()

// 修改配置分组
const editGroupModal = (item) => {
  addGroupRef.value?.open('edit')
  addGroupRef.value?.setFormData(item)
}

// 删除配置分组
const deleteConfigGroup = async (done) => {
  if (name.value !== deleteGroupData.value.name) {
    Message.error(`输入错误，验证失败`)
    done(false)
    return
  }
  const response = await config.deleteConfigGroup({ ids: deleteGroupData.value.id })
  if (response.code === 200) {
    Message.success('配置删除成功')
    deleteGroupData.value = {}
    getConfigGroupList()
    done(true)
  }
}

// 页面加载完成执行
onMounted(() => {
  getConfigGroupList()
})
</script>
