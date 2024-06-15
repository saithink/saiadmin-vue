<template>
  <div class="w-full h-full">
    <iframe
      v-if="iframeSrc"
      ref="iframeRef"
      :src="iframeSrc"
      style="width: 100%; height: 90vh"
      scrolling="auto"
      frameborder="0"
      id="iframe"
    >
    </iframe>

  </div>
</template>

<script setup>
  import { ref } from 'vue'


  const iframeSrc = ref('')
  iframeSrc.value = 'https://saithink.top/pages/5d571c/'

</script>