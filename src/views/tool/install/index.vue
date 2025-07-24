<template>
  <a-layout-content class="flex flex-col">
    <a-alert>
      仅支持上传由插件市场下载的zip压缩包进行安装，请您务必确认插件包文件来自官方渠道或经由官方认证的插件作者！
    </a-alert>
    <a-space class="ma-content-block py-3 px-2">
      <a-button type="outline" @click="getList">
        <template #icon>
          <icon-refresh />
        </template>
      </a-button>
      <a-button type="outline" @click="handleUpload">
        <template #icon>
          <icon-upload />
        </template>
        上传插件包
      </a-button>
      <a-button type="outline" status="danger" @click="handleTerminal">
        <template #icon>
          <icon-computer />
        </template>
      </a-button>
      <div class="flex">
        <div class="version-title">saiadmin版本</div>
        <div class="version-value">{{ version?.saiadmin_version?.describe }}</div>
        <div class="version-title">说明</div>
        <div class="version-value" :class="[version.saiadmin_version?.notes == '正常' ? '' : 'text-red-500']">
          {{ version?.saiadmin_version?.notes }}
        </div>
        <div class="version-title">saipackage安装器</div>
        <div class="version-value">{{ version?.saipackage_version?.describe }}</div>
        <div class="version-title">说明</div>
        <div class="version-value" :class="[version.saipackage_version?.notes == '正常' ? '' : 'text-red-500']">
          {{ version?.saipackage_version?.notes }}
        </div>
      </div>
    </a-space>

    <div class="ma-content-block">
      <a-divider orientation="left">已安装列表</a-divider>
    </div>

    <div class="ma-content-block p-2">
      <a-table :loading="loading" :columns="columns" :data="installList" class="mt-2" size="medium" :pagination="false">
        <template #app="{ record }">
          <a-link :href="record.website" target="_blank">{{ record.app }}</a-link>
        </template>
        <template #state="{ record }">
          <a-tag v-if="record.state == 0" color="red">已卸载</a-tag>
          <a-tag v-if="record.state == 1" color="green">已安装</a-tag>
          <a-tag v-if="record.state == 2" color="blue">等待安装</a-tag>
          <a-tag v-if="record.state == 4" color="orange">等待安装依赖</a-tag>
        </template>
        <template #npm="{ record }">
          <div>
            <a-link
              v-if="record.npm_dependent_wait_install && record.npm_dependent_wait_install == 1"
              @click="handleExecFront(record)">
              <icon-download />点击安装
            </a-link>
            <a-tag color="blue" v-else-if="record.state == 2">-</a-tag>
            <a-tag color="green" v-else>已安装</a-tag>
          </div>
        </template>
        <template #composer="{ record }">
          <div>
            <a-link
              v-if="record.composer_dependent_wait_install && record.composer_dependent_wait_install == 1"
              @click="handleExecBackend(record)">
              <icon-download />点击安装
            </a-link>
            <a-tag color="blue" v-else-if="record.state == 2">-</a-tag>
            <a-tag color="green" v-else>已安装</a-tag>
          </div>
        </template>
        <template #optional="{ record }">
          <a-space size="mini">
            <a-popconfirm content="确定要安装当前插件吗?" position="bottom" @ok="handleInstall(record)">
              <a-link status="warning"><icon-cloud-download />安装</a-link>
            </a-popconfirm>
            <a-popconfirm content="确定要卸载当前插件吗?" position="bottom" @ok="handleUninstall(record)">
              <a-link status="danger"><icon-delete />卸载</a-link>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>

    <InstallForm ref="installFormRef" @success="getList" />

    <TerminalBox ref="terminalRef" @success="getList" />
  </a-layout-content>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import saipackage from '@/api/tool/saipackage'
import InstallForm from './install-box.vue'
import TerminalBox from './terminal.vue'

const version = ref({})
const loading = ref(false)
const installFormRef = ref()
const terminalRef = ref()
const installList = ref([])

const handleUpload = async () => {
  installFormRef.value?.open()
}

const handleInstall = async (record) => {
  saipackage.installApp({ appName: record.app }).then((resp) => {
    if (resp.code == 200) {
      Message.success('安装成功')
      getList()
      saipackage.reloadBackend()
    }
  })
}

const handleUninstall = async (record) => {
  await saipackage.uninstallApp({ appName: record.app })
  getList()
}

const handleExecFront = (record) => {
  const extend = 'module-install:' + record.app
  terminalRef.value?.open()
  setTimeout(() => {
    terminalRef.value?.frontInstall(extend)
  }, 500)
}

const handleExecBackend = (record) => {
  const extend = 'module-install:' + record.app
  terminalRef.value?.open()
  setTimeout(() => {
    terminalRef.value?.backendInstall(extend)
  }, 500)
}

const handleTerminal = async () => {
  terminalRef.value?.open()
}

const columns = [
  { title: '插件标识', slotName: 'app', width: 120 },
  { title: '插件名称', dataIndex: 'title', width: 150 },
  { title: '插件描述', dataIndex: 'about', ellipsis: true, tooltip: true },
  { title: '作者', dataIndex: 'author', width: 120 },
  { title: '版本', dataIndex: 'version', width: 100 },
  { title: '插件状态', slotName: 'state', width: 100 },
  { title: '前端依赖', slotName: 'npm', width: 120 },
  { title: '后端依赖', slotName: 'composer', width: 120 },
  { title: '操作', slotName: 'optional', width: 150 },
]

const getList = async () => {
  loading.value = true
  const resp = await saipackage.getAppList()
  installList.value = resp.data.data
  version.value = resp.data.version
  loading.value = false
}

onMounted(async () => {
  getList()
})
</script>

<style lang="less" scoped>
.version-title {
  padding: 5px 10px;
  background: var(--color-fill-1);
  border: 1px solid #e5e7eb;
}
.version-value {
  padding: 5px 10px;
  border: 1px solid #e5e7eb;
}
</style>
