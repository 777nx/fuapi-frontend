/**
 * @name umi 的路由配置
 * @description 菜单仅保留欢迎页、管理员、列表页下的 InterfaceInfo。
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: '登录',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },
  // {
  //   path: '/welcome',
  //   name: '欢迎',
  //   icon: 'home',
  //   component: './Welcome',
  // },
  {
    path: '/admin',
    name: '管理员',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/interface',
      },
      {
        path: '/admin/interface_info',
        name: '接口管理',
        icon: 'table',
        component: './Admin/InterfaceInfo',
      },
    ],
  },
  // {
  //   path: '/',
  //   redirect: '/welcome',
  // },
  {
    path: '/*',
    layout: false,
    redirect: '/404',
  },
];
