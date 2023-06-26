import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import UserList from "../components/user/userList"
import PowList from "../components/power/PowList"
import RoleList from "../components/power/RoleList"
import OrderList from "../components/client/OrderList";
import OutputList from "../components/output/OutputList";
import Enter from "../components/warehouse/Enter";
import Out from "../components/warehouse/Out";
import Check from "../components/warehouse/Check";
import Ship from "../components/data/Report";
import ClientList from "../components/client/ClientList";
import MyWarehouse from "../components/warehouse/MyWarehouse";
import Region from "../components/warehouse/Region";
import Shelf from "../components/warehouse/Shelf";
import Transition from "../components/schedule/Transition";
import Report from "../components/data/Report";
import AddressBook from "../components/comm/AddressBook";
import OrderDetail from "../components/client/OrderDetail";
import ManageOrderTable from "../components/client/ManageOrderTable";
import HandSchedule from "../components/schedule/HandSchedule";
import SubstationList from "../components/substation/SubstationList";
import SubstationOrderManage from "../components/substation/OrderManage";
Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/home'},
    {path: '/login', component: Login},
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/userList',
                component: UserList
            },
            {
                path: '/powList',
                component: PowList
            },
            {
                path: '/roleList',
                component: RoleList
            },
            {
                path: '/orderList',
                component: OrderList
            },
            {
                path:'/outputList',
                component:OutputList
            },
            {
                path:'/myWarehouse',
                component:MyWarehouse
            },
            {
                path:'/enter',
                component:Enter
            },
            {
                path:'/out',
                component:Out
            },
            {
                path:'/check',
                component:Check
            },
            {
                path:'/ship',
                component:Ship
            },
            {
                path:'/clientList',
                component:ClientList
            },
            {
                path:'/region',
                component:Region
            },
            {
                path:'/shelf',
                component:Shelf
            },
            {
                path:'/transition',
                component:Transition
            },
            {
                path:'/report',
                component:Report
            },
            {
                path:'/addressBook',
                component:AddressBook
            },
            {
                path:'/orderDetail',
                component:OrderDetail
            },{
                path: '/manageOrderTable',
                component:ManageOrderTable
            },{
                path: '/handSchedule',
                component: HandSchedule
            },{
                path: '/substationList',
                component: SubstationList
            },{
                path: '/substationOrderManage',
                component: SubstationOrderManage
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
// //挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//     //to将要访问的路径
//     //from代表从哪个路径跳转过来
//     //next是一个函数表示放行
//     //next()放行  next('/login') 跳转到登登录页
//     if (to.path == '/login') return next();
//     //获取用户数据
//     const user = window.sessionStorage.getItem('user')
//     const cookie=document.cookie;
//     if (!cookie) return next('/login');
//     next()
//
// })
export default router
