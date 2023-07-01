<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>配送中心管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!--            搜索框区域-->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button type="primary" @click="addCategory">添加供应商</el-button>
          </el-col>
        </el-row>
        <!--            表格区域-->
        <el-table :data="dataList" border stripe>
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-colum></el-table-colum>
          <el-table-column fixed="right" label="操作" width="180px">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                content="修改信息"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-s-home"
                  size="mini"
                  @click="editDialog(scope.row)"
                >
                </el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="删除供应商"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-goods"
                  size="mini"
                  @click="deleteDialog(scope.row)"
                >
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
     
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dataList: [],
        name: ''
      };
    },
    methods: {
        searchList() {
            this.$http.get('/supplier/search?name=' + this.name).then(res => {
                this.dataList = res.obj
            })
        },
        editDialog(){

        },
        deleteDialog() {

        }
    },
    created() {
      
    },
  };
  </script>
  
  <style lang="less" scoped></style>
  