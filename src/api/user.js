// 用户相关请求模块
import request from "@/utils/request.js";

// 用户登录
export const login = (data) => {
  return request({
    method: "POST",
    url: "/mp/v1_0/authorizations",
    // data 用于设置POST请求体
    data,
  });
};
// 获取用户信息
export const getUserInfo = () => {};
// 修改用户信息
export const updateUser = () => {};
