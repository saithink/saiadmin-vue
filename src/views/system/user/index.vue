<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <div class="lg:w-2/12 w-full h-full p-2 shadow">
      <ma-tree-slider
        :data="depts"
        searchPlaceholder="搜索部门"
        v-model="defaultKey"
        @click="switchDept"
      />
    </div>

    <div class="lg:w-10/12 w-full lg:ml-4 mt-5 lg:mt-0">
      <!-- CRUD 组件 -->
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
        <!-- 状态列 -->
        <template #status="{ record }">
          <a-switch
            :checked-value="1"
            unchecked-value="2"
            @change="changeStatus($event, record.id)"
            :default-checked="record.status == 1" 
          />
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
        <!-- 操作列扩展 -->
        <template #operationAfterExtend="{ record }">
          <a-dropdown
            trigger="hover"
            v-if="record.id != 1 && ! isRecovery"
            @select="selectOperation($event, record.id)"
          >
          
            <a-link><icon-double-right /> 更多</a-link>
            <template #content>
              <a-doption value="updateCache" v-auth="['/core/user/cache']">更新缓存</a-doption>
              <a-doption value="setHomePage" v-auth="['/core/user/setHomePage']">设置首页</a-doption>
              <a-doption value="resetPassword" v-auth="['/core/user/initUserPassword']">重置密码</a-doption>
            </template>
          </a-dropdown>
        </template>
      </ma-crud>
    </div>

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
  import MaTreeSlider from '@cps/ma-treeSlider/index.vue'
  import dept from '@/api/system/dept'
  import user from '@/api/system/user'
  import commonApi from '@/api/common'
  import { Message, Modal } from '@arco-design/web-vue'

  const depts = ref([{ label: '所有部门', value: 0 }])
  const homePageList = ref([])
  const crudRef = ref()

  const setHomeVisible = ref(false)
  const userid = ref()
  const homePage = ref('')
  const defaultKey = ref([0])

  onMounted(() => {
    dept.tree().then(res => {
      res.data.map(item => {
        depts.value.push(item)
      })
    })
    commonApi.getDict('dashboard').then(res => homePageList.value = res.data )
  })

  let isRecovery = computed(() => crudRef.value ? crudRef.value.isRecovery : false )

  const switchDept = (id) => {
    crudRef.value.requestParams = id[0] === 0 ? { dept_id: undefined } : { dept_id: id[0] }
    crudRef.value.requestData()
    defaultKey.value = id
  }

  const changeStatus = async (status, id) => {
    const response = await user.changeStatus({ id, status })
    if (response.code === 200) {
      Message.success(response.message)
    }
  }

  const updateCache = id => {
    user.clearCache({ id }).then(res => {
      if (res.code === 200) Message.success(res.message)
    })
  }
  
  const resetPassword = (id) => {
    user.initUserPassword({ id }).then(res => res.code === 200 && Message.success(res.message) )
  }

  const saveHomePage = (done) => {
    user.setHomePage({ id: userid.value, dashboard: homePage.value }).then(res => {
      res.code === 200 && Message.success(res.message)
    })
    done(true)
  }

  const selectOperation = (value, id) => {
    if (value === 'resetPassword') {
      Modal.info({
        title: '提示',
        content: '确定将该用户密码重置为 123456 吗？',
        simple: false,
        onBeforeOk: (done) => {
          resetPassword(id)
          done(true)
        }
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

  const crud = reactive({
    api: user.getPageList,
    recycleApi: user.getRecyclePageList,
    searchColNumber: 3,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 200,
    add: { show: true, api: user.save, auth: ['/core/user/save'] },
    edit: { show: true, api: user.update, auth: ['/core/user/update'] },
    delete: {
      show: true,
      api: user.deletes, auth: ['/core/user/destroy'],
      realApi: user.realDestroy, realAuth: ['/core/user/realDestroy']
    },
    recovery: { show: true, api: user.recoverys, auth: ['/core/user/recovery']},
    formOption: {
      width: 800,
      layout: [
        { formType: 'grid', cols: [ { span: 24, formList: [ { dataIndex: 'avatar' }] }]  },
        { formType: 'grid', cols: [ { span: 12, formList: [ { dataIndex: 'username' }] }, { span: 12, formList: [{ dataIndex: 'dept_id' }] }]  },
        { formType: 'grid', cols: [ { span: 12, formList: [ { dataIndex: 'password' }] }, { span: 12, formList: [{ dataIndex: 'nickname' }] }]  },
        { formType: 'grid', cols: [ { span: 12, formList: [ { dataIndex: 'role_ids' }] }, { span: 12, formList: [{ dataIndex: 'phone' }] }]  },
        { formType: 'grid', cols: [ { span: 12, formList: [ { dataIndex: 'post_ids' }] }, { span: 12, formList: [{ dataIndex: 'email' }] }]  },
        { formType: 'grid', cols: [ { span: 24, formList: [ { dataIndex: 'status' }] }] },
        { formType: 'grid', cols: [ { span: 24, formList: [ { dataIndex: 'remark' }] }] },
      ]
    },
    isDbClickEdit: false,
    beforeOpenEdit: (record) => {
      if (record.id === 1) {
        Message.error('创始人不可编辑')
        return false
      }
      return true
    },
    beforeDelete: (ids) => {
      if (ids.includes(1)) {
        Message.error('创始人不可删除')
        return false
      }
      return true
    }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
      title: '头像', dataIndex: 'avatar', width: 75, formType: 'upload', returnType: 'url',
      type: 'image', rounded: true, labelWidth: '86px'
    },
    { 
      title: '账户', dataIndex: 'username', width: 130, search: true, addDisabled: false, editDisabled: true,
      commonRules: [{ required: true, message: '账户必填' }]
    },
    {
      title: '所属部门', dataIndex: 'dept_id', hide: true, formType: 'tree-select',
      multiple: false, treeCheckable: false, treeCheckStrictly: true,
      dict: { url: '/core/dept/index?tree=true' }, commonRules: [{ required: true, message: '所属部门必选' }],
      validateTrigger: 'focus',
      filterTreeNode: (searchValue, nodeData)=>{
        return nodeData.label.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
      },
      editDefaultValue: async (record) => {
        return record.dept_id == 0 ? undefined : record.dept_id
      }
    },
    { 
      title: '密码', dataIndex: 'password', hide: true, autocomplete: 'off',
      addDefaultValue: '123456', editDefaultValue: '', addDisabled: false, editDisabled: true, type: 'password',
      addRules: [{ required: true, message: '密码必填' }],
    },
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { 
      title: '角色', dataIndex: 'role_ids', width: 120, formType: 'select', multiple: true,
      dict: { url: '/core/role/index?saiType=all', props: { label: 'name', value: 'id' } }, hide: true, 
      commonRules: [{ required: true, message: '角色必选' }],
      editDefaultValue: async (record) => {
        const response = await user.read(record.id)
        return response.data.roleList.map(item => item.id )
      }
    },
    {
      title: '手机', dataIndex: 'phone', width: 150, search: true,
      commonRules: [{ match: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }]
    },
    { 
      title: '岗位', dataIndex: 'post_ids', width: 120, formType: 'select', multiple: true,
      dict: { url: '/core/post/index?saiType=all', props: { label: 'name', value: 'id' } }, hide: true,
      editDefaultValue: async (record) => {
        const response = await user.read(record.id)
        const ids = response.data.postList.map(item => item.id )
        return ids
      }
    },
    {
      title: '邮箱', dataIndex: 'email', width: 200, search: true,
      commonRules: [{ type: 'email', message: '请输入正确的邮箱' }]
    },
    {
      title: '状态', dataIndex: 'status', width: 100, search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'label', value: 'value' } },
      addDefaultValue: '1', labelWidth: '86px'
    },
    {
      title: '备注', dataIndex: 'remark', width: 180, hide: true,
      formType: 'textarea', labelWidth: '86px'
    },
    {
      title: '注册时间', dataIndex: 'create_time', width: 180, addDisplay: false, editDisplay: false,
      search: true, formType: 'range'
    },
  ])
</script>

<script>
export default { name: 'system:user' }
</script>

<style scoped>

</style>