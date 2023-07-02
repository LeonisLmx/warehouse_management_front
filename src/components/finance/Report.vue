<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
            <el-breadcrumb-item>我的报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    //导入
    import echarts from 'echarts'

    export default {
        data() {
            return {
                loading: false,
                warehouse: [],

            }
        },
        methods: {},
        created() {

        },
        async mounted() {

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '仓库使用量'
                },
                tooltip: {},
                legend: {
                    data: ['已使用','容量']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子"]
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
                console.log(res.obj)
            }
            for (let i = 0; i < this.warehouse.length; i++) {
                option.xAxis.data[i] = this.warehouse[i].num+this.warehouse[i].name;
                option.series[0].data[i] = this.warehouse[i].used;
                option.series[1].data[i] = this.warehouse[i].capacity;

            }

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);

        }
    }
</script>

<style lang="less" scoped>

</style>
