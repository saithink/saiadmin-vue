<template>
    <div>
      <AsyncComponent v-if="url != ''" :url="url" />
    </div>
</template>
<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import commonApi from '@/api/common'
    import AsyncComponent from './AsyncComponent.vue';
    const url = ref('')
    const route = useRouter()
    const env = import.meta.env

    /**
     * 初始化插件
     */
    const initPlugin = () => {
        const baseURL = env.VITE_APP_OPEN_PROXY === 'true' ? env.VITE_APP_PROXY_PREFIX : env.VITE_APP_BASE_URL
        let str = route.currentRoute.value.path
        if (str.startsWith('/')) {
            str = str.substring(1);
        }
        const plugin = str.split('/')[0];
        commonApi.getPluginInfo({ plugin }).then(resp => {
            const app = resp.data
            url.value = baseURL + route.currentRoute.value.path + '.vue?v=' + app.version
        })
    }

    initPlugin()
</script>