import { defineStore } from 'pinia'
import commonApi from '@/api/common'

// 定义字典store，名称是dict
const useDictStore = defineStore('dict', {
  // 字典数据是数组，我们定义一个data来进行保存
  state: () => ({ data: undefined }),
  getters: {
    // 获取store状态
    getState() {
      return { ...this.$state }
    }
  },
  actions: {
    //给字典数据赋值
    setInfo(data) {
      this.$patch(data)
    },
    // 初始化字典数据
    async initData() {
      const { data } = await commonApi.dictAll()
      this.data = data
    }
  }
})

export default useDictStore
