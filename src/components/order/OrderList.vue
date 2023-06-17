<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!--            搜索框区域-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query"
                              placeholder="请输入内容"
                              clearable
                              @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="openAddOrder">新建订单</el-button>
                </el-col>
            </el-row>
            <!--            表格区域-->
            <el-table v-loading="loading"
                      :data="orderList"
                      border
                      stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="orderNum" width="180px"></el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="订购数量" prop="count"></el-table-column>
                <el-table-column label="订单创建时间" prop="date" width="180px"></el-table-column>
                <el-table-column label="是否支付" prop="pay">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay===true" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="transport">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.transport===true" type="success">已发货</el-tag>
                        <el-tag v-else type="danger">未发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!--修改-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="openEditDialog(scope.row)"></el-button>
                        <!--查看进度-->
                        <el-tooltip effect="dark" content="查看进度" placement="top" :enterable="false">
                            <el-button type="success" icon="el-icon-time" size="mini"
                                       @click="openSchedule(scope.row)"></el-button>
                        </el-tooltip>
                        <!--删除操作-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteOrder(scope.row.id)"></el-button>


                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[2,5,7,10]"
                    :page-size="queryInfo.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
            <!--修改-->
            <el-dialog
                    title="修改订单"
                    :visible.sync="editOrderDialog"
                    width="40%"
            >
                <el-form ref="editUserRef" :model="orderInfo" :rules="addOrderRules" label-width="80px">
                    <el-form-item label="订单编号">
                        <el-input v-model="orderInfo.orderNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="orderInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="订购价格" prop="price">
                        <el-input v-model="orderInfo.price"></el-input>
                    </el-form-item>
                    <el-form-item label="订购数量" prop="count">
                        <el-input v-model="orderInfo.count"></el-input>
                    </el-form-item>
                    <el-form-item label="支付状态:" prop="address">
                        <el-switch
                                v-model="orderInfo.pay"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
               <el-button @click="editOrderDialog = false">取 消</el-button>
               <el-button type="primary" @click="editOrderYes">确 定</el-button>
               </span>
            </el-dialog>
            <!-- 查看进度-->
            <el-dialog title="订单跟踪"
                       :visible.sync="scheduleDialog"
                       width="50%">
                <el-steps :space="200" :active="state" align-center finish-status="success">
                    <el-step title="生成订单"></el-step>
                    <el-step title="新建生产"></el-step>
                    <el-step title="生产完成"></el-step>
                    <el-step title="存入待检库"></el-step>
                    <el-step title="入库"></el-step>
                    <el-step title="出库"></el-step>
                    <el-step title="确认收货"></el-step>
                </el-steps>
                <span slot="footer" class="dialog-footer">
               <el-button @click="scheduleDialog = false">关闭</el-button>
               </span>
            </el-dialog>
            <!--  新建订单-->
            <el-dialog
                    title="新建订单"
                    :visible.sync="addOrderDialog"
                    width="40%"
                    @close="addOrderDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="addOrder"
                        :rules="addOrderRules"
                        ref="addOrderRef"
                        label-width="90px">
                    <el-form-item label="商品名" prop="name">
                        <el-input v-model="addOrder.name"></el-input>
                    </el-form-item>
                    <el-form-item label="订购数量" prop="count">
                        <el-input v-model="addOrder.count"></el-input>
                    </el-form-item>
                    <el-form-item label="订购价格" prop="price">
                        <el-input v-model="addOrder.price"></el-input>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-autocomplete
                                v-model="addOrder.clientName"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请输入内容"
                                @select="handleSelect"
                        ></el-autocomplete>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addOrderDialog = false">取 消</el-button>
                <el-button type="primary" @click="addOrderYes">确 定</el-button>
                </span>

            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    import {Message, MessageBox,Notification } from "element-ui";

    export default {

        data() {
            return {
                queryInfo: {
                    query: '',
                    pageNum: 1,
                    size: 7
                },
                total: 0,
                orderList: [],
                editOrderDialog: false,
                //修改订单
                orderInfo: {},
                scheduleDialog: false,
                //添加订单
                addOrderDialog: false,
                query: {
                    clientName: '',
                },
                addOrder: {
                    name: '',
                    count: '',
                    price: '',
                    clientId: '',
                    clientName: ''
                },
                addOrderRules: {
                    name: [{required: true, message: '请填写商品名', trigger: 'blur'}],
                    count: [{required: true, message: '请填写订购数量', trigger: 'blur'}],
                    price: [{required: true, message: '请填写订单价格', trigger: 'blur'}],
                    client: [{required: true, message: '请填写客户名称', trigger: 'blur'}],
                },
                client: [],
                //查看进度
                state: '',
                loading: false
            }
        },
        methods: {
            async getOrderList() {
                this.loading = true;
                const res = await this.$http.get('/order/orderList/', {params: this.queryInfo});
                if (res){
                    this.total = res.obj.total;
                    this.orderList = res.obj.data;
                }
                else return ;
                this.loading = false;
            },
            //改变每页的页数
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getOrderList();
            },
            //翻页
            handleCurrentChange(newPage) {
                this.queryInfo.pageNum = newPage
                this.getOrderList();
            },
            openEditDialog(orderInfo) {
                this.editOrderDialog = true;
                this.orderInfo = orderInfo;
            },
            //查看进度
            openSchedule(orderInfo) {
                this.scheduleDialog = true;
                this.state = orderInfo.orderState;
            },
            //打开添加订单
            openAddOrder() {
                this.addOrderDialog = true
            },
            //监听关闭订单事件
            addOrderDialogClosed() {
                this.$refs.addOrderRef.resetFields()
            },
            //远程查询客户
            async querySearchAsync(queryString, cb) {
                this.query.clientName = queryString
                const res = await this.$http.get('/client/clientList/', {params: this.query});
                for (let i of res.obj) {
                    i.value = i.name + '(' + i.note + ')';
                }
                this.client = res.obj;
                cb(this.client)
            },
            //主要用来获取客户id
            handleSelect(item) {
                this.addOrder.clientId = item.id;
            },
            //添加订单
            addOrderYes() {
                this.$refs.addOrderRef.validate(async valid => {
                    if (!valid) return;
                    if (this.addOrder.clientId === '') {
                        Notification({
                            title: '提示',
                            message: '没有找到客户'+this.addOrder.clientName+'的任何信息，请先在客户列表中添加该客户的信息',
                            type: 'warning',
                            duration: 4500
                        });
                        return;
                    }
                    const res = await this.$http.post('/order/addOrder', this.addOrder);
                    if (res){
                        this.getOrderList();
                    }
                    else return ;
                    this.addOrderDialog = false;
                })
            },
            //修改订单确定按钮绑定事件
            editOrderYes() {
                this.$refs.editUserRef.validate(async valid => {
                    if (!valid) return;
                    const res = await this.$http.put('/order/editOrder', this.orderInfo);
                    if (res){
                        this.getOrderList();
                    }
                    else return ;
                    this.editOrderDialog = false;
                })
            },
            //删除订单
            deleteOrder(orderId){
                MessageBox.confirm('是否永久删除该订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.delete('/order/deleteOrder/'+orderId);
                    if (res){
                        this.getOrderList();
                    }else return ;
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    return;
                });
            }

        },
        created() {
            this.getOrderList();
        }
    }
</script>

<style lang="less" scoped>

</style>
