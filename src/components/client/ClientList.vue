<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!--           搜索框添加按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              v-model="queryInfo.clientName"
                              clearable
                              @clear="getClientList">
                        <el-button slot="append" icon="el-icon-search" @click="getClientList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="openAddClient">添加客户</el-button>
                    <el-button type="info" @click="openBlacklist"> 黑名单 </el-button>
                </el-col>
            </el-row>
            <!--客户列表区域  -->
            <el-table v-loading="loading"
                      :data="clientList"
                      border
                      height="490"
                      stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name" width="200px"></el-table-column>
                <el-table-column label="联系方式" prop="phone" width="200px"></el-table-column>
                <el-table-column label="地址" prop="address"></el-table-column>
                <el-table-column label="备注" prop="note"></el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="openEditDialog(scope.row)"></el-button>
                        <el-tooltip effect="dark" content="查看订单" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-s-order" size="mini"
                                   @click="openOrderList(scope.row.id)">
                        </el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="拉黑" placement="top" :enterable="false">
                        <el-button type="info" icon="el-icon-warning" size="mini"
                                   @click="enterBlacklist(scope.row.id)">
                        </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--查看订单对话框-->
            <el-dialog title="客户订单"
                       :visible.sync="orderListDialog"
                      >
                <el-table :data="orderList"  v-loading="orderLoading">
                    <el-table-column type="index" label="#" width="50"></el-table-column>
                    <el-table-column label="订单号" prop="orderNum" width="200"></el-table-column>
                    <el-table-column label="商品名" prop="name"></el-table-column>
                    <el-table-column label="订购数量" prop="count"></el-table-column>
                    <el-table-column label="订购价格" prop="price"></el-table-column>
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
                </el-table>

            </el-dialog>
            <!--添加客户对话框-->
            <el-dialog
                    title="添加客户"
                    :visible.sync="addClientDialog"
                    width="40%"
                    @close="addClientDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="addClient"
                        :rules="addClientRules"
                        ref="addClientRef"
                        label-width="90px">
                    <el-form-item label="客户名" prop="name">
                        <el-input v-model="addClient.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="addClient.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="省市区/县">
                        <el-cascader :options="cityData" v-model="addClient.addressA.address1">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input v-model="addClient.addressA.address2"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="addClient.note"></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addClientDialog = false">取 消</el-button>
                <el-button type="primary" @click="addClientYes">确 定</el-button>
                </span>

            </el-dialog>
<!--            修改对话框-->
            <el-dialog
                    title="修改客户"
                    :visible.sync="editClientDialog"
                    width="40%"
                   >
                <el-form :model="clientInfo"
                         :rules="addClientRules"
                         ref="editClientRef"
                         label-width="80px">
                    <el-form-item label="客户名称" prop="name">
                    <el-input v-model="clientInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="clientInfo.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="clientInfo.address"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="clientInfo.note"></el-input>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editClientDialog = false">取 消</el-button>
                <el-button type="primary" @click="editClientYes">确 定</el-button>
                </span>
            </el-dialog>
<!--            黑名单-->
            <el-dialog
                    title="黑名单"
                    :visible.sync="BlacklistDialog"
                    width="60%">
                <el-table v-loading="blackLoading"
                          :data="blacklist"
                          border
                          stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="name" width="100px"></el-table-column>
                <el-table-column label="联系方式" prop="phone" width="150px"></el-table-column>
                <el-table-column label="地址" prop="address" width="225px"></el-table-column>
                <el-table-column label="备注" prop="note"></el-table-column>
                <el-table-column label="移出黑名单" width="150px">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-refresh-right" size="mini"
                                   @click="outBlacklist(scope.row.id)">
                        </el-button>
                    </template>
                </el-table-column>
                </el-table>
                 <span slot="footer" class="dialog-footer">
                <el-button @click="BlacklistDialog = false">关闭</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    import cityData from "../order/cityData";
    import {Message, MessageBox} from "element-ui";

    export default {
        data() {
            return {
                //根据姓名查询
                queryInfo:{
                    clientName: '',
                },

                //表格数据
                clientList: [],
                //黑名单数据
                blacklist:[],
                loading: false,
                blackLoading:false,
                // 查看订单
                orderListDialog: false,
                orderList: [],
                //添加客户
                addClientDialog: false,
                addClient: {
                    name: '',
                    phone: '',
                    addressA: {
                        address1: '',
                        address2: ''
                    },
                    note: ''
                },
                orderLoading:false,
                addClientRules: {
                    name: [{required: true, message: '请填写客户姓名', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入您的联系方式', trigger: 'blur'},
                        {min: 11, max: 11, message: "格式错误", trigger: "blur"}],
                    address:[{required: true, message: '请填写客户姓名', trigger: 'blur'}]
                },
                cityData,
                //修改对话框
                editClientDialog:false,
                clientInfo:{},
                BlacklistDialog:false

            }
        },
        methods: {
            //查看客户订单
            async getClientList() {
                this.loading = true;
                const res = await this.$http.get('/client/clientList/',{params:this.queryInfo});
                if (!res) return;
                this.clientList = res.obj;
                this.loading = false;
            },
            //查看订单
            async openOrderList(clientId) {
                this.orderLoading=true;
                this.orderListDialog = true;
                const res=await this.$http.get('/client/getOrderByCid/'+clientId);
                if (!res) return ;
                this.orderList = res.obj;
                this.orderLoading=false
            },
            //监听添加关闭事件
            addClientDialogClosed() {
                this.addClient = {
                    name: '',
                    phone: '',
                    addressA: {
                        address1: [],
                        address2: ''
                    },
                    note: '',
                    address:''
                }
            },
            openEditDialog(clientInfo){
                this.editClientDialog=true;
                this.clientInfo=clientInfo;
            },
            openAddClient() {
                this.addClientDialog = true
            },
            //修改客户信息
            editClientYes(){
                this.$refs.editClientRef.validate(async valid => {
                    if (!valid) return ;
                    const res=await this.$http.put('/client/editClient',this.clientInfo)
                    if (!res) return ;
                    this.getClientList();
                    this.editClientDialog=false
                })
            },
            //添加客户
            addClientYes(){
                this.$refs.addClientRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else if (this.addClient.addressA.address1 === '') {
                        Message.error("请选择省市区县");
                        return;
                    } else if (this.addClient.addressA.address2 === '') {
                        Message.error("请填写详细地址");
                        return;
                    }
                    const address1Str=this.addClient.addressA.address1.join('');
                    this.addClient.address=address1Str+this.addClient.addressA.address2;
                    // console.log(this.addClient.address)
                    // console.log(this.addClient)
                    const res=await this.$http.post('/client/addClient',this.addClient);
                    if (res){
                        this.getClientList();
                    }
                    this.addClientDialog=false

                })
            },
            //加入黑名单
            enterBlacklist(clientId){
                MessageBox.confirm('确定将用户加入黑名单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.put('/client/enterBlacklist/'+clientId);
                    if (res){
                        this.getClientList();
                    }
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消拉黑'
                    });
                    return;
                });
            },
            async outBlacklist(clientId){
                const res=await this.$http.put('/client/enterBlacklist/'+clientId);
                if (res){
                    this.openBlacklist();
                    this.getClientList();
                }

            },
            async openBlacklist(){
                this.blackLoading=true;
                this.BlacklistDialog=true;
                const res=await this.$http.get('/client/getBlacklist');
                this.blacklist=res.obj;
                this.blackLoading=false;
            }
        },
        created() {
            this.getClientList();
        }
    }
</script>

<style scoped>

</style>
