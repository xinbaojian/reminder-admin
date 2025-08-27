/**
 * @description 导出默认网路配置
 **/
const network = {
  // 默认的接口地址 如果是开发环境和生产环境走vab-mock-server，当然你也可以选择自己配置成需要的接口地址
  baseURL:
    process.env.NODE_ENV === "production"
      ? "./vab-mock-server"
      : "http://localhost:8000/api/v1",
      // : "https://reminder.xiuyuan.xin/api/v1",
  //配后端数据的接收方式application/json;charset=UTF-8或者application/x-www-form-urlencoded;charset=UTF-8
  contentType: "application/json;charset=UTF-8",
  //消息框消失时间
  messageDuration: 3000,
  //最长请求时间
  requestTimeout: 15000,
  //操作正常code，支持String、Array、int多种类型
  successCode: [-1,0,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,300],
  //登录失效code
  invalidCode: 61,
  //无权限code
  noPermissionCode: 61,
};
module.exports = network;
