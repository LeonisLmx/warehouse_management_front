<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内部通讯</el-breadcrumb-item>
            <el-breadcrumb-item>通讯录</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card style="height: 600px">

            <el-container class="AddressBook-container">
                <el-header class="AddressBook-header" style="height: 30px">
                    <span>聊天室</span>
                    <span style="margin-left: 500px">当前在线人数：{{count.split(',')[1]}}</span>

                </el-header>
                <el-container>
                    <el-aside width="200px" class="AddressBook-aside">
                        <el-input placeholder="请输入用户名"
                                  size="mini"
                                  v-model="addressBookInfo.name"
                                  clearable
                                  @clear="getAddressBook"
                                  @keyup.enter.native="getAddressBook">
                            <!--                            <el-button  size="small" icon="el-icon-search" @click="getAddressBook"></el-button>-->
                        </el-input>
                        <div style="margin-top: 0px">
                            <div v-for="item in addressBook" class="userList">
                                <div style="height:5px">
                                </div>
                                <el-avatar shape="square" size="medium" :src="item.userface"
                                           style="margin-left: 5px"></el-avatar>
                                <span class="name">{{item.name}}</span>
                                <el-tag size="mini" type="success">{{item.roleName}}</el-tag>

                            </div>
                            <div style="height:5px">
                            </div>
                        </div>

                    </el-aside>
                    <el-container>
                        <el-main class="AddressBook-main">
                            <!--                            <p>{{message}}</p>-->
                            <el-row style="margin-top: 20px" v-for="item in message" :key="item.id">
                                <el-row v-if="item.username===name" type="flex" justify="end">
                                    <el-col :span="8">
                                        <el-card shadow="always" :style="'item.username===name'?'':'background-color: greenyellow;'">
                                            {{item.text}}
                                        </el-card>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-avatar shape="square" size="medium" :src="item.userface"
                                                   style="margin-left: 5px"></el-avatar>
                                    </el-col>
                                </el-row>
                                <el-row v-else type="flex" justify="start">
                                    <el-col :span="2">
                                        <el-avatar shape="square" size="medium" :src="item.userface"
                                                   style="margin-left: 5px"></el-avatar>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-card shadow="always" style="background-color: greenyellow">
                                            {{item.text}}
                                        </el-card>
                                    </el-col>

                                </el-row>
                            </el-row>
                        </el-main>
                        <el-footer class="uesrtext" style="height:150px">

                            <el-input type="textarea"
                                      class="inputT"
                                      placeholder="按 Enter 发送" v-model="text"
                                      @keyup.enter.native="sendToServer"
                            ></el-input>
                            <el-button type="primary" icon="el-icon-s-promotion" @click="sendToServer"></el-button>
                        </el-footer>
                    </el-container>
                </el-container>
            </el-container>
        </el-card>
    </div>

</template>

<script>
    export default {
        name: "AddressBook",
        data() {
            return {
                text: '',
                // websock: '',
                message: this.$websocket.state.message,
                name: this.$store.state.user.name,
                userface: this.$store.state.user.userface,
                addressBook: [],
                addressBookInfo: {
                    name: '',
                },
                count: this.$websocket.state.count
            }
        },

        created() { // 页面创建生命周期函数
            this.getAddressBook();
            this.count=this.$websocket.state.count
        },

        methods: {

            async getAddressBook() {
                const res = await this.$http.get('/ws/addressBook/', {params: this.addressBookInfo});
                //console.log(res.obj);
                this.addressBook = res.obj;
            },
            sendToServer(){
                this.$websocket.dispatch('websocket_send',this.name + "," + this.userface + "," + this.text);
                this.message=this.$websocket.state.message;
                this.text=''
            }
        }

    }
</script>

<style lang="less" scoped>
    .el-card {
        background-color: transparent;
        border: none;

    }

    .AddressBook-container {
        height: 100%;
        width: 100%;
        border: 1px solid #909399;
        border-radius: 3px;
    }

    .AddressBook-header {
        background-color: #24394E;
        color: #d3dce6;
        display: flex;
        align-items: center;
    }

    .AddressBook-main {
        height: 380px;
        background-color: #DCDFE6;

    }

    .AddressBook-aside {
        background-color: #909399;
    }

    .userList {
        padding-top: 3px;
        box-shadow: 0px 3px 3px #888888;

        .name {
            vertical-align: top;
            /*margin-top: 2px;*/
            margin-left: 15px;
            font-size: 15px;
        }

    }

    .uesrtext {
        position: relative;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-top: solid 1px #DDD;
        background-color: white;

        .inputT {
            padding-top: 10px;
            width: 100%;
            height: 200%;
            border: none;
            outline: none;
        }

        .el-button {
            position: absolute;
            bottom: 10px;
            right: 10px;
        }
    }
    .message-avatar{

    }
</style>