import { request } from '@/utils/request.js'

export default {
  /**
   * 获取数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/user/index',
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
      url: '/core/user/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save(params = {}) {
    return request({
      url: '/core/user/save',
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
      url: '/core/user/destroy',
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
      url: '/core/user/update?id=' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改数据状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/user/changeStatus',
      method: 'post',
      data
    })
  },

  /**
   * 清除用户缓存
   * @returns
   */
  clearCache(params = {}) {
    return request({
      url: '/core/user/clearCache',
      method: 'post',
      data: params
    })
  },

  /**
   * 设置用户首页
   * @returns
   */
  setHomePage(data = {}) {
    return request({
      url: '/core/user/setHomePage',
      method: 'post',
      data
    })
  },

  /**
   * 初始化用户密码
   * @returns
   */
  initUserPassword(data) {
    return request({
      url: '/core/user/initUserPassword',
      method: 'post',
      data
    })
  },

  /**
   * 用户更新个人资料
   * @returns
   */
  updateInfo(data = {}) {
    return request({
      url: '/core/user/updateInfo',
      method: 'post',
      data
    })
  },

  /**
   * 用户修改密码
   * @returns
   */
  modifyPassword(data = {}) {
    return request({
      url: '/core/user/modifyPassword',
      method: 'post',
      data
    })
  }
}
