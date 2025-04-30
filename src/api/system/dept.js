import { request } from '@/utils/request.js'

export default {
  /**
   * 获取部门树
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/dept/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取部门领导列表
   * @returns
   */
  getLeaderList(params = {}) {
    return request({
      url: '/core/dept/leaders',
      method: 'get',
      params
    })
  },

  /**
   * 新增部门领导
   * @returns
   */
  addLeader(data = {}) {
    return request({
      url: '/core/dept/addLeader',
      method: 'post',
      data
    })
  },

  /**
   * 删除部门领导
   * @returns
   */
  delLeader(data = {}) {
    return request({
      url: '/core/dept/delLeader',
      method: 'delete',
      data
    })
  },

  /**
   * 获取部门选择树
   * @returns
   */
  tree() {
    return request({
      url: '/core/dept/index?tree=true',
      method: 'get'
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save(params = {}) {
    return request({
      url: '/core/dept/save',
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
      url: '/core/dept/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 修改数据
   * @returns
   */
  update(id, params = {}) {
    return request({
      url: '/core/dept/update?id=' + id,
      method: 'put',
      data: params
    })
  },

  /**
   * 更改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/dept/changeStatus',
      method: 'post',
      data
    })
  }
}
