import { request } from '@/utils/request.js'

export default {
	/**
	 * 获取数据表分页列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/core/dataMaintain/index',
			method: 'get',
			params,
		})
	},

	/**
	 * 获取数据源
	 * @returns
	 */
	getDataSource(params = {}) {
		return request({
			url: '/core/dataMaintain/dataSource',
			method: 'get',
			params,
		})
	},

	/**
	 * 获取表字段列表
	 * @returns
	 */
	getDetailed(params = {}) {
		return request({
			url: '/core/dataMaintain/detailed',
			method: 'get',
			params,
		})
	},

	/**
	 * 优化表
	 * @returns
	 */
	optimize(data = {}) {
		return request({
			url: '/core/dataMaintain/optimize',
			method: 'post',
			data,
		})
	},

	/**
	 * 清理表碎片
	 * @returns
	 */
	fragment(data = {}) {
		return request({
			url: '/core/dataMaintain/fragment',
			method: 'post',
			data,
		})
	},
}
