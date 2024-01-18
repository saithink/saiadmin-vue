import { request } from '@/utils/request.js'

export default {

  /**
   * 获取文件分页列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/core/attachment/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/core/attachment/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 移到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: '/core/attachment/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复数据
   * @returns
   */
  recoverys (data) {
    return request({
      url: '/core/attachment/recovery',
      method: 'post',
      data
    })
  },

}