export const realtionsType = [
  { name: '一对一', value: 'hasOne' },
  { name: '一对多', value: 'hasMany' },
  { name: '一对一（反向)', value: 'belongsTo' },
  { name: '多对多', value: 'belongsToMany' }
]

export const queryType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'neq' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: 'LIKE', value: 'like' },
  { label: 'IN', value: 'in' },
  { label: 'NOT IN', value: 'notin' },
  { label: 'BETWEEN', value: 'between' }
]

// 页面控件
export const viewComponent = [
  { label: '输入框', value: 'input' },
  { label: '密码框', value: 'password' },
  { label: '文本域', value: 'textarea' },
  { label: '数字输入框', value: 'inputNumber' },
  { label: '标签输入框', value: 'inputTag' },
  // { label: '提及', value: 'mention' },
  { label: '开关', value: 'switch' },
  { label: '滑块', value: 'slider' },
  { label: '数据下拉框', value: 'select' },
  { label: '字典下拉框', value: 'saSelect' },
  { label: '树形下拉框', value: 'treeSelect' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期选择器', value: 'date' },
  { label: '时间选择器', value: 'time' },
  { label: '评分器', value: 'rate' },
  { label: '级联选择器', value: 'cascader' },
  // { label: '数据穿梭框', value: 'transfer' },
  { label: '用户选择器', value: 'userSelect' },
  // { label: '用户信息', value: 'userinfo' },
  { label: '省市区联动', value: 'cityLinkage' },
  // { label: '子表单', value: 'formGroup' },
  { label: '图片上传', value: 'uploadImage' },
  { label: '文件上传', value: 'uploadFile' },
  // { label: '资源选择器', value: 'selectResource' },
  { label: '富文本控件', value: 'wangEditor' }
  // { label: '代码编辑器', value: 'codeEditor' }
]
