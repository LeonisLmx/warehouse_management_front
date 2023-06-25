<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>出库管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--        查询框-->
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
        <el-col :span="4">
          <el-button type="primary" @click="getOutList">搜索</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="outList" border height="490" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNum"
          width="170"
        ></el-table-column>
        <el-table-column label="商品代码" prop="codeName"></el-table-column>
        <el-table-column label="货物名称" prop="name"></el-table-column>
        <el-table-column label="入库数量" prop="count"></el-table-column>
        <el-table-column label="剩余数量" prop="remainCount"></el-table-column>
        <el-table-column
          label="入库时间"
          prop="date"
          width="150"
        ></el-table-column>
        <el-table-column label="操作员" prop="operator"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="商品出库"
              placement="top"
              :enterable="false"
              v-if="scope.row.remainCount > 0"
            >
              <el-button
                type="warning"
                icon="el-icon-s-promotion"
                size="mini"
                @click="openShip(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="关联订单"
              placement="top"
              :enterable="false"
              v-if="scope.row.count > scope.row.remainCount"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="viewDetails(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--商品出库-->
    <el-dialog title="商品出库" :visible.sync="shipDialog" width="30%">
      <el-form :model="ship" ref="shipRef" label-width="90px">
        <el-form-item label="订单">
          <el-select v-model="ship.orders" placeholder="请选择订单">
            <el-option
              v-for="item in orders"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shipDialog = false" type="info">关 闭</el-button>
        <el-button type="primary" @click="shipYes">确 定</el-button>
      </span>
    </el-dialog>
    <!--出库信息-->
    <el-dialog title="出库信息" :visible.sync="goodsOutDialog" width="40%">
      <el-table :data="goodsOrders" border height="490" stripe>
        <el-table-column label="出库订单号" prop="orderNum"></el-table-column>
        <el-table-column
          label="出库时间"
          prop="createTime"
          width="170"
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsOutDialog = false" type="info">关 闭</el-button>
      </span>
    </el-dialog>
    <!--物流信息-->
    <el-dialog title="物流信息" :visible.sync="logisticsDialog" width="40%">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(kd, index) in kd.Traces"
          :key="index"
          :timestamp="kd.AcceptTime"
        >
          {{ kd.AcceptStation }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pramTime: "",
      outList: [],
      loading: false,
      shipDialog: false,
      ship: {
        id: "",
        expCode: "",
        expNo: "",
      },
      options: [
        {
          value: "ZTO",
          label: "中通",
        },
        {
          value: "STO",
          label: "申通",
        },
        {
          value: "YTO",
          label: "圆通",
        },
      ],
      orders: [],
      logisticsDialog: false,
      reverse: true,
      goodsOrders: [],
      kd: {},
      goodsOutDialog: false
    };
  },
  methods: {
    //获取货物列表
    async getOutList() {
      this.loading = true;
      var url = "/goods/enterList";
      if (this.pramTime.length > 0) {
        url =
          url +
          "/?startTime=" +
          this.pramTime[0].getTime() +
          "&endTime=" +
          this.pramTime[1].getTime();
      }
      const res = await this.$http.get(url);
      if (res) {
        this.outList = res.obj;
      }
      this.loading = false;
    },
    async openShip(item) {
      this.shipDialog = true;
      this.ship.goodsId = item.id;
      this.getOrders();
    },
    async shipYes() {
      console.log(this.ship);
      const res = await this.$http.put("/goods/out", this.ship);
      if (res) {
        this.shipDialog = false;
        this.getOutList();
      }
    },
    getOrders() {
      this.$http
        .get("/order/orderList/?pageNum=1&size=1000&orderState=2")
        .then((res) => {
          let list = res.obj.data;
          this.orders = [];
          for (var i = 0; i < list.length; i++) {
            this.orders.push({
              label: list[i].orderNum,
              value: list[i].orderNum + "-" + list[i].count,
            });
          }
        });
    },
    viewDetails(row) {
        this.goodsOutDialog = true
        this.$http.post('/goods/ship', {"goodsId":row.id})
        .then(res => {
            console.log(res)
            this.goodsOrders = res.obj
        })
    }
  },
  created() {
    this.getOutList();
  },
};
</script>

<style scoped>
</style>
