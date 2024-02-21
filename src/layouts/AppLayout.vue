<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu v-for="menu in menuList" :key="menu.name">
            <template #title>
              <span>
                <user-outlined />
                {{ menu.name }}
              </span>
            </template>
            <a-menu-item v-for="submenu in menu.children" :key="submenu.name">
              <router-link :to="{ name: submenu.name }">
                {{ submenu.name }}
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { getMenuList } from '@/router';
const router = useRouter()
const selectedKeys1 = ref(['']);
const selectedKeys = ref(['']);
const openKeys = ref(['homepage']);
const menuList = ref([])
const syncMenu = (name) => {
  const openKey = name.split('-')[0] + '-management'
  selectedKeys.value = [name]
  openKeys.value = [openKey]
}
watch(() => router.currentRoute, currentRoute => {
  syncMenu(currentRoute.value.name)
  console.log('currentRoute', currentRoute.value)
}, { immediate: true })
onMounted(() => {
  console.log('layout mounted')
  const routes = JSON.parse(sessionStorage.getItem('routes'))
  menuList.value = getMenuList(routes)
})
</script>
<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
