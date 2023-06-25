<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓库盘点</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20"> </el-row>
      <el-table v-loading="loading" :data="dataList" border height="490" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="商品代码"
          prop="codeName"
          width="170"
        ></el-table-column>
        <el-table-column label="总库存" prop="totalCount"></el-table-column>
        <el-table-column label="剩余库存" prop="remainCount"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      loading: false,
    };
  },
  methods: {
    getList() {
      this.$http.get("/goods/check").then((res) => {
        console.log(res)
        this.dataList = res.obj;
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
</style>
