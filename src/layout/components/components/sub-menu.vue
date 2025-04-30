<template>
  <a-sub-menu :key="menuInfo.name">
    <template #title>
      {{ appStore.i18n ? ($t(`menus.${menuInfo.name}`).indexOf('.') > 0 ? menuInfo.meta.title : $t(`menus.${menuInfo.name}`)) : menuInfo.meta.title }}
    </template>
    <template #icon v-if="menuInfo.meta.icon">
      <sa-icon :icon="menuInfo.meta.icon" :size="18" />  
    </template>
    <template v-for="item in menuInfo.children" :key="item.id">
      <template v-if="!item.children|| item.children.length === 0">
        <a-menu-item :key="item.name" @click="routerPush(item)">
          <template #icon v-if="item.meta.icon">
            <sa-icon :icon="item.meta.icon" :size="18" />    
          </template>
          {{ appStore.i18n ? ($t(`menus.${item.name}`).indexOf('.') > 0 ? item.meta.title : $t(`menus.${item.name}`)) : item.meta.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <SubMenu :menu-info="item" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script setup name="SubMenu">
  import { useRouter, useRoute } from 'vue-router'
  import { useTagStore, useAppStore } from '@/store'
  defineProps({ menuInfo: Object })
  const emits = defineEmits(['go'])
  const router = useRouter()
  const tagStore = useTagStore()
  const appStore = useAppStore()
  const routerPush = (menu) => {
    if (menu.meta && menu.meta.type === 'L') {
      window.open(menu.path)
    } else {
      router.push(menu.path)
      tagStore.addTag({ name: menu.name, title: menu.meta.title, path: menu.path })
    }
  }
</script>
<style scoped>
.arco-trigger-menu-icon .icon {
width: 1em; height: 1em; 
}
[mine-skin="mine"] .arco-menu-selected .icon {
fill: rgb(var(--primary-6));
}
</style>