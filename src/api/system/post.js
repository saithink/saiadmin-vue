import { request } from '@/utils/request.js'

/**
 * 岗位数据接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/post/index',
      method: 'get',
      params
    })
  },

  /**
   * 读取数据
   * @returns
   */
  read(id) {
    return request({
      url: '/core/post/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save(params = {}) {
    return request({
      url: '/core/post/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 修改数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/core/post/update?id=' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/post/changeStatus',
      method: 'post',
      data
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/core/post/destroy',
      method: 'delete',
      data
    })
  }
}
