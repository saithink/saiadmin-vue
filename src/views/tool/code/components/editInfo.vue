<template>
  <a-modal v-model:visible="visible" :on-before-ok="save" fullscreen unmount-on-close>
    <template #title>编辑生成信息 - {{ record?.table_comment }}</template>
    <a-spin :loading="loading" tip="加载数据中..." class="w-full">
      <a-form :model="form" ref="formRef">
        <a-tabs v-model:active-key="activeTab">
          <a-tab-pane title="配置信息" key="base_config">
            <a-divider orientation="left">基础信息</a-divider>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  label="表名称"
                  field="table_name"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }">
                  <a-input v-model="form.table_name" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="表描述"
                  field="table_comment"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '表描述必填' }]">
                  <a-input v-model="form.table_comment" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="实体类"
                  field="class_name"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '实体类必填' }]">
                  <a-input v-model="form.class_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  label="业务名称"
                  field="business_name"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '实体别名必填' }]">
                  <a-input v-model="form.business_name" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="数据源" field="source" label-col-flex="auto" :label-col-style="{ width: '94px' }">
                  <a-select placeholder="请选择数据源" v-model="form.source" :options="dataSourceList" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="备注信息" field="remark" label-col-flex="auto" :label-col-style="{ width: '94px' }">
                  <a-textarea v-model="form.remark" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-divider orientation="left">生成信息</a-divider>
            <a-row :gutter="24">
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="应用类型"
                  field="template"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '应用类型必选' }]"
                  extra="默认app模板,生成文件放app目录下">
                  <a-select
                    style="width: 100%"
                    v-model="form.template"
                    :options="[
                      { label: 'webman应用[app]', value: 'app' },
                      { label: 'webman插件[plugin]', value: 'plugin' },
                    ]"
                    allow-clear
                    allow-search
                    placeholder="请选择生成模板" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="应用名称"
                  field="namespace"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '应用名称必填' }]"
                  extra="plugin插件名称, 或者app下应用名称, 禁止使用saiadmin">
                  <a-input v-model="form.namespace" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="包名"
                  field="package_name"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  extra="指定控制器文件所在控制器目录的二级目录名，如：system">
                  <a-input allow-clear v-model="form.package_name" placeholder="请输入包名" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="生成类型"
                  field="tpl_category"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '生成类型必填' }]"
                  extra="单表须有主键，树表须指定id、parent_id、name等字段">
                  <a-select
                    style="width: 100%"
                    v-model="form.tpl_category"
                    :options="[
                      { label: '单表CRUD', value: 'single' },
                      { label: '树表CRUD', value: 'tree' },
                    ]"
                    allow-clear
                    allow-search
                    placeholder="请选择所属模块" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="生成路径"
                  field="generate_path"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '生成路径必填' }]"
                  extra="前端根目录文件夹名称，必须与后端根目录同级">
                  <a-input v-model="form.generate_path" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="模型类型"
                  field="generate_model"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  extra="根据不同选择生成不同的模型">
                  <a-radio-group v-model="form.generate_model">
                    <a-radio :value="1">软删除</a-radio>
                    <a-radio :value="2">非软删除</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="所属菜单"
                  field="belong_menu_id"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  extra="默认为工具菜单栏目下的子菜单。不选择则为顶级菜单栏目">
                  <a-cascader
                    v-model="form.belong_menu_id"
                    :options="menus"
                    expand-trigger="hover"
                    :style="{ width: '100%' }"
                    placeholder="生成功能所属菜单"
                    allow-search
                    allow-clear
                    check-strictly />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="8" :xl="8">
                <a-form-item
                  label="菜单名称"
                  field="menu_name"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '菜单名称必选' }]"
                  extra="显示在菜单栏目上的菜单名称、以及代码中的业务功能名称">
                  <a-input allow-clear v-model="form.menu_name" placeholder="请输入菜单名称" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  label="表单样式"
                  field="component_type"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  extra="设置新增和修改组件显示方式">
                  <a-radio-group v-model="form.component_type" type="button">
                    <a-radio :value="1">模态框</a-radio>
                    <a-radio :value="2">抽屉</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="表单宽度"
                  field="form_width"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  extra="表单组件的宽度，单位为px">
                  <a-input-number v-model="form.form_width" :min="200" :max="10000" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="表单全屏"
                  field="is_full"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  extra="编辑表单是否全屏">
                  <a-radio-group v-model="form.is_full">
                    <a-radio :value="1">否</a-radio>
                    <a-radio :value="2">是</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <div v-if="form.tpl_category === 'tree'">
              <a-divider orientation="left">树表配置</a-divider>
              <a-row :gutter="24">
                <a-col :xs="24" :md="8" :xl="8">
                  <a-form-item
                    label="树主ID"
                    field="tree_id"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="指定树表的主要ID，一般为主键">
                    <a-select
                      style="width: 100%"
                      v-model="formOptions.tree_id"
                      allow-clear
                      allow-search
                      placeholder="请选择树表的主ID">
                      <a-option
                        class="w-full"
                        v-for="(item, index) in form.columns"
                        :label="item.column_name + ' - ' + item.column_comment"
                        :value="item.column_name"
                        :key="index">
                        <div class="flex justify-between w-full">
                          <span>{{ item.column_name }}</span>
                          <span>{{ item.column_comment }}</span>
                        </div>
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :md="8" :xl="8">
                  <a-form-item
                    label="树父ID"
                    field="tree_parent_id"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="指定树表的父ID，比如：parent_id">
                    <a-select
                      style="width: 100%"
                      v-model="formOptions.tree_parent_id"
                      allow-clear
                      allow-search
                      placeholder="请选择树表的父ID">
                      <a-option
                        class="w-full"
                        v-for="(item, index) in form.columns"
                        :label="item.column_name + ' - ' + item.column_comment"
                        :value="item.column_name"
                        :key="index">
                        <div class="flex justify-between w-full">
                          <span>{{ item.column_name }}</span>
                          <span>{{ item.column_comment }}</span>
                        </div>
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :md="8" :xl="8">
                  <a-form-item
                    label="树名称"
                    field="tree_name"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="指定树显示的名称字段，比如：name">
                    <a-select
                      style="width: 100%"
                      v-model="formOptions.tree_name"
                      allow-clear
                      allow-search
                      placeholder="请选择树表的主ID">
                      <a-option
                        class="w-full"
                        v-for="(item, index) in form.columns"
                        :label="item.column_name + ' - ' + item.column_comment"
                        :value="item.column_name"
                        :key="index">
                        <div class="flex justify-between w-full">
                          <span>{{ item.column_name }}</span>
                          <span>{{ item.column_comment }}</span>
                        </div>
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <a-tab-pane title="字段配置" key="field_config">
            <a-alert title="提示">
              使用数组形式字段的组件，请在模型设置
              <a-tag class="tag-primary">获取器</a-tag>
              和 <a-tag class="tag-primary">修改器</a-tag>
            </a-alert>
            <a-table :data="form.columns" :pagination="false" class="mt-3">
              <template #columns>
                <a-table-column dataIndex="sort" title="排序" :width="90">
                  <template #cell="{ rowIndex }"><a-input-number v-model="form.columns[rowIndex].sort" /></template>
                </a-table-column>
                <a-table-column dataIndex="column_name" title="字段名称" :width="150" tooltip></a-table-column>
                <a-table-column dataIndex="column_comment" title="字段描述" :width="160">
                  <template #cell="{ rowIndex }"
                    ><a-input v-model="form.columns[rowIndex].column_comment" allow-clear
                  /></template>
                </a-table-column>
                <a-table-column dataIndex="column_type" title="物理类型" :width="100"></a-table-column>
                <a-table-column dataIndex="is_required" title="必填" :width="60">
                  <template #title
                    >必填
                    <a-tooltip content="全选 / 全不选" position="bottom"
                      ><a-checkbox @change="handlerAll($event, 'required')"
                    /></a-tooltip>
                  </template>
                  <template #cell="{ rowIndex }"><a-checkbox v-model="form.columns[rowIndex].is_required" /></template>
                </a-table-column>
                <a-table-column dataIndex="is_insert" title="插入" :width="60">
                  <template #title
                    >表单
                    <a-tooltip content="全选 / 全不选" position="bottom"
                      ><a-checkbox @change="handlerAll($event, 'insert')"
                    /></a-tooltip>
                  </template>
                  <template #cell="{ rowIndex }"><a-checkbox v-model="form.columns[rowIndex].is_insert" /></template>
                </a-table-column>
                <a-table-column dataIndex="is_list" title="列表" :width="60">
                  <template #title
                    >列表
                    <a-tooltip content="全选 / 全不选" position="bottom"
                      ><a-checkbox @change="handlerAll($event, 'list')"
                    /></a-tooltip>
                  </template>
                  <template #cell="{ rowIndex }"><a-checkbox v-model="form.columns[rowIndex].is_list" /></template>
                </a-table-column>
                <a-table-column dataIndex="is_query" title="查询" :width="60">
                  <template #title
                    >查询
                    <a-tooltip content="全选 / 全不选" position="bottom"
                      ><a-checkbox @change="handlerAll($event, 'query')"
                    /></a-tooltip>
                  </template>
                  <template #cell="{ rowIndex }"><a-checkbox v-model="form.columns[rowIndex].is_query" /></template>
                </a-table-column>
                <a-table-column dataIndex="is_sort" title="排序" :width="60">
                  <template #title
                    >排序
                    <a-tooltip content="全选 / 全不选" position="bottom"
                      ><a-checkbox @change="handlerAll($event, 'sort')"
                    /></a-tooltip>
                  </template>
                  <template #cell="{ rowIndex }"><a-checkbox v-model="form.columns[rowIndex].is_sort" /></template>
                </a-table-column>
                <a-table-column dataIndex="query_type" title="查询方式" :width="150">
                  <template #cell="{ rowIndex }"
                    ><a-select
                      v-model="form.columns[rowIndex].query_type"
                      :options="vars.queryType"
                      allow-clear></a-select
                  ></template>
                </a-table-column>
                <a-table-column dataIndex="view_type" title="页面控件" :width="220">
                  <template #cell="{ record, rowIndex }">
                    <a-space>
                      <a-select
                        v-model="form.columns[rowIndex].view_type"
                        :style="{ width: '140px' }"
                        :options="vars.viewComponent"
                        allow-clear></a-select>
                      <a-link
                        v-if="notNeedSettingComponents.includes(record.view_type)"
                        @click="settingComponentRef.open(record)"
                        >设置</a-link
                      >
                    </a-space>
                  </template>
                </a-table-column>
                <a-table-column dataIndex="dict_type" title="数据字典" :width="160">
                  <template #cell="{ record, rowIndex }">
                    <a-select
                      v-model="form.columns[rowIndex].dict_type"
                      :options="dicts"
                      allow-clear
                      :field-names="{ label: 'name', value: 'code' }"
                      placeholder="选择数据字典"
                      :disabled="!['saSelect', 'radio', 'checkbox'].includes(record.view_type)"></a-select>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane title="关联配置" key="relation_config">
            <a-alert title="提示">模型关联支持：一对一、一对多、一对一（反向）、多对多。</a-alert>
            <a-button @click="addRelation" type="primary" class="mt-3"><icon-plus /> 新增关联</a-button>
            <div v-for="(item, index) in formOptions.relations" :key="index">
              <a-divider orientation="left">
                {{ item.name ? item.name : '定义新关联' }}
                <a-link @click="delRelation(index)" class="ml-5"><icon-delete /> 删除定义</a-link>
              </a-divider>
              <a-row :gutter="24">
                <a-col :xs="24" :md="12" :xl="12">
                  <a-form-item
                    label="关联类型"
                    field="type"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="指定关联类型">
                    <a-select v-model="item.type" allow-clear allow-search placeholder="请选择关联类型">
                      <a-option
                        v-for="types in vars.realtionsType"
                        :key="types.value"
                        :value="types.value"
                        :label="types.name" />
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12" :xl="12">
                  <a-form-item
                    label="关联名称"
                    field="name"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="设置关联名称，且是代码中调用的名称">
                    <a-input v-model="item.name" allow-clear placeholder="设置关联名称" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :xs="24" :md="12" :xl="12">
                  <a-form-item
                    label="关联模型"
                    field="model"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="选择要关联的模型">
                    <a-input v-model="item.model" allow-clear placeholder="设置关联模型" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12" :xl="12">
                  <a-form-item
                    :label="
                      item.type === 'belongsTo' ? '外键' : item.type === 'belongsToMany' ? '外键' : '当前模型主键'
                    "
                    field="localKey"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    :extra="
                      item.type === 'belongsTo'
                        ? '关联模型_id'
                        : item.type === 'belongsToMany'
                        ? '关联模型_id'
                        : '当前模型主键'
                    ">
                    <a-input v-model="item.localKey" allow-clear placeholder="设置键名" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :xs="24" :md="12" :xl="12" v-show="item.type === 'belongsToMany'">
                  <a-form-item
                    label="中间模型"
                    field="model"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    extra="多对多关联的中间模型">
                    <a-input v-model="item.table" allow-clear placeholder="请输入中间模型" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :md="12" :xl="12">
                  <a-form-item
                    :label="item.type === 'belongsTo' ? '关联主键' : '外键'"
                    field="foreignKey"
                    label-col-flex="auto"
                    :label-col-style="{ width: '100px' }"
                    :extra="item.type === 'belongsTo' ? '关联模型主键' : '当前模型_id'">
                    <a-input style="width: 100%" v-model="item.foreignKey" allow-clear placeholder="设置键名" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-spin>
    <setting-component ref="settingComponentRef" @confrim="confrimSetting" />
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'

// 接口导入
import generate from '@/api/tool/generate'
import database from '@/api/system/database'
import menuApi from '@/api/system/menu'
import { dictType } from '@/api/system/dict'

import SettingComponent from './settingComponent.vue'

// 导入变量
import * as vars from '../js/vars.js'

const record = ref({})
const loading = ref(true)
const visible = ref(false)
const activeTab = ref('base_config')
const settingComponentRef = ref()

const notNeedSettingComponents = ref([
  'uploadFile',
  'uploadImage',
  'editor',
  'codeEditor',
  'wangEditor',
  'cityLinkage',
  'date',
  'userInfo',
])

const form = ref({
  generate_menus: ['save', 'update', 'read', 'delete', 'recycle', 'recovery', 'realDestroy', 'changeStatus'],
  columns: [],
})

const formRef = ref()

const emit = defineEmits(['success'])

// form扩展组
const formOptions = ref({
  relations: [],
})
// 菜单列表
const menus = ref([])
// 角色列表
const roles = ref([])
// 字典列表
const dicts = ref([])
// 模型列表
const models = ref([])
// 表列表
const tables = ref([])
// 模块信息
const modules = ref([])
// 数据源
const dataSourceList = ref([])

const open = async (id) => {
  visible.value = true
  const source = await database.getDataSource()
  dataSourceList.value = source.data.map((item) => {
    return { label: item, value: item }
  })
  const response = await generate.readTable(id)
  record.value = response.data
  init()
  loading.value = false
}

const confrimSetting = (name, value) => {
  form.value.columns.find((item, idx) => {
    if (item.column_name == name) {
      form.value.columns[idx].options = value
    }
  })
  Message.success('组件设置成功')
}

const save = async (done) => {
  if (form.value.namespace === 'saiadmin') {
    Message.error('应用名称不能为saiadmin')
    return false
  }
  const validResult = await formRef.value.validate()
  if (validResult) {
    for (let i in validResult) {
      Message.error(validResult[i].message)
    }
    return false
  }
  form.value.options = formOptions.value
  const response = await generate.update(form.value.id, form.value)
  if (response.code == 200) {
    Message.success(response.message)
    emit('success', true)
    done(true)
  } else {
    return false
  }
}

// 全选 / 全不选
const handlerAll = (value, type) =>
  form.value.columns.map((item) => {
    item['is_' + type] = value
  })

// 新增关联定义
const addRelation = () => {
  formOptions.value.relations.push({
    name: '',
    type: 'hasOne',
    model: '',
    foreignKey: '',
    localKey: '',
    table: '',
  })
}

// 删除关联定义
const delRelation = (idx) => formOptions.value.relations.splice(idx, 1)

const init = () => {
  // 设置form数据
  for (let name in record.value) {
    if (name === 'generate_menus') {
      form.value[name] = record.value[name] ? record.value[name].split(',') : []
    } else {
      form.value[name] = record.value[name]
    }
  }

  if (record.value.options && record.value.options.relations) {
    formOptions.value.relations = record.value.options.relations
  } else {
    formOptions.value.relations = []
  }

  if (record.value.tpl_category === 'tree') {
    formOptions.value.tree_id = record.value.options.tree_id
    formOptions.value.tree_name = record.value.options.tree_name
    formOptions.value.tree_parent_id = record.value.options.tree_parent_id
  }

  // 请求表字段
  generate.getTableColumns({ table_id: record.value.id }).then((res) => {
    form.value.columns = []
    res.data.map((item) => {
      item.is_required = item.is_required === 2
      item.is_insert = item.is_insert === 2
      item.is_edit = item.is_edit === 2
      item.is_list = item.is_list === 2
      item.is_query = item.is_query === 2
      item.is_sort = item.is_sort === 2
      form.value.columns.push(item)
    })
  })

  // 请求菜单列表
  menuApi.getList({ tree: true }).then((res) => {
    menus.value = res.data
    menus.value.unshift({ id: 0, value: 0, label: '顶级菜单' })
  })

  // 请求所有字典类型
  dictType.getPageList({ saiType: 'all' }).then((res) => (dicts.value = res.data))
}

defineExpose({ open })
</script>

<script>
export default { name: 'setting:code:update' }
</script>
<style scoped>
:deep(.arco-select-option-content) {
  width: 100%;
}
</style>
