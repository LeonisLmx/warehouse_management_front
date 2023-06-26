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
       <el-col :span="8">
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
        <!-- <el-table-column
        label="分站订单数量"
        prop="orderCount"
      ></el-table-column> -->
      </el-table>

       <el-dialog title="新建站点" :visible.sync="substationDialog" width="45%">
        <el-form :model="dataModel" label-width="100px" :inline="true">
          <el-form-item label="站点名称">
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
export default {
  data() {
    return {
      substationList: [],
      substationDialog: false,
      dataModel: {}
    };
  },
  methods: {
    getSubstations() {
      this.$http.get("/substation/list").then((res) => {
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
        this.getSubstations()
      })
    }
  },
  created() {
    this.getSubstations();
  },
};
</script>

<style scoped>
</style>
