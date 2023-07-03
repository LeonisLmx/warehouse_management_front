<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户服务中心</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              placeholder="请输入电话号码"
              v-model="queryInfo.phoneNumber"
              clearable
              @clear="getClientList"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入用户身份证号码"
              v-model="queryInfo.cardNumber"
              clearable
              @clear="getClientList"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入用户姓名"
              v-model="queryInfo.clientName"
              clearable
              @clear="getClientList"
            >
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="getClientList">搜索</el-button>
          <el-button type="danger" @click="openAddClient">添加客户</el-button>
        </el-form>
      </el-header>
      <!--客户列表区域  -->
      <el-table
        v-loading="loading"
        :data="clientList"
        border
        height="490"
        stripe
      >
        <el-table-column
          label="客户编号"
          type="index"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="客户姓名"
          prop="name"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="单位名称"
          prop="companyName"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="座机号码"
          prop="landlinePhone"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="移动电话"
          prop="phone"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="身份证号"
          prop="cardNumber"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="联系地址"
          prop="address"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="邮编"
          prop="postcode"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="email"
          prop="phone"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="备注"
          prop="note"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="200px"
        ></el-table-column>
        <el-table-column
          label="修改时间"
          prop="updateTime"
          width="200px"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="300px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="openEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="查看订单"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-s-order"
                size="mini"
                @click="openOrderList(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="拉黑客户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-warning"
                size="mini"
                @click="enterBlacklist(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--查看订单对话框-->
      <el-dialog title="客户订单" :visible.sync="orderListDialog">
        <el-table :data="orderList" v-loading="orderLoading">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column
            label="订单号"
            prop="orderNum"
            width="200"
          ></el-table-column>
          <el-table-column label="商品名" prop="name"></el-table-column>
          <el-table-column label="订购数量" prop="count"></el-table-column>
          <el-table-column label="订购单价" prop="price"></el-table-column>
          <el-table-column label="订购价格" prop="price"></el-table-column>
          <el-table-column label="是否支付" prop="pay">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay === true" type="success"
                >已付款</el-tag
              >
              <el-tag v-else type="danger">未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="transport">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.transport === true" type="success"
                >已发货</el-tag
              >
              <el-tag v-else type="danger">未发货</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--添加客户对话框-->
      <el-dialog
        :title="clientDialogTitle"
        :visible.sync="clientDialog"
        width="40%"
      >
        <!--内容主体区域-->
        <el-form
          :model="clientInfo"
          :rules="clientRules"
          ref="clientRef"
          label-width="90px"
        >
          <el-form-item label="客户名" prop="name">
            <el-input v-model="clientInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="单位名称">
            <el-input v-model="clientInfo.companyName"></el-input>
          </el-form-item>
          <el-form-item label="座机号码">
            <el-input v-model="clientInfo.landlinePhone"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="clientInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardNumber">
            <el-input v-model="clientInfo.cardNumber"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="clientInfo.address"></el-input>
          </el-form-item>
          <el-form-item label="邮编">
            <el-input v-model="clientInfo.postcode"></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="clientInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="clientInfo.note"></el-input>
          </el-form-item>
        </el-form>
        <!--内容底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="clientDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addClientYes"
            v-if="formEnabled == 1"
            >确 定</el-button
          >
          <el-button
            type="primary"
            @click="editClientYes"
            v-if="formEnabled == 2"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!--            黑名单-->
      <el-dialog title="黑名单" :visible.sync="BlacklistDialog" width="60%">
        <el-table v-loading="blackLoading" :data="blacklist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            prop="name"
            width="100px"
          ></el-table-column>
          <el-table-column
            label="联系方式"
            prop="phone"
            width="150px"
          ></el-table-column>
          <el-table-column
            label="地址"
            prop="address"
            width="225px"
          ></el-table-column>
          <el-table-column label="备注" prop="note"></el-table-column>
          <el-table-column label="移出黑名单" width="150px">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-refresh-right"
                size="mini"
                @click="outBlacklist(scope.row.id)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="BlacklistDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "../order/cityData";
import { Message, MessageBox } from "element-ui";

export default {
  data() {
    return {
      //根据姓名查询
      queryInfo: {
        clientName: "",
      },

      //表格数据
      clientList: [],
      //黑名单数据
      blacklist: [],
      loading: false,
      blackLoading: false,
      // 查看订单
      orderListDialog: false,
      orderList: [],
      //添加客户
      clientDialog: false,
      orderLoading: false,
      clientRules: {
        name: [{ required: true, message: "请填写客户姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入您的联系方式", trigger: "blur" },
          { min: 11, max: 11, message: "格式错误", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请填写客户姓名", trigger: "blur" },
        ],
        cardNumber: [
          { required: true, message: "请填写身份证号码", trigger: "blur" },
        ],
      },
      cityData,
      clientDialogTitle: "",
      clientInfo: {},
      BlacklistDialog: false,
      formEnabled: 1,
    };
  },
  methods: {
    //查看客户订单
    async getClientList() {
      this.loading = true;
      const res = await this.$http.get("/client/clientList/", {
        params: this.queryInfo,
      });
      if (!res) return;
      this.clientList = res.obj;
      this.loading = false;
      this.CLIENT_LIST = this.clientList;
    },
    //查看订单
    async openOrderList(clientId) {
      this.orderLoading = true;
      this.orderListDialog = true;
      const res = await this.$http.get("/client/getOrderByCid/" + clientId);
      if (!res) return;
      this.orderList = res.obj;
      this.orderLoading = false;
    },
    openEditDialog(row) {
      this.formEnabled = 2;
      this.clientDialog = true;
      this.clientInfo = JSON.parse(JSON.stringify(row));
      this.clientDialogTitle = "修改客户信息";
    },
    openAddClient() {
      this.formEnabled = 1;
      this.clientInfo = {};
      this.clientDialog = true;
      this.clientDialogTitle = "新增客户";
    },
    //修改客户信息
    editClientYes() {
      this.$refs.clientRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.put("/client/editClient", this.clientInfo);
        if (!res) return;
        this.getClientList();
        this.clientDialog = false;
      });
    },
    //添加客户
    addClientYes() {
      this.$refs.clientRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const res = await this.$http.post("/client/addClient", this.clientInfo);
        if (res) {
          this.getClientList();
        }
        this.clientDialog = false;
      });
    },
    //加入黑名单
    enterBlacklist(clientId) {
      MessageBox.confirm("确定将用户加入黑名单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.put(
            "/client/enterBlacklist/" + clientId
          );
          if (res) {
            this.getClientList();
          }
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消拉黑",
          });
          return;
        });
    },
    async outBlacklist(clientId) {
      const res = await this.$http.put("/client/enterBlacklist/" + clientId);
      if (res) {
        this.openBlacklist();
        this.getClientList();
      }
    },
    async openBlacklist() {
      this.blackLoading = true;
      this.BlacklistDialog = true;
      const res = await this.$http.get("/client/getBlacklist");
      this.blacklist = res.obj;
      this.blackLoading = false;
    },
  },
  created() {
    this.getClientList();
  },
};
</script>

<style scoped>
.el-col {
  margin-right: 10px;
}
</style>
