import { createRouter, createWebHistory } from 'vue-router';

export const asyncRoutes = {
  name: 'Main',
  path: '/',
  component: () => import(/* webpackChunkName: "AppLayout" */ '@/layouts/AppLayout.vue'),
  children: [
    { path: 'user-center', component: () => import(/* webpackChunkName: "UserCenter" */ '@/views/System/UserCenter'), name: 'index-user-center', id: 'index-user-center'},
    { path: 'system-announcement', component: () => import(/* webpackChunkName: "SystemAnnouncement" */ '@/views/System/SystemAnnouncement'), name: 'system-announcement', id: 'system-announcement'},
    { path: 'member-list', component: () => import(/* webpackChunkName: "MemberList" */ '@/views/Member/MemberList'), name: 'member-list'},
    { path: 'member-blacklist', component: () => import(/* webpackChunkName: "MemberBlackList" */ '@/views/Member/MemberBlackList'), name: 'member-blacklist'}
  ]
}

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "LoginPage" */ '@/views/LoginPage.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "LoginPage" */ '@/views/NotFound.vue')
  }
]
  
const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any'
}

function getAccessRoutes (authRoutes, accessRoutes = {...asyncRoutes, children: []}) {
  const asyncRoutesList = asyncRoutes.children
  authRoutes.forEach(authRoute => {
    if (!authRoute.select) return
    const matchedAsyncRoute = asyncRoutesList.find(asyncRoute => asyncRoute.id === authRoute.id)
    if (matchedAsyncRoute) {
      accessRoutes.children.push(matchedAsyncRoute)
    }
    if (authRoute.children.length > 0) {
      getAccessRoutes(authRoute.children, accessRoutes)
    }
  })
  return accessRoutes
}

export function getMenuList (authRoutesList, isParentNode = true) {
  const result = []
  const asyncRouteList = asyncRoutes.children
  authRoutesList.forEach(authNode => {
    if (!authNode.select) return
    if (isParentNode) {
      if (authNode.children.length === 0) return
    } else {
      const isRouteInAsyncList = asyncRouteList.some(asyncRoute => asyncRoute.id === authNode.id)
      if (!isRouteInAsyncList) return
    }
    const newAuthNode = {
      ...authNode,
      children: []
    }
    if (authNode.children.length > 0) {
      newAuthNode.children = [...newAuthNode.children, ...getMenuList(authNode.children, false)]
    }
    result.push(newAuthNode)
  })
  return result
}

let asyncRoutesAdded = false


const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
})

// Global Before Guards
router.beforeEach((to) => {
  const isAuthenticated = sessionStorage.getItem('token')
  if (isAuthenticated) {
    if (asyncRoutesAdded) {
      if (to.name === 'Login') {
        return { path: '/user-center' }
      }
      return true
    } else {
      const authRoutes = JSON.parse(sessionStorage.getItem('routes'))
      const accessRoutes = getAccessRoutes(authRoutes)
      // const menuList = getMenuList(authRoutes)
      // sessionStorage.setItem('menuList', JSON.stringify(menuList))
      ;[accessRoutes, anyRoute].forEach(route => {
        router.addRoute(route)
      })
      asyncRoutesAdded = true
      // hack method to ensure that addRoutes is complete
      // set the replace: true, so the navigation will not leave a history record
      return { ...to, replace: true }
    }
  } else {
    if (to.name === 'Login') {
      return true
    }
    return { name: 'Login' }
  }
})
export default router