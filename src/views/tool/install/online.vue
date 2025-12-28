<template>
  <div class="ma-content-block lg:flex justify-between">
    <!-- CRUD 组件 -->
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="6" :xs="24">
          <a-form-item field="keywords" label="关键词">
            <a-input v-model="searchForm.keywords" placeholder="请输入关键词" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="5" :xs="24">
          <a-form-item field="type" label="类型">
            <a-select v-model="searchForm.type" placeholder="请选择类型" allow-clear>
              <a-option value="">全部</a-option>
              <a-option :value="1">插件</a-option>
              <a-option :value="2">系统</a-option>
              <a-option :value="3">组件</a-option>
              <a-option :value="4">项目</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="5" :xs="24">
          <a-form-item field="price" label="价格">
            <a-select v-model="searchForm.price" placeholder="请选择价格" allow-clear>
              <a-option value="all">全部</a-option>
              <a-option value="free">免费</a-option>
              <a-option value="paid">付费</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- 商店账号入口 -->
        <a-col :sm="8" :xs="24">
          <a-form-item label="商店账号">
            <div v-if="storeUser" class="store-user-logged">
              <a-avatar :size="24">
                <img v-if="storeUser.avatar" :src="storeUser.avatar" />
                <icon-user v-else />
              </a-avatar>
              <span class="store-username">{{ storeUser.nickname || storeUser.username }}</span>
              <a-link type="primary" @click="showPurchasedApps">我的应用</a-link>
              <a-divider direction="vertical" />
              <a-link @click="handleLogout">退出</a-link>
            </div>
            <div v-else class="store-user-guest">
              <a-link type="primary" @click="handleLogin">登录</a-link>
              <a-divider direction="vertical" />
              <a-link @click="handleRegister">注册</a-link>
              <span class="store-tip">来管理已购插件</span>
            </div>
          </a-form-item>
        </a-col>
      </template>

      <!-- 自定义内容区 -->
      <template #crudContent="{ data }">
        <div class="app-grid">
          <div v-for="item in data" :key="item.id" class="app-card" @click="showDetail(item)">
            <div class="app-card-header">
              <img :src="item.logo" :alt="item.title" class="app-logo" />
              <div class="app-info">
                <div class="app-title">{{ item.title }}</div>
                <div class="app-version">v{{ item.version }}</div>
              </div>
              <div class="app-price" :class="{ free: item.price === '0.00' }">
                {{ item.price === '0.00' ? '免费' : '¥' + item.price }}
              </div>
            </div>
            <div class="app-about">{{ item.about }}</div>
            <div class="app-footer">
              <div class="app-author">
                <img :src="item.avatar || 'https://via.placeholder.com/24'" class="author-avatar" />
                <span>{{ item.username }}</span>
              </div>
              <div class="app-sales">
                <icon-user /> {{ item.sales_num }} 销量
              </div>
            </div>
          </div>
        </div>
      </template>
    </sa-table>

    <!-- 详情抽屉 -->
    <a-drawer
      :visible="detailVisible"
      :width="600"
      :footer="false"
      @cancel="detailVisible = false"
    >
      <template #title>
        <div class="detail-title">
          <img :src="currentApp?.logo" class="detail-logo" />
          <div>
            <div class="detail-name">{{ currentApp?.title }}</div>
            <div class="detail-version">v{{ currentApp?.version }} · {{ currentApp?.username }}</div>
          </div>
        </div>
      </template>
      <div class="detail-content">
        <div class="detail-price" :class="{ free: currentApp?.price === '0.00' }">
          {{ currentApp?.price === '0.00' ? '免费' : '¥' + currentApp?.price }}
        </div>
        <div class="detail-about">{{ currentApp?.about }}</div>
        
        <!-- 截图预览 -->
        <div v-if="currentApp?.screenshots?.length" class="detail-screenshots">
          <div class="screenshots-title">截图预览</div>
          <a-image-preview-group>
            <a-space :size="12" wrap>
              <a-image
                v-for="(img, idx) in currentApp?.screenshots"
                :key="idx"
                :src="img"
                :width="150"
                fit="cover"
                class="screenshot-thumb"
              />
            </a-space>
          </a-image-preview-group>
        </div>

        <!-- 详情描述 -->
        <div class="detail-desc">
          <div class="desc-title">详细介绍</div>
          <div class="desc-content" v-html="renderMarkdown(currentApp?.content)"></div>
        </div>

        <!-- 购买按钮 -->
        <div class="detail-action">
          <a-button type="primary" size="large" long @click="handleBuy">
            <template #icon><icon-shopping-cart /></template>
            立即购买
          </a-button>
        </div>
      </div>
    </a-drawer>

    <!-- 登录弹窗 -->
    <a-modal
      v-model:visible="loginVisible"
      title="登录应用商店"
      :width="400"
      :footer="false"
      :mask-closable="false"
    >
      <a-form :model="loginForm" @submit="submitLogin" layout="vertical">
        <a-form-item field="username" label="用户名/邮箱" :rules="[{ required: true, message: '请输入用户名或邮箱' }]">
          <a-input v-model="loginForm.username" placeholder="请输入用户名或邮箱" allow-clear>
            <template #prefix><icon-user /></template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" label="密码" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model="loginForm.password" placeholder="请输入密码" allow-clear>
            <template #prefix><icon-lock /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item field="code" label="验证码" :rules="[{ required: true, message: '请输入验证码' }]">
          <a-input v-model="loginForm.code" placeholder="请输入验证码" allow-clear style="width: 60%">
            <template #prefix><icon-safe /></template>
          </a-input>
          <img 
            :src="captchaImage" 
            @click="getCaptcha" 
            class="captcha-img" 
            title="点击刷新"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" long :loading="loginLoading">登录</a-button>
        </a-form-item>
        <div class="login-footer">
          还没有账号？<a-link @click="handleRegister">立即注册</a-link>
        </div>
      </a-form>
    </a-modal>

    <!-- 已购应用抽屉 -->
    <a-drawer
      v-model:visible="purchasedVisible"
      title="我的应用"
      :width="720"
      :footer="false"
    >
      <a-spin :loading="purchasedLoading" style="width: 100%">
        <div class="purchased-list">
          <div v-for="app in purchasedApps" :key="app.id" class="purchased-card">
            <img :src="app.logo" class="purchased-logo" />
            <div class="purchased-info">
              <div class="purchased-title">{{ app.title }}</div>
              <div class="purchased-version">v{{ app.version }} · {{ app.developer }}</div>
              <div class="purchased-about">{{ app.about }}</div>
            </div>
            <div class="purchased-actions">
              <a-button size="small" @click="viewDocs(app)">
                <icon-book /> 文档
              </a-button>
              <a-button type="primary" size="small" @click="showVersions(app)">
                <icon-download /> 下载
              </a-button>
            </div>
          </div>
          <a-empty v-if="!purchasedLoading && purchasedApps.length === 0" description="暂无已购应用" />
        </div>
      </a-spin>
    </a-drawer>

    <!-- 版本选择对话框 -->
    <a-modal
      v-model:visible="versionVisible"
      :title="'选择版本 - ' + (currentPurchasedApp?.title || '')"
      :width="500"
      :footer="false"
    >
      <a-spin :loading="versionLoading" style="width: 100%">
        <div class="version-list">
          <div v-for="ver in versionList" :key="ver.id" class="version-item">
            <div class="version-info">
              <span class="version-name">v{{ ver.version }}</span>
              <span class="version-date">{{ ver.create_time }}</span>
            </div>
            <div class="version-remark">{{ ver.remark }}</div>
            <a-button 
              type="primary" 
              size="small" 
              :loading="downloadingId === ver.id"
              @click="downloadVersion(ver)"
            >
              下载安装
            </a-button>
          </div>
          <a-empty v-if="!versionLoading && versionList.length === 0" description="暂无可用版本" />
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'

const router = useRouter()

const crudRef = ref()
const detailVisible = ref(false)
const currentApp = ref(null)

// 商店用户状态（null 表示未登录）
const storeUser = ref(null)
const storeToken = ref(localStorage.getItem('storeToken') || '')

// 登录弹窗相关
const loginVisible = ref(false)
const loginLoading = ref(false)
const captchaImage = ref('')
const captchaUuid = ref('')
const loginForm = reactive({
  username: '',
  password: '',
  code: '',
})

// 打开登录弹窗
const handleLogin = () => {
  loginVisible.value = true
  getCaptcha()
}

// 商店注册
const handleRegister = () => {
  window.open('https://saas.saithink.top/register', '_blank')
}

// 退出登录
const handleLogout = () => {
  storeUser.value = null
  storeToken.value = ''
  localStorage.removeItem('storeToken')
}

// 获取验证码
const getCaptcha = async () => {
  const response = await request({ url: '/tool/install/online/storeCaptcha', method: 'get' })
  if (response.code === 200) {
    captchaImage.value = response.data.image
    captchaUuid.value = response.data.uuid
  }
}

// 提交登录
const submitLogin = async ({ values, errors }) => {
  if (errors) return
  
  loginLoading.value = true
  try {
    const response = await request({
      url: '/tool/install/online/storeLogin',
      method: 'post',
      data: {
        username: loginForm.username,
        password: loginForm.password,
        code: loginForm.code,
        uuid: captchaUuid.value,
      },
    })
    
    if (response.code === 200) {
      storeToken.value = response.data.access_token
      localStorage.setItem('storeToken', response.data.access_token)
      loginVisible.value = false
      // 重置表单
      loginForm.username = ''
      loginForm.password = ''
      loginForm.code = ''
      // 获取用户信息
      await fetchStoreUser()
      Message.success('登录成功')
    } else {
      getCaptcha()
      Message.error(response.msg || '登录失败')
    }
  } finally {
    loginLoading.value = false
  }
}

// 获取商店用户信息
const fetchStoreUser = async () => {
  if (!storeToken.value) return
  
  const response = await request({
    url: '/tool/install/online/storeUserInfo',
    method: 'get',
    params: { token: storeToken.value },
  })
  
  if (response.code === 200) {
    storeUser.value = response.data
  } else {
    // token 无效，清除
    handleLogout()
  }
}

// ========== 已购应用相关 ==========
const purchasedVisible = ref(false)
const purchasedLoading = ref(false)
const purchasedApps = ref([])
const versionVisible = ref(false)
const versionLoading = ref(false)
const versionList = ref([])
const currentPurchasedApp = ref(null)
const downloadingId = ref(null)

// 显示已购应用列表
const showPurchasedApps = async () => {
  purchasedVisible.value = true
  purchasedLoading.value = true
  
  const response = await request({
    url: '/tool/install/online/storePurchasedApps',
    method: 'get',
    params: { token: storeToken.value },
  })
  
  if (response.code === 200) {
    purchasedApps.value = response.data
  } else {
    Message.error(response.msg || '获取已购应用失败')
  }
  purchasedLoading.value = false
}

// 查看文档
const viewDocs = (app) => {
  window.open(`https://saas.saithink.top/store/docs-${app.app_id}`, '_blank')
}

// 显示版本列表
const showVersions = async (app) => {
  currentPurchasedApp.value = app
  versionVisible.value = true
  versionLoading.value = true
  
  const response = await request({
    url: '/tool/install/online/storeAppVersions',
    method: 'get',
    params: { 
      token: storeToken.value,
      app_id: app.app_id,
    },
  })
  
  if (response.code === 200) {
    versionList.value = response.data
  } else {
    Message.error(response.msg || '获取版本列表失败')
  }
  versionLoading.value = false
}

// 下载版本
const downloadVersion = async (ver) => {
  downloadingId.value = ver.id
  
  const response = await request({
    url: '/tool/install/online/storeDownloadApp',
    method: 'post',
    data: { 
      token: storeToken.value,
      id: ver.id,
    },
  })
  
  if (response.code === 200) {
    Message.success(`下载成功: ${response.data.filename}，即将跳转到插件安装页面...`)
    versionVisible.value = false
    purchasedVisible.value = false
    // 延迟跳转到插件安装列表
    setTimeout(() => {
      router.push('/tool/install')
    }, 1000)
  } else {
    Message.error(response.msg || '下载失败')
  }
  downloadingId.value = null
}

// 搜索表单
const searchForm = ref({
  keywords: '',
  type: '',
  price: 'all',
})

// 通过后端代理请求应用商店列表
const fetchAppList = async (params) => {
  const response = await request({
    url: '/tool/install/online/appList',
    method: 'get',
    params: {
      page: params.page || 1,
      limit: params.limit || 15,
      price: params.price || 'all',
      type: params.type || '',
      keywords: params.keywords || '',
    },
  })
  
  if (response.code === 200) {
    return {
      code: 200,
      data: {
        data: response.data.data,
        total: response.data.total,
      },
    }
  }
  return response
}

// SaTable 基础配置
const options = reactive({
  api: fetchAppList,
  showTools: false,
  add: { show: false },
  edit: { show: false },
  delete: { show: false },
  operationColumn: false,
  singleLine: false,
  pagination: {
    pageSizeOptions: [15, 30, 50],
  },
})

// SaTable 列配置（虽然使用自定义内容，但需要定义列）
const columns = reactive([])

// 显示详情
const showDetail = (item) => {
  currentApp.value = item
  detailVisible.value = true
}

// 简单的 Markdown 渲染
const renderMarkdown = (content) => {
  if (!content) return ''
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
}

// 跳转到商店购买
const handleBuy = () => {
  window.open('https://saas.saithink.top/store', '_blank')
}

// 页面加载时自动请求数据和检查登录状态
import { onMounted } from 'vue'
onMounted(() => {
  crudRef.value?.refresh()
  fetchStoreUser() // 检查是否已登录
})
</script>

<style lang="less" scoped>
// 商店用户入口样式
.store-user-logged {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .store-username {
    font-weight: 500;
    color: var(--color-text-1);
  }
}

.store-user-guest {
  display: flex;
  align-items: center;
  gap: 4px;
  
  .store-tip {
    margin-left: 8px;
    font-size: 12px;
    color: var(--color-text-3);
  }
}

// 验证码图片
.captcha-img {
  width: 100px;
  height: 32px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  vertical-align: middle;
}

// 登录底部
.login-footer {
  text-align: center;
  color: var(--color-text-3);
  font-size: 13px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 16px;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  margin-bottom: 16px;
}

.app-card {
  background: var(--color-bg-2);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.app-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.app-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.app-info {
  flex: 1;
}

.app-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.app-version {
  font-size: 12px;
  color: var(--color-text-3);
}

.app-price {
  font-size: 16px;
  font-weight: 600;
  color: #f5222d;
  
  &.free {
    color: #52c41a;
  }
}

.app-about {
  font-size: 13px;
  color: var(--color-text-2);
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-3);
}

.app-author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.app-sales {
  display: flex;
  align-items: center;
  gap: 4px;
}

// 详情抽屉样式
.detail-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
}

.detail-version {
  font-size: 12px;
  color: var(--color-text-3);
}

.detail-content {
  padding: 16px 0;
}

.detail-price {
  font-size: 24px;
  font-weight: 600;
  color: #f5222d;
  margin-bottom: 16px;
  
  &.free {
    color: #52c41a;
  }
}

.detail-about {
  font-size: 14px;
  color: var(--color-text-2);
  line-height: 1.6;
  margin-bottom: 24px;
}

.detail-screenshots {
  margin-bottom: 24px;
}

.screenshot-thumb {
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
}

.screenshots-title,
.desc-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-text-1);
}

.screenshot-img {
  width: 100%;
  border-radius: 8px;
}

.desc-content {
  font-size: 14px;
  color: var(--color-text-2);
  line-height: 1.8;
  
  :deep(h1), :deep(h2), :deep(h3) {
    margin: 16px 0 8px;
    color: var(--color-text-1);
  }
  
  :deep(code) {
    background: var(--color-fill-2);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }
  
  :deep(ul) {
    padding-left: 20px;
    margin: 8px 0;
  }
  
  :deep(a) {
    color: rgb(var(--primary-6));
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.detail-action {
  position: sticky;
  bottom: 0;
  padding: 16px 0;
  background: var(--color-bg-2);
  border-top: 1px solid var(--color-border);
  margin-top: 24px;
}

// 已购应用列表样式
.purchased-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.purchased-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-bg-2);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.purchased-logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}

.purchased-info {
  flex: 1;
  min-width: 0;
}

.purchased-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.purchased-version {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 6px;
}

.purchased-about {
  font-size: 13px;
  color: var(--color-text-2);
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}

.purchased-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 版本列表样式
.version-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.version-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-fill-2);
  border-radius: 6px;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.version-name {
  font-weight: 600;
  color: var(--color-text-1);
}

.version-date {
  font-size: 12px;
  color: var(--color-text-3);
}

.version-remark {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-2);
}
</style>
