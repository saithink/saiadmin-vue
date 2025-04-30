export default {
  // 当前crud组件的 id，全局唯一，不指定则随机生成一个
  id: undefined,
  // 主键名称
  pk: 'id',
  // 请求api方法
  api: () => {},
  // 设置分页组件每页记录数
  pageSizeOption: [10, 20, 30, 50, 100],
  // 设置选择列
  rowSelection: undefined,
  // 是否显示边框
  bordered: { wrapper: true, cell: false },
  // 每页记录数
  pageSize: 10,
  // 默认展开所有行
  expandAllRows: false,
  // 是否显示总结行
  showSummary: false,
  // 斑马线
  stripe: true,
  // 表格大小
  size: 'large',
  // 是否显示展开/折叠按钮
  isExpand: false,
  // 是否显示工具栏
  showTools: true,
  // 页面布局方式，支持 normal（标准）和 fixed（固定）两种
  pageLayout: 'fixed',
  height: 0,
  // 简洁模式
  pageSimple: false,
  // 显示排序
  showSort: true,
  // 显示搜索
  showSearch: true,
  // 搜索提交按钮文案
  searchText: '搜索',
  // 搜索重置按钮文案
  resetText: '重置',
  // 强制搜索一行显示
  singleLine: false,

  view: {
    // 新增api
    func: undefined,
    // 显示新增按钮的权限
    auth: [],
    // 按钮文案
    text: '查看',
    // 是否显示
    show: false
  },

  add: {
    // 新增api
    func: undefined,
    // 显示新增按钮的权限
    auth: [],
    // 按钮文案
    text: '新增',
    // 是否显示
    show: false
  },
  edit: {
    // 编辑api
    func: undefined,
    // 显示编辑按钮的权限
    auth: [],
    // 按钮文案
    text: '编辑',
    // 是否显示
    show: false
  },
  delete: {
    // 删除api
    func: undefined,
    // 显示删除按钮的权限
    auth: [],
    // 按钮文案
    text: '删除',
    // 是否显示
    show: false,
    // 是否显示批量处理按钮
    batch: true
  },
  import: {
    // 导入url
    url: undefined,
    // 导入参数
    params: {},
    // 下载模板地址
    templateUrl: undefined,
    // 显示导入按钮的权限
    auth: [],
    // 按钮文案
    text: '导入',
    // 是否显示
    show: false
  },
  export: {
    // 导出url
    url: undefined,
    // 显示导出按钮的权限
    auth: [],
    // 按钮文案
    text: '导出',
    // 是否显示
    show: false
  },

  // 列对齐方式
  columnAlign: 'left',

  // 是否显示索引列
  showIndex: false,
  // 索引列名称
  indexLabel: '序号',
  // 索引列宽度
  indexColumnWidth: 70,
  // 索引列固定方向，false 为不固定
  indexColumnFixed: 'left',

  // 是否显示操作列
  operationColumn: true,
  // 操作列宽度
  operationColumnWidth: 190,
  // 操作列名称
  operationColumnText: '操作'
}
