<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库管理</el-breadcrumb-item>
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
          <el-button type="primary" @click="getEnterList">搜索</el-button>
          <el-button type="primary" @click="openEnter">新建存储</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="enterList"
        border
        height="490"
        stripe
      >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNum"
          width="170"
        ></el-table-column>
        <el-table-column label="商品代码" prop="codeName"></el-table-column>
        <el-table-column label="货物名称" prop="name"></el-table-column>
        <el-table-column label="入库数量" prop="count"></el-table-column>
        <el-table-column
          label="入库时间"
          prop="date"
          width="150"
        ></el-table-column>
        <el-table-column label="操作员" prop="operator"></el-table-column>
      </el-table>
    </el-card>
    <!--        入库登记-->
    <el-dialog
      title="入库登记"
      :visible.sync="enterDialog"
      width="45%"
      @close="enterClose"
    >
      <el-form
        :model="enter"
        ref="enterRef"
        :rules="enterRules"
        label-width="90px"
        :inline="true"
      >
        <el-form-item label="订单号">
          <el-input v-model="enter.orderNum" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="enter.name" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="货物代码">
          <el-input v-model="enter.codeName" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="enter.count" style="width: 220px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="中心库房">
          <el-select
            v-model="enter.parentId"
            placeholder="请选择中心库房"
            clearable
          >
            <el-option
              v-for="item in parentSubstationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="分站库房">
          <el-cascader
            v-model="enter.substaionId"
            :options="substationList"
            :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="供应商名字">
          <el-input v-model="enter.supplierName" style="width: 220px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="enterDialog = false">取 消</el-button>
        <el-button type="primary" @click="enterYes">确 定</el-button>
      </span>
    </el-dialog>
    <!--        存放位置-->
    <el-dialog
      title="存放地址（仓库）"
      :visible.sync="locationDialog"
      width="30%"
    >
      <p style="color: red">
        *存放位置为在待检库中的存放位置W代表仓库编号，
        R代表库区编号，S代表货架编号，L代表层编号
      </p>
      <p>存放位置：{{ locations }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="locationDialog = false" type="info">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  data() {
    return {
      pramTime: "",
      enterList: [],
      loading: false,
      enterDialog: false,
      queryInfo: {
        name: "",
        state: 2,
      },
      enter: {
        tNote: "",
        tid: "",
        orderNum: "",
        name: "",
        type: "",
        count: "",
        countQ: 0,
        countD: 0,
        pid: [],
        area1: "",
        area2: 0,
        lid: "",
        operator: this.$store.state.user.name,
      },
      enterRules: {
        universal: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      options: [
        {
          value: 1,
          label: "生产入库",
        },
        {
          value: 2,
          label: "退货入库",
          disabled: true,
        },
        {
          value: 3,
          label: "客户存储",
          disabled: true,
        },
      ],
      warehouseId: [],
      position: [],
      query: {
        id: "",
      },
      locationDialog: false,
      locations: [],
      substationList: [],
    };
  },
  methods: {
    //获取货物列表
    async getEnterList() {
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
        this.enterList = res.obj;
      }
      this.loading = false;
    },
    openEnter() {
      this.enterDialog = true;
      this.getWarehouseId();
    },
    enterClose() {
      this.enter = {
        tNote: "",
        tid: "",
        orderNum: "",
        name: "",
        type: "",
        count: "",
        countQ: 0,
        countD: 0,
        pid: [],
        area1: "",
        area2: "",
        lid: "",
      };
      this.query.id = "";
      this.warehouseId = "";
    },

    enterYes() {
      const pid = this.enter.pid;
      const lid = [];
      for (let i = 0; i < pid.length; i++) {
        lid[i] = pid[i][pid[i].length - 1];
      }
      this.enter.lid = lid.join(",");
      console.log(this.enter.substaionId)
      this.enter.substationId = this.enter.substaionId[this.enter.substaionId.length - 1]
      console.log(this.enter.substationId)
      this.$refs.enterRef.validate(async (valid) => {
          if (!valid){
            return
          }
          const res = await this.$http.post("/warehouse/enter", this.enter);
          if (res) {
            this.getEnterList();
            this.enterDialog = false;
          } else return;
        });
    },
    //远程查询数据
    async querySearchAsync(queryString, cb) {
      this.queryInfo.name = queryString;
      const res = await this.$http.get("/warehouse/transitions/", {
        params: this.queryInfo,
      });
      for (let i of res.obj) {
        i.value = i.name + "(数量:" + i.complete + "单号" + i.orderNum + ")";
      }
      cb(res.obj);
    },
    handleSelect(item) {
      this.enter.tid = item.id;
      if (item.orderNum === "") {
        this.enter.orderNum = "自主生产";
      } else {
        this.enter.orderNum = item.orderNum;
      }
      this.enter.name = item.name;
      this.enter.count = item.complete;
    },
    countQd() {
      this.enter.countD = this.enter.count - this.enter.countQ;
    },
    async getWarehouseId() {
      const res = await this.$http.get("/warehouse/getWarehouseId");
      if (res) {
        this.warehouseId = res.obj;
      }
    },
    async getPosition() {
      console.log(this.query.id);
      const res = await this.$http.get("/warehouse/position/", {
        params: this.query,
      });
      this.position = res.obj;
      console.log(res);
    },
    async location(item) {
      console.log(item.id);
      this.locationDialog = true;
      const res = await this.$http.get("/goods/goodsPosition/" + item.id);
      if (res) {
        this.locations = res.obj;
      }
    },
    getParentSubstation() {
      this.$http.get("/substation/listAll").then((res) => {
        this.substationList = res.obj;
      });
    },
  },
  created() {
    this.getEnterList();
    this.getParentSubstation();
  },
};
</script>

<style lang="less" scoped>
</style>
