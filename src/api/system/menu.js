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
   * 从回收站获取数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/core/menu/recycle',
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
  deletes(data) {
    return request({
      url: '/core/menu/destroy',
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
      url: '/core/menu/recovery',
      method: 'post',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/core/menu/update/' + id,
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
      url: '/core/menu/changeStatus',
      method: 'post',
      data
    })
  },
}
