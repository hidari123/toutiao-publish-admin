import request from "../utils/request";

// 获取粉丝列表
export const getFansList = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/followers",
    params: params,
  });
};

// 获取粉丝统计数据

// export const getFansData = () => {
//   return request({
//     method: "GET",
//     url: "/mp/v1_0/statistics/followers",
//   });
// };
