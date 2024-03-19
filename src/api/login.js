import { request } from '@/utils/request.js'

export default {
	/**
	 * 获取验证码
	 * @returns
	 */
	getCaptch() {
		// return import.meta.env.VITE_APP_PROXY_PREFIX + '/core/captcha?' + Date.parse(new Date().toString())
		return request({
			url: '/core/captcha',
			method: 'get',
		})
	},

	/**
	 * 用户登录
	 * @param {object} params
	 * @returns
	 */
	login(params = {}) {
		return request({
			url: '/core/login',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 用户退出
	 * @param {object} params
	 * @returns
	 */
	logout(params = {}) {
		return request({
			url: '/core/logout',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 获取登录用户信息
	 * @param {object} params
	 * @returns
	 */
	getInfo(params = {}) {
		return request({
			url: '/core/system/user',
			method: 'get',
			data: params,
		})
	},
}
