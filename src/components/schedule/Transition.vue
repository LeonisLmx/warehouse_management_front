<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>调度中心</el-breadcrumb-item>
      <el-breadcrumb-item>自动调度</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--            搜索框区域-->
      <el-header style="over-flow: auto">
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
          <el-form-item>
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
              content="查看信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-camera-solid"
                size="mini"
                @click="viewInfo(scope.row.orderNum)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="商品到货"
              placement="top"
              :enterable="false"
              v-if="scope.row.orderState == 0"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="editOrderState(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="调度分站"
              placement="top"
              :enterable="false"
              v-if="scope.row.orderState == 2"
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

      <el-dialog title="查看信息" :visible.sync="viewDialog" width="45%">
        <el-form :model="dataModel" label-width="100px" :inline="true">
          <el-form-item label="订单号">
            <el-input v-model="dataModel.orderNum" disabled> </el-input>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-input v-model="dataModel.orderType" disabled> </el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="dataModel.clientName" disabled> </el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-input v-model="dataModel.orderState" disabled> </el-input>
          </el-form-item>
          <el-form-item label="送货日期">
            <el-input v-model="dataModel.date" disabled> </el-input>
          </el-form-item>
          <el-form-item label="录入员">
            <el-input v-model="dataModel.operateName" disabled> </el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="dataModel.name" disabled> </el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="dataModel.count" disabled> </el-input>
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="dataModel.price" disabled> </el-input>
          </el-form-item>
          <el-form-item label="收货人">
            <el-input v-model="dataModel.clientName" disabled> </el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="dataModel.address" disabled> </el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="dataModel.phone" disabled> </el-input>
          </el-form-item>
          <el-form-item label="邮编">
            <el-input v-model="dataModel.postcode" disabled> </el-input>
          </el-form-item>
          <el-form-item label="执行任务分站">
            <el-input v-model="dataModel.substation" disabled> </el-input>
          </el-form-item>
          <el-form-item label="发票">
            <el-input v-model="dataModel.invoice" disabled> </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="dataModel.content" disabled> </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="viewDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="登记分站" :visible.sync="stationDialog" width="45%">
        <el-form
          :model="stationModel"
          :rules="stationRules"
          label-width="100px"
          :inline="true"
        >
          <el-form-item label="所属分站:" prop="substation">
            <el-input v-model="stationModel.substation"> </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="stationDialog = false">取 消</el-button>
          <el-button type="primary" @click="editSubstation">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        size: 7,
        orderState: 2,
      },
      clientOptions: [],
      total: 0,
      orderList: [],
      orderTypeOption: this.GLOBAL.orderTypeOption,
      orderStateOption: this.GLOBAL.orderStateOption,
      pramTime: "",
      stationDialog: false,
      stationModel: {},
      stationRules: {
        substation: [
          { required: true, message: "请输入所选分站", trigger: "blur" },
        ],
      },
      dataModel: {},
      viewDialog: false,
      operateOption: [],
    };
  },
  methods: {
    async getOrderList() {
      this.loading = true;
      if (this.pramTime != "") {
        this.queryInfo.startTime = this.pramTime[0].getTime();
        this.queryInfo.endTime = this.pramTime[1].getTime();
      }
      const res = await this.$http.get("/order/list/", {
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
      MessageBox.confirm("将自动分配投递分站，是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/order/selectRandomSubstation", {
              orderNum: row.orderNum,
            })
            .then((res) => {
              this.getOrderList();
            });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消",
          });
          return;
        });
    },
    editSubstation() {
      this.$http
        .post("/order/selectSubstation", this.substation)
        .then((res) => {
          this.stationDialog = false;
        });
    },
    viewInfo(orderNum) {
      this.viewDialog = true;
      this.$http
        .get("/order/searchByOrderId?orderId=" + orderNum)
        .then((res) => {
          this.dataModel = res.obj.order;
          console.log(res.obj);
          this.dataModel.clientName = res.obj.client.name;
          this.dataModel.address = res.obj.client.address;
          this.dataModel.phone = res.obj.client.phone;
          this.dataModel.postcode = res.obj.client.postcode;
          this.dataModel.invoice = this.dataModel.invoiceEnabled ? "是" : "否";
          this.dataModel.operateName = this.operateOption.find(
            (ans) => ans.id == this.dataModel.operateId
          ).name;
        });
    },
    parseOrderState(state) {
      return this.GLOBAL.parseOrderState(state);
    },
    editOrderState(row) {
      this.$http
        .post("/order/stateUpdate/", { orderState: 2, orderNum: row.orderNum })
        .then((res) => {
          this.getOrderList();
        });
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
