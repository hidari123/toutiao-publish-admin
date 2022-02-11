// 文章相关请求模块
// POST Body data
// GET Query params

import request from "../utils/request";

// 获取文章列表

export const getArticles = (params) => {
  return request({
    method: "GET",
    url: "/mp/v1_0/articles",
    // Body 参数使用 data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 headers 设置
    params: params,
  });
};

/**
 * 获取文章频道
 */
export const getArticleChannels = () => {
  return request({
    method: "GET",
    url: "/mp/v1_0/channels",
  });
};

/**
 * 删除文章
 */
export const deleteArticle = (articleId) => {
  return request({
    method: "DELETE",
    // 接口文档中的写的路径参数需要在 url 中传递
    // 凡是看见接口路径中有的 :xxx 格式的字段，则需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`,
  });
};

/**
 * 新建文章
 */
// 默认值放后面，不能跳过有默认值的参数传参
export const addArticle = (data, draft = false) => {
  return request({
    method: "POST",
    url: "/mp/v1_0/articles",
    params: {
      draft: draft, // 是否存为草稿 （true 为草稿）
    },
    data: data,
  });
};

/**
 * 编辑文章
 */
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: "PUT",
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft: draft, // 是否存为草稿 （true 为草稿）
    },
    data: data,
  });
};

/**
 * 获取指定文章
 */
export const getArticle = (articleId) => {
  return request({
    method: "GET",
    url: `/mp/v1_0/articles/${articleId}`,
  });
};

/**
 * 修改文章评论状态
 */
export const updateArticleStatus = (articleId, allowComment) => {
  return request({
    method: "PUT",
    url: "/mp/v1_0/comments/status",
    params: {
      // 对象属性名 不受代码规范限制
      // 代码格式规范 变量名需要驼峰写法
      article_id: articleId,
    },
    data: {
      allow_comment: allowComment,
    },
  });
};
