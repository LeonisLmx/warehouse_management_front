<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商结算</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--        查询框-->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select
              v-model="supplierId"
              placeholder="请选择供应商"
              @change="getData"
              clearable
            >
              <el-option
                v-for="item in suppliers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
        </el-col>
      </el-row>
      <el-table :data="dataList" border height="490" stripe>
        <el-table-column label="编号" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品单价" prop="price"></el-table-column>
        <el-table-column label="供货数量" prop="supplyCount"></el-table-column>
        <el-table-column label="退回数量" prop="backCount"></el-table-column>
        <el-table-column
          label="结算数量"
          prop="settlementCount"
        ></el-table-column>
        <el-table-column
          label="结算金额"
          prop="settlementPrice"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      suppliers: [],
      supplierId: "",
      dataList: []
    };
  },
  methods: {
    getSuppliers() {
      this.$http.get("/supplier/search").then((res) => {
        this.suppliers = res.obj;
      });
    },
    getData() {
      this.$http
        .get("/order/integrateDataBySupplierId?supplierId=" + this.supplierId)
        .then((res) => {
          this.dataList = res.obj;
          console.log(res)
        });
    },
  },
  created() {
    this.getSuppliers();
  },
};
</script>
  
  <style lang="less" scoped>
</style>
  