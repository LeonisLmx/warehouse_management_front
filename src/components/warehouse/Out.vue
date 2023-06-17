<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>出库管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--        查询框-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入货物内容"
                              clearable
                    >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table v-loading="loading"
                      :data="outList"
                      border
                      height="490"
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="货号" prop="num" width="170px"></el-table-column>
                <el-table-column label="订单号" prop="orderNum" width="170px"></el-table-column>
                <el-table-column label="货物名称" prop="name"></el-table-column>
                <el-table-column label="存储数量" prop="count"></el-table-column>
                <el-table-column label="客户名" prop="client.name"></el-table-column>
                <el-table-column label="联系方式" prop="client.phone"></el-table-column>
                <el-table-column label="入库时间" prop="date" width="150px"></el-table-column>
                <el-table-column label="操作员" prop="operator"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="scope.row.expNo===null?'发货':'物流信息'" placement="top"
                                    :enterable="false">
                            <el-button :type="scope.row.expNo===null?'warning':'success'"
                                       :icon="scope.row.expNo===null?'el-icon-box':'el-icon-truck'" size="mini"
                                       @click="openShip(scope.row)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--创建快递-->
        <el-dialog
                title="出库"
                :visible.sync="shipDialog"
                width="30%"
        >
            <el-form
                    :model="ship"
                    ref="shipRef"
                    label-width="90px"
            >
                <p style="color: red">*请认真填写订单号</p>
                <el-form-item label="快递公司">
                    <el-select v-model="ship.expCode" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model="ship.expNo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shipDialog = false" type="info">关 闭</el-button>
                <el-button type="primary" @click="shipYes">确 定</el-button>
            </span>
        </el-dialog>
        <!--物流信息-->
        <el-dialog
                title="物流信息"
                :visible.sync="logisticsDialog"
                width="40%"
        >
            <el-timeline :reverse="reverse">
                <el-timeline-item
                        v-for="(kd, index) in kd.Traces"
                        :key="index"
                        :timestamp="kd.AcceptTime">
                    {{kd.AcceptStation}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                outList: [],
                loading: false,
                shipDialog: false,
                ship: {
                    id: '',
                    expCode: '',
                    expNo: '',

                },
                options: [{
                    value: 'ZTO',
                    label: '中通'
                }, {
                    value: 'STO',
                    label: '申通'
                }, {
                    value: 'YTO',
                    label: '圆通'
                }],
                logisticsDialog: false,
                reverse: true,
                kd: {}
            }
        },
        methods: {
            //获取货物列表
            async getOutList() {
                this.loading = true;
                const res = await this.$http.get('/goods/enterList');
                for (let i = 0; i < res.obj.length; i++) {
                    if (res.obj[i].orderNum === '') {
                        res.obj[i].orderNum = '自主生产';
                    }
                }
                if (res) {
                    this.outList = res.obj;
                }
                this.loading = false;
            },
            async openShip(item) {
                if (item.expNo === null) {
                    this.shipDialog = true;
                    this.ship.id = item.id;
                } else {
                    this.logisticsDialog = true;
                    const res = await this.$http.post('/goods/ship', {
                        expCode: item.expCode,
                        expNo: item.expNo,
                    });
                    this.kd = JSON.parse(res.obj);
                }

            },
            async shipYes() {
                const res = await this.$http.put('/goods/out', this.ship);
                if (res) {
                    this.shipDialog = false;
                    this.getOutList();
                }
            }
        },
        created() {
            this.getOutList();
        }
    }
</script>

<style scoped>

</style>
