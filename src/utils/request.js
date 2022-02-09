/**
 * 基于 axios 封装的请求模块
 */
import axios from "axios";
import JSONbig from "json-bigint";

// axios()
// axios.get()
// axios.post()

// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: "http://api-toutiao-web.itheima.net", // 最新接口地址

  // 定制后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据 未处理的 JSON 格式
  transformResponse: [
    function (data) {
      // axios 默认在内部使用 JSON.parse 来转换处理原始数据

      // 后端返回的数据 可能不是 JSON 格式字符串
      // 如果不是的话 那么 JSONbig.parse 调用就会报错
      // 所以我们要使用 try-catch 来捕获异常 处理异常发生
      try {
        // 如果转换成功 直接返回
        return JSONbig.parse(data);
      } catch (err) {
        // 转换失败了 进入这里
        // 把数据原封不动的直接回给请求使用
        return data;
      }
    },
  ],
});

// 请求拦截器

request.interceptors.request.use(
  // 任何请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    // 可以再允许请求出去之前定制统一业务处理
    // 例如 统一设置的token
    const user = JSON.parse(window.localStorage.getItem("user"));
    // 如果有登陆用户信息 则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    // return config 之后请求才会发出去
    return config;
  },
  // 请求失败会经过这里
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器

// 导出请求方法
export default request;

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
