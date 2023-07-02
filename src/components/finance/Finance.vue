<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务报表</el-breadcrumb-item>
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
        <el-col :span="3">
          <el-select v-model="role" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getFinanceList">搜索</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="dataList" border height="490" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="财务操作"
          prop="action"
          width="170"
        ></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pramTime: "",
      options: [
        {
          label: "客户",
          value: 1,
        },
        {
          label: "供应商",
          value: 3,
        },
      ],
      dataList: [],
      role: ''
    };
  },
  methods: {
    //获取货物列表
    async getFinanceList() {
      this.loading = true;
      var url = "/finance/search?role=" + role;
      if(len(this.pramTime) > 0){
        
      }
      const res = await this.$http.get(url);
      if (res) {
        this.enterList = res.obj;
      }
      this.loading = false;
    },
  },
  created() {
    this.getEnterList();
  },
};
</script>

<style lang="less" scoped>
</style>
