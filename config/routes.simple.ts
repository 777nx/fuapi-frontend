export default [
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
    path: '/welcome',
    name: '欢迎',
    icon: 'home',
    component: './Index',
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
        redirect: '/list/InterfaceInfo',
      },
      {
        path: '/list/InterfaceInfo',
        name: 'InterfaceInfo',
        icon: 'table',
        component: './InterfaceInfo',
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
