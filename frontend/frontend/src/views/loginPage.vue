<template>
    <div class="loginOuter">
        <div class="title">多功能企业协作平台</div>
        <div class="loginBox">
        <div class="loginTip" >请登陆</div>
        <el-input 
            v-model="username" 
            style="width: 240px" 
            placeholder="用户名" />
        <br>
        <el-input
            v-model="password"
            style="width: 240px"
            type="password"
            placeholder="密码"
            show-password
    />
    <el-button type="success" class="loginBtn" @click="loginReq">登陆</el-button>
    <div class="regtip">还没有账号？去<RouterLink to="/register">注册</RouterLink></div>

    </div>
    <div class="auth">作者：HenryYe</div>
    </div>
    
</template>

<script lang="ts" setup name="loginPage">
    // import {RouterView,RouterLink} from 'vue-router'

    import { ref } from 'vue'
    const username = ref('')
    const password= ref('')
    import { useRouter } from 'vue-router'
    const router = useRouter()

    import { use_username } from '@/stores/username'
    const pinia_username = use_username()
    

    function loginReq(){
        pinia_username.value = username.value
        fetch('/api/account/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "username":String(username.value),
                "password":String(password.value)
            })
        }).then((res) => {
            if(res.status == 200){
                console.log("登陆成功")
                router.push("/mainWorkPage")
            }
        })
    }


</script>

<style scoped>
    .title {
        font-size: 50px;
        margin-bottom: 40px;
        color:black
    }
    .loginBox {
        width: 400px;
        height: auto;
        padding: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: aliceblue;
        border-radius: 20px;

        
    }
    .loginOuter{
        width: 100%;
        height: calc(100vh - 50px);
        background-color: rgb(219, 245, 255);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        
    }
    .loginTip{
        font-size: 30px;
        padding-bottom: 20px;
        color: rgba(0, 0, 0, 0.738);

    }
    .regtip{
        margin-top: 20px;
        color:black;
    }
    .loginBtn{
        margin-top: 30px;
        width: 240px;
    }
    .auth {
        margin-top: 30px;
        color: black;
    }
</style>

