<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/myWarehouse' }">我的仓库</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/region' ,query:{
                 id:this.tId,
                 num:this.tNum,
            } }">库区</el-breadcrumb-item>
            <el-breadcrumb-item>货架</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div class="comeBackDiv">
                <h5 class="comeBackFont" @click="comeBack"> <<<返回</h5>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-button type="primary" @click="openAddShelf">新建货架</el-button>
                    </el-col>
                </el-row>
            </div>
<!--            内容主体区域-->
            <el-row :gutter="40" v-loading="loading">
                <el-col v-for="item in shelf" :key="item.id"
                        :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
                    <el-tooltip effect="dark" :content="tNum+rNum+item.num+item.name" placement="top" :enterable="false">
                        <div class="myShelfClass">
                            <table width="100%" style="height: 100px" border="1">
                                <tr v-for="item1 in item.shelf" :key="item1.id">
                                    <td><el-progress :text-inside="true" :color="colors"
                                                     :stroke-width="24" :percentage="item1.percentage"></el-progress></td>
                                </tr>
                            </table>
                        </div>
                    </el-tooltip>
                </el-col>
            </el-row>
<!--            新建货架-->
            <el-dialog
                    title="新建货架"
                    :visible.sync="addShelfDialog"
                    width="30%"
                    @close="addDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="addShelf"
                        :rules="addShelfRules"
                        ref="addShelfRef"
                        label-width="90px">
                    <el-form-item label="货架编号" prop="num">
                        <el-input v-model="addShelf.num" placeholder="例：S1"></el-input>
                    </el-form-item>
                    <el-form-item label="货架类型" prop="name">
                        <el-select v-model="addShelf.name" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="占地面积" prop="area">
                        <el-input v-model="addShelf.area" placeholder="默认为10，与存储容量相关"></el-input>
                    </el-form-item>
                    <el-form-item label="货架层数" prop="layer">
                        <el-input v-model="addShelf.layer" placeholder="默认为3，与存储容量相关"></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="addShelfDialog = false">取 消</el-button>
                <el-button type="primary" @click="addShelYes">确 定</el-button>
                </span>

            </el-dialog>

        </el-card>

    </div>
</template>

<script>
    import {Message} from 'element-ui'
    export default {
        data(){
            return{
                //待检库编号
                tNum:'',
                ///库区编号
                rNum:'',
                shelf:[],
                loading:false,
                //待检库id
                tId:0,
                layer:[],
                colors: [
                    {color: '#f56c6c', percentage: 100},
                    {color: '#e6a23c', percentage: 90},
                    {color: '#5cb87a', percentage: 80},
                ],
                addShelf:{
                    num:'',
                    name:'',
                    area:'',
                    layer:'',
                    type:3,
                    parentId:0,
                },
                addShelfRules:{
                    num:[{required: true, message: '请输入货架编号', trigger: 'blur'}],
                    name:[{required: true, message: '请输入货架编号', trigger: 'blur'}],
                    area:[{required: true, message: '请输入占地面积', trigger: 'blur'}],
                    layer:[{required: true, message: '请输入货架层数', trigger: 'blur'}]

                },
                addShelfDialog:false,
                options: [{
                    label: '普通货架',
                    value: '货架',

                },
                    {
                        label: '高级货架',
                        value:'高级货架',
                        disabled: true
                    },]

            }
        },
        methods:{
            async getShelf(){
                this.loading=true
                this.tNum=this.$route.query.tNum;
                this.rNum=this.$route.query.rNum;
                this.tId=this.$route.query.tId;
                this.addShelf.parentId=this.$route.query.id
                const res=await this.$http.get('/warehouse/myShelf/'+this.$route.query.id);
                if (res){
                    this.shelf=res.obj;
                }
                else return ;
                this.loading=false;
            },
            comeBack(){
                this.$router.push({
                    path:'/region',
                    query:{
                        id:this.tId,
                        num:this.tNum,
                    }
                })
            },
            //新建货架关闭监听事件
            addDialogClosed(){
                this.$refs.addShelfRef.resetFields();
            },
            //打开新建货架
            openAddShelf(){
                this.addShelfDialog=true;
            },
            addShelYes(){
                this.$refs.addShelfRef.validate( async valid=>{
                    if (!valid) return ;
                    let fArea=0;
                    for (let i=0;i<this.shelf.length;i++){
                        fArea=this.shelf[i].area+fArea;
                    }
                    fArea=parseInt(this.addShelf.area)+fArea;
                    if (fArea>160){
                        Message.warning("货架面积已达上限");
                        return ;
                    }else {
                        const res=await this.$http.post('/warehouse/addShelf',this.addShelf);
                        if (res){
                            this.getShelf();
                        }
                        this.addShelfDialog=false;
                    }

                });

            }
        },
        created() {
            this.getShelf();
        }
    }
</script>

<style lang="less" scoped>
    .el-card{
        height: 590px;
    }
    .el-row {
        margin-bottom: 20px;
    }

    .myShelfClass {
        border-radius: 4px;
        min-height: 100px;
        min-width: 100px;
        background-color: #d3dce6;
    }
    .brand-info__text {
        cursor: pointer;
        margin:  0 0 22px 0;
        font-size: 48px;
        font-weight: 400;
        text-transform : uppercase;
    }
    .comeBackDiv{
        margin-bottom: 0;
        .comeBackFont {
            cursor: pointer;
            font-size: 13px;
            margin-top: 0;
        }
    }
</style>

