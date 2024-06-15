import homePageRoutes from './homePageRoutes'
//系统路由
const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: 'dashboard',
    children: homePageRoutes
  }, {
    name: 'formLayout',
    path: '/formLayout',
    component: () => import('@/layout/index.vue'),
    redirect: 'openForm',
    children: [{
        name: 'openForm',
        path: '/openForm/:id',
        meta: {
          title: '公共表单',
          type: 'M',
        },
        component: () => import('@/layout/form.vue'),
    }]
  }, {
    name: 'autoform',
    path: '/autoform',
    component: () => import('@/layout/index.vue'),
    redirect: '/autoform/:id',
    children: [{
      name: 'autoformList',
      path: '/autoform:/:id',
      meta: {
        title: '自动表单',
        type: 'M',
      },
      component: () => import('@/views/setting/autoform/index.vue'),
    }]
  }, {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { title: '登录' }
  }, {
    path: "/:pathMatch(.*)*",
    hidden: true,
    meta: { title: '访问的页面不存在' },
    component: () => import('@/layout/404.vue'),
  }
]

export default routes