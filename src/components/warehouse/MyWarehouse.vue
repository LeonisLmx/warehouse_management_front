<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/mytransition' }">我的仓库</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!--            按钮区域-->
            <div>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-button type="primary" @click="openAddWarehouse">新建仓库</el-button>
                    </el-col>
                </el-row>
            </div>
            <!--            内容主体区域-->
            <el-row :gutter="20" v-loading="loading">
                <el-col v-for="item in transition" :key="item.id"
                        :span="11" class="col1"
                >
                    <el-row>
                        <!--仓库-->
                        <el-col :span="14" style="height: 300px">
                            <div class="grid-content bg-purple">
                                <el-tooltip effect="dark" :content="item.num+item.name" placement="top"
                                            :enterable="false">
                                    <img src="~@/assets/img/warehouse.jpg" @click="toRegion(item)">
                                </el-tooltip>
                            </div>
                            <h4 style="color: #eeeeee">仓库编号：{{item.num}}</h4>
                            <h4 style="color: #eeeeee">仓库类型：{{item.name}}</h4>
                            <h4 style="color: #eeeeee">仓库面积：{{item.area}}m2</h4>
                            <h4 style="color: #eeeeee">仓库地址：{{item.address}}</h4>
                            <h4 style="color: #eeeeee">仓库状态：
                                <el-switch
                                        v-model="item.state"
                                        disabled>
                                </el-switch>
                            </h4>

                        </el-col>
                        <!--容量-->
                        <el-col :span="10" style="margin-top: 20px;padding-left: 40px">
                            <el-progress type="circle" :percentage="item.percentage"></el-progress>
                            <h4 style="color: #eeeeee;padding-left: 12px">仓库已使用面积:{{item.used}}m2</h4>
                            <h4 style="color: #eeeeee;padding-left: 12px">实际可使用面积:{{item.capacity}}m2</h4>
                            <el-dropdown>
                               <span class="el-dropdown-link"
                                     style="color: #eeeeee;padding-left: 12px;font-size: 15px; font-weight: 700">
                               仓库操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown" trigger="click">
                                    <el-dropdown-item @click.native="openUpdateWarehouse(item)">修改信息</el-dropdown-item>
                                    <el-dropdown-item @click.native="openStore(item)" v-if="item.id===2">暂存货物
                                    </el-dropdown-item>
                                    <el-dropdown-item v-else>存储货物</el-dropdown-item>
                                    <el-dropdown-item @click.native="openRedress(item)">矫正容量</el-dropdown-item>
                                    <el-dropdown-item style="color: red" @click.native="deleteWarehouse(item)">删除仓库</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
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
                <!-- 远程搜索-->
                <el-form-item label="产品名称:">
                    <el-autocomplete
                            v-model="store.tNote"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            @select="handleSelect"
                            clearable
                            @clear="storeClosed"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="占地面积:">
                    <el-input v-model="store.area" placeholder="货架水平占地面积为10平方米" >
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
        <!--新建仓库-->
        <el-dialog
                title="新建仓库"
                :visible.sync="addWarehouseDialog"
                width="45%"
                @close="addWarehouseClosed">
            <el-form :model="addWarehouse"
                     ref="addWarehouseRef"
                     :rules="addWarehouseRules"
                     label-width="90px"
                     :inline="true">
                <el-form-item label="仓库编号:" prop="num">
                    <el-input v-model="addWarehouse.num" placeholder="格式：W xx"></el-input>
                </el-form-item>
                <el-form-item label="仓库类型:" prop="name">
                    <el-select v-model="addWarehouse.name" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库地址" prop="address">
                    <el-input v-model="addWarehouse.address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="占地面积" prop="area">
                    <el-input v-model="addWarehouse.area" placeholder="请输入占地面积"></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addWarehouseDialog = false">取 消</el-button>
                <el-button type="primary" @click="addWarehouseYes">确 定</el-button>
                </span>
        </el-dialog>
        <!--修改仓库信息-->
        <el-dialog
                title="修改仓库"
                :visible.sync="updateWarehouseDialog"
                width="40%"
                >
            <el-form :model="updateWarehouse"
                     ref="updateWarehouseRef"
                     :rules="addWarehouseRules"
                     label-width="90px"
                     >
                <el-form-item label="仓库编号:" prop="num">
                    <el-input v-model="updateWarehouse.num" disabled></el-input>
                </el-form-item>
                <el-form-item label="仓库类型:" prop="name">
                    <el-input v-model="updateWarehouse.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="仓库地址:" prop="address">
                    <el-input v-model="updateWarehouse.address"></el-input>
                </el-form-item>
                <el-form-item label="占地面积:" prop="area">
                    <el-input v-model="updateWarehouse.area" ></el-input>
                </el-form-item>
                <el-form-item label="仓库状态:" prop="address">
                    <el-switch
                            v-model="updateWarehouse.state"
                            >
                    </el-switch>
                </el-form-item>
            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateWarehouseDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateWarehouseYes">确 定</el-button>
                </span>
        </el-dialog>
        <!--矫正容量-->
        <el-dialog
                title="矫正容量"
                :visible.sync="redressDialog"
                width="40%"
        >
            <el-form :model="redress"
                     ref="redressRef"
                     :rules="addWarehouseRules"
                     label-width="120px"
            >
                <el-form-item label="仓库编号:" prop="num">
                    <el-input v-model="redress.num" disabled></el-input>
                </el-form-item>
                <el-form-item label="可使用面积:" prop="area">
                    <el-input v-model="redress.capacity" ></el-input>
                </el-form-item>
                <el-form-item label="已使用面积:" prop="area">
                    <el-input v-model="redress.used" ></el-input>
                </el-form-item>
                <el-form-item label="仓库使用率:" prop="area">
                    <el-input v-model="redress.percentage+'%'" disabled></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateWarehouseDialog = false">取 消</el-button>
                <el-button type="primary" @click="redressYes">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui'

    export default {
        data() {
            return {
                transition: [],
                loading: false,
                storeDialog: false,
                store: {
                    area: '',
                    wid: 2,
                    tid: '',
                    pid: [],
                    tNote: ''
                },
                storeRules: {
                    area: [{required: true, message: '请输入估算面积', trigger: 'blur'}],
                },
                //级联选择器中的内容
                query:{
                  id:2,
                },
                queryInfo: {
                    name: '',
                    state:1
                },
                //暂存货物中的位置信息
                position: [],
                addWarehouseDialog: false,
                addWarehouse: {
                    num: '',
                    name:'',
                    address:'',
                    area:'',
                    parentId:1,
                    type:1,
                },
                addWarehouseRules: {
                    num: [{required: true, message: '请输入仓库编号', trigger: 'blur'}],
                    name: [{required: true, message: '请选择仓库类型', trigger: 'blur'}],
                    address:[{required: true, message: '请输入仓库详细地址', trigger: 'blur'}],
                    area:[{required: true, message: '请输入仓库占地面积', trigger: 'blur'}],
                },
                options: [{
                    value: '待检库',
                    label: '待检库',
                    disabled: true
                },
                    {
                    value: '普通仓库',
                    label: '普通仓库',

                },],
                //修改仓库信息
                updateWarehouseDialog:false,
                updateWarehouse:{},
                redressDialog:false,
                redress:{},

            }
        },
        methods: {
            //监听暂存关闭事件
            storeClosed() {
                this.store = {
                    area: '',
                    tid: '',
                    pid: [],
                    lid: '',
                    tNote: ''
                }
            },
            toRegion(item) {
                this.$router.push({
                    path: '/region',
                    query: {
                        id: item.id,
                        num: item.num,
                    }
                })
            },
            //获取仓库
            async getWarehouse() {
                this.loading = true;
                const res = await this.$http.get('/warehouse/myWarehouse');
                if (res){
                    this.transition = res.obj;
                }else return ;
                this.loading = false;
            },
            openStore(item) {
                if (item.state){
                    this.storeDialog = true
                    this.getPosition();
                }else {
                    Message.error("仓库已被禁用");
                }

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
            //远程查询赋值
            handleSelect(item) {
                this.store.tid = item.id;
            },
            //获取级联选择器中内容
            async getPosition() {
                const res = await this.$http.get('/warehouse/position/',{params: this.query});
                this.position = res.obj;
            },
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
                        const res=await this.$http.post('/warehouse/store', this.store);
                        if (res){
                            this.getWarehouse();
                        }else return ;
                        this.storeDialog = false;
                    }
                });
            },
            addWarehouseClosed() {
                this.$refs.addWarehouseRef.resetFields();
            },
            openAddWarehouse() {
                this.addWarehouseDialog = true;
            },
            //新建仓库确定按钮
            addWarehouseYes(){
                this.$refs.addWarehouseRef.validate(async valid=>{
                    if (!valid) return ;
                    const res=await this.$http.post('/warehouse/addWarehouse',this.addWarehouse);
                    if (res){
                        this.getWarehouse();
                    }else return ;
                    this.addWarehouseDialog=false
                })
            },
            openUpdateWarehouse(item){
                    this.updateWarehouseDialog=true;
                    this.updateWarehouse=item;
            },
            updateWarehouseYes(){
                this.$refs.updateWarehouseRef.validate(async valid=>{
                    if (!valid) return;
                    const res=await this.$http.put('/warehouse/updateWarehouse',this.updateWarehouse);
                    if (res){
                        this.getWarehouse();
                    }
                    this.updateWarehouseDialog=false;
                });
            },
            openRedress(item){
                if (item.state){
                    this.redressDialog=true;
                    this.redress=item;
                }else {
                    Message.error("仓库已被禁用")
                }
            },
            //矫正容量
            redressYes(){
                this.$refs.redressRef.validate(async valid=>{
                    if (!valid) return;
                    this.redress.percentage=this.redress.used/this.redress.capacity*100;
                    const res=await this.$http.put('/warehouse/updateWarehouse',this.redress);
                    if (res){
                        this.getWarehouse();
                    }else return ;
                    this.redressDialog=false;
                });
            },
            deleteWarehouse(item){
                MessageBox.confirm('执行该操作后与该仓库相关联的信息将全部丢失无法找回，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.delete('/warehouse/deleteWarehouseById/' + item.id);
                    if (res){
                        this.getWarehouse();
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
            this.getWarehouse();

        }
    }
</script>

<style lang="less" scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .el-card {
        /*height: 590px;*/
        /*background-color: #545E6A;*/
    }

    .col1 {
        margin-bottom: 30px;
        margin-left: 30px;
        padding-left: 20px;
        border-radius: 10px;
        height: 350px;
        background-color: #24394E;
    }

    .bg-purple {
        background: #d3dce6;
        img {
            border-radius: 4px;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }

    .grid-content {
        margin-top: 15px;
        margin-left: 10px;
        height: 60px;
        width: 60px;
        border-radius: 4px;
        min-height: 36px;
    }


</style>
