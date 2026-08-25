<template>
<div class="mainOuter">
    <div class="mainLeft">
        <div class="title">功能列表</div>
        <ul>
            <li><RouterLink to="/mainWorkPage/welcome">首页</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/approval">审批</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/todo">待办</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/management">业务管理</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/message">站内信</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/display">大屏展示</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/order">浏览产品与下单</RouterLink></li>
            <li><RouterLink to="/mainWorkPage/admin">系统管理</RouterLink></li>
        </ul>
        <div class="userBox">
            <span>当前用户：{{pinia_username.value}} </span>
            <el-popconfirm
                title="确认退出？"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="exitBtn"
                :hide-icon="true"
                effect="dark"
                >
            <template #reference>
                <el-button>退出</el-button>
            </template>
</el-popconfirm>
        </div>
    </div>

    <div class="mainRight">
        <RouterView/>
    </div>
</div>
    
</template>
<script lang="ts" setup name="mainWorkPage">

    import { use_username } from '@/stores/username'
    const pinia_username = use_username()
    import { useRouter } from 'vue-router'
    const router = useRouter()
    router.push("/mainWorkPage/welcome")
    function exitBtn(){
        fetch("/api/account/logout").then(()=>{
            router.push("/login")
        })

    }
    


</script>
<style scoped>
    .mainOuter {
        display: flex;
        backdrop-filter: blur(10px);
        
    }
    .mainLeft{
        width: 230px;
        height: calc(100vh - 50px);
        background-color: rgba(0, 0, 0, 0.458);
        display: flex;
        flex-direction: column;

    }
    .mainLeft .title{
        text-align: center;
        padding: 10px;
        font-size: 25px;
        color: white;
        background-color: rgba(0, 0, 0, 0.302);
    }


    .mainLeft ul li a{
        display: block;
        padding-left: 50px;
        padding-top: 6px;
        padding-bottom: 6px;
        margin-top: 5px;
        color:aliceblue;
        background-color: rgba(216, 215, 215, 0.202);
        font-size: 15px;
        text-decoration: none;
        transition: 0.3s;

    }

    .mainLeft ul li a:hover{
        background-color: rgba(0, 0, 0, 0.524)

    }

    .mainLeft ul li a.router-link-active {
        background-color: rgba(255, 255, 255, 0.3);

    }
    
    .userBox{
        margin-top: auto;
        height: 60px;
        background-color: rgba(0, 0, 0, 0.202);
        color:white;
        line-height: 60px;
        padding-left: 15px;
    }
    
    #app > div.mainOuter > div.mainLeft > div.userBox > button{
        display: inline-block;
        margin-left: 15px;
        padding: 1px;
        width: 50px;
        height: 30px;
        margin-left: 25px;
    }


</style>
