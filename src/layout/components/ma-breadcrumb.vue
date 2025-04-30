<template>
  <div class="ml-2 mt-3.5 hidden lg:block">
    <a-breadcrumb>
      <a-breadcrumb-item class="cursor-pointer" @click="router.push('/dashboard')">
        <div class="flex items-center">
          <icon-dashboard style="color:rgb(var(--color-text-1))" />
          <span class="ml-1">{{ $t('menus.dashboard') }}</span>
        </div>
        
      </a-breadcrumb-item>
      <template v-for="(r, index) in route.matched" :key="index">
        <a-breadcrumb-item
          v-if="index > 0 && !['/', '/home', '/dashboard'].includes(r.path)"
        >
          <div class="flex items-center">
            <sa-icon :icon="r.meta.icon" :size="16" style="color:rgb(var(--color-text-1));width:1rem" />
            <span class="ml-1">
              {{ appStore.i18n ? ( $t('menus.' + r.name).indexOf('.') > 0 ? r.meta.title : $t('menus.' + r.name) ) : r.meta.title }}
            </span>
          </div>
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
</script>
