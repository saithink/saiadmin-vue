<template>
  <div class="w-full mx-auto">
    <a-grid :cols="{ xs: 1, sm: 12, md: 24 }" :row-gap="16" class="panel ma-content-block mt-3 p-4">
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/user.svg" />
          </a-avatar>
          <a-statistic title="用户统计" :value="data.user" :value-from="0" animation show-group-separator>
            <template #suffix><span class="unit">个</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/attach.svg" />
          </a-avatar>
          <a-statistic title="附件统计" :value="data.attach" :value-from="0" animation show-group-separator>
            <template #suffix><span class="unit">个</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/login.svg" />
          </a-avatar>
          <a-statistic title="登录统计" :value="data.login" :value-from="0" animation show-group-separator>
            <template #suffix><span class="unit">次</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/action.svg" />
          </a-avatar>
          <a-statistic title="操作统计" :value="data.operate" :value-from="0" animation show-group-separator>
            <template #suffix><span class="unit">次</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/api/common'

const data = ref({
  user: 0,
  attach: 0,
  login: 0,
  operate: 0
})

const getData = async () => {
  const res = await api.getStatistics()
  data.value = res.data
}

getData()
</script>

<style scoped lang="less">
.arco-grid.panel {
  margin-bottom: 0;
}
.panel-col {
  padding-left: 43px;
  border-right: 1px solid rgb(var(--gray-2));
}
.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}
.up-icon {
  color: rgb(var(--red-6));
}
.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}
:deep(.panel-border) {
  margin: 4px 0 0 0;
}
</style>
