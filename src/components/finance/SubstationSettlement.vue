<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>分站结算</el-breadcrumb-item>
      </el-breadcrumb>
  
      <el-card>
        <!--        查询框-->
        <el-row :gutter="20">
          
        </el-row>
        <el-table v-loading="loading" :data="dataList" border height="490" stripe>
          
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        
      };
    },
    methods: {
      
    },
    created() {
     
    },
  };
  </script>
  
  <style lang="less" scoped>
  </style>
  