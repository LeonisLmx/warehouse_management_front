<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>生产管理</el-breadcrumb-item>
            <el-breadcrumb-item>生产档案</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              v-model="queryInfo.name"
                              clearable
                              @clear="getTransition" @keyup.enter.native="getTransition">
                        <el-button slot="append" icon="el-icon-search" @click="getTransition"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-select v-model="queryInfo.state" clearable
                               @change="getTransition"
                               @clear="getTransition"
                               placeholder="产品状态">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <!--  表格区域-->
            <el-table v-loading="loading"
                      :data="transitionInfo"
                      border
                      height="490"
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="订单号" prop="orderNum"></el-table-column>
                <el-table-column label="产品名称" prop="name"></el-table-column>
                <el-table-column label="计划生产数量" prop="plan"></el-table-column>
                <el-table-column label="实际完成数量" prop="complete"></el-table-column>
                <el-table-column label="生产线" prop="outputId"></el-table-column>
                <el-table-column label="产品状态" prop="state">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state===2" type="warning">待检</el-tag>
                        <el-tag v-if="scope.row.state===1" type="danger">未入库</el-tag>
                        <el-tag v-if="scope.row.state===3" type="success">已入库</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="暂存" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-s-home" size="mini"
                                       @click="openStore(scope.row)">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="存放位置" placement="top" :enterable="false">
                            <el-button type="success" icon="el-icon-s-flag" size="mini"
                                       @click="location(scope.row)">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="清理" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete"
                                       :disabled="scope.row.state!==3"
                                       size="mini"
                                       @click="deleteTransition(scope.row.id)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 暂存货物-->
        <el-dialog
                title="暂存登记（待检库仅供内部使用,非法使用后果自负）"
                :visible.sync="storeDialog"
                width="45%"
                @close="storeClosed">
            <!--内容主体区域-->
            <el-form
                    :model="store"
                    ref="storeRef"
                    :rules="storeRules"
                    label-width="80px"
                    :inline="true">
                <p style="color: red"> 产品完成后将暂存入待检库等待质检。
                    请您以货物的占地面积大小为依据合理的分配货物存储方式。
                    在完成货物暂存后请登记货物的存放位置</p>

                <el-form-item label="订单号:">
                    <el-input v-model="storeInfo.orderNum" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="产品名称:">
                    <el-input v-model="storeInfo.name" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="存入数量:">
                    <el-input v-model="storeInfo.complete" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="生产线:">
                    <el-input v-model="storeInfo.outputId" disabled>
                    </el-input>
                </el-form-item>
                <!-- 远程搜索-->
                <el-form-item label="占地面积:">
                    <el-input v-model="store.area" placeholder="货架水平占地面积为10平方米">
                    </el-input>
                </el-form-item>
                <p v-if="store.area>0">提示:大约占用{{Math.ceil(store.area/10)}}层货架</p>
                <!--级联选择器-->
                <el-form-item label="存储位置:" label-width="80px">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-cascader
                                placeholder="请输入"
                                :options="position"
                                :props="{ multiple: true }"
                                filterable
                                v-model="store.pid"></el-cascader>
                    </div>
                </el-form-item>

            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="storeDialog = false">取 消</el-button>
                <el-button type="primary" @click="storeYes">确 定</el-button>
                </span>
        </el-dialog>
<!--        存放位置-->
        <el-dialog
                title="存放地址（待检库）"
                :visible.sync="locationDialog"
                width="30%"
                >
            <p style="color: red">*存放位置为在待检库中的存放位置T代表仓库编号，
                R代表库区编号，S代表货架编号，L代表层编号</p>
            <p>存放位置：{{locations}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="locationDialog = false" type="info">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Message, MessageBox} from "element-ui";

    export default {
        data() {
            return {
                queryInfo: {
                    name: '',
                    state: ''
                },
                query: {
                    id: 2
                },
                //所有生产完毕产品
                transitionInfo: [],
                loading: true,
                storeDialog: false,
                //暂存数据
                store: {
                    area: '',
                    wid: 2,
                    tid: '',
                    pid: [],
                    tNote: ''
                },
                storeInfo: {},
                storeRules: {
                    area: [{required: true, message: '请输入估算面积', trigger: 'blur'}],
                },
                //暂存货物中的位置信息
                position: [],
                options: [
                    {
                        value: 1,
                        label: '未入库'
                    },
                    {
                        value: 2,
                        label: '待检'
                    },
                    {
                        value: 3,
                        label: '已入库'
                    }],
                locations:[],
                locationDialog:false,
            }
        },
        created() {
            this.getTransition()
        },
        methods: {
            async getTransition() {
                this.loading = true
                const res = await this.$http.get('/transition/myTransition/', {params: this.queryInfo});
                for (let i = 0; i < res.obj.length; i++) {
                    if (res.obj[i].orderNum === '') {
                        res.obj[i].orderNum = '自主生产'
                    }
                    res.obj[i].outputId = res.obj[i].outputId + '号生产线';
                }
                this.transitionInfo = res.obj;
                this.loading = false;
            },
            storeClosed() {
                this.store = {
                    area: '',
                    tid: '',
                    pid: [],
                    lid: '',
                    tNote: ''
                }
            },
            openStore(item) {
                if (item.state === 2) {
                    Message.warning("产品已暂存于待检库请不要进行重复操作");
                } else if (item.state === 3) {
                    Message.warning("产品已入库");
                } else {
                    this.storeInfo = item
                    this.storeDialog = true;
                    this.store.tid = item.id;
                    this.getPosition();
                }
            },
            //获取级联选择器中内容
            async getPosition() {
                const res = await this.$http.get('/warehouse/position/', {params: this.query});
                this.position = res.obj;
            },
            //暂存
            storeYes() {
                const pid = this.store.pid;
                const lid = [];
                for (let i = 0; i < pid.length; i++) {
                    lid[i] = pid[i][pid[i].length - 1];
                }
                this.store.lid = lid.join(',');
                this.$refs.storeRef.validate(async valid => {
                    if (Math.ceil(this.store.area / 10) < lid.length) {
                        Message.error("请您节约空间");
                        return;
                    } else if (Math.ceil(this.store.area / 10) > lid.length) {
                        Message.error("我想这点地方不太够吧");
                        return;
                    } else if (!valid) {
                        return;
                    } else {
                        const res = await this.$http.post('/warehouse/store', this.store);
                        if (res) {
                            this.storeDialog = false;
                            this.getTransition();
                        }
                    }
                })
            },
            //位置
            async location(item) {
                console.log(item.id);
                this.locationDialog=true;
                const res=await this.$http.get('/transition/transitionPosition/'+item.id);
                console.log(res.obj);
                if (res.obj.length===0){
                    res.obj='未存待检库或已入库'
                }
                if (res){
                    this.locations=res.obj;
                }

            },
            deleteTransition(id) {
                MessageBox.confirm('此操作将永久删除本条生产数据，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.delete('/transition/deleteTransition/'+id);
                    if (res){
                        this.getTransition();
                    }
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消完成操作'
                    });
                    return;
                });
            }
        }
    }
</script>

<style scoped>

</style>
