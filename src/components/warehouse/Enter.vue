<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item>入库管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--        查询框-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              clearable
                    >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="openEnter">新建存储</el-button>
                </el-col>
            </el-row>
            <el-table v-loading="loading"
                      :data="enterList"
                      border
                      height="490"
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="货号" prop="num" width="170"></el-table-column>
                <el-table-column label="订单号" prop="orderNum" width="170"></el-table-column>
                <el-table-column label="货物名称" prop="name"></el-table-column>
                <el-table-column label="存储数量" prop="count"></el-table-column>
                <el-table-column label="入库时间" prop="date"width="150"></el-table-column>
                <el-table-column label="是否出库" prop="ship">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.ship===1" type="success">已出库</el-tag>
                        <el-tag v-if="scope.row.ship===0" type="danger">未出库</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作员" prop="operator"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="存储位置" placement="top" :enterable="false">
                            <el-button type="success" :disabled="scope.row.ship===1" icon="el-icon-s-flag" size="mini"
                                       @click="location(scope.row)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--        入库登记-->
        <el-dialog
                title="入库登记"
                :visible.sync="enterDialog"
                width="45%"
                @close="enterClose">
            <el-form
                    :model="enter"
                    ref="enterRef"
                    :rules="enterRules"
                    label-width="90px"
                    :inline="true">
                <el-form-item label="入库类型">
                    <el-select v-model="enter.type"
                               placeholder="请选择您的入库方式">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="enter.type===1" label="选择产品">
                    <el-autocomplete
                            v-model="enter.tNote"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item v-if="enter.type===1" label="订单号">
                    <el-input v-model="enter.orderNum" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item  label="产品名称">
                    <el-input v-model="enter.name" :disabled="enter.type===''" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="enter.count" :disabled="enter.type===''" style="width: 220px"></el-input>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item v-if="enter.type===1" label="合格数量">
                    <el-input v-model="enter.countQ"
                              @change="countQd" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item v-if="enter.type===1" label="不合格数量">
                    <el-input v-model="enter.countD"
                              style="width: 220px"
                              disabled></el-input>
                </el-form-item>
                <el-form-item v-if="enter.type===1" label="废品面积">
                    <el-input v-model="enter.area2" placeholder="其输入废品大概占地面积"
                              style="width: 220px">
                    </el-input>
                </el-form-item>
                <el-form-item label="占用面积">
                    <el-input v-model="enter.area1" :disabled="enter.type===''" placeholder="货架水平占地面积为10平方米"
                              style="width: 220px">
                    </el-input>
                </el-form-item>
                <p v-if="enter.area1>0">提示:大约占用{{Math.ceil(enter.area1/10)}}层货架</p>

                <el-form-item label="选择仓库">
                    <el-select v-model="query.id"
                               @change="getPosition"
                               placeholder="请选择您的入库方式">
                        <el-option
                                v-for="item in warehouseId"
                                :key="item.id"
                                :label="item.num"
                                :value="item.id"
                                :disabled="enter.type===''">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--级联选择器-->
                <el-form-item label="存储位置">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-cascader
                                placeholder="请输入"
                                :options="position"
                                :props="{ multiple: true }"
                                filterable
                                v-model="enter.pid"
                                :disabled="enter.type===''"></el-cascader>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="enterDialog = false">取 消</el-button>
                <el-button type="primary" @click="enterYes">确 定</el-button>
            </span>
        </el-dialog>
        <!--        存放位置-->
        <el-dialog
                title="存放地址（仓库）"
                :visible.sync="locationDialog"
                width="30%"
        >
            <p style="color: red">*存放位置为在待检库中的存放位置W代表仓库编号，
                R代表库区编号，S代表货架编号，L代表层编号</p>
            <p>存放位置：{{locations}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="locationDialog = false" type="info">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Message} from "element-ui";

    export default {
        data() {
            return {
                enterList: [],
                loading: false,
                enterDialog: false,
                queryInfo: {
                    name: '',
                    state: 2
                },
                enter: {
                    tNote: '',
                    tid: '',
                    orderNum: '',
                    name: '',
                    type: '',
                    count: '',
                    countQ: 0,
                    countD: 0,
                    pid: [],
                    area1: '',
                    area2: 0,
                    lid: '',
                    operator: this.$store.state.user.name
                },
                enterRules: {
                    universal: [{required: true, message: '必填项', trigger: 'blur'}],
                },
                options: [
                    {
                        value: 1,
                        label: '生产入库',
                    },
                    {
                        value: 2,
                        label: '退货入库',
                        disabled: true
                    },
                    {
                        value: 3,
                        label: '客户存储',
                        disabled: true
                    },

                ],
                warehouseId: [],
                position: [],
                query: {
                    id: '',
                },
                locationDialog:false,
                locations:[]
            }
        },
        methods: {
            //获取货物列表
            async getEnterList() {
                this.loading = true;
                const res = await this.$http.get('/goods/enterList');
                for (let i=0;i<res.obj.length;i++){
                    if (res.obj[i].orderNum===''){
                        res.obj[i].orderNum='自主生产';
                    }
                }
                if (res) {
                    this.enterList = res.obj;
                }
                this.loading = false;
            },
            openEnter() {
                this.enterDialog = true;
                this.getWarehouseId();
            },
            enterClose() {
                this.enter = {
                    tNote: '',
                    tid: '',
                    orderNum: '',
                    name: '',
                    type: '',
                    count: '',
                    countQ: 0,
                    countD: 0,
                    pid: [],
                    area1: '',
                    area2: '',
                    lid: '',
                };
                this.query.id = '';
                this.warehouseId = '';
            },

            enterYes() {
                const pid = this.enter.pid;
                const lid = [];
                for (let i = 0; i < pid.length; i++) {
                    lid[i] = pid[i][pid[i].length - 1];
                }
                this.enter.lid = lid.join(',');
                console.log(this.enter);
                this.$refs.enterRef.validate(async valid => {
                    if (Math.ceil(this.enter.area1 / 10) < lid.length) {
                        Message.error("请您节约空间");
                        return;
                    } else if (Math.ceil(this.enter.area1 / 10) > lid.length) {
                        Message.error("我想这点地方不太够吧");
                        return;
                    } else if (!valid) {
                        return;
                    } else {
                        const res = await this.$http.post('/warehouse/enter', this.enter);
                        if (res) {
                            this.getEnterList();
                            this.enterDialog = false;
                        } else return;

                    }

                })

            },
            //远程查询数据
            async querySearchAsync(queryString, cb) {
                this.queryInfo.name = queryString;
                const res = await this.$http.get('/warehouse/transitions/', {params: this.queryInfo});
                for (let i of res.obj) {
                    i.value = i.name + '(数量:' + i.complete + '单号' + i.orderNum + ')';
                }
                cb(res.obj);
            },
            handleSelect(item) {
                this.enter.tid = item.id;
                if (item.orderNum === '') {
                    this.enter.orderNum = '自主生产';
                } else {
                    this.enter.orderNum = item.orderNum;
                }
                this.enter.name = item.name;
                this.enter.count = item.complete;
            },
            countQd() {
                this.enter.countD = this.enter.count - this.enter.countQ;
            },
            async getWarehouseId() {
                const res = await this.$http.get('/warehouse/getWarehouseId');
                if (res) {
                    this.warehouseId = res.obj;
                }
            },
            async getPosition() {
                console.log(this.query.id);
                const res = await this.$http.get('/warehouse/position/', {params: this.query});
                this.position = res.obj;
                console.log(res);
            },
            async location(item) {
                console.log(item.id);
                this.locationDialog=true;
                const res=await this.$http.get('/goods/goodsPosition/'+item.id);
                if (res){
                    this.locations=res.obj;
                }

            },
        },
        created() {
            this.openEnter();
            this.getEnterList();
        }
    }
</script>

<style lang="less" scoped>

</style>
