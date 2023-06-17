<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>生产管理</el-breadcrumb-item>
            <el-breadcrumb-item>我的生产</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" @click="openAddOutput">新建生产线</el-button>
                    <el-divider></el-divider>
                </el-col>
            </el-row>
            <!-- 内容主体区域-->
            <el-row v-loading="loading">
                <el-row
                        v-for="item in outputList"
                        :key="item.id"
                >
                    <el-col :span="4">
                        <h4>{{item.name}}</h4>
                        <el-progress type="circle" :percentage="item.percentage" :color="colors"></el-progress>
                    </el-col>
                    <el-col :span="4">
                        <h3>生产操作</h3>
                        <el-divider></el-divider>
                        <el-tooltip effect="dark" content="新建生产" placement="top" :enterable="false">
                            <el-button :disabled="item.total!==0||item.state!==true" type="primary" size="small"
                                       @click="openAdd(item.id)" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="工作进度" placement="top" :enterable="false">
                            <el-button :disabled="item.total===0||item.state!==true" type="warning" size="small"
                                       @click="openWork(item)" icon="el-icon-edit-outline"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="完成" placement="top" :enterable="false">
                            <el-button :disabled="item.total===0||item.state!==true" type="success"
                                       @click="achieve(item)" size="small"
                                       icon="el-icon-success"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="4">
                        <h3>生产线操作</h3>
                        <el-divider></el-divider>
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button :disabled="item.state!==true" type="primary" size="small" icon="el-icon-edit"
                                       @click="updateOutput(item)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="生产日志" placement="top" :enterable="false">
                            <el-button :disabled="item.state!==true" type="info" size="small" icon="el-icon-tickets"
                                       @click="openOutputLog(item.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除生产线" placement="top" :enterable="false">
                            <el-button :disabled="item.state!==true" type="danger" size="small" icon="el-icon-delete"
                                       @click="deleteOutput(item.id)"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                        <h3>基本信息</h3>
                        <el-divider></el-divider>
                        {{item.note}}
                    </el-col>
                    <el-col :span="3">
                        <h3>生产线状态</h3>
                        <el-divider></el-divider>
                        <el-switch v-model="item.state" @change="updateOutputState(item.id,item.state)">
                        </el-switch>
                    </el-col>
                </el-row>
            </el-row>
            <!--新建生产线-->
            <el-dialog
                    title="新建生产线"
                    :visible.sync="addOutputDialog"
                    width="40%"
                    @close="addOutputDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="addOutput"
                        :rules="addOutputRules"
                        ref="addOutputRef"
                        label-width="100px">
                    <el-form-item label="生产线名称" prop="name">
                        <el-input v-model="addOutput.name" placeholder="?号生产线"></el-input>
                    </el-form-item>
                    <el-form-item label="生产线描述">
                        <el-input
                                type="textarea"
                                v-model="addOutput.note"
                                autosize
                                size="medium"></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addOutputDialog = false">取 消</el-button>
                <el-button type="primary" @click="addOutputYes">确 定</el-button>
                </span>

            </el-dialog>
            <!--更新生产线信息-->
            <el-dialog
                    title="更新生产线信息"
                    :visible.sync="updateOutputDialog"
                    width="40%"
            >
                <!--内容主体区域-->
                <el-form
                        :model="outputInfo"
                        :rules="addOutputRules"
                        ref="updateOutputRef"
                        label-width="100px">
                    <el-form-item label="生产线名称" prop="name">
                        <el-input v-model="outputInfo.name" placeholder="?号生产线"></el-input>
                    </el-form-item>
                    <el-form-item label="生产线描述">
                        <el-input
                                type="textarea"
                                v-model="outputInfo.note"
                                autosize></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addOutputDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateOutputYes">确 定</el-button>
                </span>

            </el-dialog>
            <!--新建生产-->
            <el-dialog
                    title="新建生产"
                    :visible.sync="addDialog"
                    width="35%"
                    @close="addDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="add"
                        :rules="addOutputRules"
                        ref="addRef"
                        label-width="100px">
                    <div style="color: red;margin-left: 40px;">
                        <span >*订单号非必填项，自主生产请勿填写。</span>
                        <br>
                        <el-radio v-model="radio" label="1">自主生产</el-radio>
                        <el-radio v-model="radio" label="2">订单</el-radio>
                    </div>
                    <div style="margin-top: 20px">
                        <el-form-item label="订单号">
                            <el-autocomplete
                                    v-model="add.addNote"
                                    :fetch-suggestions="querySearchAsync"
                                    placeholder="请输入内容"
                                    @select="handleSelect"
                                    style="width: 300px"
                                    :disabled="radio==='1'"
                                    clearable
                                    @clear="addDialogClosed"
                            ></el-autocomplete>
                        </el-form-item>
                        <el-form-item label="商品名称">
                            <el-input v-model="add.orderName"></el-input>
                        </el-form-item>
                        <el-form-item label="生产数量">
                            <el-input v-model="add.total"></el-input>
                        </el-form-item>
                    </div>

                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="insertOutputYes">确 定</el-button>
                </span>

            </el-dialog>
            <!--查看工作日志-->
            <el-dialog title="生产日志"
                       :visible.sync="outputLogDialog"
                       width="55%"
            >
                <el-table :data="outputLogList" v-loading="outputLogLoading">
                    <el-table-column type="index" label="#" width="50"></el-table-column>
                    <el-table-column label="订单号" prop="orderNum" width="180"></el-table-column>
                    <el-table-column label="名称" prop="orderName" width="90"></el-table-column>
                    <el-table-column label="开始时间" prop="startTime" width="170"></el-table-column>
                    <el-table-column label="结束时间" prop="endTime" width="170"></el-table-column>
                    <el-table-column label="责任人" prop="username"></el-table-column>
                </el-table>

            </el-dialog>
            <!-- 工作进度-->
            <el-dialog
                    title="工作进度"
                    :visible.sync="workDialog"
                    width="30%"
                    @close="workClose">
                <div>
                    <p>当前订单号:{{outputWork.orderNum}}</p>
                    <p>商品名称:{{outputWork.orderName}}</p>
                    <p>计划生产总数:{{outputWork.total}}</p>
                    <p>已生产数:{{outputWork.complete}}</p>
                    <p>今日生产数:
                        <el-input v-model="outNow" style="width: 50px" size="mini"></el-input>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="workDialog= false">取 消</el-button>
                <el-button type="primary" @click="workYes(outputWork.id)">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>

</template>

<script>
    import {Message, MessageBox} from "element-ui";

    export default {
        data() {
            return {
                queryInfo: {
                    name: ''
                },
                colors: [
                    {color: '#f56c6c', percentage: 20},
                    {color: '#e6a23c', percentage: 40},
                    {color: '#5cb87a', percentage: 100},
                    {color: '#1989fa', percentage: 80},
                    {color: '#6f7ad3', percentage: 60}
                ],
                radio:'1',
                loading: false,
                outputList: [],
                addOutputDialog: false,
                updateOutputDialog: false,
                addOutput: {
                    name: '',
                    note: ''
                },
                addOutputRules: {
                    name: [{required: true, message: '请填写商品名', trigger: 'blur'}],
                },
                //修改
                outputInfo: {},
                //工作进度
                outputWork: {},
                workDialog: false,
                addDialog: false,
                //新建生产的数据
                add: {
                    orderId: 0,
                    id: 0,
                    addNote: '',
                    orderNum: '',
                    orderName: '',
                    total: '',
                    operator: this.$store.state.user.id
                },
                //远程获取订单数据
                order: [],
                outputLogDialog: false,
                //生产日志
                outputLogList: [],
                outputLogLoading: false,
                //今日生产数
                outNow: 0,
            }
        },
        methods: {
            //所有生产线
            async getOutputList() {
                this.loading = true
                const res = await this.$http.get('/output/findOutputs');
                this.outputList = res.obj;
                this.loading = false
            },
            //新建生产线关闭事件
            addOutputDialogClosed() {
                this.$refs.addOutputRef.resetFields();
            },
            //打开新建生产线对话框
            openAddOutput() {
                this.addOutputDialog = true;
            },
            //新建生产线确定按钮
            addOutputYes() {
                this.$refs.addOutputRef.validate(async valid => {
                    if (!valid) return;
                    await this.$http.post('/output/addOutput', this.addOutput);
                    this.addOutputDialog = false;
                    this.getOutputList();
                })
            },
            //更新状态
            async updateOutputState(id, state) {
                const res = await this.$http.put('/output/updateOutputState/' + state + '/' + id);
                if (!res) {
                    state = !state;
                }
            },
            //打开更新对话框
            updateOutput(outputInfo) {
                this.updateOutputDialog = true;
                this.outputInfo = outputInfo;
            },
            updateOutputYes() {
                this.$refs.updateOutputRef.validate(async valid => {
                    if (!valid) return;
                    const res=await this.$http.put('/output/updateOutput', this.outputInfo);
                    if (res){
                        this.getOutputList();
                    }
                    else return ;
                    this.updateOutputDialog = false;
                })
            },
            //删除生产线
            deleteOutput(id) {
                MessageBox.confirm('执行该操作后将不再为您监控该生产线，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res =await this.$http.delete('/output/deleteOutput/' + id);
                    if (res){
                        this.getOutputList();
                    }else return ;
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });
            },
            //打开新建生产对话框
            openAdd(id) {
                this.addDialog = true;
                this.add.id = id;
            },
            //监听关闭新建生产对话框
            addDialogClosed() {
                this.add = {
                    addNote: '',
                    orderNum: '',
                    orderName: '',
                    total: ''
                }
            },
            //远程查询客户
            async querySearchAsync(queryString, cb) {
                this.queryInfo.name = queryString;
                const res = await this.$http.get('/order/orders', {params: this.queryInfo});

                for (let i of res.obj) {
                    i.value = i.orderNum + '(' + i.name + ')';
                }
                this.order = res.obj;
                cb(this.order)
            },
            handleSelect(item) {
                this.add.orderNum = item.orderNum;
                this.add.orderName = item.name;
                this.add.total = item.count;
                this.add.orderId = item.id;
            },
            //新建生产确定按钮
            insertOutputYes() {
                this.$refs.addRef.validate(async valid => {
                    if (this.add.orderName === '' || this.add.total === '') {
                        Message.error("请填写商品名或生产数量")
                    }
                    const res=await this.$http.post('/output/insertOutput', this.add);
                    if (res){
                        this.getOutputList();
                    }else return ;
                    this.addDialog = false;
                })
            },
            //打开工作日志
            async openOutputLog(oid) {
                this.outputLogDialog = true;
                this.outputLogLoading = true;
                const res = await this.$http.get('/output/outputLog/' + oid);
                this.outputLogList = res.obj;
                this.outputLogLoading = false;
            },
            //工作进度
            openWork(work) {
                this.workDialog = true;
                this.outputWork = work;
            },
            workClose() {
                this.outNow = 0
            },
            //更新工作进度
            async workYes(id) {
                if (this.outNow > this.outputWork.total - this.outputWork.complete) {
                    Message.error("玩我呢，这个数您看看合适么？")
                    return;
                } else {
                    const res=await this.$http.put('/output/workOutput/' + id + '/' + this.outNow);
                    if (res){
                        this.getOutputList();
                    }else return ;
                    this.workDialog = false;
                }
            },
            //完成生产
            achieve(item) {
                MessageBox.confirm('订单号为'+item.orderNum+'的'
                    +item.orderName+'已完成'+item.percentage+'%,您是否继续执行完成操作', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.put('/output/achieve',item);
                    if (res){
                        this.getOutputList();
                    }else return ;
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消完成操作'
                    });
                    return;
                });

            }

        },
        created() {
            this.getOutputList();
        }

    }
</script>

<style lang="less" scoped>
    .el-row {
        /*栅格布局上下间隔*/
        margin-bottom: 30px;
    }

    .el-divider {
        background-color: #1f1f1f;
    }

</style>
