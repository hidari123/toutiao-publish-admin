<template>
  <div class="login-container">
    <!--
      el-form 表单组件
      每个表单项都必须使用 el-form-item 组件包裹
     -->

    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!-- 
        配置 Form 表单验证
          1 必须给 el-form 组件绑定 model 为表单数据对象
          2 给需要验证的表单项 el-form-item 绑定 prop 属性
            注意：prop 属性 需要指定表单对象中的数据名称
          3 通过 el-form 组件的 rules 属性 配置验证规则

          如果验证规则不足，可以自定义验证规则
          手动触发表单验证
          1 给 el-form 设置 ref 起个名字 不要重复
          2 通过 ref 获取 el-form 组件 调用组件的 validate 进行验证
       -->
      <el-form
        class="login-form"
        ref="login-form"
        :model="user"
        :rules="formRules"
      >
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree"
            >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            @click="onLogin"
            :loading="loginLoading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/user.js";
export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "", // 手机号
        code: "", // 验证码
        agree: false, // 是否同意协议的选中状态
      },
      loginLoading: false,
      formRules: {
        // 要验证的规则名称：规则列表[]
        mobile: [
          {
            required: true,
            message: "长度不能为空",
            trigger: "change",
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}/,
            message: "请输入正确的号码格式",
            trigger: "change",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "change",
          },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确的验证码格式",
            trigger: "change",
          },
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过： callback()
            // 验证失败： callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      }, // 表单验证规则配置
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onLogin() {
      // 获取表单数据
      const user = this.user;
      // 表单验证
      this.$refs["login-form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 验证成功 请求登录
        this.login();
      });
      // 处理后端响应结果
      // 成功
      // 失败
    },
    login() {
      // 通过 提交
      // 开启登录中 loading
      // 1 交互反馈
      // 2 防止网络请求慢用户多次提交登录
      this.loginLoading = true;
      // 对于代码中的请求操作
      // 1、接口请求可能需要重用
      // 2、实际工作中，接口非常容易变动，改起来麻烦
      // 我们建议的做法是把所有的请求都封装成函数然后统一的组织到模块中进行管理
      // 这样做的好处就是：管理维护更方便，也好重用
      login(this.user)
        .then((res) => {
          this.$message({
            message: "登陆成功！",
            type: "success",
          });

          // 关闭 loading
          this.loginLoading = false;

          // 将接口返回的用户相关数据放到本地存储 方面应用数据
          // 本地存储只能存字符串
          // 如果需要存储对象，数组类型的数据 需要把他们转化成 JSON 格式字符串进行存储
          // JSON.stringify 把对象转换成字符串 可以还原
          window.localStorage.setItem("user", JSON.stringify(res.data.data));

          // 跳转到首页
          // this.$router.push("/");
          this.$router.push({
            name: "home",
          });
        })
        .catch((err) => {
          this.$message.error("登陆失败，手机号或验证码错误");

          // 关闭 loading
          this.loginLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("./logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
