<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓库盘点</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-header>
        <el-form :inline="true">
          <el-form-item>
            <el-select
              v-model="parentId"
              placeholder="请选择中心库房"
              clearable
              @change="searchChildren"
            >
              <el-option
                v-for="item in parentSubstationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="parentId != 0">
            <el-select
              v-model="childrenId"
              placeholder="请选择分站库房"
              clearable
            >
              <el-option
                v-for="item in substationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="searchData">搜索</el-button>
        </el-form>
      </el-header>
      <el-table v-loading="loading" :data="dataList" border height="490" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="商品代码"
          prop="codeName"
          width="170"
        ></el-table-column>
        <el-table-column label="总库存" prop="totalCount"></el-table-column>
        <el-table-column label="剩余库存" prop="remainCount"></el-table-column>
        <el-table-column
          label="所属分站"
          prop="substationName"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      dataList: [],
      loading: false,
      parentId: "",
      childrenId: "",
      parentSubstationList: [],
      substationList: [],
    };
  },
  methods: {
    getParentSubstation() {
      this.$http.get("/substation/list").then((res) => {
        this.parentSubstationList = res.obj;
      });
    },
    searchChildren() {
      this.$http
        .get("/substation/list?parentId=" + this.parentId)
        .then((res) => {
          this.substationList = res.obj;
        });
    },
    searchData() {
      var substaionId = this.parentId;
      if (this.childrenId != "") {
        substaionId = this.childrenId;
      }
      if (substaionId == "") {
        Message.error("请选择仓库");
        return;
      }
      this.$http.get("/goods/check?substationId=" + substaionId).then((res) => {
        console.log(res);
        this.dataList = res.obj;
      });
    },
  },
  created() {
    // this.searchData();
    this.getParentSubstation();
  },
};
</script>

<style lang="less" scoped>
</style>
