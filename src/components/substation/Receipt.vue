<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分站管理</el-breadcrumb-item>
      <el-breadcrumb-item>配送单打印</el-breadcrumb-item>
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
            v-model="queryInfo.expressName"
            placeholder="请选择快递员"
            clearable
          >
            <el-option
              v-for="item in expressNameOptions"
              :key="item"
              :label="item"
              :value="item"
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
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column label="订单号" prop="orderNum"></el-table-column>
        <el-table-column label="姓名" prop="clientName"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="任务分站" prop="substationId">
            <template slot-scope="scope">
            {{ parseStation(scope.row.substationId) }}
          </template>
        </el-table-column>
        <el-table-column label="送货地址" prop="address"></el-table-column>
        <el-table-column label="配送员" prop="expressName"></el-table-column>
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
        <el-table-column label="备注" prop="goodsContent"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="回执录入"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="selectOrder(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="回执录入" :visible.sync="receiptDialog" width="45%">
      <el-form :model="dataModel" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="dataModel.orderNum" disabled> </el-input>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select
            v-model="dataModel.code"
            placeholder="请选择任务状态"
            clearable
          >
            <el-option
              v-for="item in optionOrderTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户满意度">
          <el-input v-model="dataModel.customerSatisfaction" placeholder="请输入客户满意度，最大为100"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="receiptDialog = false">取 消</el-button>
          <el-button type="primary" @click="receiptRequest">确 定</el-button>
        </span>
    </el-dialog>
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
        orderState: 8,
      },
      clientOptions: [],
      total: 0,
      orderList: [],
      orderTypeOption: this.GLOBAL.orderStateOption,
      pramTime: "",
      dataModel: {},
      operateOption: [],
      substations: [],
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
      expressNameOptions: [],
      optionOrderTypes: [{
        label: '完成',
        value: 9
      }, {
        label: '部分完成',
        value: 10
      }, {
        label: '失败',
        value: 11
      }],
      receiptDialog: false
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
    parseOrderState(state) {
      return this.GLOBAL.parseOrderState(state);
    },
    parseStation(stationId) {
      return this.substations.find((res) => {
        return res.id == stationId;
      }).name;
    },
    queryAllExpressNames() {
      this.$http.get("/util/allExpressName").then((res) => {
        console.log(res);
        this.expressNameOptions = res.obj;
      });
    },
    selectOrder(row) {
        this.dataModel = row
        this.receiptDialog = true
        this.dataModel.orderState = null
    },
    receiptRequest() {
        this.$http.post('/order/receipt', this.dataModel).then(res => {
            this.receiptDialog = false
            this.getOrderList();
        })
    },
    getSubstations() {
      this.$http.get("/substation/list").then((res) => {
        this.substations = res.obj;
      });
    },
  },
  created() {
    this.querySearchAsync();
    this.queryManage();
    this.getOrderList();
    this.queryAllExpressNames();
    this.getSubstations();
  },
};
</script>

<style lang="less" scoped></style>
