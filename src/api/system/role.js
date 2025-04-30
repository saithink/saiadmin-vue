import { request } from '@/utils/request.js'

export default {
  /**
   * 获取数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/role/index',
      method: 'get',
      params
    })
  },

  /**
   * 通过角色获取菜单
   * @returns
   */
  getMenuByRole(id) {
    return request({
      url: '/core/role/getMenuByRole?id=' + id,
      method: 'get'
    })
  },

  /**
   * 通过角色获取部门
   * @returns
   */
  getDeptByRole(id) {
    return request({
      url: '/core/role/getDeptByRole?id=' + id,
      method: 'get'
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save(data = {}) {
    return request({
      url: '/core/role/save',
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
      url: '/core/role/destroy',
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
      url: '/core/role/update?id=' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更新菜单权限
   * @returns
   */
  updateMenuPermission(id, data) {
    return request({
      url: '/core/role/menuPermission?id=' + id,
      method: 'post',
      data
    })
  },

  /**
   * 更新数据权限
   * @returns
   */
  updateDataPermission(id, data) {
    return request({
      url: '/core/role/dataPermission?id=' + id,
      method: 'post',
      data
    })
  },

  /**
   * 更改数据状态
   * @returns
   */
  changeStatus(params = {}) {
    return request({
      url: '/core/role/changeStatus',
      method: 'post',
      data: params
    })
  }
}
