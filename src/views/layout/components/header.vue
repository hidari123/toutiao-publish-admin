<template>
  <div class="header-container">
    <div>
      <!-- 
        class 样式处理
          {
            css类名: 布尔值
          }
          true: 作用类名
          false: 不作用类名
       -->
      <i
        :class="{
          'el-icon-s-fold': this.isCollapse,
          'el-icon-s-unfold': !this.isCollapse,
        }"
        @click="changeCollapse"
      ></i>
      <span>江苏传智播客科技教育有限公司</span>
    </div>
    <el-dropdown>
      <div class="avatar-wrap">
        <img class="avatar" :src="user.photo" alt="" />
        <span>{{ user.name }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <!-- 
          组件默认不识别原生事件 除非内部做了处理
          .native 原生事件修饰符
         -->
        <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
// 导入和user相关的接口
import { getUserProfile } from "@/api/user.js";
// 导入eventBus
import eventBus from "@/utils/event-bus.js";

export default {
  name: "AppHeader",
  components: {},
  props: {},
  data() {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    // 组件初始化好 请求获取用户资料
    this.loadUserProfile();
    eventBus.$on("update-user", (data) => {
      // 不要直接写 this.user = data
      // 对象之间赋值的是引用 会导致相互影响的问题
      this.user.name = data.name;
      this.user.photo = data.photo;
    });
    eventBus.$on("update-photo", (data) => {
      this.user.photo = data.photo;
    });
  },
  mounted() {},
  methods: {
    // 除了登录接口 其他所有接口都需要授权才能请求使用
    // 需要提供身份令牌
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
      eventBus.$emit("isCollapse", this.isCollapse);
      // console.log(!this.isCollapse);
    },
    onLogout() {
      // MessageBox 确认信息弹框
      this.$confirm("确认退出登录?", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 清除用户登录状态
          window.localStorage.removeItem("user");
          // 跳转到登录页面
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
