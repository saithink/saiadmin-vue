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
   * 获取所有文件
   * @returns
   */
   getAllFiles (params = {}) {
    return request({
      url: 'system/getAllFiles',
      method: 'get',
      params
    })
  },

  /**
   * 上传图片接口
   * @returns
   */
  uploadImage (data = {}) {
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
  uploadFile (data = {}) {
    return request({
      url: '/core/system/uploadFile',
      method: 'post',
      timeout: 30000,
      // headers: { 'Content-Type': 'multipart/form-data' },
      data
    })
  },

  /**
   * 分片上传接口
   * @returns
   */
  chunkUpload (data = {}) {
    return request({
      url: 'system/chunkUpload',
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
  saveNetWorkImage (data = {}) {
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
  importExcel (url, data) {
    return request({
      url,
      method: 'post',
      data,
      timeout: 30 * 1000,
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
   * 快捷查询字典
   */
  getDict(code) {
    return request({
      url: '/core/system/dictData?code=' + code,
      method: 'get'
    })
  },

  /**
   * 快捷查询多个字典
   */
  getDicts(codes) {
    return request({
      url: '/core/system/dictData?codes=' + codes.join(','),
      method: 'get'
    })
  },

  /**
	 * 获取插件信息
	 */
	getPluginInfo(params) {
		return request({
			url: '/core/system/getPlugin',
			method: 'get',
            params,
		})
	},

  downloadById(id) {
    return request({
      url: '/core/system/downloadById/' + id,
      method: 'get',
    })
  },

  downloadByHash(hash) {
    return request({
      url: '/core/system/downloadByHash/' + hash,
      method: 'get',
    })
  },

  getFileInfoById(id) {
    return request({
      url: '/core/system/getFileInfoById/' + id,
      method: 'get',
    })
  },

  getFileInfoByHash(hash) {
    return request({
      url: '/core/system/getFileInfoByHash/' + hash,
      method: 'get',
    })
  }
}
