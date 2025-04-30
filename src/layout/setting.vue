<template>
  <a-drawer
    class="backend-setting"
    v-model:visible="visible"
    :on-before-ok="save"
    width="450px"
    :ok-text="$t('sys.saveToBackend')"
    @cancel="close"
    unmountOnClose>
    <template #title>{{ $t('sys.backendSettingTitle') }}</template>
    <a-form :model="form" :auto-label-width="true">
      <a-row class="flex justify-center mb-5">
        <a-divider orientation="center"
          ><span class="title">{{ $t('sys.systemPrimaryColor') }}</span></a-divider
        >
        <ColorPicker
          theme="dark"
          :color="appStore.color"
          :sucker-hide="true"
          :colors-default="defaultColorList"
          @changeColor="changeColor"
          style="width: 218px" />
      </a-row>
      <a-divider orientation="center"
        ><span class="title">{{ $t('sys.personalizedConfig') }}</span></a-divider
      >
      <a-form-item :label="$t('sys.skin')" :help="$t('sys.skinHelp')">
        {{ currentSkin }}
        <a-button type="primary" size="mini" class="ml-2" @click="skin.open()">
          {{ $t('sys.changeSkin') }}
        </a-button>
      </a-form-item>
      <a-form-item :label="$t('sys.layouts')" :help="$t('sys.layoutsHelp')">
        <a-select v-model="form.layout" @change="handleLayout">
          <a-option value="classic">{{ $t('sys.layout.classic') }}</a-option>
          <a-option value="columns">{{ $t('sys.layout.columns') }}</a-option>
          <a-option v-if="appStore.skin !== 'classics'" value="banner">{{ $t('sys.layout.banner') }}</a-option>
          <a-option v-if="appStore.skin !== 'classics'" value="mixed">{{ $t('sys.layout.mixed') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.round')" :help="$t('sys.roundHelp')">
        <a-switch v-model="form.roundOpen" @change="handleRound" />
      </a-form-item>
      <a-form-item :label="$t('sys.ws')" :help="$t('sys.wsHelp')">
        <a-switch v-model="form.ws" @change="handleWs" />
      </a-form-item>
      <a-form-item :label="$t('sys.i18n')" :help="$t('sys.i18nHelp')">
        <a-switch v-model="form.i18n" @change="handleI18n" />
      </a-form-item>
      <a-form-item :label="$t('sys.language')" :help="$t('sys.languageHelp')" v-if="form.i18n">
        <a-select v-model="form.language" @change="handleLanguage">
          <a-option value="zh_CN">{{ $t('sys.chinese') }}</a-option>
          <a-option value="en">{{ $t('sys.english') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.animation')" :help="$t('sys.animationHelp')">
        <a-select v-model="form.animation" @change="handleAnimation">
          <a-option value="ma-fade">{{ $t('sys.animate.fade') }}</a-option>
          <a-option value="ma-slide-left">{{ $t('sys.animate.sliderLeft') }}</a-option>
          <a-option value="ma-slide-right">{{ $t('sys.animate.sliderRight') }}</a-option>
          <a-option value="ma-slide-down">{{ $t('sys.animate.sliderDown') }}</a-option>
          <a-option value="ma-slide-up">{{ $t('sys.animate.sliderUp') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.dark')" :help="$t('sys.darkHelp')" v-if="currentSkin === 'Mine'">
        <a-switch v-model="form.mode" @change="handleSettingMode" />
      </a-form-item>
      <a-form-item :label="$t('sys.water')" :help="$t('sys.waterHelp')">
        <a-switch v-model="form.waterMark" @change="handleSettingWater" />
      </a-form-item>
      <a-form-item :label="$t('sys.waterContent')" v-if="form.waterMark">
        <a-input v-model="form.waterContent" @blur="handleSettingWaterContent" />
      </a-form-item>
      <a-form-item :label="$t('sys.tag')" :help="$t('sys.tagHelp')">
        <a-switch v-model="form.tag" @change="handleSettingTag" />
      </a-form-item>
      <a-form-item v-if="form.layout !== 'banner'" :label="$t('sys.menuFold')" :help="$t('sys.menuFoldHelp')">
        <a-switch v-model="form.menuCollapse" @change="handleMenuCollapse" />
      </a-form-item>
      <a-form-item v-if="form.layout !== 'banner'" :label="$t('sys.menuWidth')" :help="$t('sys.menuWidthHelp')">
        <a-input-number v-model="form.menuWidth" mode="button" @change="handleMenuWidth" />
      </a-form-item>
    </a-form>
  </a-drawer>

  <Skin ref="skin" />
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import { Message } from '@arco-design/web-vue'
import user from '@/api/system/user'
import Skin from './components/components/skin.vue'
import skins from '@/config/skins'
import { useI18n } from 'vue-i18n'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const userStore = useUserStore()
const appStore = useAppStore()
const { t } = useI18n()

const skin = ref(null)
const visible = ref(false)
const currentSkin = ref('')
const form = reactive({
  mode: appStore.mode === 'dark',
  tag: appStore.tag,
  menuCollapse: appStore.menuCollapse,
  menuWidth: appStore.menuWidth,
  layout: appStore.layout,
  language: appStore.language,
  animation: appStore.animation,
  i18n: appStore.i18n,
  waterMark: appStore.waterMark,
  waterContent: appStore.waterContent,
  ws: appStore.ws,
  roundOpen: appStore.roundOpen,
})

const defaultColorList = reactive([
  '#165DFF',
  '#7166f0',
  '#e84a6c',
  '#efbd48',
  '#0bd092',
  '#bb1b1b',
  '#0d9496',
  '#18181b',

  '#0960be',
  '#4e69fd',
  '#f5319d',
  '#c1420b',
  '#43a047',
  '#f53f3f',
  '#344256',
  '#3f3f46',
])
const changeColor = (color) => {
  appStore.changeColor(color.hex)
}

skins.map((item) => {
  if (item.name === appStore.skin) currentSkin.value = t('skin.' + item.name)
})

watch(
  () => appStore.skin,
  (v) => {
    skins.map((item) => {
      if (item.name === v) currentSkin.value = t('skin.' + item.name)
    })
  }
)

const open = () => (visible.value = true)
const close = () => (visible.value = false)

const handleLayout = (val) => appStore.changeLayout(val)
const handleI18n = (val) => appStore.toggleI18n(val)
const handleWs = (val) => appStore.toggleWs(val)
const handleRound = (val) => appStore.toggleRound(val)
const handleLanguage = (val) => appStore.changeLanguage(val)
const handleAnimation = (val) => appStore.changeAnimation(val)
const handleSettingMode = (val) => appStore.toggleMode(val ? 'dark' : 'light')
const handleSettingWater = (val) => appStore.toggleWater(val)
const handleSettingWaterContent = (val) => appStore.changeWaterContent(val)
const handleSettingTag = (val) => appStore.toggleTag(val)
const handleMenuCollapse = (val) => appStore.toggleMenu(val)
const handleMenuWidth = (val) => appStore.changeMenuWidth(val)

watch(
  () => appStore.menuCollapse,
  (val) => (form.menuCollapse = val)
)

const save = async (done) => {
  const data = {
    mode: appStore.mode,
    tag: appStore.tag,
    menuCollapse: appStore.menuCollapse,
    menuWidth: appStore.menuWidth,
    layout: appStore.layout,
    skin: appStore.skin,
    i18n: appStore.i18n,
    language: appStore.language,
    animation: appStore.animation,
    color: appStore.color,
    waterMark: appStore.waterMark,
    waterContent: appStore.waterContent,
    ws: appStore.ws,
    roundOpen: appStore.roundOpen,
  }

  user.updateInfo({ id: userStore.user.id, backend_setting: data }).then((res) => {
    res.code === 200 && Message.success(res.message)
  })
  done(true)
}

defineExpose({ open })
</script>
