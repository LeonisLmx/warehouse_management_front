<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统监控</el-breadcrumb-item>
            <el-breadcrumb-item>SQL监控</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div   v-html="url1"></div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                url1:''
            }
        },
        methods:{
           async getSql(){
                const res=await this.$http.get('/system/druidSql');
                window.location.href=res;
            }
        },
        mounted() {
                this.url1 = 'http://localhost:8181/druid/login.html'
        },
        created() {

        }
    }
</script>

<style scoped>

</style>
