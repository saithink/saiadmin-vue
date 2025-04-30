import { request } from '@/utils/request.js'

/**
 * 操作日志接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/logs/getOperLogPageList',
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
      url: '/core/logs/deleteOperLog',
      method: 'delete',
      data
    })
  }
}
