<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分站管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--            搜索框区域-->
      <el-header>
        <el-form :inline="true">
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
          <el-button type="primary" @click="getOrderList">搜索</el-button>
        </el-form>
      </el-header>
      <!--            表格区域-->
      <el-table v-loading="loading" :data="orderList" border stripe>
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column label="订单号" prop="orderNum"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品数量" prop="count"> </el-table-column>
        <el-table-column label="订单状态" prop="orderState">
          <template slot-scope="scope">
            {{ parseOrderState(scope.row.orderState) }}
          </template>
        </el-table-column>
        <el-table-column label="订单类型" prop="orderType">
          <template slot-scope="scope">
            {{ parseOrderType(scope.row.orderType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单时间" prop="date"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="分配快递员"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="selectStation(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="分配快递员" :visible.sync="stationDialog" width="45%">
        <el-form
          :model="model"
          :rules="rules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label="快递员名字:" prop="name">
            <el-input v-model="model.expressName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="stationDialog = false">取 消</el-button>
          <el-button type="primary" @click="SelectExpressState"
            >确 定</el-button
          >
        </span>
      </el-dialog>
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
        orderState: 6,
      },
      clientOptions: [],
      total: 0,
      orderList: [],
      orderTypeOption: this.GLOBAL.orderStateOption,
      pramTime: "",
      stationDialog: false,
      model: {},
      rules: {
        name: [
          { required: true, message: "请输入快递员名字", trigger: "blur" },
        ],
      },
      dataModel: {},
      operateOption: [],
      substations: [],
    };
  },
  methods: {
    async getOrderList() {
      this.loading = true;
      if (this.pramTime != "") {
        this.queryInfo.startTime = this.pramTime[0].getTime();
        this.queryInfo.endTime = this.pramTime[1].getTime();
      }
      const res = await this.$http.get("/order/orderList/", {
        params: this.queryInfo,
      });
      if (res) {
        this.total = res.obj.total;
        this.orderList = res.obj.data;
        console.log(this.orderList);
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
      return this.GLOBAL.parseOrderType(orderType);
    },
    selectStation(row) {
      this.stationDialog = true;
      this.stationModel = row;
    },
    SelectExpressState() {
      this.$http
        .post("/order/selectExpress", {
          expressName: this.model.expressName,
          orderNum: this.stationModel.orderNum,
        })
        .then((res) => {
          this.stationDialog = false;
          this.getOrderList();
        });
    },
    parseOrderState(state) {
      return this.GLOBAL.parseOrderState(state);
    },
    getSubstations() {
      this.$http.get("/substation/list").then((res) => {
        this.substations = res.obj;
      });
    },
  },
  created() {
    this.getSubstations();
    this.querySearchAsync();
    this.queryManage();
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped></style>
