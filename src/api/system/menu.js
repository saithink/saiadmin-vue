import { request } from '@/utils/request.js'

export default {
  /**
   * 获取数据
   * @returns
   */
  getList(params = {}) {
    return request({
      url: '/core/menu/index',
      method: 'get',
      params
    })
  },

  /**
   * 可操作菜单
   * @returns
   */
  accessMenu(params = {}) {
    return request({
      url: '/core/menu/accessMenu',
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
      url: '/core/menu/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/core/menu/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/core/menu/update?id=' + id,
      method: 'put',
      data
    })
  }
}
