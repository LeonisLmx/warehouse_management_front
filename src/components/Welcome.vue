<template>
    <div class="welcome">
        <el-row :gutter="10">
            <el-col :span="11" class="col1">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="天气预报" name="first" style="align-content: center">
                                                <div id="weather-view-he"></div>
<!--                        <div style="margin-left: 20px">-->
<!--                            <h4>您好: {{$store.state.user.name}}</h4>-->
<!--                            <p>您拥有{{$store.state.user.roleName}}权限</p>-->
<!--                        </div>-->

                    </el-tab-pane>
                </el-tabs>


            </el-col>
            <el-col :span="11" class="col2">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="系统介绍" name="first" style="align-content: center">
                        <el-collapse accordion>

                            <el-collapse-item>
                                <template slot="title">
                                    订单模块<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 订单模块的重要功能就是实现了对所创建订单的全程监控，使订单信息更直观的展示给企业管理者。<br>
                                    <span style="color: red">本系统中订单管理模块提供了订单的添加、修改、删除功能。</span></div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    生产模块<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 生产线是企业的重要组成部分，生产产品基于订单和自主生产。生产监控提高了企业的工作效率。<br>
                                    <span style="color: red">本系统中生产模块提供了生产线的增删查改操作，以及新建生产，工作进度，生产日志等功能。</span></div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    仓库模块<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 仓库模块是本系统最重要的模块，用于将产品暂存、入库、盘点、出库以及订单的追踪。 <br>
                                    <span style="color: red">本系统中仓库又分为待检库、普通仓库、废品库，仓库中包含库区库
                                区中包含货架，真正的实现了监控每个货物以及仓库的使用量，为管理者提供了仓库的增删改查功能，
                                矫正容量功能，禁用仓库功能，入库，盘点，出库等功能，并通过快递鸟第三方接口实现了物流订单的跟踪。</span></div>
                            </el-collapse-item>
                            <el-collapse-item>
                                <template slot="title">
                                    客户模块<i class="header-icon el-icon-info"></i>
                                </template>
                                <div> 客户是针对某一特定细分市场而言的，他们的需求较集中，企业的经济效益大部分是客户带来的。<br>
                                    <span style="color: red">本系统中客户管理模块提供了客户的添加、修改、查看订单、拉黑功能。</span></div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!-- 第二列布局 -->
        <el-row :gutter="10">
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
        </el-row>
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
