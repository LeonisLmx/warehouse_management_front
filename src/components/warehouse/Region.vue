<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/myWarehouse' }">我的仓库</el-breadcrumb-item>
            <el-breadcrumb-item>库区</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="comeBackDiv">
                <h5 class="comeBackFont" @click="comeBack">
                    <<<返回
                </h5>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-button type="primary" @click="openAddRegion">新建库区</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-row :gutter="40" v-loading="loading">
                <!--                内容主体区域-->
                <el-col v-for="item in regions" :key="item.id"
                        :span="6">
                    <div class="myRegionsClass1">
                        <!--库区，进度条区域-->
                        <el-tooltip effect="dark" :content="tNum+item.num+item.name" placement="top" :enterable="false">
                            <div class="myRegionsClass">
                                <h1 class="brand-info__text" @click="toShelf(item)">{{item.num}}</h1>
                                <el-progress :text-inside="true"
                                             :stroke-width="15"
                                             :color="colors"
                                             :percentage="item.percentage"></el-progress>
                            </div>
                        </el-tooltip>
                        <!--文字区域-->
                        <div style="padding-left: 20px;padding-top: 10px">
                            <span style="font-weight: 700;font-size:20px;margin-left: 70px">基本信息</span><br>
                            <span style="margin-bottom: 10px">库区编号:{{item.num}}</span><br>
                            <span>占地面积:{{item.area}}m2</span><br>
                            <span>可使用面积:{{item.capacity}}m2</span><br>
                            <span>已使用面积:{{item.used}}m2</span><br>


                        </div>
                        <!--按钮区域-->
                        <div style="padding-left: 20px;padding-top: 10px">
                            <i class="el-icon-plus"></i>
                            <el-tooltip effect="dark" content="修改库区信息" placement="top" :enterable="false">
                            <el-button type="primary"
                                       icon="el-icon-edit"
                                       circle
                                       @click="openUpdateRegion(item)"
                                       style="margin-left: 10px"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="矫正容量" placement="top" :enterable="false">
                            <el-button :disabled="!item.state"
                                       type="success"
                                       icon="el-icon-check"
                                       @click="openCorrect(item)"
                                       circle></el-button>
                            </el-tooltip>
                            <el-button :disabled="!item.state" type="warning" icon="el-icon-star-off" circle></el-button>
                            <el-button :disabled="!item.state"
                                       type="danger"
                                       icon="el-icon-delete"
                                       @click="deleteRegion(item)"
                                       circle></el-button>
                        </div>
                    </div>

                </el-col>
            </el-row>
        </el-card>
        <!--新建库区-->
        <el-dialog
                title="新建库区"
                :visible.sync="addRegionDialog"
                width="30%"
                @close="addRegionClosed">
            <el-form :model="addRegion"
                     ref="addRegionRef"
                     :rules="addRegionRules"
                     label-width="90px"
            >
                <el-form-item label="所属仓库:" prop="num">
                    <el-input v-model="tNum" disabled></el-input>
                </el-form-item>
                <el-form-item label="库区编号:" prop="num">
                    <el-input v-model="addRegion.num" placeholder="格式：R xx"></el-input>
                </el-form-item>
                <el-form-item label="库区类型:" prop="name">
                    <el-select v-model="addRegion.name" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="占地面积:" prop="area">
                    <el-input v-model="addRegion.area" placeholder="请输入占地面积"></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRegionDialog = false">取 消</el-button>
                <el-button type="primary" @click="addRegionYes">确 定</el-button>
                </span>
        </el-dialog>
        <!--修改库区信息-->
        <el-dialog
                title="修改库区信息"
                :visible.sync="updateRegionDialog"
                width="40%"
        >
            <el-form :model="updateRegion"
                     ref="updateRegionRef"
                     :rules="addRegionRules"
                     label-width="90px"
            >
                <el-form-item label="仓库编号:" prop="num">
                    <el-input v-model="tNum" disabled></el-input>
                </el-form-item>
                <el-form-item label="库区编号:" prop="num">
                    <el-input v-model="updateRegion.num" disabled></el-input>
                </el-form-item>
                <el-form-item label="库区类型:" prop="name">
                    <el-input v-model="updateRegion.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="占地面积:" prop="area">
                    <el-input v-model="updateRegion.area" ></el-input>
                </el-form-item>
                <el-form-item label="仓库状态:" >
                    <el-switch
                            v-model="updateRegion.state"
                    >
                    </el-switch>
                </el-form-item>
            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateRegionDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateRegionYes">确 定</el-button>
                </span>
        </el-dialog>
        <!--矫正容量-->
        <el-dialog
                title="矫正容量"
                :visible.sync="correctDialog"
                width="30%"
        >
            <el-form :model="correct"
                     ref="correctRef"
                     :rules="addRegionRules"
                     label-width="120px"
            >
                <el-form-item label="仓库编号:" prop="num">
                    <el-input v-model="correct.num" disabled></el-input>
                </el-form-item>
                <el-form-item label="可使用面积:" prop="area">
                    <el-input v-model="correct.capacity" ></el-input>
                </el-form-item>
                <el-form-item label="已使用面积:" prop="area">
                    <el-input v-model="correct.used" ></el-input>
                </el-form-item>
                <el-form-item label="仓库使用率:" prop="area">
                    <el-input v-model="correct.percentage+'%'" disabled></el-input>
                </el-form-item>
            </el-form>
            <!--内容底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="correctDialog = false">取 消</el-button>
                <el-button type="primary" @click="correctYes">确 定</el-button>
                </span>
        </el-dialog>
    </div>

</template>

<script>

    import {Message, MessageBox} from "element-ui";

    export default {
        data() {
            return {
                regions: [],
                loading: false,
                tNum: '',
                tId: 0,
                colors: [
                    {color: '#FE0728', percentage: 100},
                    {color: '#5cb87a', percentage: 80},
                ],
                addRegionDialog: false,
                addRegion: {
                    num: '',
                    name: '',
                    address: '',
                    area: '',
                    parentId: '',
                    type: 2

                },
                addRegionRules: {
                    num: [{required: true, message: '请输入仓库编号', trigger: 'blur'}],
                    name: [{required: true, message: '请选择仓库类型', trigger: 'blur'}],
                    address: [{required: true, message: '请输入仓库详细地址', trigger: 'blur'}],
                    area: [{required: true, message: '请输入仓库占地面积', trigger: 'blur'}],
                },
                options: [{
                    value: '库区',
                    label: '普通库区',

                },
                    {
                        value: '废料区',
                        label: '废料区',
                        disabled: true
                    },],
                updateRegionDialog:false,
                updateRegion:{},
                correctDialog:false,
                correct:{}
            }
        },
        methods: {
            async getRegion() {
                this.loading = true;
                this.tId = this.$route.query.id;
                this.tNum = this.$route.query.num;
                const res = await this.$http.get('/warehouse/myRegion/' + this.tId);
                if (!res) return ;
                if (res){
                    this.regions = res.obj;
                }
                this.loading = false;

            },
            comeBack() {
                this.$router.push('/myWarehouse')
            },
            toShelf(item) {
                this.$router.push({
                    path: '/shelf',
                    query: {
                        id: item.id,
                        rNum: item.num,
                        tNum: this.tNum,
                        tId: this.tId
                    }
                })
            },
            addRegionClosed() {
                this.$refs.addRegionRef.resetFields();
            },
            openAddRegion() {
                this.addRegionDialog = true;
            },
            addRegionYes() {
                this.addRegion.parentId = this.tId;
                this.$refs.addRegionRef.validate(async valid => {
                    if (!valid) return;
                    let fArea=0;
                    for (let i=0;i<this.regions.length;i++){
                        fArea=fArea+this.regions[i].area;
                    }
                    fArea=parseInt(this.addRegion.area)+fArea;
                    if (fArea>900)
                    {
                        Message.warning("库区面积已达上限");
                        return ;
                    }else {
                        const res=await this.$http.post('/warehouse/addWarehouse', this.addRegion);
                        if (!res) return ;
                        if (res){
                            this.getRegion();
                        }
                        this.addRegionDialog = false
                    }
                })

            },
            openUpdateRegion(item){
                this.updateRegionDialog=true
                this.updateRegion=item;
            },
            updateRegionYes(){
                this.$refs.updateRegionRef.validate(async valid=>{
                    if (!valid) return;
                    const res=await this.$http.put('/warehouse/updateWarehouse',this.updateRegion);
                    if (res){
                        this.getRegion();
                    }else return ;
                    this.updateRegionDialog=false;
                });
            },
            openCorrect(item){
                this.correctDialog=true;
                this.correct=item;
            },
            correctYes(){
                this.$refs.correctRef.validate(async valid=>{
                    if (!valid) return;
                    this.correct.percentage=this.correct.used/this.correct.capacity*100;
                    const res=await this.$http.put('/warehouse/updateWarehouse',this.correct);
                    if (res){
                        this.getRegion();
                    }else return ;
                    this.correctDialog=false;
                });
            },
            deleteRegion(item){
                MessageBox.confirm('执行该操作后与该库区相关联的信息将全部丢失无法找回，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.delete('/warehouse/deleteWarehouseById/' + item.id);
                    if (res){
                        this.getRegion();
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
            this.getRegion();
        }
    }
</script>

<style lang="less" scoped>
    .el-card {

    }

    .el-row {
        margin-bottom: 20px;
    }

    .el-col {
        margin-bottom: 20px;
    }

    .myRegionsClass {
        border-radius: 8px;
        min-height: 100px;
        background-color: #E6A23C;
    }

    .myRegionsClass1 {
        border-radius: 8px;
        background-color: #909399;
    }

    .brand-info__text {
        cursor: pointer;
        margin: 0 0 22px 0;
        font-size: 48px;
        font-weight: 400;
        text-transform: uppercase;
    }

    .comeBackDiv {
        margin-bottom: 0;

        .comeBackFont {
            cursor: pointer;
            font-size: 13px;
            margin-top: 0;
        }
    }
</style>
