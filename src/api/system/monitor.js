import { request } from '@/utils/request.js'

/**
 * 服务监控接口
 */
export default {
  /**
   * 获取服务器信息
   * @returns
   */
  getServerInfo() {
    return request({
      url: '/core/system/monitor',
      method: 'get'
    })
  }
}
