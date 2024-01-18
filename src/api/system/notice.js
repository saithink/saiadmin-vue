import { request } from '@/utils/request.js'

/**
 * 系统公告 API JS
 */

export default {

  /**
   * 获取系统公告分页列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/core/notice/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取系统公告数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/core/notice/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加系统公告
   * @returns
   */
  save (params = {}) {
    return request({
      url: '/core/notice/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 读取系统公告
   * @returns
   */
  read (id) {
    return request({
      url: '/core/notice/read/' + id,
      method: 'get'
    })
  },

  /**
   * 将系统公告移到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: '/core/notice/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复系统公告数据
   * @returns
   */
  recoverys (data) {
    return request({
      url: '/core/notice/recovery',
      method: 'post',
      data
    })
  },

  /**
   * 更新系统公告数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: '/core/notice/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改岗位状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/notice/changeStatus',
      method: 'post',
      data
    })
  },

}