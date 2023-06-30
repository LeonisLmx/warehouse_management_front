<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配送中心管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--            搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="primary" @click="addCategory">添加分类</el-button>
          <el-button type="primary" @click="addNewGood">商品录入</el-button>
        </el-col>
      </el-row>
      <!--            表格区域-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column label="" prop="orderNum"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品数量" prop="count"> </el-table-column>
        <el-table-column label="订单状态" prop="orderState">
          <template slot-scope="scope">
            {{ parseOrderState(scope.row.orderState) }}
          </template>
        </el-table-column>
        <el-table-column label="订单类型" prop="orderType">
          <template slot-scope="scope">
            {{ parseOrderType(scope.row.orderType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单时间" prop="date"> </el-table-column>
        <el-table-column label="快递员" prop="expressName"> </el-table-column>
        <el-table-column label="最后更新时间" prop="updateTime">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="配送单打印"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="viewOrderInfo(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="newCategoryDialog" width="45%">
      <el-form :model="categoryModel" label-width="150px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryModel.name"> </el-input>
        </el-form-item>
        <el-form-item label="请选择类目等级">
          <el-select v-model="categoryModel.level" placeholder="请选择类目等级">
            <el-option label="一级类目" value="1"></el-option>
            <el-option label="二级类目" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择所属分类" v-if="categoryModel.level == 2">
          <el-select
            v-model="categoryModel.parentId"
            placeholder="请选择一级类目"
          >
            <el-option
              v-for="item in firstCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newCategoryDialog = false">取 消</el-button>
        <el-button @click="submitNewCategory">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增商品信息" :visible.sync="newGoodDialog" width="45%">
      <el-form :model="dataModel" label-width="100px">
        <el-form-item label="商品代码">
          <el-input v-model="dataModel.code"> </el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="dataModel.name"> </el-input>
        </el-form-item>
        <el-form-item label="商品一级分类">
          <el-input v-model="dataModel.firstCategory"> </el-input>
        </el-form-item>
        <el-form-item label="商品二级分类">
          <el-input v-model="dataModel.orderState"> </el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input v-model="dataModel.date"> </el-input>
        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model="dataModel.operateName"> </el-input>
        </el-form-item>
        <el-form-item label="商品折扣">
          <el-input v-model="dataModel.name"> </el-input>
        </el-form-item>
        <el-form-item label="成本价">
          <el-input v-model="dataModel.count"> </el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="dataModel.price"> </el-input>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="dataModel.clientName"> </el-input>
        </el-form-item>
        <el-form-item label="厂商">
          <el-input v-model="dataModel.address"> </el-input>
        </el-form-item>
        <el-form-item label="保质期限">
          <el-input v-model="dataModel.phone"> </el-input>
        </el-form-item>
        <el-form-item label="可否退货">
          <el-input v-model="dataModel.postcode"> </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dataModel.substation"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newGoodDialog = false">取 消</el-button>
        <el-button v-print="'#print'">打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        size: 7,
        orderState: "7,8",
      },
      clientOptions: [],
      total: 0,
      orderList: [],
      orderTypeOption: this.GLOBAL.orderStateOption,
      dataModel: {},
      newCategoryDialog: false,
      newGoodDialog: false,
      firstCategoryList: [],
      categoryModel: {},
    };
  },
  methods: {
    queryCategory() {
      this.$http.get("/goodCategory/search?parentId=0").then((res) => {
        this.firstCategoryList = res.obj;
      });
    },
    addCategory() {
      this.categoryModel = {}
      this.newCategoryDialog = true;
    },
    addNewGood() {
      this.newGoodDialog = true;
    },
    submitNewCategory() {
      this.$http.post('/goodCategory/add',this.categoryModel).then(res => {
        this.newCategoryDialog = false
        this.queryCategory();
      })
    }
  },
  created() {
    this.queryCategory();
  },
};
</script>

<style lang="less" scoped></style>
