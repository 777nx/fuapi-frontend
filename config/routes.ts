/**
 * @name umi 的路由配置
 * @description 菜单仅保留欢迎页、管理员、列表页下的 InterfaceInfo。
 */
export default [
  {
    path: '/index',
    name: '主页',
    icon: 'home',
    component: './Index',
  },
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/interface_info/:id',
    name: '查看接口',
    icon: 'smile',
    component: './InterfaceInfo',
    hideInMenu: true
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: '登录',
        component: './User/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },
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
  {
    path: '/*',
    layout: false,
    redirect: '/404',
  },
];
