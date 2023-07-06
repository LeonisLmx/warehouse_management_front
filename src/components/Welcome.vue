<template>
  <div class="welcome">
    <el-row :gutter="24">
      <el-col :span="12" class="col2">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="系统介绍"
            name="first"
            style="align-content: center"
          >
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  调度中心<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  调度中心的重要功能就是实现了对订单的调度功能。<br />
                  <!-- <span style="color: red">本系统中订单管理模块提供了订单的添加、修改、删除功能。</span></div> -->
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  库房管理<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  库房管理是针对商品库存的管理。<br />
                  <!-- <span style="color: red">本系统中生产模块提供了生产线的增删查改操作，以及新建生产，工作进度，生产日志等功能。</span></div> -->
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  财务管理<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  财务管理涵盖了收入，支出，发票等一些必要的信息 <br />
                  <!-- <span style="color: red"></span></div> -->
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  客户服务中心<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  客户服务中心是针对于订单的全程管理以及一些详情管理。<br />
                  <!-- <span style="color: red">本系统中客户管理模块提供了客户的添加、修改、查看订单、拉黑功能。</span></div> -->
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  分站管理<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  分站管理是针对于投递分站的管理，可以增加或者删除。<br />
                  <!-- <span style="color: red">本系统中客户管理模块提供了客户的添加、修改、查看订单、拉黑功能。</span></div> -->
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  配送中心管理<i class="header-icon el-icon-info"></i>
                </template>
                <div>
                  配送中心管理是对商品、各分站以及供应商的货物进行管理<br />
                  <!-- <span style="color: red">本系统中客户管理模块提供了客户的添加、修改、查看订单、拉黑功能。</span></div> -->
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 第二列布局 -->
    <div>
      <div class="echarts-style">
        <span>订单状态饼图</span>
        <div
          id="orderStateChart"
          :style="{ float: 'left', width: '100%', height: '400px' }"
        ></div>
      </div>
      <div class="echarts-style">
        <span>订单类型柱状图</span>
        <div
          id="orderTypeChart"
          :style="{ float: 'left', width: '100%', height: '400px' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-liquidfill";
import AppVue from "../App.vue";

export default {
  data() {
    return {
      activeName: "first",
      outName: "first",
      infoDialog: false,
      outList: {},
      warehouse: [],
      stateOption: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "订单状态分布图",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      typeOption: {
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      },
    };
  },
  watch: {
    stateOption: {
      deep: true,
      handler(newValue) {
        this.initStateEcharts();
      },
    },
    typeOption: {
      deep: true,
      handler(newValue) {
        this.initTypeEcharts();
      },
    },
  },
  methods: {
    initStateEcharts() {
      const myChart = echarts.init(document.getElementById("orderStateChart"));
      myChart.setOption(this.stateOption); // 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    initTypeEcharts() {
      console.log("------data");
      const myChart = echarts.init(document.getElementById("orderTypeChart"));
      myChart.setOption(this.typeOption); // 渲染页面
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    getStateData() {
      this.$http.get("/order/queryStateData").then((res) => {
        console.log(res.obj);
        for (var i = 0; i < res.obj.length; i++) {
          var element = res.obj[i];
          this.stateOption["series"][0]["data"].push({
            value: element.count,
            name: this.parseOrderState(element.orderState),
          });
        }
      });
    },
    getTypeData() {
      this.$http.get("/order/queryTypeData").then((res) => {
        for (var i = 0; i < res.obj.length; i++) {
          var element = res.obj[i];
          this.typeOption["xAxis"]["data"].push(
            this.parseOrderState(element.orderType)
          );
          this.typeOption["series"][0]["data"].push(element.count);
        }
      });
    },
    parseOrderState(state) {
      return this.GLOBAL.parseOrderState(state);
    },
    parseOrderType(type) {
      return this.GLOBAL.parseOrderType(type);
    },
  },
  created() {
    this.getStateData();
    this.getTypeData();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}

.el-progress {
  margin-left: 10px;
  margin-top: 10px;
}

.el-col {
  margin-left: 20px;
  padding-left: 20px;
  border-radius: 10px;
  height: 350px;
}

.col1 {
  background-color: #ffffff;
  padding-left: 40px;
  height: 400px;
}

.col2 {
  padding-left: 10px;
  background-color: #ffffff;
}

.echarts-style {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  font-size: 25px;
}
</style>
