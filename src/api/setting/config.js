import { request } from '@/utils/request.js'

export default {
  /**
   * 获取配置列表
   * @returns
   */
  getConfigList(params) {
    return request({
      url: '/core/config/index',
      method: 'get',
      params
    })
  },

  /**
   * 清除缓存
   * @returns
   */
  clearCache(data = {}) {
    return request({
      url: '/core/config/clearCache',
      method: 'post',
      data
    })
  },

  /**
   * 删除配置
   * @returns
   */
  delete(data) {
    return request({
      url: '/core/config/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 保存配置
   * @returns
   */
  save(data = {}) {
    return request({
      url: '/core/config/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新配置
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/core/config/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 按 keys 更新配置
   * @returns
   */
  updateByKeys(data) {
    return request({
      url: '/core/config/updateByKeys',
      method: 'post',
      data
    })
  },

  /**
   * 批量修改配置值
   * @returns
   */
  batchUpdate(data) {
    return request({
      url: '/core/config/batchUpdate',
      method: 'post',
      data
    })
  },

  /**
   * 获取组列表
   * @returns
   */
  getConfigGroupList(params = {}) {
    return request({
      url: '/core/configGroup/index',
      method: 'get',
      params
    })
  },

  /**
   * 保存配置组
   * @returns
   */
  saveConfigGroup(data = {}) {
    return request({
      url: '/core/configGroup/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新配置组
   * @returns
   */
  updateConfigGroup(id, data = {}) {
    return request({
      url: '/core/configGroup/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 删除配置组
   * @returns
   */
  deleteConfigGroup(data = {}) {
    return request({
      url: '/core/configGroup/destroy',
      method: 'delete',
      data
    })
  }
}
