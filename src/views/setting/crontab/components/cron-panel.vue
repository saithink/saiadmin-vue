<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="700"
    title="Cron表达式生成器"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" title="秒" class="p-2 min-h-48">
        <a-radio-group v-model="secondType" direction="vertical">
          <a-radio value="A">秒，允许的通配符有【* /】</a-radio>
          <a-radio value="D" class="mt-2">
            <a-space>
              <a-tag color="red">周期从</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="secondForm.start" :min="0" :max="58" mode="button" />
              <a-tag color="red"> 到 </a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="secondForm.end" :min="1" :max="59" mode="button" />
            </a-space>
          </a-radio>
          <a-radio value="B" class="mt-2">
            <a-space>
              <a-tag color="red">每</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="secondForm.every" :min="1" :max="59" mode="button" />
              <span>秒钟执行一次</span>
            </a-space>
          </a-radio>
          <a-radio value="C" class="mt-2">
            <a-space>
              <a-tag color="red">指定第</a-tag>
              <a-select v-model="secondForm.sort" :style="{ width: '350px' }" multiple>
                <a-option v-for="i in 60" :value="i - 1">{{ i - 1 }}</a-option>
              </a-select>
              <span>秒钟执行</span>
            </a-space>
          </a-radio>
        </a-radio-group>
      </a-tab-pane>
      <a-tab-pane key="2" title="分钟" class="p-2 min-h-48">
        <a-radio-group v-model="minuteType" direction="vertical">
          <a-radio value="A">分钟，允许的通配符有【* /】</a-radio>
          <a-radio value="D" class="mt-2">
            <a-space>
              <a-tag color="red">周期从</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="minuteForm.start" :min="0" :max="58" mode="button" />
              <a-tag color="red"> 到 </a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="minuteForm.end" :min="1" :max="59" mode="button" />
            </a-space>
          </a-radio>
          <a-radio value="B" class="mt-2">
            <a-space>
              <a-tag color="red">每</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="minuteForm.every" :min="1" :max="59" mode="button" />
              <span>分钟执行一次</span>
            </a-space>
          </a-radio>
          <a-radio value="C" class="mt-2">
            <a-space>
              <a-tag color="red">指定第</a-tag>
              <a-select v-model="minuteForm.sort" :style="{ width: '350px' }" multiple>
                <a-option v-for="i in 60" :value="i - 1">{{ i - 1 }}</a-option>
              </a-select>
              <span>分钟执行</span>
            </a-space>
          </a-radio>
        </a-radio-group>
      </a-tab-pane>
      <a-tab-pane key="3" title="小时" class="p-2 min-h-48">
        <a-radio-group v-model="hourType" direction="vertical">
          <a-radio value="A">小时，允许的通配符有【* /】</a-radio>
          <a-radio value="D" class="mt-2">
            <a-space>
              <a-tag color="red">周期从</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="hourForm.start" :min="0" :max="22" mode="button" />
              <a-tag color="red"> 到 </a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="hourForm.end" :min="1" :max="23" mode="button" />
            </a-space>
          </a-radio>
          <a-radio value="B" class="mt-2">
            <a-space>
              <a-tag color="red">每</a-tag>
              <a-input-number :style="{ width: '150px' }" v-model="hourForm.every" :min="0" :max="23" mode="button" />
              <span>小时执行一次</span>
            </a-space>
          </a-radio>
          <a-radio value="C" class="mt-2">
            <a-space>
              <a-tag color="red">指定第</a-tag>
              <a-select v-model="hourForm.sort" :style="{ width: '350px' }" multiple>
                <a-option v-for="i in 24" :value="i - 1">{{ i - 1 }}</a-option>
              </a-select>
              <span>小时执行</span>
            </a-space>
          </a-radio>
        </a-radio-group>
      </a-tab-pane>
      <a-tab-pane key="4" title="日" class="p-2 min-h-48">
        <a-radio-group v-model="dayType" direction="vertical">
          <a-radio value="A">日，允许的通配符有【* /】</a-radio>
          <a-radio value="D" class="mt-2">
            <a-space>
              <a-tag color="red">周期从</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="dayForm.start" :min="1" :max="30" mode="button" />
              <a-tag color="red"> 到 </a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="dayForm.end" :min="2" :max="31" mode="button" />
            </a-space>
          </a-radio>
          <a-radio value="B" class="mt-2">
            <a-space>
              <a-tag color="red">每</a-tag>
              <a-input-number :style="{ width: '150px' }" v-model="dayForm.every" :min="1" :max="31" mode="button" />
              <span>日执行一次</span>
            </a-space>
          </a-radio>
          <a-radio value="C" class="mt-2">
            <a-space>
              <a-tag color="red">指定第</a-tag>
              <a-select v-model="dayForm.sort" :style="{ width: '350px' }" multiple>
                <a-option v-for="i in 31" :value="i">{{ i }}</a-option>
              </a-select>
              <span>日执行</span>
            </a-space>
          </a-radio>
        </a-radio-group>
      </a-tab-pane>
      <a-tab-pane key="5" title="月" class="p-2 min-h-48">
        <a-radio-group v-model="monthType" direction="vertical">
          <a-radio value="A">月，允许的通配符有【* /】</a-radio>
          <a-radio value="D" class="mt-2">
            <a-space>
              <a-tag color="red">周期从</a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="monthForm.start" :min="1" :max="11" mode="button" />
              <a-tag color="red"> 到 </a-tag>
              <a-input-number :style="{ width: '120px' }" v-model="monthForm.end" :min="2" :max="12" mode="button" />
            </a-space>
          </a-radio>
          <a-radio value="B" class="mt-2">
            <a-space>
              <a-tag color="red">每</a-tag>
              <a-input-number :style="{ width: '150px' }" v-model="monthForm.every" :min="1" :max="12" mode="button" />
              <span>月执行一次</span>
            </a-space>
          </a-radio>
          <a-radio value="C" class="mt-2">
            <a-space>
              <a-tag color="red">指定第</a-tag>
              <a-select v-model="monthForm.sort" :style="{ width: '350px' }" multiple>
                <a-option v-for="i in 12" :value="i">{{ i }}</a-option>
              </a-select>
              <span>月执行</span>
            </a-space>
          </a-radio>
        </a-radio-group>
      </a-tab-pane>
      <a-tab-pane key="6" title="周几" class="p-2 min-h-48">
        <a-radio-group v-model="weekType" direction="vertical">
          <a-radio value="A">周几，允许的通配符有【* /】</a-radio>
          <a-radio value="B" class="mt-2">
            <a-space>
              <a-tag color="red">每</a-tag>
              <a-select v-model="weekForm.every">
                <a-option :value="1">周一</a-option>
                <a-option :value="2">周二</a-option>
                <a-option :value="3">周三</a-option>
                <a-option :value="4">周四</a-option>
                <a-option :value="5">周五</a-option>
                <a-option :value="6">周六</a-option>
                <a-option :value="0">周日</a-option>
              </a-select>
              <span>执行一次</span>
            </a-space>
          </a-radio>
          <a-radio value="C" class="mt-2">
            <a-space>
              <a-tag color="red">指定</a-tag>
              <a-select v-model="weekForm.sort" :style="{ width: '350px' }" multiple>
                <a-option :value="1">周一</a-option>
                <a-option :value="2">周二</a-option>
                <a-option :value="3">周三</a-option>
                <a-option :value="4">周四</a-option>
                <a-option :value="5">周五</a-option>
                <a-option :value="6">周六</a-option>
                <a-option :value="0">周日</a-option>
              </a-select>
              <span>执行</span>
            </a-space>
          </a-radio>
        </a-radio-group>
      </a-tab-pane>
    </a-tabs>
    <a-divider orientation="center" class="mt-2">时间表达式</a-divider>
    <a-space direction="vertical">
      <a-space>
        <a-tag class="w-10" size="large">秒</a-tag>
        <a-tag class="w-10" size="large">分钟</a-tag>
        <a-tag class="w-10" size="large">小时</a-tag>
        <a-tag class="w-10" size="large">日</a-tag>
        <a-tag class="w-10" size="large">月</a-tag>
        <a-tag class="w-10" size="large">周</a-tag>
        <a-tag class="w-80 ml-8" size="large">Cron 表达式</a-tag>
      </a-space>
      <a-space>
        <a-tag class="w-10" size="large">{{ formData.second }}</a-tag>
        <a-tag class="w-10" size="large">{{ formData.minute }}</a-tag>
        <a-tag class="w-10" size="large">{{ formData.hour }}</a-tag>
        <a-tag class="w-10" size="large">{{ formData.day }}</a-tag>
        <a-tag class="w-10" size="large">{{ formData.month }}</a-tag>
        <a-tag class="w-10" size="large">{{ formData.week }}</a-tag>
        <a-tag class="w-80 ml-8" size="large">
          {{ formData.second }} {{ formData.minute }} {{ formData.hour }} {{ formData.day }} {{ formData.month }}
          {{ formData.week }}
        </a-tag>
      </a-space>
    </a-space>
  </component>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['success'])

// 引用定义
const visible = ref(false)
const loading = ref(false)

// 秒
const secondType = ref('')
const secondForm = reactive({
  every: 1,
  sort: [1],
  start: 0,
  end: 1,
})
watch([secondType, secondForm], ([secondType, secondForm], [prevType, prevForm]) => {
  if (secondType === 'A') {
    formData.second = '*'
  }
  if (secondType === 'B') {
    formData.second = '*/' + secondForm.every
  }
  if (secondType === 'C') {
    formData.second = secondForm.sort.join(',')
  }
  if (secondType === 'D') {
    if (secondForm.start >= secondForm.end) {
      secondForm.end = secondForm.start + 1
    }
    formData.second = secondForm.start + '-' + secondForm.end
  }
})

// 分
const minuteType = ref('')
const minuteForm = reactive({
  every: 1,
  sort: [1],
  start: 0,
  end: 1,
})
watch([minuteType, minuteForm], ([minuteType, minuteForm], [prevType, prevForm]) => {
  if (minuteType === 'A') {
    formData.minute = '*'
  }
  if (minuteType === 'B') {
    formData.minute = '*/' + minuteForm.every
  }
  if (minuteType === 'C') {
    formData.minute = minuteForm.sort.join(',')
  }
  if (minuteType === 'D') {
    if (minuteForm.start >= minuteForm.end) {
      minuteForm.end = minuteForm.start + 1
    }
    formData.minute = minuteForm.start + '-' + minuteForm.end
  }
  if (formData.second === '*') {
    formData.second = '0'
  }
})

// 小时
const hourType = ref('')
const hourForm = reactive({
  every: 1,
  sort: [1],
  start: 0,
  end: 1,
})
watch([hourType, hourForm], ([hourType, hourForm], [prevType, prevForm]) => {
  if (hourType === 'A') {
    formData.hour = '*'
  }
  if (hourType === 'B') {
    formData.hour = '*/' + hourForm.every
  }
  if (hourType === 'C') {
    formData.hour = hourForm.sort.join(',')
  }
  if (hourType === 'D') {
    if (hourForm.start >= hourForm.end) {
      hourForm.end = hourForm.start + 1
    }
    formData.hour = hourForm.start + '-' + hourForm.end
  }
  if (formData.second === '*') {
    formData.second = '0'
  }
})

// 日
const dayType = ref('')
const dayForm = reactive({
  every: 1,
  sort: [1],
  start: 1,
  end: 2,
})
watch([dayType, dayForm], ([dayType, dayForm], [prevType, prevForm]) => {
  if (dayType === 'A') {
    formData.day = '*'
  }
  if (dayType === 'B') {
    formData.day = '*/' + dayForm.every
  }
  if (dayType === 'C') {
    formData.day = dayForm.sort.join(',')
  }
  if (dayType === 'D') {
    if (dayForm.start >= dayForm.end) {
      dayForm.end = dayForm.start + 1
    }
    formData.day = dayForm.start + '-' + dayForm.end
  }
  if (formData.second === '*') {
    formData.second = '0'
  }
})

// 月
const monthType = ref('')
const monthForm = reactive({
  every: 1,
  sort: [1],
  start: 1,
  end: 2,
})
watch([monthType, monthForm], ([monthType, monthForm], [prevType, prevForm]) => {
  if (monthType === 'A') {
    formData.month = '*'
  }
  if (monthType === 'B') {
    formData.month = '*/' + monthForm.every
  }
  if (monthType === 'C') {
    formData.month = monthForm.sort.join(',')
  }
  if (monthType === 'D') {
    if (monthForm.start >= monthForm.end) {
      monthForm.end = monthForm.start + 1
    }
    formData.hour = monthForm.start + '-' + monthForm.end
  }
  if (formData.second === '*') {
    formData.second = '0'
  }
})

// 周
const weekType = ref('')
const weekForm = reactive({
  every: 1,
  sort: [1],
})
watch([weekType, weekForm], ([weekType, weekForm], [prevType, prevForm]) => {
  if (weekType === 'A') {
    formData.week = '*'
  }
  if (weekType === 'B') {
    formData.week = '*/' + weekForm.every
  }
  if (weekType === 'C') {
    formData.week = weekForm.sort.join(',')
  }
  if (formData.second === '*') {
    formData.second = '0'
  }
})

// 表单信息
const formData = reactive({
  second: '*',
  minute: '*',
  hour: '*',
  day: '*',
  month: '*',
  week: '*',
})

// 打开弹框
const open = async (rule) => {
  if (rule && rule != '') {
    const arr = rule.split(' ')
    // 秒
    if (arr[0] === '*') {
      secondType.value = 'A'
    } else if (arr[0].indexOf('-') !== -1) {
      secondType.value = 'D'
      secondForm.start = parseInt(arr[0].split('-')[0])
      secondForm.start = parseInt(arr[0].split('-')[1])
    } else if (arr[0].indexOf('/') !== -1) {
      secondType.value = 'B'
      secondForm.every = parseInt(arr[0].split('/')[1])
    } else if (arr[0].indexOf(',') !== -1) {
      secondType.value = 'B'
      secondForm.sort = arr[0].split(',')
    } else {
      secondType.value = 'C'
      secondForm.sort = [arr[0]]
    }

    // 分钟
    if (arr[1] === '*') {
      minuteType.value = 'A'
    } else if (arr[1].indexOf('-') !== -1) {
      minuteType.value = 'D'
      minuteForm.start = parseInt(arr[1].split('-')[0])
      minuteForm.start = parseInt(arr[1].split('-')[1])
    } else if (arr[1].indexOf('/') !== -1) {
      minuteType.value = 'B'
      minuteForm.every = parseInt(arr[1].split('/')[1])
    } else if (arr[1].indexOf(',') !== -1) {
      minuteType.value = 'B'
      minuteForm.sort = arr[1].split(',')
    } else {
      minuteType.value = 'C'
      minuteForm.sort = [arr[1]]
    }

    // 小时
    if (arr[2] === '*') {
      hourType.value = 'A'
    } else if (arr[2].indexOf('-') !== -1) {
      hourType.value = 'D'
      hourForm.start = parseInt(arr[2].split('-')[0])
      hourForm.start = parseInt(arr[2].split('-')[1])
    } else if (arr[2].indexOf('/') !== -1) {
      hourType.value = 'B'
      hourForm.every = parseInt(arr[2].split('/')[1])
    } else if (arr[2].indexOf(',') !== -1) {
      hourType.value = 'B'
      hourForm.sort = arr[2].split(',')
    } else {
      hourType.value = 'C'
      hourForm.sort = [arr[2]]
    }

    // 日
    if (arr[3] === '*') {
      dayType.value = 'A'
    } else if (arr[3].indexOf('-') !== -1) {
      dayType.value = 'D'
      dayForm.start = parseInt(arr[3].split('-')[0])
      dayForm.start = parseInt(arr[3].split('-')[1])
    } else if (arr[3].indexOf('/') !== -1) {
      dayType.value = 'B'
      dayForm.every = parseInt(arr[3].split('/')[1])
    } else if (arr[3].indexOf(',') !== -1) {
      dayType.value = 'B'
      dayForm.sort = arr[3].split(',')
    } else {
      dayType.value = 'C'
      dayForm.sort = [arr[3]]
    }

    // 月
    if (arr[4] === '*') {
      monthType.value = 'A'
    } else if (arr[4].indexOf('-') !== -1) {
      monthType.value = 'D'
      monthForm.start = parseInt(arr[4].split('-')[0])
      monthForm.start = parseInt(arr[4].split('-')[1])
    } else if (arr[4].indexOf('/') !== -1) {
      monthType.value = 'B'
      monthForm.every = parseInt(arr[4].split('/')[1])
    } else if (arr[4].indexOf(',') !== -1) {
      monthType.value = 'B'
      monthForm.sort = arr[4].split(',')
    } else {
      monthType.value = 'C'
      monthForm.sort = [arr[4]]
    }

    // 周
    if (arr[5] === '*') {
      weekType.value = 'A'
    } else if (arr[5].indexOf('/') !== -1) {
      weekType.value = 'B'
      weekForm.every = parseInt(arr[5].split('/')[1])
    } else if (arr[5].indexOf(',') !== -1) {
      weekType.value = 'B'
      weekForm.sort = arr[5].split(',')
    } else {
      weekType.value = 'C'
      weekForm.sort = [arr[5]]
    }
  } else {
    secondType.value = ''
    secondType.every = 1
    secondType.sort = [1]
    secondType.start = 0
    secondType.end = 1

    minuteType.value = ''
    minuteType.every = 1
    minuteType.sort = [1]
    minuteType.start = 0
    minuteType.end = 1

    hourType.value = ''
    hourType.every = 1
    hourType.sort = [1]
    hourType.start = 0
    hourType.end = 1

    dayType.value = ''
    dayType.every = 1
    dayType.sort = [1]
    dayType.start = 1
    dayType.end = 1

    monthType.value = ''
    monthType.every = 1
    monthType.sort = [1]
    monthType.start = 1
    monthType.end = 2

    weekType.value = ''
    weekType.every = 1
    weekType.sort = [1]

    formData.second = '*'
    formData.minute = '*'
    formData.hour = '*'
    formData.day = '*'
    formData.month = '*'
    formData.week = '*'
  }
  visible.value = true
}

const submit = async () => {
  const result =
    formData.second +
    ' ' +
    formData.minute +
    ' ' +
    formData.hour +
    ' ' +
    formData.day +
    ' ' +
    formData.month +
    ' ' +
    formData.week
  emit('success', result)
}

// 关闭弹窗
const close = () => (visible.value = false)

defineExpose({ open })
</script>
