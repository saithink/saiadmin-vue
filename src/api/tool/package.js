import { request } from '@/utils/request.js'

/**
 * saipackage安装器
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getAppList(params = {}) {
    return request({
      url: '/app/saipackage/install/index',
      method: 'get',
      params
    })
  },

  /**
   * 应用上传
   * @returns
   */
  uploadApp(data = {}) {
    return request({
      url: '/app/saipackage/install/upload',
      method: 'post',
      data
    })
  },

  /**
   * 应用安装
   * @returns
   */
  installApp(data = {}) {
    return request({
      url: '/app/saipackage/install/install',
      method: 'post',
      data
    })
  },

  /**
   * 应用卸载
   * @returns
   */
  uninstallApp(data = {}) {
    return request({
      url: '/app/saipackage/install/uninstall',
      method: 'post',
      data
    })
  },

  /**
   * 重启后端
   * @returns
   */
  reloadBackend(data = {}) {
    return request({
      url: '/app/saipackage/install/reload',
      method: 'post',
      data
    })
  }
}
