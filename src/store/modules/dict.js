import { defineStore } from 'pinia'
import commonApi from '@/api/common'

const useDictStore = defineStore('dict', {
  state: () => ({ data: undefined }),

  getters: {
    getState() {
      return { ...this.$state }
    }
  },

  actions: {
    setInfo(data) {
      this.$patch(data)
    },

    async initData() {
      const { data } = await commonApi.dictAll()
      this.data = data
    }
  }
})

export default useDictStore
