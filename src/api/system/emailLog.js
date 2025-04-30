import { request } from '@/utils/request.js'

/**
 * 邮件日志接口
 */
export default {
  /**
   * 数据列表
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
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/core/email/destroy',
      method: 'delete',
      data
    })
  }
}
