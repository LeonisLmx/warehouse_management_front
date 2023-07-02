<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>配送中心管理</el-breadcrumb-item>
        <el-breadcrumb-item>分站配送分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">   
        </el-row>
        <!--            表格区域-->
        <el-table :data="dataList" border stripe>
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="counts" label="订购单数"></el-table-column>
          <el-table-column prop="name" label="客服名称"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dataList: []
      };
    },
    methods: {
      getList() {
        this.$http.get('/goods/staticsSupplierOrders').then(res => {
            this.dataList = res.obj
        })
      }
    },
    created() {
      this.getList()
    },
  };
  </script>
  
  <style lang="less" scoped></style>
  