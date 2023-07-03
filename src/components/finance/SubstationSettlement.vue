<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>分站结算</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--        查询框-->
      <el-header>
        <el-form :inline="true">
          <el-form-item>
            <el-cascader
              v-model="substaionId"
              :options="substationList"
              :props="{ expandTrigger: 'hover' }"
              placeholder="请选择分站"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="pramTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form>
      </el-header>
      <el-table :data="dataList" border height="490" stripe>
        <el-table-column label="编号" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="送货数量" prop="totalCount"></el-table-column>
        <el-table-column label="收款额" prop="totalPrice"></el-table-column>
        <el-table-column label="退回数量" prop="backCount"></el-table-column>
        <el-table-column label="退款额" prop="backPrice"></el-table-column>
        <el-table-column label="实收小计" prop="settlementPrice">
          <template slot-scope="scope">
            {{ parseData(scope.row) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
  
  <script>
import { Message, MessageBox, Notification } from "element-ui";
export default {
  data() {
    return {
      pramTime: "",
      substaionId: "",
      dataList: [],
      substationList: [],
    };
  },
  methods: {
    search() {
      if (this.substaionId == "") {
        Message.error("请选择分站");
        return;
      }
      this.substaionId = this.substaionId[this.substaionId.length - 1];
      let url =
        "/order/integrateDataBySubstationId?substationId=" + this.substaionId;
      if (this.pramTime != "") {
        url =
          url +
          "&startTime=" +
          this.pramTime[0].getTime() +
          "&endTime=" +
          this.pramTime[1].getTime();
      }
      this.$http.get(url).then((res) => {
        this.dataList = res.obj;
      });
    },
    getParentSubstation() {
      this.$http.get("/substation/listAll").then((res) => {
        this.substationList = res.obj;
      });
    },
    parseData(row) {
      if (row.backPrice == null) {
        return row.totalPrice;
      }
      if (row.totalPrice == null) {
        return row.backPrice * -1;
      }
      return row.totalPrice - row.backPrice;
    },
  },
  created() {
    this.getParentSubstation();
  },
};
</script>
  
  <style lang="less" scoped>
</style>
  