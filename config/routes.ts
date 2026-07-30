/**
 * @name umi 的路由配置
 * @description 菜单仅保留欢迎页、管理员、列表页下的 table-list。
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
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'home',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '管理员',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },
  {
    path: '/list',
    name: '列表页',
    icon: 'table',
    routes: [
      {
        path: '/list',
        redirect: '/list/table-list',
      },
      {
        path: '/list/table-list',
        name: 'table-list',
        icon: 'table',
        component: './table-list',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/*',
    redirect: '/welcome',
  },
];
