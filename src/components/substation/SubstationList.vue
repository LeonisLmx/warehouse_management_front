<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分站管理</el-breadcrumb-item>
      <el-breadcrumb-item>分布情况</el-breadcrumb-item>
    </el-breadcrumb>
    <!--客户列表区域  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select
            v-model="parentId"
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
        </el-col>
       <el-col :span="8">
          <el-button type="primary" @click="searchData">搜索</el-button>
          <el-button type="primary" @click="addNewSubstation">新建站点</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="substationList"
        border
        height="490"
        stripe
      >
        <el-table-column label="编号" type="index"></el-table-column>
        <el-table-column label="分站站点名称" prop="name" style="text-align:center"></el-table-column>
        <el-table-column label="当前关联订单数量" prop="count" style="text-align:center"></el-table-column>
        <!-- <el-table-column
        label="分站订单数量"
        prop="orderCount"
      ></el-table-column> -->
      </el-table>

       <el-dialog title="新建站点" :visible.sync="substationDialog" width="45%">
        <el-form :model="dataModel" label-width="200px">
          <el-form-item label="请选择中心库房">
            <el-select
            v-model="dataModel.parentId"
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
          </el-form-item>
          <el-form-item label="站点名称" v-if="dataModel.parentId != null">
            <el-input v-model="dataModel.name"> </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="substationDialog = false">取 消</el-button>
          <el-button @click="submitNewSubstation">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {Message, MessageBox} from 'element-ui'

export default {
  data() {
    return {
      parentSubstationList: [],
      substationList: [],
      substationDialog: false,
      dataModel: {},
      parentId: ''
    };
  },
  methods: {
    getParentSubstation() {
      this.$http.get("/substation/listCount").then((res) => {
        this.parentSubstationList = res.obj;
      });
    },
    searchData() {
      if (this.parentId == ''){
        Message.error("请您先选择中心库房");
        return
      }
      this.$http.get("/substation/list?parentId=" + this.parentId).then((res) => {
        this.substationList = res.obj;
      });
    },
    addNewSubstation() {
        this.substationDialog = true
        this.dataModel = {}
    },
    submitNewSubstation() {
      this.$http.post('/substation/add',this.dataModel).then(res => {
        this.substationDialog = false
        this.searchData()
      })
    }
  },
  created() {
    this.getParentSubstation()
  },
};
</script>

<style scoped>
</style>
