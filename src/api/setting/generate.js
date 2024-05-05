import { request } from '@/utils/request.js'

export default {
	/**
	 * 获取代码生成列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/tool/code/index',
			method: 'get',
			params,
		})
	},

	/**
	 * 从回收站获取数据列表
	 * @returns
	 */
	getRecyclePageList(params = {}) {
		return request({
			url: '/tool/code/recycle',
			method: 'get',
			params,
		})
	},

	/**
	 * 移到回收站
	 * @returns
	 */
	deletes(data) {
		return request({
			url: '/tool/code/destroy',
			method: 'delete',
			data,
		})
	},

	/**
	 * 恢复数据
	 * @returns
	 */
	recoverys(data) {
		return request({
			url: '/tool/code/recovery',
			method: 'post',
			data,
		})
	},

	/**
	 * 真实删除数据
	 * @returns
	 */
	realDestroy(data) {
		return request({
			url: '/tool/code/realDestroy',
			method: 'delete',
			data,
		})
	},

	/**
	 * 编辑生成信息
	 * @returns
	 */
	update(id, data = {}) {
		return request({
			url: '/tool/code/update/' + id,
			method: 'put',
			data,
		})
	},

	readTable(id) {
		return request({
			url: '/tool/code/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 生成代码
	 * @returns
	 */
	generateCode(data = {}) {
		return request({
			url: '/tool/code/generate',
			method: 'post',
			responseType: 'blob',
			timeout: 20 * 1000,
			data,
		})
	},

	/**
	 * 装载数据表
	 * @returns
	 */
	loadTable(data = {}) {
		return request({
			url: '/tool/code/loadTable',
			method: 'post',
			data,
		})
	},

	/**
	 * 同步数据表
	 * @returns
	 */
	sync(data) {
		return request({
			url: '/tool/code/sync/' + data,
			method: 'post',
		})
	},

	/**
	 * 预览代码
	 * @returns
	 */
	preview(id) {
		return request({
			url: '/tool/code/preview/' + id,
			method: 'get',
		})
	},

	// 获取表中字段信息
	getTableColumns(params = {}) {
		return request({
			url: '/tool/code/getTableColumns',
			method: 'get',
			params,
		})
	},

	// 获取数据源列表
	getDataSourceList(params = {}) {
		return request({
			url: '/tool/code/getDataSourceList',
			method: 'get',
			params,
		})
	},

	// 获取所有模型
	getModels() {
		return request({
			url: '/tool/code/getModels',
			method: 'get',
		})
	},
}
