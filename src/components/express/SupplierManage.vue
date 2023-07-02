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
          <el-table-column label="供应商名字" prop="name"></el-table-column>
          <el-table-column label="地址" prop="address"></el-table-column>
          <el-table-column label="联系人" prop="contactUser"></el-table-column>
          <el-table-column label="联系电话" prop="contactPhone"></el-table-column>
          <el-table-column label="开户行" prop="bankName"></el-table-column>
          <el-table-column label="传真" prop="fax"></el-table-column>
          <el-table-column label="邮编" prop="postcode"></el-table-column>
          <el-table-column label="法人" prop="legalPerson"></el-table-column>
          <el-table-column label="备注" prop="content"></el-table-column>
          <el-table-column label="记录最后修改时间" prop="date"></el-table-column>
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
                  icon="el-icon-edit-outline"
                  size="mini"
                  @click="edit(scope.row)"
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
                  @click="deleteRecord(scope.row)"
                >
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
     <el-dialog :title=dialogTitle :visible.sync="dataDialog" width="45%">
      <el-form :model="model" label-width="150px">
        <el-form-item label="供应商名字">
          <el-input v-model="model.name"> </el-input>
        </el-form-item>
        <el-form-item label="供应商地址">
          <el-input v-model="model.address"> </el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="model.contactUser"> </el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="model.contactPhone"> </el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="model.bankName"> </el-input>
        </el-form-item>
        <el-form-item label="传真">
          <el-input v-model="model.fax"> </el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="model.postcode"> </el-input>
        </el-form-item>
        <el-form-item label="法人">
          <el-input v-model="model.legalPerson"> </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="model.content"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRecord" v-if="isAdd">新 增</el-button>
        <el-button @click="editRecord" v-if="!isAdd">修 改</el-button>
        <el-button @click="dataDialog = false">取 消</el-button>
      </span>
     </el-dialog>
    </div>
  </template>
  
  <script>
  import {Message, MessageBox} from 'element-ui'
  export default {
    data() {
      return {
        dataList: [],
        name: '',
        dataDialog: false,
        dialogTitle: '',
        model: {},
        isAdd: false
      };
    },
    methods: {
        searchList() {
            this.$http.get('/supplier/search?name=' + this.name).then(res => {
                this.dataList = res.obj
            })
        },
        addCategory() {
          this.dialogTitle = '新增供应商信息'
          this.model = {}
          this.dataDialog = true
          this.isAdd = true
        },
        edit(row){
          this.dialogTitle = '修改供应商信息'
          this.model = row
          this.dataDialog = true
          this.isAdd = false
        },
        deleteRecord(row) {
          MessageBox.confirm('是否确定删除供应商：' + row.name + ' 的信息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.$http.post('/supplier/delete?id=' + row.id).then(res => {
                      this.searchList()
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });
        },
        addRecord() {
          this.$http.post('/supplier/new', this.model).then(res => {
            this.dataDialog = false
            this.searchList()
          })
        },
        editRecord() {
          this.$http.post('/supplier/update', this.model).then(res => {
            this.dataDialog = false
            this.searchList()
          })
        }
    },
    created() {
      this.searchList()
    },
  };
  </script>
  
  <style lang="less" scoped></style>
  