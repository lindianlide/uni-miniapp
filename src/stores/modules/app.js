import { defineStore } from 'pinia'

export const useAppStore = defineStore({
  id: 'appStore',
  state: () => ({
    orderList: 0
  }),
  actions: {
    setOrderList(list) {
      this.orderList = list
    }
  }
})
