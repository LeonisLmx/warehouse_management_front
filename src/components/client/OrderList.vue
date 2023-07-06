<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--            搜索框区域-->
      <el-header>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              v-model="queryInfo.name"
              placeholder="请输入商品名称"
              clearable
              @clear="getOrderList"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryInfo.orderNumber"
              placeholder="请输入订单号"
              clearable
              @clear="getOrderList"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryInfo.orderState"
              placeholder="请选择货物状态"
              clearable
            >
              <el-option label="正常" value="1"></el-option>
              <el-option label="缺货" value="2"></el-option>
            </el-select>
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
          <el-button type="primary" @click="openAddOrder">新建订单</el-button>
        </el-form>
      </el-header>
      <!--            表格区域-->
      <el-table v-loading="loading" :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="orderNum"
          width="180px"
        ></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="订购数量" prop="count"></el-table-column>
        <el-table-column label="订购单位" prop="util"> </el-table-column>
        <el-table-column
          label="订单创建时间"
          prop="date"
          width="180px"
        ></el-table-column>
        <el-table-column label="关联订单Id" prop="relationOrderId">
        </el-table-column>
        <el-table-column label="是否需要发票" prop="invoiceEnabled">
          <template slot-scope="scope">
            {{ scope.row.invoiceEnabled ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="订单类型" prop="orderType">
          <template slot-scope="scope">
            {{ parseOrderType(scope.row.orderType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderState">
          <template slot-scope="scope">
            {{ parseOrderState(scope.row.orderState) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!--修改-->
            <el-tooltip
              effect="dark"
              content="修改订单信息"
              placement="top"
              :enterable="false"
              v-if="scope.row.orderState <= 2"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="openEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!--查看进度-->
            <el-tooltip
              effect="dark"
              content="查看进度"
              placement="top"
              :enterable="false"
              v-if="scope.row.orderState > 0"
            >
              <el-button
                type="success"
                icon="el-icon-time"
                size="mini"
                @click="openSchedule(scope.row)"
              ></el-button>
            </el-tooltip>
            <!--删除操作-->
            <!--查看进度-->
            <el-tooltip
              effect="dark"
              content="退订"
              placement="top"
              :enterable="false"
              v-if="scope.row.orderState <= 2"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteOrder(scope.row, 2)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="换货"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-s-goods"
                size="mini"
                @click="deleteOrder(scope.row, 3)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="退货"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete-solid"
                size="mini"
                @click="deleteOrder(scope.row, 4)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="货物到站"
              placement="top"
              :enterable="false"
              v-if="scope.row.orderState == 0"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editOrderState(scope.row)"
              ></el-button>
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
      <!--修改-->
      <el-dialog title="修改订单" :visible.sync="editOrderDialog" width="40%">
        <el-form
          ref="editUserRef"
          :model="orderInfo"
          :rules="addOrderRules"
          label-width="80px"
        >
          <el-form-item label="订单编号">
            <el-input v-model="orderInfo.orderNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsId">
            <el-select v-model="orderInfo.goodsId" placeholder="请选择商品名称">
              <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订购价格" prop="price">
            <el-input v-model="orderInfo.price"></el-input>
          </el-form-item>
          <el-form-item label="订购数量" prop="count">
            <el-input v-model="orderInfo.count"></el-input>
          </el-form-item>
          <!-- <el-form-item label="支付状态:" prop="address">
            <el-switch v-model="orderInfo.pay"> </el-switch>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editOrderDialog = false">取 消</el-button>
          <el-button type="primary" @click="editOrderYes">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看进度-->
      <el-dialog title="订单跟踪" :visible.sync="scheduleDialog" width="50%">
        <el-steps
          :space="200"
          :active="state"
          align-center
          finish-status="success"
        >
          <el-step title="生成订单"></el-step>
          <el-step title="待调度"></el-step>
          <el-step title="订单出库"></el-step>
          <el-step title="订单运输"></el-step>
          <el-step title="验货入库"></el-step>
          <el-step title="待分配"></el-step>
          <el-step title="配送出库"></el-step>
          <el-step title="领货配送"></el-step>
          <el-step title="回执录入" v-if="state <= 9"></el-step>
          <el-step title="部分完成" v-if="state == 10"></el-step>
          <el-step title="失败" v-if="state == 11"></el-step>
        </el-steps>
        <span slot="footer" class="dialog-footer">
          <el-button @click="scheduleDialog = false">关闭</el-button>
        </span>
      </el-dialog>
      <!--  新建订单-->
      <el-dialog
        title="新建订单"
        :visible.sync="addOrderDialog"
        width="40%"
        @close="addOrderDialogClosed"
      >
        <!--内容主体区域-->
        <el-form
          :model="addOrder"
          :rules="addOrderRules"
          ref="addOrderRef"
          label-width="90px"
        >
          <el-form-item label="商品名" prop="goodsId">
            <el-select v-model="addOrder.goodsId" placeholder="请选择商品名称">
              <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.name + ' (剩余数量' + item.remainCount + ')'"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订购数量" prop="count">
            <el-input
              v-model="addOrder.count"
              @input="calcTotalPrice"
            ></el-input>
          </el-form-item>
          <el-form-item label="计量单位" prop="util">
            <el-input v-model="addOrder.util"></el-input>
          </el-form-item>
          <el-form-item label="订购价格" prop="price">
            <el-input
              v-model="addOrder.price"
              @input="calcTotalPrice"
            ></el-input>
          </el-form-item>
          <el-form-item label="订购总额" prop="totalPrice">
            <el-input v-model="addOrder.totalPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="发票信息">
            <el-switch
              v-model="addOrder.invoiceEnabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select
              v-model="addOrder.orderType"
              placeholder="请选择订单类型"
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
          <el-form-item label="原订单号" v-if="addOrder.orderType == 2">
            <el-input v-model="addOrder.oldOrderNumber"></el-input>
          </el-form-item>
          <!-- <el-form-item label="投递分站">
            <el-input v-model="addOrder.deliverySubstation"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="送货日期">
            <el-input v-model="addOrder.deliverTime"></el-input>
          </el-form-item>
          <el-form-item label="商品说明">
            <el-input v-model="addOrder.goodsContent"></el-input>
          </el-form-item> -->
          <el-form-item label="备注">
            <el-input v-model="addOrder.content"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-autocomplete
              v-model="addOrder.clientName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addOrderDialog = false">取 消</el-button>
          <el-button type="primary" @click="addOrderYes">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 退订单 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="backOrderDialog"
        width="40%"
      >
        <!--内容主体区域-->
        <el-form :model="backOrder" ref="backOrderRef" label-width="90px">
          <el-form-item label="商品名" prop="name">
            <el-input v-model="backOrder.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="count">
            <el-input v-model="backOrder.count"></el-input>
          </el-form-item>
          <el-form-item label="订购单价" prop="price">
            <el-input v-model="backOrder.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="原订单号">
            <el-input v-model="backOrder.orderNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单日期">
            <el-input v-model="backOrder.date" disabled></el-input>
          </el-form-item>
          <el-form-item :label="dialogTitle + '原因'">
            <el-input v-model="backOrder.reason"></el-input>
          </el-form-item>
          <el-form-item :label="dialogTitle + '日期'">
            <el-date-picker
              v-model="backOrder.backDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="backOrder.clientName" disabled></el-input>
          </el-form-item>
        </el-form>
        <!--内容底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="backOrderDialog = false">取 消</el-button>
          <el-button type="primary" @click="addBackOrder">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { Message, MessageBox, Notification } from "element-ui";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        size: 7,
      },
      total: 0,
      orderList: [],
      editOrderDialog: false,
      //修改订单
      orderInfo: {},
      scheduleDialog: false,
      //添加订单
      addOrderDialog: false,
      query: {
        clientName: "",
      },
      addOrder: {
        goodsId: "",
        count: "",
        price: "",
        clientId: "",
        clientName: "",
      },
      addOrderRules: {
        goodsId: [{ required: true, message: "请选择商品", trigger: "blur" }],
        count: [{ required: true, message: "请填写订购数量", trigger: "blur" }],
        price: [{ required: true, message: "请填写订单价格", trigger: "blur" }],
        client: [
          { required: true, message: "请填写客户名称", trigger: "blur" },
        ],
      },
      backOrder: {},
      client: [],
      //查看进度
      state: "",
      loading: false,
      backOrderDialog: false,
      dialogTitle: "退订",
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
      goodsList: [],
    };
  },
  methods: {
    async getOrderList() {
      this.loading = true;
      const res = await this.$http.get("/order/orderList/", {
        params: this.queryInfo,
      });
      if (res) {
        this.total = res.obj.total;
        this.orderList = res.obj.data;
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
      this.orderInfo.checked = this.orderInfo.orderState == 0;
    },
    //查看进度
    openSchedule(orderInfo) {
      this.scheduleDialog = true;
      if(orderInfo.orderState == -1){
        this.state = -1
      }else if(this.orderInfo.orderState <= 8){
        this.state = this.orderInfo.orderState - 1
      }else{
        this.state = orderInfo.orderState;
      }
    },
    //打开添加订单
    openAddOrder() {
      this.addOrderDialog = true;
      this.addOrder = {};
    },
    //监听关闭订单事件
    addOrderDialogClosed() {
      this.$refs.addOrderRef.resetFields();
    },
    //远程查询客户
    async querySearchAsync(queryString, cb) {
      this.query.clientName = queryString;
      const res = await this.$http.get("/client/clientList/", {
        params: this.query,
      });
      for (let i of res.obj) {
        i.value = i.name + "(" + i.note + ")";
      }
      this.client = res.obj;
      cb(this.client);
    },
    //主要用来获取客户id
    handleSelect(item) {
      this.addOrder.clientId = item.id;
      this.addOrder.clientName = item.name;
    },
    //添加订单
    addOrderYes() {
      this.$refs.addOrderRef.validate(async (valid) => {
        if (!valid) return;
        if (this.addOrder.clientId === "") {
          Notification({
            title: "提示",
            message:
              "没有找到客户" +
              this.addOrder.clientName +
              "的任何信息，请先在客户列表中添加该客户的信息",
            type: "warning",
            duration: 4500,
          });
          return;
        }
        const res = await this.$http.post("/order/addOrder", this.addOrder);
        if (res) {
          this.getOrderList();
          this.getGoodsList();
        } else return;
        this.addOrderDialog = false;
      });
    },
    //修改订单确定按钮绑定事件
    editOrderYes() {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.put("/order/editOrder", this.orderInfo);
        if (res) {
          this.getOrderList();
          this.getGoodsList();
        } else return;
        this.editOrderDialog = false;
      });
    },
    //删除订单
    deleteOrder(row, orderType) {
      this.dialogTitle = this.parseOrderType(orderType);
      this.backOrder = JSON.parse(JSON.stringify(row));
      this.$http
        .get("/client/client/" + row.clientId)
        .then((res) => (this.backOrder.clientName = res.obj.name));
      this.backOrderDialog = true;
    },
    calcTotalPrice() {
      if (
        this.addOrder.count == undefined ||
        this.addOrder.price == undefined
      ) {
        return;
      }
      this.addOrder.totalPrice = this.addOrder.count * this.addOrder.price;
    },
    addBackOrder() {
      this.backOrder.time = this.backOrder.backDate.getTime();
      this.backOrder.relationOrderId = this.backOrder.orderNum;
      this.$http
        .post("/order/addOrder", this.backOrder)
        .then((res) => (this.backOrderDialog = false));
    },
    parseOrderType(orderType) {
      return this.orderTypeOption.find((res) => {
        return res.value == orderType;
      }).label;
    },
    parseOrderState(orderState) {
      return this.GLOBAL.parseOrderState(orderState);
    },
    editOrderState(row) {
      this.$http
        .post("/order/stateUpdate", { orderNum: row.orderNum, orderState: 1 })
        .then((res) => {
          this.getOrderList();
        });
    },
    getGoodsList() {
      this.$http.get("/goods/searchList").then((res) => {
        this.goodsList = res.obj;
      });
    },
  },
  created() {
    this.getOrderList();
    this.getGoodsList();
  },
};
</script>

<style lang="less" scoped></style>
