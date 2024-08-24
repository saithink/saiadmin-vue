<template>
  <div class="ma-content-block lg:flex justify-between">
    <div class="lg:w-2/12 pt-4 pl-2 pr-2">
      <sa-tree-slider :data="depts" search-placeholder="搜索部门" @click="switchDept" v-model="defaultKey" />
    </div>

    <div class="lg:w-10/12 w-full">
      <!-- CRUD 组件 -->
      <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm" @resetSearch="handleReset">
        <!-- 搜索区 tableSearch -->
        <template #tableSearch>
          <a-col :span="8">
            <a-form-item field="username" label="账号名称">
              <a-input v-model="searchForm.username" placeholder="请输入账号名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="phone" label="手机">
              <a-input v-model="searchForm.phone" placeholder="请输入手机" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="email" label="邮箱">
              <a-input v-model="searchForm.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item field="create_time" label="注册时间">
              <a-range-picker v-model="searchForm.create_time" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="status" label="状态">
              <sa-select v-model="searchForm.status" dict="data_status" placeholder="请选择状态" alow-clear />
            </a-form-item>
          </a-col>
        </template>

        <!-- Table 自定义渲染 -->
        <!-- 状态列 -->
        <template #status="{ record }">
          <sa-switch v-model="record.status" @change="changeStatus($event, record.id)"></sa-switch>
        </template>
        <!-- 头像列 -->
        <template #avatar="{ record }">
          <a-avatar>
            <img :src="record.avatar ? $tool.showFile(record.avatar) : $url + 'avatar.jpg'" style="object-fit: cover" />
          </a-avatar>
        </template>
        <!-- 操作列 -->
        <template #operationCell="{ record }">
          <div v-if="record.id == 1">
            <a-link @click="updateCache(record.id)"><icon-refresh /> 更新缓存</a-link>
          </div>
        </template>
        <!-- 操作后置扩展 -->
        <template #operationAfterExtend="{ record }">
          <a-dropdown trigger="hover" v-if="record.id != 1 && !isRecovery" @select="selectOperation($event, record.id)">
            <a-link><icon-double-right /> 更多</a-link>
            <template #content>
              <a-doption value="updateCache" v-auth="['/core/user/cache']">更新缓存</a-doption>
              <a-doption value="setHomePage" v-auth="['/core/user/setHomePage']">设置首页</a-doption>
              <a-doption value="resetPassword" v-auth="['/core/user/initUserPassword']">重置密码</a-doption>
            </template>
          </a-dropdown>
        </template>
      </sa-table>
    </div>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />

    <!-- 设置首页 -->
    <a-modal v-model:visible="setHomeVisible" @before-ok="saveHomePage">
      <template #title>设置用户后台首页</template>
      <a-form-item label="用户首页">
        <a-select v-model="homePage" placeholder="请选择用户首页">
          <a-option v-for="(item, index) in homePageList" :key="index" :value="item.value">
            {{ item.label }}
          </a-option>
        </a-select>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import api from '@/api/system/user'
import commonApi from '@/api/common'
import { Message, Modal } from '@arco-design/web-vue'
import EditForm from './edit.vue'

const depts = ref([{ label: '所有部门', value: 0 }])
const homePageList = ref([])
const crudRef = ref()
const editRef = ref()

const searchForm = ref({
  username: '',
  phone: '',
  email: '',
  status: '',
  create_time: [],
  dept_id: '',
})

const setHomeVisible = ref(false)
const userid = ref()
const homePage = ref('')
const defaultKey = ref([0])

let isRecovery = computed(() => (crudRef.value ? crudRef.value.isRecovery : false))

const handleReset = async () => {
  defaultKey.value = [0]
  searchForm.value.dept_id = ''
}

const switchDept = (id) => {
  searchForm.value.dept_id = id[0] === 0 ? '' : id[0]
  crudRef.value.refresh()
  defaultKey.value = id
}

const changeStatus = async (status, id) => {
  const response = await api.changeStatus({ id, status })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

const updateCache = (id) => {
  api.clearCache({ id }).then((res) => res.code === 200 && Message.success(res.message))
}

const resetPassword = async (id) => {
  api.initUserPassword({ id }).then((res) => res.code === 200 && Message.success(res.message))
}

const saveHomePage = async (done) => {
  const resp = await api.setHomePage({ id: userid.value, dashboard: homePage.value })
  if (resp.code === 200) {
    Message.success(resp.message)
    crudRef.value.refresh()
    done(true)
  }
  done(false)
}

const selectOperation = (value, id) => {
  if (value === 'resetPassword') {
    Modal.info({
      title: '提示',
      content: '确定将该用户密码重置为 sai123456 吗？',
      simple: false,
      onBeforeOk: (done) => {
        resetPassword(id)
        done(true)
      },
    })
    return
  }

  if (value === 'updateCache') {
    updateCache(id)
    return
  }

  if (value === 'setHomePage') {
    setHomeVisible.value = true
    userid.value = id
    return
  }
}

const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  operationColumnWidth: 210,
  add: {
    show: true,
    auth: ['/core/user/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/core/user/update'],
    func: async (record) => {
      editRef.value?.open('edit', record.id)
    },
  },
  delete: {
    show: true,
    auth: ['/core/user/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/core/user/realDestroy'],
    realFunc: async (params) => {
      const resp = await api.realDestroy(params)
      if (resp.code === 200) {
        Message.success(`销毁成功！`)
        crudRef.value?.refresh()
      }
    },
  },
  recovery: {
    show: true,
    auth: ['/core/user/recovery'],
    func: async (params) => {
      const resp = await api.recovery(params)
      if (resp.code === 200) {
        Message.success(`恢复成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

const columns = reactive([
  { title: '头像', dataIndex: 'avatar', width: 75 },
  { title: '账户', dataIndex: 'username', width: 130 },
  { title: '昵称', dataIndex: 'nickname', width: 120 },
  { title: '手机', dataIndex: 'phone', width: 150 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
  { title: '状态', dataIndex: 'status', width: 100, dict: 'data_status' },
  { title: '工作台', dataIndex: 'dashboard', width: 100 },
  { title: '注册时间', dataIndex: 'create_time', width: 180 },
])

const initPage = async () => {
  const resp = await commonApi.commonGet('/core/dept/accessDept')
  resp.data.map((item) => {
    depts.value.push(item)
  })

  const dashResp = await commonApi.getDict('dashboard')
  homePageList.value = dashResp.data
}

const refresh = async () => {
  crudRef.value?.refresh()
}

onMounted(() => {
  initPage()
  refresh()
})
</script>

<style scoped></style>
