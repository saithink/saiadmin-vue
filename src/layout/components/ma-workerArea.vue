<template>
  <a-layout-content class="work-area customer-scrollbar relative">
    <div class="h-full" :class="{ 'p-3': $route.path.indexOf('maIframe') === -1 }">
      <a-watermark :content="appStore.waterMark ? appStore.waterContent : ''">
        <router-view v-slot="{ Component }">
          <transition :name="appStore.animation" mode="out-in">
            <keep-alive :max="20">
              <component :is="Component" :key="$route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </a-watermark>
      <iframe-view />
    </div>
  </a-layout-content>
</template>

<script setup>
import { useAppStore } from '@/store'
import IframeView from './components/iframe-view.vue'
const appStore = useAppStore()
</script>
