<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--            搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="pramTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryInfo.clientId"
            placeholder="请选择客户"
            clearable
          >
            <el-option
              v-for="item in clientOptions"
              :key="item.clientId"
              :label="item.name"
              :value="item.clientId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryInfo.orderType"
            placeholder="请选择订单类型"
            clearable
          >
            <el-option
              v-for="item in orderTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryInfo.operateId"
            placeholder="请选择操作人员"
            clearable
          >
            <el-option
              v-for="item in operateOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="getOrderList">搜索</el-button>
        </el-col>
      </el-row>
      <!--            表格区域-->
      <el-table v-loading="loading" :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="客户编号"
          prop="clientId"
          width="180px"
        ></el-table-column>
        <el-table-column label="客户名" prop="clientName"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品数量" prop="count"> </el-table-column>
        <el-table-column label="订单状态" prop="orderState"> </el-table-column>
        <el-table-column label="订单类型" prop="orderType">
          <template slot-scope="scope">
            {{ parseOrderType(scope.row.orderType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单时间" prop="date"> </el-table-column>
        <el-table-column label="操作人" prop="operateName"> </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        size: 7,
      },
      clientOptions: [],
      total: 0,
      orderList: [],
      operateOption: [],
      orderTypeOption: [
        {
          label: "新订",
          value: 1,
        },
        {
          label: "退订",
          value: 2,
        },
        {
          label: "换货",
          value: 3,
        },
        {
          label: "退货",
          value: 4,
        },
      ],
      pramTime: ''
    };
  },
  methods: {
    async getOrderList() {
      this.loading = true;
      if (this.pramTime != ''){
        this.queryInfo.startTime = this.pramTime[0].getTime()
        this.queryInfo.endTime = this.pramTime[1].getTime()
      }
      const res = await this.$http.get("/order/list/", {
        params: this.queryInfo,
      });
      if (res) {
        this.total = res.obj.total;
        this.orderList = res.obj.data;
        console.log(this.orderList)
      } else return;
      this.loading = false;
    },
    //改变每页的页数
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      this.getOrderList();
    },
    //翻页
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getOrderList();
    },
    openEditDialog(orderInfo) {
      this.editOrderDialog = true;
      this.orderInfo = orderInfo;
    },
    //查看进度
    openSchedule(orderInfo) {
      this.scheduleDialog = true;
      this.state = orderInfo.orderState;
    },
    //远程查询客户
    async querySearchAsync() {
      this.$http.get("/client/clientList/").then((res) => {
        for (let i of res.obj) {
          this.clientOptions.push({ name: i.name, clientId: i.id });
        }
      });
    },
    async queryManage() {
      this.$http
        .get("/employee/userList/?pageNum=1&size=1000&query=")
        .then((res) => {
          for (let i of res.obj.data) {
            this.operateOption.push({ name: i.name, id: i.id });
          }
        });
    },
    parseOrderType(orderType) {
      return this.orderTypeOption.find((res) => {
        return res.value == orderType;
      }).label;
    },
  },
  created() {
    this.querySearchAsync();
    this.queryManage();
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped></style>
