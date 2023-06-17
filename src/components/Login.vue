<template>
    <div class="site-wrapper site-page--login">
        <div class="site-content__wrapper">
            <div class="site-content">
                <div class="brand-info">
                    <h2 class="brand-info__text">w-m-s</h2>
                    <p class="brand-info__intro">Warehouse Management System基于企业管理系统货物供应链构建开发，实现了对仓储各环节实施的全过程控制与管理。</p>
                </div>
                <div class="login-main">
                    <h3 class="login-title">仓库管理系统</h3>
                    <el-form :model="loginForm" :rules="loginFormRoles" ref="loginFormRef" @keyup.enter.native="login"
                             status-icon>
                        <el-form-item prop="username">
                            <el-input v-model="loginForm.username" placeholder="请输入用户名或手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item prop="code">
                            <div style="width: 100%;height: 100%;display: flex;align-items: center">
                                <el-input v-model="loginForm.code" placeholder="点击图片更换验证码"
                                          style="width: 250px;"></el-input>
                                <img :src="vcUrl" @click="updateVerifyCode">
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-row :gutter="10">
                                <el-col :span='5'>
                                    <el-checkbox v-model="loginForm.rememberMe"><span style="color: #fff">记住我</span>
                                    </el-checkbox>
                                </el-col>
                                <el-col :span='2'>
                                    <el-tooltip class="item" effect="dark" content="短信登录" placement="top">
                                        <el-button type="info" icon="el-icon-message" circle
                                                   @click="openSmsLogin"></el-button>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-btn-submit" type="primary" @click="login">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
            <!--    短信登录-->
            <el-dialog
                    title="SMS认证"
                    :visible.sync="smsLoginDialog"
                    width="30%"
                    @close="smsLoginDialogClosed">
                <!--内容主体区域-->
                <el-form
                        :model="smsLoginForm"
                        :rules="smsLoginRules"
                        ref="smsLoginRef"
                        label-width="90px"
                        inline
                >
                    <el-form-item label="联系方式">
                        <el-row :gutter="10">
                            <el-col :span="20">
                                <el-input v-model="smsLoginForm.mobile" style="width:240px"></el-input>
                            </el-col>
                            <el-col :span="3">
                                <el-tooltip class="item" effect="dark" content="获取验证码" placement="top">
                                    <el-button type="info" icon="el-icon-message" @click="getSmsCode"></el-button>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="验证码">
                        <el-input v-model="smsLoginForm.smsCode" style="width:240px"></el-input>
                    </el-form-item>
                </el-form>
                <!--内容底部区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="smsLoginDialog = false">取 消</el-button>
                <el-button type="primary" @click="smsLogin">确 定</el-button>
                </span>

            </el-dialog>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                vcUrl: '/verifyCode?time=' + new Date(),
                //这是登录表单的数据绑定对象
                loginForm: {
                    username: '',
                    password: '',
                    code: '',
                    rememberMe: false
                },
                smsLoginForm: {
                    mobile: '',
                    smsCode: ''
                },
                //这是表单的验证规则对象
                loginFormRoles: {
                    //验证用户名是否合法
                    username: [
                        {required: true, message: '请输入登录名称', trigger: 'blur'},
                        {min: 3, max: 12, message: "长度在3到10个字符", trigger: "blur"}
                    ],
                    //验证密码是否合法
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'},
                        {min: 3, max: 15, message: "长度在3到15个字符", trigger: 'blur'}
                    ],
                },
                smsLoginRules:{
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {min: 11, max: 12, message: "格式错误"}
                    ],
                },
                smsLoginDialog: false,
            }
        },

        methods: {
            updateVerifyCode() {
                this.vcUrl = '/verifyCode?time=' + new Date();
            },
            //点击重置登录表单
            resetLoginForm() {
                // console.log(this)
                this.$refs.loginFormRef.resetFields();
            },
            //
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    const res = await this.postKeyValueRequest('/doLogin', this.loginForm);
                    // console.log(res);
                    //将登陆成功之后的数据保存在sessionStorage中
                    if (res) {
                        window.sessionStorage.setItem("user", JSON.stringify(res.obj));
                        this.$store.commit('changeState', res.obj);
                        this.$websocket.dispatch('websocket_init',"ws://localhost:8181/ws/asset/"+this.$store.state.user.name)
                    } else {
                        setTimeout(() => {
                            loading.close();
                        }, 2000);
                        this.updateVerifyCode();
                        return;
                    }
                    await this.$router.push('/home');
                    setTimeout(() => {
                        loading.close();
                    });
                });
            },
            smsLoginDialogClosed() {
                this.$refs.smsLoginRef.resetFields()
            },
            openSmsLogin() {
                this.smsLoginDialog = true;
            },
            async getSmsCode(){
                const res=await this.$http.get('/smsCode',{
                    params:{
                       mobile: this.smsLoginForm.mobile
                    }
                })
            },
            async smsLogin(){
                this.$refs.smsLoginRef.validate(async valid => {
                    console.log(this.smsLoginForm);
                    const res=await  this.postKeyValueRequest('/smsLogin',this.smsLoginForm);
                    console.log(res)
                    if (res) {
                        window.sessionStorage.setItem("user", JSON.stringify(res.obj));
                        this.$store.commit('changeState', res.obj)
                        this.smsLoginDialog=false
                    } else {
                        return;
                    }
                    await this.$router.push('/home');
                })
            }
        }
    }
</script>
<!--scoped如果加上只在本页面生效，去掉就全局生效,只要是但文件就定义-->
<style lang="less" scoped>
    .site-wrapper.site-page--login {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(38, 50, 56, .6);
        overflow: hidden;

        &:before {
            position: fixed;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            content: "";
            background-image: url(~@/assets/img/bg1.jpg);
            background-size: cover;
        }

        .site-content__wrapper {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            padding: 0;
            margin: 0;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: transparent;
        }

        .site-content {
            min-height: 100%;
            padding: 30px 500px 30px 30px;
        }

        .brand-info {
            margin: 220px 100px 0 90px;
            color: #fff;
        }

        .brand-info__text {
            margin: 0 0 22px 0;
            font-size: 48px;
            font-weight: 400;
            text-transform: uppercase;
        }

        .brand-info__intro {
            margin: 10px 0;
            font-size: 16px;
            line-height: 1.58;
            opacity: .6;
        }

        .login-main {
            position: absolute;
            top: 0;
            right: 0;
            padding: 150px 60px 180px;
            width: 350px;
            min-height: 100%;
            background-color: Transparent;
        }

        .login-title {
            font-size: 25px;
            color: #fff;
        }

        .login-captcha {
            overflow: hidden;

            > img {
                width: 100%;
                cursor: pointer;
            }
        }

        .login-btn-submit {
            width: 100%;
            margin-top: 38px;
        }

    }

</style>
