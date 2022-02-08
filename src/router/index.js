import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/login/index.vue";
import Home from "@/views/home/index.vue";
import Layout from "@/views/layout/index.vue";

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
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
