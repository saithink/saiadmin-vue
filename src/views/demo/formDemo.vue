<template>
	<div class="h-full p-3">
		<div class="ma-content-block p-5">
			<ma-form v-model="form" :columns="columns" ref="maForm" @onSubmit="handlerSubmit"></ma-form>
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'

const form = ref({})

const columns = ref([
	{
		formType: 'grid',
		customClass: ['mb-2'],
		cols: [
			{
				span: 24,
				formList: [
					{
						formType: 'divider',
						title: '基础信息',
					},
				],
			},
			{
				span: 3,
				formList: [
					{
						formType: 'upload',
						dataIndex: 'avatar',
						title: '免冠照片',
						hideLabel: !0,
					},
				],
			},
			{
				span: 21,
				formList: [
					{
						formType: 'grid-tailwind',
						colNumber: 3,
						cols: [
							{
								formList: [
									{
										title: '姓名',
										dataIndex: 'name',
										rules: [{ required: true, message: '请输入姓名' }],
									},
								],
							},
							{
								formList: [
									{
										title: '出生年月',
										dataIndex: 'bron',
										formType: 'date',
									},
								],
							},
							{
								formList: [
									{
										title: '求职意向',
										dataIndex: 'zhiwei',
									},
								],
							},
						],
					},
					{
						formType: 'grid-tailwind',
						colNumber: 3,
						cols: [
							{
								formList: [
									{
										title: '籍贯',
										dataIndex: 'jiguan',
									},
								],
							},
							{
								formList: [
									{
										title: '政治面貌',
										dataIndex: 'mianmao',
										formType: 'select',
										dict: {
											data: [
												{
													label: '党员',
													value: 1,
												},
												{
													label: '团员',
													value: 2,
												},
												{
													label: '群众',
													value: 3,
												},
											],
										},
									},
								],
							},
							{
								formList: [
									{
										title: '现居地',
										dataIndex: 'xianjudi',
										formType: 'input',
									},
								],
							},
						],
					},
					{
						formType: 'grid-tailwind',
						colNumber: 3,
						cols: [
							{
								formList: [
									{
										title: '联系电话',
										dataIndex: 'dianhua',
									},
								],
							},
							{
								formList: [
									{
										title: '邮箱',
										dataIndex: 'email',
									},
								],
							},
							{
								formList: [
									{
										title: '目前状态',
										dataIndex: 'zhuangtai',
										formType: 'select',
										dict: {
											data: [
												{
													label: '在职',
													value: 1,
												},
												{
													label: '待业',
													value: 2,
												},
											],
										},
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		formType: 'card',
		title: '教育经历',
		hideLabel: !0,
		customClass: ['mb-5'],
		formList: [
			{
				title: '添加教育经历',
				formType: 'children-form',
				dataIndex: 'shangxuejingli',
				type: 'table',
				formList: [
					{
						dataIndex: 'qishinian',
						title: '起始年月',
						formType: 'date',
						mode: 'month',
					},
					{
						dataIndex: 'endnian',
						title: '结束年月',
						formType: 'date',
						mode: 'month',
					},
					{
						dataIndex: 'xuexiao',
						title: '毕业学校',
					},
					{
						dataIndex: 'xueli',
						title: '学历',
					},
					{
						dataIndex: 'zhuanye',
						title: '主修专业',
					},
				],
			},
		],
	},
	{
		formType: 'card',
		title: '工作经历',
		hideLabel: !0,
		customClass: ['mb-5'],
		formList: [
			{
				title: '添加工作经历',
				formType: 'children-form',
				dataIndex: 'workjingli',
				type: 'group',
				formList: [
					{
						dataIndex: 'qishinian',
						title: '起始年月',
						formType: 'date',
						mode: 'month',
					},
					{
						dataIndex: 'endnian',
						title: '结束年月',
						formType: 'date',
						mode: 'month',
					},
					{
						dataIndex: 'gongsi',
						title: '公司名称',
					},
					{
						dataIndex: 'zhiwei',
						title: '职位',
					},
					{
						dataIndex: 'jieshao',
						title: '工作介绍',
						formType: 'editor',
						height: 260,
					},
				],
			},
		],
	},
	{
		formType: 'editor',
		title: '自我评价',
		dataIndex: 'ziwopingjia',
	},
])

const handlerSubmit = (data, done) => {
	// 显示表单提交中状态
	done(true)
	if (data) {
		if (data.name == '张三') {
			Message.info('真实姓名是张三')
		}
		// todo
		console.log(data)
		Message.success('提交成功')
	}
	// 关闭表单提交中状态
	done(false)
}
</script>
