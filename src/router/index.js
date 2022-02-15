import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login/";
import Home from "@/views/home/";
import Layout from "@/views/layout/";
import Article from "@/views/article/";
import Publish from "@/views/publish/";
import Image from "@/views/image/";
import Comment from "@/views/comment/";
import Settings from "@/views/settings/";
import Fans from "@/views/fans/";

Vue.use(VueRouter);

// 路由配置表
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/",
    // layout 有默认子路由 名字没有意义
    // 如果有默认子路由 不要给父路由起名字
    component: Layout,
    children: [
      {
        path: "", // path 为空 默认子路由
        name: "home",
        component: Home,
      },
      {
        path: "/article",
        name: "article",
        component: Article,
      },
      {
        path: "/publish",
        name: "publish",
        component: Publish,
      },
      {
        path: "/image",
        name: "image",
        component: Image,
      },
      {
        path: "/comment",
        name: "comment",
        component: Comment,
      },
      {
        path: "/settings",
        name: "settings",
        component: Settings,
      },
      {
        path: "/fans",
        name: "fans",
        component: Fans,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 路由导航守卫
// 所有页面的导航都会经过这里
// 守卫页面的导肮
// beforeEach 是全局前置守卫 任何页面的访问都要经过这里
// to: 到哪里去
// from: 从哪里来
// next: 放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login 校验登陆状态
  // 如果没有登录 跳转到登录页面
  // 登陆了允许通过
  const user = JSON.parse(window.localStorage.getItem("user"));
  if (to.path !== "/login") {
    // 校验非登陆页面的登陆状态
    if (user) {
      // 已登录 允许通过
      next();
    } else {
      // 未登录 跳转到登录页面
      next("/login");
    }
  } else {
    // 登陆页面 正常允许通过
    next();
  }
});

export default router;
