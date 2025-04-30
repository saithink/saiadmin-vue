import { request } from '@/utils/request.js'

export default {
  /**
   * 获取文件分页列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/attachment/index',
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
      url: '/core/attachment/destroy',
      method: 'delete',
      data
    })
  }
}
