<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>发票管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--        查询框-->
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select
            v-model="status"
            placeholder="请选择发票状态"
            @change="getData"
            clearable
          >
            <el-option
              v-for="item in invoiceStatus"
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
        <el-table-column label="开票人" prop="name"></el-table-column>
        <el-table-column label="开票价格" prop="price"></el-table-column>
        <el-table-column label="发票描述" prop="description"></el-table-column>
        <el-table-column label="开票时间" prop="applyTime"></el-table-column>
        <el-table-column label="发票状态" prop="status">
            <template slot-scope="scope">
                {{ parseInvocieState(scope.row.status) }}
            </template>
        </el-table-column>
        <el-table-column label="最后修改时间" prop="date"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="发票作废"
              placement="top"
              :enterable="false"
              v-if="scope.row.status == 1"
            >
              <el-button
                type="danger"
                icon="el-icon-s-home"
                size="mini"
                @click="missInvoice(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="发票退回"
              placement="top"
              :enterable="false"
              v-if="scope.row.status == 1"
            >
              <el-button
                type="warning"
                icon="el-icon-goods"
                size="mini"
                @click="backInvoice(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="开票完成"
              placement="top"
              :enterable="false"
              v-if="scope.row.status == 1"
            >
              <el-button
                type="primary"
                icon="el-icon-s-goods"
                size="mini"
                @click="finishInvoice(scope.row)"
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
  import {Message, MessageBox} from 'element-ui'
export default {
  data() {
    return {
      invoiceStatus: [
        {
          id: -1,
          name: "发票作废",
        },
        {
          id: 0,
          name: "发票退回",
        },
        {
          id: 1,
          name: "发票申请",
        },
        {
          id: 2,
          name: "开票完成",
        },
      ],
      status: "",
      dataList: [],
    };
  },
  methods: {
    getData() {
      this.$http
        .get("/invoice/list?status=" + this.status)
        .then((res) => {
          this.dataList = res.obj;
        });
    },
    missInvoice(row) {
        MessageBox.confirm('是否确定作废此发票?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.$http.post('/invoice/update', {"id":row.id,"status":-1}).then(res => {
                      this.getData()
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消作废发票'
                    });
                    return;
                });
    },
    backInvoice(row) {
        MessageBox.confirm('是否确定退回此发票?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.$http.post('/invoice/update', {"id":row.id,"status":0}).then(res => {
                      this.getData()
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消退回发票'
                    });
                    return;
                });
    },
    finishInvoice(row) {
         MessageBox.confirm('是否确定开票?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.$http.post('/invoice/update', {"id":row.id,"status":2}).then(res => {
                      this.getData()
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消开票'
                    });
                    return;
                });
    },
    parseInvocieState(status) {
        return this.invoiceStatus.find(res => res.id == status).name
    }
  },
  created() {
    this.getData();
  },
};
</script>
  
  <style lang="less" scoped>
</style>
  