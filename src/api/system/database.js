import { request } from '@/utils/request.js'

export default {
  /**
   * 获取数据表分页列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/database/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取数据源
   * @returns
   */
  getDataSource(params = {}) {
    return request({
      url: '/core/database/dataSource',
      method: 'get',
      params
    })
  },

  /**
   * 获取表字段列表
   * @returns
   */
  getDetailed(params = {}) {
    return request({
      url: '/core/database/detailed',
      method: 'get',
      params
    })
  },

  /**
   * 获取回收站数据
   * @returns
   */
  getRecycle(params = {}) {
    return request({
      url: '/core/database/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 销毁数据
   * @returns
   */
  delete(data) {
    return request({
      url: '/core/database/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复数据
   * @returns
   */
  recovery(data) {
    return request({
      url: '/core/database/recovery',
      method: 'post',
      data
    })
  },

  /**
   * 优化表
   * @returns
   */
  optimize(data = {}) {
    return request({
      url: '/core/database/optimize',
      method: 'post',
      data
    })
  },

  /**
   * 清理表碎片
   * @returns
   */
  fragment(data = {}) {
    return request({
      url: '/core/database/fragment',
      method: 'post',
      data
    })
  }
}
