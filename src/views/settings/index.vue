<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updateProfileLoading"
                @click="onUpdateUser"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <!-- label for 指向 input 里的id -->
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            ref="file"
            hidden
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img class="preview-image" :src="previewImage" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile,
} from "@/api/user.js";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import eventBus from "@/utils/event-bus.js";

export default {
  name: "SettingsIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      }, // 用户资料
      dialogVisible: false, // 控制上传头像裁切的对话框
      previewImage: "", // 预览图片
      updatePhotoLoading: false, // 更新用户头像的 loading 状态
      updateProfileLoading: false, // 更新基本信息的 loading 状态
      cropper: null, //裁切器实例
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUser();
  },
  methods: {
    onUpdateUser() {
      // 表单验证
      // 验证通过提交表单
      this.updateProfileLoading = true;
      const { name, intro, email } = this.user;
      updateUserProfile({
        name,
        intro,
        email,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.updateProfileLoading = false;
        // 发布通知 用户信息已修改
        eventBus.$emit("update-user", this.user);
      });
    },
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onFileChange() {
      // 处理图片预览
      const file = this.$refs.file;
      // html5 新增 API 可以找到图片URL
      const blobData = window.URL.createObjectURL(file.files[0]);
      this.previewImage = blobData;
      // 解决选择相同文件 不触发 change 事件问题
      this.$refs.file.value = "";
      // 展示弹出层 预览用户选择的图片
      this.dialogVisible = true;
    },
    onDialogOpened() {
      // 图片裁切器必须基于 img 进行初始化
      // img 必须可见才能正常完成初始化
      // 因为这里在对话框里面初始化裁切器
      // 所以初始化要放在对话框完全打开的状态下开始初始化
      // 获取图片 dom 节点
      const image = this.$refs["preview-image"];
      // 第 1 次 初始化好以后 如果预览裁切的图片发生变化 裁切器默认不会更新
      // 如果预览发生变化 需要更新裁切器
      // 1 裁切器 replace 方法
      // 2 销毁裁切器 重新初始化
      // 初始化裁切器
      if (this.cropper) {
        // replace 效率更高
        this.cropper.replace(this.previewImage);
        return;
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "none",
        cropBoxResizable: false,
        background: false,
        movable: true,
        // 移动裁切器触发 crop 方法
        // crop(event) {},
      });
    },
    onDialogClosed() {
      // destroy 挂在对话框关闭的钩子
      // this.cropper.destroy();
    },
    onUpdatePhoto() {
      // 让 确定 按钮开始 loading
      this.updatePhotoLoading = true;
      // 获取裁切图片对象
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData();
        fd.append("photo", file);
        //请求提交fd
        updateUserPhoto(fd).then((res) => {
          // 关闭对话框
          this.dialogVisible = false;
          // 请求更新用户头像
          // 把服务端返回的图片进行展示 有点慢
          // this.user.photo = res.data.data.photo;
          // 直接把裁切结果的文件对象转换为 blob 数据 本地预览
          this.user.photo = window.URL.createObjectURL(file);
          // 关闭 loading
          this.updatePhotoLoading = false;
          this.$message({
            type: "success",
            message: "更新头像成功",
          });
          // 刷新页面
          eventBus.$emit("update-photo", this.user);
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
.preview-image-wrap {
  /* Ensure the size of the image fit the container perfectly */
  .preview-image {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 200px;
  }
}
</style>
