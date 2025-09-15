import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw
} from 'vue-router';
// 路由配置数组？
const rootRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    //懒加载
    component: () => import('@/views/HomePage/HomePage.vue'),
    name: "home"
  },
  {
    path: '/account',
    name: 'account',
    component: () => import("@/views/account/Account.vue")
  },
  {
    path: '/discount',
    name: 'discount',
    component: () => import("@/views/discount/Discount.vue")
  },
  {
    path: '/collection',
    name: 'collection',
    component: () => import("@/views/collection/Collection.vue")
  },
  {
    path: '/trip',
    name: 'trip',
    component: () => import("@/views/trip/Trip.vue")
  }
]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: "App",
    component: () => import('@/views/TheRoot.vue'),
    redirect: "/home",
    children: rootRoutes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router