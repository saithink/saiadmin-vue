import { request } from '@/utils/request.js'

/**
 * 定时任务接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/tool/crontab/index',
      method: 'get',
      params
    })
  },

  /**
   * 日志列表
   * @returns
   */
  getLogPageList(params = {}) {
    return request({
      url: '/tool/crontab/logPageList',
      method: 'get',
      params
    })
  },

  /**
   * 删除定时任务日志
   * @returns
   */
  deleteLog(data) {
    return request({
      url: '/tool/crontab/deleteCrontabLog',
      method: 'delete',
      data
    })
  },

  /**
   * 立刻执行一次定时任务
   * @returns
   */
  run(data = {}) {
    return request({
      url: '/tool/crontab/run',
      method: 'post',
      data
    })
  },

  /**
   * 读取数据
   * @returns
   */
  read(id) {
    return request({
      url: '/tool/crontab/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 添加
   * @returns
   */
  save(data = {}) {
    return request({
      url: '/tool/crontab/save',
      method: 'post',
      data
    })
  },

  /**
   * 删除
   * @returns
   */
  destroy(data) {
    return request({
      url: '/tool/crontab/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, params = {}) {
    return request({
      url: '/tool/crontab/update?id=' + id,
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
      url: '/tool/crontab/changeStatus',
      method: 'post',
      data
    })
  }
}
