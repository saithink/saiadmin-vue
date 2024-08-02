import { request } from '@/utils/request.js'

export default {

  /**
   * 获取登录日志分页列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/logs/getLoginLogPageList',
      method: 'get',
      params
    })
  },

  /**
   * 删除
   * @returns
   */
  deletes(data) {
    return request({
      url: '/core/logs/deleteLoginLog',
      method: 'delete',
      data
    })
  }
}