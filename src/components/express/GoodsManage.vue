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
        <el-table-column label="商品编号" prop="code"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="商品成本价" prop="price"> </el-table-column>
        <el-table-column label="商品数量" prop="count"> </el-table-column>
        <el-table-column label="订单时间" prop="date"> </el-table-column>
        <el-table-column label="供应商" prop="supplierName"> </el-table-column>
        <el-table-column label="可否退货" prop="enabledReturn">
          <template slot-scope="scope">
            {{ scope.row.enabledReturn?'是':'否' }}
          </template>
        </el-table-column>
        <el-table-column label="是否入库" prop="goodsId">
          <template slot-scope="scope">
            {{ scope.row.goodsId == null?'未入库':'已入库' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="供应商货品入库"
              placement="top"
              :enterable="false"
              v-if="scope.row.goodsId == null"
            >
              <el-button
                type="primary"
                icon="el-icon-s-home"
                size="mini"
                @click="selectStation(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="查看入库信息"
              placement="top"
              :enterable="false"
              v-if="scope.row.goodsId != null"
            >
              <el-button
                type="primary"
                icon="el-icon-goods"
                size="mini"
                @click="viewGoodsInfo(scope.row)"
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
          <el-input v-model="dataModel.goodsName"> </el-input>
        </el-form-item>
        <el-form-item label="商品一级分类">
          <el-select
            v-model="dataModel.firstCategory"
            placeholder="请选择一级类目"
            @change="querySecondCategory"
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
        <el-form-item label="商品二级分类" v-if="dataModel.firstCategory != null">
          <el-select
            v-model="dataModel.secondCategory"
            placeholder="请选择二级类目"
          >
            <el-option
              v-for="item in secondCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="dataModel.count"> </el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input v-model="dataModel.measurement"> </el-input>
        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model="dataModel.originPrice"> </el-input>
        </el-form-item>
        <el-form-item label="商品折扣">
          <el-input v-model="dataModel.discount"> </el-input>
        </el-form-item>
        <el-form-item label="成本价">
          <el-input v-model="dataModel.price"> </el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="dataModel.model"> </el-input>
        </el-form-item>
        <el-form-item label="供应商">
          <el-select
            v-model="categoryModel.parentId"
            placeholder="请选择一级类目"
          >
            <el-option
              v-for="item in suppliers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商">
          <el-input v-model="dataModel.factoryName"> </el-input>
        </el-form-item>
        <el-form-item label="保质期限">
          <el-input v-model="dataModel.shelfLife"> </el-input>
        </el-form-item>
        <el-form-item label="可否退货">
          <el-checkbox v-model="dataModel.enabledReturn">可否退货</el-checkbox>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dataModel.content"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newGoodDialog = false">取 消</el-button>
        <el-button @click="goodsEnter">商品录入</el-button>
      </span>
    </el-dialog>

    <el-dialog title="商品入库" :visible.sync="goodsEnterWarehouseDialog" width="45%">
      <el-form :model="goodsModel" label-width="200px">
        <el-form-item label="请选择存储仓库">
          <el-cascader
            v-model="goodsModel.substationId"
            :options="substationList"
            :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsEnterWarehouseDialog = false">取 消</el-button>
        <el-button @click="goodsEnterWarehouse">商品入库</el-button>
      </span>
    </el-dialog>

    <el-dialog title="入库信息" :visible.sync="goodsDetailvialog" width="45%">
      <el-form :model="goodsDataModel" label-width="200px">
        <el-form-item label="入库订单Id">
          <el-input v-model="goodsDataModel.goodsId" disabled> </el-input>
        </el-form-item>
        <el-form-item label="仓库信息">
          <el-input v-model="goodsDataModel.substaionName" disabled> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsDetailvialog = false">取 消</el-button>
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
      secondCategoryList: [],
      categoryModel: {},
      goodsEnterWarehouseDialog: false,
      substationList: [],
      goodsModel: {},
      goodsDetailvialog: false,
      goodsDataModel: {},
      suppliers: []
    };
  },
  methods: {
    queryCategory() {
      this.$http.get("/goodCategory/search?parentId=0").then((res) => {
        this.firstCategoryList = res.obj;
      });
    },
    querySecondCategory() {
      this.$http.get("/goodCategory/search?parentId=" + this.dataModel.firstCategory).then((res) => {
        this.secondCategoryList = res.obj;
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
    },
    goodsEnter() {
      this.$http.post('/goods/enter', this.dataModel).then(res => {
        this.newGoodDialog = false;
        this.searchList()
      })
    },
    searchList() {
      this.$http.get('/goods/searchSupplierList').then(res => {
        this.orderList = res.obj
      })
    },
    selectStation(row) {
      this.goodsEnterWarehouseDialog = true
      this.goodsModel = row
    },
    getParentSubstation() {
      this.$http.get("/substation/listAll").then((res) => {
        this.substationList = res.obj;
      });
    },
    goodsEnterWarehouse() {
      this.goodsModel.substationId = this.goodsModel.substationId[this.goodsModel.substationId.length - 1]
      this.$http.post('/goods/goodsToWarehouse', this.goodsModel).then(res => {
        this.goodsEnterWarehouseDialog = false
        this.searchList()
      })
    },
    viewGoodsInfo(row) {
      this.goodsDataModel = row
      this.$http.get('/substation/getFullSubstation?goodsId=' + row.goodsId).then(res => {
        this.goodsDataModel.substaionName = res.obj
        this.goodsDetailvialog = true
      })
    },
    getAllSupplier() {
      this.$http.get('/supplier/search').then(res => {
        this.suppliers = res.obj
      })
    }
  },
  created() {
    this.queryCategory();
    this.searchList();
    this.getParentSubstation();
    this.getAllSupplier();
  },
};
</script>

<style lang="less" scoped></style>
