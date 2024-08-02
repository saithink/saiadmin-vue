<template>
  <div class="ma-content-block">
    <a-space class="flex">
      <a-button type="primary" @click="open">
        <template #icon><icon-select-all /></template>{{ props.text }}
      </a-button>
      <a-tag size="large" color="blue" v-if="props.isEcho">已选择 {{ isArray(selecteds) ? selecteds.length : 0 }} 位</a-tag>
      <a-input-tag
        v-model="userList"
        v-if="props.isEcho"
        :style="{ width: '320px' }"
        :placeholder="'请点击前面按钮' + props.text"
        :max-tag-count="3"
        disabled />
    </a-space>

    <a-modal v-model:visible="visible" width="1000px" draggable :on-before-ok="close" unmountOnClose>
      <template #title>{{ props.text }}</template>

      <sa-table
        ref="crudRef"
        :options="options"
        :columns="columns"
        :searchForm="searchForm"
        v-model:selected-keys="selecteds"
        @selection-change="selectHandler">
        <!-- 搜索区 tableSearch -->
        <template #tableSearch>
          <a-col :span="8">
            <a-form-item field="username" label="账户">
              <a-input v-model="searchForm.username" placeholder="请输入账户" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="phone" label="手机">
              <a-input v-model="searchForm.phone" placeholder="请输入手机" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="post_ids" label="岗位">
              <a-select
                v-model="searchForm.post_id"
                :options="postData"
                :field-names="{ label: 'name', value: 'id' }"
                allow-clear
                placeholder="请选择岗位" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="dept_id" label="部门">
              <a-tree-select
                v-model="searchForm.dept_id"
                :data="deptData"
                :field-names="{ key: 'value', title: 'label' }"
                allow-clear
                placeholder="请选择所属部门">
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="role_ids" label="角色">
              <a-select
                v-model="searchForm.role_id"
                :options="roleData"
                :field-names="{ label: 'name', value: 'id' }"
                allow-clear
                placeholder="请选择角色" />
            </a-form-item>
          </a-col>
        </template>
      </sa-table>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import commonApi from '@/api/common'
import { Message } from '@arco-design/web-vue'
import { isArray, isEmpty } from 'lodash'

const props = defineProps({
  modelValue: { type: Array },
  isEcho: { type: Boolean, default: false },
  multiple: { type: Boolean, default: true },
  onlyId: { type: Boolean, default: true },
  text: { type: String, default: '选择用户' },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const crudRef = ref()
const selecteds = ref([])
const userList = ref([])
const deptData = ref([])
const roleData = ref([])
const postData = ref([])

const open = async () => {
  visible.value = true
  initPage()
  await nextTick()
  crudRef.value?.refresh()

  setTimeout(() => {
    selecteds.value = props.modelValue
  }, 500)
}

const initPage = async () => {
  const deptResp = await commonApi.commonGet('/core/dept/index?tree=true')
  deptData.value = deptResp.data

  const roleResp = await commonApi.commonGet('/core/role/index?saiType=all')
  roleData.value = roleResp.data

  const postResp = await commonApi.commonGet('/core/post/index?saiType=all')
  postData.value = postResp.data
}

onMounted(() => {
  if (props.isEcho && props.onlyId) selecteds.value = props.modelValue
})

watch(
  () => props.modelValue,
  (val) => {
    if (props.isEcho && props.onlyId) selecteds.value = val
    if (val.length == 0) userList.value = []
  }
)

const selectHandler = (rows) => {
  selecteds.value = rows
}

const close = async (done) => {
  if (isArray(selecteds.value) && selecteds.value.length > 0) {
    const response = await commonApi.getUserInfoByIds({ ids: selecteds.value })
    if (!isEmpty(response) && isArray(response.data)) {
      userList.value = response.data.map((item) => {
        return `${item.username}(${item.id})`
      })
      if (props.onlyId) {
        emit('update:modelValue', selecteds.value)
      } else {
        emit('update:modelValue', response.data)
      }
      emit('success', true)
      Message.success('选择成功')
    }
  } else {
    emit('update:modelValue', [])
    userList.value = []
  }
  done(true)
}

const searchForm = ref({
  username: '',
  phone: '',
  dept_id: '',
  role_id: '',
  post_id: '',
})

const options = ref({
  api: commonApi.getUserList,
  pageSimple: true,
  rowSelection: props.multiple ? { type: 'checkbox', showCheckedAll: true } : { type: 'radio' },
})

const columns = ref([
  { title: '账户', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'nickname' },
  { title: '手机', dataIndex: 'phone' },
  { title: '邮箱', dataIndex: 'email' },
])
</script>

<style scoped>
:deep(.arco-tabs-nav-type-capsule .arco-tabs-nav-tab) {
  justify-content: flex-start;
}
</style>
