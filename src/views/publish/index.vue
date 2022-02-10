<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-form
        :model="article"
        label-width="60px"
        :rules="formRules"
        ref="publish-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="400px"
            placeholder="请输入文章内容..."
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- button 本来就有默认的参数 要想默认 一定要写 -->
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor,
} from "element-tiptap";
import "element-tiptap/lib/index.css";
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article.js";
import { uploadImage } from "@/api/image.js";

export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
  },
  props: {},
  data() {
    return {
      channels: [], // 文章频道列表
      article: {
        title: "", // 文章标题
        content: "", // 文章内容
        cover: {
          // 文章封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [], // 封面图片的地址
        },
        channel_id: null,
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把图片生成 basr64 字符串和内容存储在一起
          // 如果需要自定义上传
          uploadRequest(file) {
            // 如果接口要求把请求头中的 Content-Type 设置为 multipart/form-data
            // 则请求体必须使用 FormData
            const fd = new FormData();
            fd.append("image", file);
            // return 返回 Promise 对象
            // axios 本身就是返回 Promise
            return uploadImage(fd).then((res) => {
              // return 返回最后的结果
              return res.data.data.url;
            });
          }, // 图片的上传方法 返回一个promise函数
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor(),
      ],
      formRules: {
        title: [
          {
            required: true,
            message: "请输入文章标题",
            trigger: "blur",
          },
          {
            min: 5,
            max: 30,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === "<p></p>") {
                // 验证失败
                callback(new Error("请输入文章内容"));
              } else {
                // 验证通过
                callback();
              }
            },
          },
          {
            required: true,
            message: "请输入文章内容",
            trigger: "blur",
          },
        ],
        channel_id: [
          {
            required: true,
            message: "请选择文章频道",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadChannels();
    // 由于发布和修改用同一个组件
    // 所以这里要判断
    // 如果路由参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  mounted() {},
  methods: {
    loadChannels() {
      getArticleChannels().then(({ data: { data } }) => {
        this.channels = data.channels;
      });
    },
    onPublish(draft = false) {
      this.$refs["publish-form"].validate((valid) => {
        if (!valid) {
          return false;
        }
        // 如果是修改文章 执行修改操作 否则执行发布操作
        const articleId = this.$route.query.id;
        if (articleId) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft).then((res) => {
            this.$message({
              message: `${draft ? "存入草稿" : "修改"}成功`,
              type: "success",
            });
            // 跳转到内容页面
            this.$router.push("/article");
          });
        } else {
          addArticle(this.article, draft).then((res) => {
            // 处理响应结果
            this.$message({
              message: `${draft ? "存入草稿" : "发布"}成功`,
              type: "success",
            });
            // 跳转到内容页面
            this.$router.push("/article");
          });
        }
      });
    },
    // 修改文章 加载文章内容
    loadArticle() {
      getArticle(this.$route.query.id).then((res) => {
        // 模板绑定展示
        this.article = res.data.data;
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
