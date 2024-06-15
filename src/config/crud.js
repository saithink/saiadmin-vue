export default {
  
  // 响应返回解析
  parseResponseData: (res) => {

    return res?.data?.data
    ?
    // 分页响应字段结构定义
    {
      rows: res?.data?.data ?? [],      // 分析行数据字段结构
      pageInfo: {
        total: res?.data?.total?? 0,
        currentPage: res?.data?.current_page?? 1,
        totalPage: res?.data?.last_page?? 1,
      },    // 分析总数字段结构
      message: res?.message,      // 分析描述字段结构
      code: res?.code            // 分析状态字段结构
    }
    :
    // 无分页响应字段结构定义
    {
      rows: res?.data ?? [],           // 分析行数据字段结构
      message: res?.message,     // 分析描述字段结构
      code: res?.code            // 分析状态字段结构
    }

  },

  // 请求字段结构定义
  request: {
    page: 'page',             //规定当前分页字段
    pageSize: 'limit',        //规定一页条数字段
  }

}