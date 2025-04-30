import { request } from '@/utils/request.js'

/**
 * 通知公告接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/notice/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save(params = {}) {
    return request({
      url: '/core/notice/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 读取数据
   * @returns
   */
  read(id) {
    return request({
      url: '/core/notice/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/core/notice/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 修改数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/core/notice/update?id=' + id,
      method: 'put',
      data
    })
  },

  /**
   * 修改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/notice/changeStatus',
      method: 'post',
      data
    })
  }
}
