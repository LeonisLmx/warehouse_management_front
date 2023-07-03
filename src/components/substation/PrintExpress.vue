<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分站管理</el-breadcrumb-item>
      <el-breadcrumb-item>配送单打印</el-breadcrumb-item>
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
        <el-form-item>
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
        <el-table-column label="快递员" prop="expressName"> </el-table-column>
        <el-table-column label="最后更新时间" prop="updateTime"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="配送单打印"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="viewOrderInfo(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="信息预览" :visible.sync="viewDialog" width="45%" id="print" ref="print">
        <el-form :model="dataModel" label-width="100px">
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
          <el-button v-print="'#print'">打印</el-button>
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
        orderState: '7,8'
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
      viewDialog: false,
      dataModel: {}
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
    parseOrderState(state) {
      return this.GLOBAL.parseOrderState(state);
    },
    queryAllExpressNames() {
        this.$http.get("/util/allExpressName").then(res => {
            console.log(res)
            this.expressNameOptions = res.obj;
        })
    },
    viewOrderInfo(row) {
        this.dataModel = row
        this.viewDialog = true
    },
    printOrder() {
        var oldHtml = $("body").innerHTML; 
        var printbox = $(".box").innerHTML;
        $("body").innerHTML = printbox;
        window.print();
        $("body").innerHTML = oldHtml;
    }
  },
  created() {
    this.querySearchAsync();
    this.queryManage();
    this.getOrderList();
    this.queryAllExpressNames();
  },
};
</script>

<style lang="less" scoped></style>
