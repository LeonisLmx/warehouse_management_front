<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索框区域-->
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
          <el-button type="primary" @click="getOrders">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单类型" prop="orderType"> 
            <template slot-scope="scope">
            {{ parseOrderType(scope.row.orderType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单数量" prop="nums"> </el-table-column>
        <el-table-column label="订单总价" prop="total"> </el-table-column>
        <el-table-column label="操作人" prop="operateId"> 
            <template slot-scope="scope">
                {{ parseManageName(scope.row.operateId) }}
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        size: 7,
      },
      total: 0,
      pramTime: "",
      userList: [],
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
    };
  },
  methods: {
    getOrders() {
      this.$http.get("/order/aggregation/data").then((res) => {
        for (var index in res.obj) {
          this.orderList.push(res.obj[index]);
        }
      });
    },
    parseManageName(id) {
        return this.userList.find(ans => ans.id == id).name
    },
        //改变每页的页数
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize;
      this.getOrders();
    },
    //翻页
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getOrders();
    },
    async queryManage() {
      this.$http
        .get("/employee/userList/?pageNum=1&size=1000&query=")
        .then((res) => {
          for (let i of res.obj.data) {
            this.userList.push(i);
            this.operateOption.push({ name: i.name, id: i.id });
          }
          this.getOrders();
        });
    },
    parseOrderType(orderType) {
      return this.orderTypeOption.find((res) => {
        return res.value == orderType;
      }).label;
    },
  },
  created() {
    this.queryManage();
  },
};
</script>

<style lang="less" scoped></style>
