<template>
    <div class="welcome">
        <el-row :gutter="10">
            <el-col :span="11" class="col2">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="系统介绍" name="first" style="align-content: center">
                        <el-collapse accordion>

                            <el-collapse-item>
                                <template slot="title">
                                    调度中心<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 调度中心的重要功能就是实现了对订单的调度功能。<br>
                                    <!-- <span style="color: red">本系统中订单管理模块提供了订单的添加、修改、删除功能。</span></div> -->
                                </div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    库房管理<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 库房管理是针对商品库存的管理。<br>
                                    <!-- <span style="color: red">本系统中生产模块提供了生产线的增删查改操作，以及新建生产，工作进度，生产日志等功能。</span></div> -->
                                </div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    财务管理<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 财务管理涵盖了收入，支出，发票等一些必要的信息 <br>
                                    <!-- <span style="color: red"></span></div> -->
                                </div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    客户服务中心<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 客户服务中心是针对于订单的全程管理以及一些详情管理。<br>
                                    <!-- <span style="color: red">本系统中客户管理模块提供了客户的添加、修改、查看订单、拉黑功能。</span></div> -->
                                </div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    分站管理<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 分站管理是针对于投递分站的管理，可以增加或者删除。<br>
                                    <!-- <span style="color: red">本系统中客户管理模块提供了客户的添加、修改、查看订单、拉黑功能。</span></div> -->
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!-- 第二列布局 -->
        <!-- <el-row :gutter="10">
            <el-col :span="11" class="col1">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="仓库状态" name="first" style="align-content: center">
                        <div id="main" style="width: 560px;height:270px;"></div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="11" class="col2">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="生产线" name="first" style="align-content: center">
                        <el-row>
                            <el-col :span="9">
                                <div id="main1" style="width: 180px;height:200px;"></div>
                            </el-col>
                            <el-col :span="13" style="margin-top: 20px;color:#0C61B8">
                                <span>生产线名称：{{outList.name}}</span><br>
                                <span>货物订单号：{{outList.orderNum}}</span><br>
                                <span>生产中货物：{{outList.orderName}}</span><br>
                                <span>计划生产数量：{{outList.total}}</span><br>
                                <span>已完成进度：{{outList.percentage}}%</span>
                            </el-col>
                        </el-row>


                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
    import echarts from "echarts";
    import dark from '@/assets/ech/dark.js'
    import 'echarts-liquidfill'

    export default {
        data() {
            return {
                activeName: 'first',
                outName: 'first',
                infoDialog: false,
                outList: {},
                warehouse: []
            }
        },
        methods: {},
        created() {

        },
        async mounted() {
            //天气插件  我也不知怎么捣鼓
            window.WIDGET = {ID: '7athXOL7XL'};
            (function (d) {
                var cs = d.createElement('link');
                cs.rel = 'stylesheet';
                cs.href = 'https://apip.weatherdt.com/view/static/js/r.js?v=1111';
                var s = d.createElement('script')
                s.src = 'https://apip.weatherdt.com/view/static/js/r.js?v=1111';
                var sn = d.getElementsByTagName('script')[0];
                sn.parentNode.insertBefore(cs, sn);
                sn.parentNode.insertBefore(s, sn);
            })(document);
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            var myChart1 = echarts.init(document.getElementById('main1'));
            // 指定图表的配置项和数据
            var option = {

                tooltip: {},
                legend: {
                    data: ['已使用', '容量']
                },
                xAxis: {
                    data: ["仓库", "仓库", "仓库", "仓库"]
                },
                yAxis: {},
                series: [
                    {
                        name: '已使用',
                        type: 'bar',
                        data: [5, 20, 36, 10]
                    },
                    {
                        name: '容量',
                        type: 'bar',
                        data: [5, 20, 36, 10]
                    },
                ]
            };
            const res = await this.$http.get('/warehouse/myWarehouse');
            if (res) {
                this.warehouse = res.obj;
                for (let i = 0; i < this.warehouse.length; i++) {
                    option.xAxis.data[i] = this.warehouse[i].num + this.warehouse[i].name;
                    option.series[0].data[i] = this.warehouse[i].used;
                    option.series[1].data[i] = this.warehouse[i].capacity;
                }
            } else {
                option = option;
            }
            //生产
            const resp = await this.$http.get('/output/findOutputs');
            if (resp) {
                this.outList = resp.obj[0];
                var value = this.outList.percentage / 100;
                var data = [value, value, value, value, value,];
            } else {
                value = 0.28;
                data = [value, value, value, value, value,];
            }

            var option1 = {
                backgroundColor: '#fff',
                graphic: [{
                    type: 'group',
                    left: 'center',
                    bottom: 10,
                },
                ],
                series: [{
                    type: 'liquidFill',
                    radius: '70%',
                    center: ['50%', '40%'],
                    data: data,
                    backgroundStyle: {
                        borderWidth: 5,
                        borderColor: '#1daaeb',
                        color: '#fff'
                    },
                    label: {
                        normal: {
                            formatter: (value * 100).toFixed(2) + '%',
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    }
                },
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            myChart1.setOption(option1);
        }

    }
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
        height: 300px;
    }

    .col1 {
        background-color: #FFFFFF;
        padding-left: 40px;
    }

    .col2 {
        padding-left: 10px;
        background-color: #FFFFFF;
    }
</style>
