import { request } from '@/utils/request.js'

export default {

  /**
   * 获取登录日志分页列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/email/index',
      method: 'get',
      params
    })
  },

  /**
   * 删除
   * @returns
   */
  delete(data) {
    return request({
      url: '/core/email/destroy',
      method: 'delete',
      data
    })
  },
}