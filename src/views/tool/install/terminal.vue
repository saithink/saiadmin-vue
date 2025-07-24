<template>
  <div>
    <a-modal v-model:visible="visible" :width="800" :footer="false">
      <template #title> 终端执行面板 </template>
      <div>
        <a-empty description="暂无任务" v-if="terminal.taskList.length == 0" />
        <div v-else>
          <a-timeline labelPosition="relative">
            <a-timeline-item v-for="(item, idx) in terminal.taskList" :label="item.createTime">
              <a-collapse :default-active-key="['1']">
                <a-collapse-item key="1">
                  <template #header>
                    <div class="flex items-center">
                      <span class="font-bold text-lg mr-4">{{ item.command }}</span>
                      <a-tag :color="getTagColor(item.status)">{{ getTagText(item.status) }}</a-tag>
                    </div>
                  </template>
                  <template #extra>
                    <a-button type="text" status="warning" shape="round" @click="terminal.retryTask(idx)">
                      <template #icon>
                        <icon-refresh />
                      </template>
                    </a-button>
                    <a-button type="text" status="danger" shape="round" @click="terminal.delTask(idx)">
                      <template #icon>
                        <icon-delete />
                      </template>
                    </a-button>
                  </template>
                  <div
                    v-if="item.status == 2 || item.status == 3 || (item.status > 3 && item.showMessage)"
                    class="exec-message">
                    <pre v-for="(msg, index) in item.message" :key="index" v-html="ansiToHtml(msg)"></pre>
                  </div>
                </a-collapse-item>
              </a-collapse>
            </a-timeline-item>
          </a-timeline>
        </div>

        <a-divider />

        <div class="flex justify-center gap-2">
          <a-button type="outline" status="success" @click="testTerminal">
            <template #icon><icon-play-arrow /></template>测试命令
          </a-button>
          <a-button type="outline" @click="handleFronted">
            <template #icon><icon-sync /></template>前端依赖更新
          </a-button>
          <a-button type="outline" @click="handleBackend">
            <template #icon><icon-sync /></template>后端依赖更新
          </a-button>
          <a-button type="outline" status="warning" @click="webBuild">
            <template #icon><icon-share-external /></template>一键发布
          </a-button>
          <a-button type="outline" @click="openConfig">
            <template #icon><icon-settings /></template>终端设置
          </a-button>
          <a-button type="outline" status="danger" @click="terminal.cleanTaskList()">
            <template #icon><icon-delete /></template>清理任务
          </a-button>
        </div>
      </div>
    </a-modal>
    <a-modal v-model:visible="configVisible" :footer="false">
      <template #title> 终端设置 </template>
      <div class="pb-4">
        <a-space>
          <div class="w-24">NPM源</div>
          <a-select :style="{ width: '320px' }" v-model="terminal.npmRegistry" @change="npmRegistryChange">
            <a-option value="npm">npm官源</a-option>
            <a-option value="taobao">taobao</a-option>
            <a-option value="tencent">tencent</a-option>
          </a-select>
        </a-space>
        <a-space class="mt-4">
          <label class="w-24">NPM包管理器</label>
          <a-select :style="{ width: '320px' }" v-model="terminal.packageManager">
            <a-option value="npm">npm</a-option>
            <a-option value="yarn">yarn</a-option>
            <a-option value="pnpm">pnpm</a-option>
          </a-select>
        </a-space>
        <a-space class="mt-4">
          <label class="w-24">Composer源</label>
          <a-select :style="{ width: '320px' }" v-model="terminal.composerRegistry" @change="composerRegistryChange">
            <a-option value="composer">composer官源</a-option>
            <a-option value="tencent">tencent</a-option>
            <a-option value="huawei">huawei</a-option>
            <a-option value="kkame">kkame</a-option>
          </a-select>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTerminalStore } from '@/store'
import { Modal, Message } from '@arco-design/web-vue'

const emit = defineEmits(['success'])

const terminal = useTerminalStore()
const visible = ref(false)
const configVisible = ref(false)

const testTerminal = () => {
  terminal.addNodeTask('test', true, () => {})
}

const webBuild = () => {
  Modal.confirm({
    title: '前端打包发布',
    content: '确认重新打包前端并发布项目吗？',
    onOk: () => {
      terminal.addNodeTask('web-build', '', () => {
        Message.success('前端打包发布成功')
      })
    },
  })
}

const handleFronted = () => {
  Modal.confirm({
    title: '前端依赖更新',
    content: '确认更新前端Node依赖吗？',
    onOk: () => {
      terminal.addNodeTask('web-install', '', () => {
        Message.success('前端依赖更新成功')
      })
    },
  })
}

const handleBackend = () => {
  Modal.confirm({
    title: 'composer包更新',
    content: '确认更新后端composer包吗？',
    onOk: () => {
      terminal.addTask('composer.update', '', () => {
        Message.success('composer包更新成功')
      })
    },
  })
}

const frontInstall = (extend = '') => {
  terminal.addNodeTask('web-install', extend, () => {
    Message.success('前端依赖更新成功')
    emit('success')
  })
}

const backendInstall = (extend = '') => {
  terminal.addTask('composer.update', extend, () => {
    Message.success('composer包更新成功')
    setTimeout(() => {
      emit('success')
    }, 500)
  })
}

const npmRegistryChange = (val) => {
  const command = 'set-npm-registry' + '.' + val
  configVisible.value = false
  terminal.addTask(command, '', () => {
    Message.success('NPM源设置成功')
  })
}

const composerRegistryChange = (val) => {
  const command = 'set-composer-registry' + '.' + val
  configVisible.value = false
  terminal.addTask(command, '', () => {
    Message.success('Composer源设置成功')
  })
}

const getTagColor = (status) => {
  switch (status) {
    case 1:
      return '#a2afb9'
    case 2:
      return '#2196f3'
    case 3:
      return '#ffc107'
    case 4:
      return '#00b42a'
    case 5:
      return '#ff0000'
    case 6:
      return '#ff4d4f'
  }
}

const getTagText = (status) => {
  switch (status) {
    case 1:
      return '等待执行'
    case 2:
      return '连接中'
    case 3:
      return '执行中'
    case 4:
      return '执行成功'
    case 5:
      return '执行失败'
    case 6:
      return '未知'
  }
}

const ansiToHtml = (text) => {
  return text.replace(/\x1b\[([0-9;]+)m/g, function (match, codes) {
    const styles = []
    codes.split(';').forEach((code) => {
      code = parseInt(code, 10)
      switch (code) {
        case 0:
          styles.push('color:inherit;font-weight:normal;text-decoration:none')
          break
        case 1:
          styles.push('font-weight:bold')
          break
        case 3:
          styles.push('font-style:italic')
          break
        case 4:
          styles.push('text-decoration:underline')
          break
        case 30:
          styles.push('color:black')
          break
        case 31:
          styles.push('color:red')
          break
        case 32:
          styles.push('color:green')
          break
        case 33:
          styles.push('color:yellow')
          break
        case 34:
          styles.push('color:blue')
          break
        case 35:
          styles.push('color:magenta')
          break
        case 36:
          styles.push('color:cyan')
          break
        case 37:
          styles.push('color:white')
          break
        // 背景色等更多代码可以继续添加
      }
    })
    return styles.length ? `<span style="${styles.join(';')}">` : '</span>'
  })
}

// 打开配置弹框
const openConfig = async () => {
  configVisible.value = true
}

// 打开弹框
const open = async () => {
  visible.value = true
}
// 关闭弹框
const close = () => {
  visible.value = false
}

defineExpose({ open, close, frontInstall, backendInstall })
</script>
<style lang="less" scoped>
.exec-message {
  font-size: 12px;
  line-height: 1.5em;
  min-height: 30px;
  max-height: 200px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c8c9cc;
    border-radius: 4px;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
}
:deep(.arco-collapse-item-content) {
  background-color: #000;
  color: #c0c0c0;
}
</style>
