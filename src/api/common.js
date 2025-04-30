import { request } from '@/utils/request.js'

export default {
  /**
   * 获取用户列表
   * @returns
   */
  getUserList(params = {}) {
    return request({
      url: '/core/system/getUserList',
      method: 'get',
      params
    })
  },

  /**
   * 通过id 列表获取用户基础信息
   * @returns
   */
  getUserInfoByIds(data = {}) {
    return request({
      url: '/core/system/getUserInfoByIds',
      method: 'post',
      data
    })
  },

  /**
   * 获取公告列表
   * @returns
   */
  getNoticeList(params = {}) {
    return request({
      url: '/core/system/notice',
      method: 'get',
      params
    })
  },

  /**
   * 获取基础统计
   * @returns
   */
  getStatistics(params = {}) {
    return request({
      url: '/core/system/statistics',
      method: 'get',
      params
    })
  },

  /**
   * 获取登录图表统计
   * @returns
   */
  loginChart(params = {}) {
    return request({
      url: '/core/system/loginChart',
      method: 'get',
      params
    })
  },

  /**
   * 清除所有缓存
   * @returns
   */
  clearAllCache() {
    return request({
      url: '/core/system/clearAllCache',
      method: 'get'
    })
  },

  /**
   * 上传图片接口
   * @returns
   */
  uploadImage(data = {}) {
    return request({
      url: '/core/system/uploadImage',
      method: 'post',
      timeout: 30000,
      // headers: { 'Content-Type': 'multipart/form-data' },
      data
    })
  },

  /**
   * 上传文件接口
   * @returns
   */
  uploadFile(data = {}) {
    return request({
      url: '/core/system/uploadFile',
      method: 'post',
      timeout: 30000,
      // headers: { 'Content-Type': 'multipart/form-data' },
      data
    })
  },

  /**
   * 保存网络图片
   * @returns
   */
  saveNetWorkImage(data = {}) {
    return request({
      url: '/core/system/saveNetworkImage',
      method: 'post',
      data
    })
  },

  /**
   * 获取登录日志列表
   */
  getLoginLogList(params = {}) {
    return request({
      url: '/core/system/getLoginLogList',
      method: 'get',
      params
    })
  },

  /**
   * 获取操作日志列表
   */
  getOperationLogList(params = {}) {
    return request({
      url: '/core/system/getOperationLogList',
      method: 'get',
      params
    })
  },

  /**
   * 获取资源列表
   */
  getResourceList(params = {}) {
    return request({
      url: '/core/system/getResourceList',
      method: 'get',
      params
    })
  },

  /**
   * 通用导入Excel
   */
  importExcel(url, data) {
    return request({
      url,
      method: 'post',
      data,
      timeout: 30 * 1000
      // headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * 下载通用方法
   */
  download(url, method = 'post') {
    return request({ url, method, responseType: 'blob' })
  },

  /**
   * GET通用方法
   */
  commonGet(url, params = {}) {
    return request({ url, method: 'get', params })
  },

  /**
   * 查询所有字典数据
   */
  dictAll() {
    return request({
      url: '/core/system/dictAll',
      method: 'get'
    })
  },

  /**
   * 根据id下载资源
   */
  downloadById(id) {
    return request({
      url: '/core/system/downloadById?id=' + id,
      responseType: 'blob',
      method: 'get'
    })
  },

  /**
   * 根据hash下载资源
   */
  downloadByHash(hash) {
    return request({
      url: '/core/system/downloadByHash?hash=' + hash,
      responseType: 'blob',
      method: 'get'
    })
  }
}
