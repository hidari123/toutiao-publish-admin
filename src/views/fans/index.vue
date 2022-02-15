<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="fansList">
          <el-row :gutter="20">
            <el-col
              :span="4"
              v-for="(fan, index) in fans"
              :key="index"
              class="fansList"
              ><div class="photo">
                <el-avatar :src="fan.photo" size="large"></el-avatar>
                <div>{{ fan.name }}</div>
                <el-button type="primary" icon="el-icon-plus" size="mini"
                  >关注</el-button
                >
              </div>
            </el-col>
          </el-row>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :current-page.sync="page"
            :page-size.sync="pageSize"
          >
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="粉丝画像" name="fansPortrait">粉丝画像</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFansList } from "@/api/fans.js";
export default {
  name: "FansIndex",
  components: {},
  props: {},
  data() {
    return {
      activeName: "fansList",
      totalCount: 0, // 总数据条数
      pageSize: 24, // 每页大小
      page: 1, // 当前页码
      fans: [], // 粉丝列表
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadFansList();
    this.loadFansData();
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    loadFansList(page = 1) {
      getFansList({ page: page, per_page: this.pageSize }).then((res) => {
        this.fans = res.data.data.results;
        console.log(this.fans);
      });
    },
    loadFansData() {
      // getFansData().then((res) => {
      //   console.log(res);
      // });
    },
  },
};
</script>

<style scoped lang="less">
.fansList {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  .photo {
    justify-content: center;
  }
}
</style>
