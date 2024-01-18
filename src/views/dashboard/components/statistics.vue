
<template>

  <st-welcome />
  <st-count />
  <st-login-chart />

  <div class="block lg:flex">
    <st-announced />
    <st-mineadmin />
  </div>
</template>

<script setup>
  import StCount from './components/st-count.vue'
  import StWelcome from './components/st-welcome.vue'
  import StLoginChart from './components/st-loginChart.vue'
  import StMineadmin from './components/st-mineadmin.vue'
  import StAnnounced from './components/st-announced.vue'
</script>

