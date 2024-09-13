const homePageRoutes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    meta: {
      title: '仪表盘',
      icon: 'icon-dashboard',
      type: 'M',
      affix: true
    },
    component: () => import('@/views/dashboard/index.vue')
  },
  {
    name: 'userCenter',
    path: '/usercenter',
    meta: {
      title: '个人信息',
      icon: 'icon-user',
      type: 'M'
    },
    component: () => import('@/views/dashboard/userCenter/index.vue')
  },
  {
    name: 'appStore',
    path: 'https://saas.saithink.top/#/appStore',
    meta: {
      title: '插件市场',
      icon: 'icon-apps',
      type: 'L'
    }
  }
]

export const homePage = {
  name: 'home',
  path: '/home',
  meta: { title: '首页', icon: 'icon-home', hidden: false, type: 'M' }
}

export default homePageRoutes
