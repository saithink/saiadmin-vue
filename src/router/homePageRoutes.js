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
    component: () => import('@/views/dashboard/index.vue'),
  }, {
    name: 'userCenter',
    path: '/usercenter',
    meta: {
      title: '个人信息',
      icon: 'icon-user',
      type: 'M',
    },
    component: () => import('@/views/userCenter/index.vue'),
  }, {
    name: '简历示例',
    path: '/demo',
    meta: {
      title: '简历示例',
      icon: 'icon-book',
      type: 'M',
    },
    component: () => import('@/views/demo/demo.vue'),
  }, {
    name: 'store',
    path: '/store',
    component: () => import('@/views/appStore/index.vue'),
    meta: { title: '应用市场', hidden: true }
  },
]

export const homePage = {
  name: 'home',
  path: '/home',
  meta: { title: '首页', icon: 'icon-home', hidden: false, type: 'M' }
}

export default homePageRoutes