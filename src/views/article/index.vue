<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- 
              el-radio 默认把 label
              作为文本和选中之后的 value 值
             -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <!-- 
            button 按钮的 click 事件有个默认参数
            当没有指定参数的时候 会默认传递一个没用的数据
           -->
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{ this.totalCount }} 条结果：
      </div>
      <!-- 数据列表 -->
      <!-- 
        Table 表格组件
          1 把需要展示的数组列表数据绑定给 table 组件的 data 属性
            注意：不用 v-for 遍历 自己会遍历
          2 设计表格列 el-table-column
            width 可以设定表格列的宽度
            label 可以设定列的标题
            prop 用来设定要渲染的列表项数据字段 默认只能展示文本
          3 表格列默认只能渲染普通文本 如果需要展示其他内容 需要自定义列表格模板

       -->
      <el-table
        :data="articles"
        stripe
        style="width: 100%"
        class="list-table"
        size="mini"
        v-loading="loading"
      >
        <el-table-column label="封面">
          <!-- 
            :src="scope.row.cover.images[0] || './no-cover.gif'"
            是在运行期间动态改变处理
            而本地图片必须在打包的时候就存在
            要用 v-if 和 v-else
           -->
          <template slot-scope="scope">
            <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img v-else class="article-cover" src="./no-cover.gif" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 
            如果需要在自定义列模板中 获取当前遍历项数据 
            需要在 template 上声明 slot-scope="scope" 
            如果数据很多，用data把数据剥离出来
          -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板 则把需要自定义的内容放到 template 里面 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              icon="el-icon-edit"
              type="primary"
              @click="$router.push(`/publish?id=${scope.row.id}`)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->

      <!-- 列表分页 -->
      <!-- 
        total 用来设定总数居的条数
        默认按照10条每页
       -->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        @current-change="onCurrentChange"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
      />
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticleChannels,
  deleteArticle,
} from "@/api/article.js";

export default {
  name: "ArticleIndex",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
      totalCount: 0, // 总数据条数
      pageSize: 20, // 每页数据数
      status: null, // 查询文章的状态，null 不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表单数据加载中 loading
      page: 1, // 当前页码
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles();
    this.loadChannels();
  },
  mounted() {},
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    loadArticles(page = 1) {
      // 展示加载中 loading
      this.loading = true;
      getArticles({
        page: page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null, // 截止日期
      }).then((res) => {
        const { results, total_count: totalCount } = res.data.data;
        this.articles = results;
        this.totalCount = totalCount;
        // 关闭加载中 loading
        this.loading = false;
      });
    },
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    onDeleteArticle(articleId) {
      // MessageBox 确认信息弹框
      this.$confirm("确认删除文章?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认执行这里
          deleteArticle(articleId.toString()).then((res) => {
            // 删除成功 更新当前页文章数据列表
            this.loadArticles(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
    },
  },
};
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
  background-size: cover;
}
</style>
