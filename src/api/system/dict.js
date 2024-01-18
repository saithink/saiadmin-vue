import { request } from '@/utils/request.js'

export const dictType = {

  /**
   * 获取字典类型，无分页
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/dictType/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/core/dictType/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加字典类型
   * @returns
   */
  save(params = {}) {
    return request({
      url: '/core/dictType/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 移到回收站
   * @returns
   */
  deletes(data) {
    return request({
      url: '/core/dictType/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复数据
   * @returns
   */
  recoverys (data) {
    return request({
      url: '/core/dictType/recovery',
      method: 'post',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/core/dictType/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改字典类型状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/dictType/changeStatus',
      method: 'post',
      data
    })
  },
}

export const dict = {
  /**
   * 快捷查询字典
   * @param {*} params
   * @returns
   */
  getDict(code) {
    return request({
      url: '/core/dataDict/index?code=' + code,
      method: 'get'
    })
  },

  /**
   * 获取字典数据分页列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/core/dictData/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加字典数据
   * @returns
   */
  saveDictData(data = {}) {
    return request({
      url: '/core/dictData/save',
      method: 'post',
      data
    })
  },

  /**
   * 移到回收站
   * @returns
   */
  deletesDictData(data) {
    return request({
      url: '/core/dictData/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  updateDictData(id, data = {}) {
    return request({
      url: '/core/dictData/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 清空缓存
   * @returns
   */
  clearCache() {
    return request({
      url: '/core/dictData/clearCache',
      method: 'post'
    })
  },

  /**
   * 更改字典状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/core/dictData/changeStatus',
      method: 'post',
      data
    })
  },
}