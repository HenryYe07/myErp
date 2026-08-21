<template>
    
    <div class="loginOuter">
        
        <div class="title">多功能企业协作平台</div>
        
        <div class="loginBox">
            <el-alert :title="tipContent" :type="tipType" effect="light" :style="{ visibility: showTip ? 'visible' : 'hidden' }" :closable=false />
        <div class="loginTip" >欢迎注册</div>
        

        <div class="usernameOuter line">
            <span>用户名：</span>
            <el-input 
            v-model="username" 
            style="width: 240px" 
            placeholder="" />
        <br>
        </div>
        <div class="password1Outer line">
            <span>密码：</span>
            <el-input
            v-model="password1"
            style="width: 240px"
            type="password1"
            placeholder=""
            show-password
    />
        </div>

        <div class="password2Outer line">
            <span>确认密码：</span>
            <el-input
            v-model="password2"
            style="width: 240px"
            type="password2"
            placeholder=""
            show-password
    />
        </div>

        <div class="realNameOuter line">
            <span>真实姓名：</span>
            <el-input 
            v-model="realName" 
            style="width: 240px" 
            placeholder="" />
        <br>
        </div>

        <div class="emailOuter line">
            <span>邮箱：</span>
            <el-input 
            v-model="email" 
            style="width: 240px" 
            placeholder="" />
        <br>
        </div>
        
        
    <el-button type="primary" class="loginBtn" @click="regReq">注册</el-button>
    <el-button type="success" class="loginBtn backlogin" plain @click="gologin">已有账号？返回登陆</el-button>


    </div>
    </div>
    
</template>

<script lang="ts" setup name="registerPage">
    // import {RouterView,RouterLink} from 'vue-router'

    import { ref } from 'vue'
    const username = ref('')
    const password1 = ref('')
    const password2 = ref("")
    const realName = ref("")
    const email = ref("")


    const tipContent = ref("")
    const tipType = ref("")
    const showTip = ref(false)

    import { useRouter } from 'vue-router'
    const router = useRouter()
    
    function regReq(){
        if(password1.value != password2.value){
            tipType.value = "error"
            tipContent.value = '两次密码输入不一致' 
            showTip.value = true
            return
        }else if(username.value == "" || password1.value == "" || realName.value == "" || email.value == ""){
            tipType.value = "error"
            tipContent.value = '请填写完整' 
            showTip.value = true
            return
        }else if(/^\d+$/.test(username.value)){
            tipType.value = "error"
            tipContent.value = '用户名不允许纯数字' 
            showTip.value = true
            return
        }
        
        // 真的要提交了
        fetch("/api/account/register",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                "username": username.value,
                "password": password1.value,
                "realName": realName.value,
                "email": email.value
            })
        }).then((res)=>{
            if(res.status == 409){
                tipType.value = "error"
                tipContent.value = '用户名已被占用，请换一个' 
                showTip.value = true
                return
            }else if(res.status != 201){
                tipType.value = "error"
                tipContent.value = '未知错误，请联系开发人员' 
                showTip.value = true
                return
            }else{
                tipType.value = "success"
                tipContent.value = '注册成功，将在三秒后跳转至登陆页面' 
                showTip.value = true
                setTimeout(()=>{
                    router.push('/login')
                },3000)
            }
        })
    }
function gologin(){
    router.push('/login')
}
</script>

<style scoped>
    .title {
        font-size: 50px;
        margin-bottom: 40px;
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
        height: 100vh;
        background-color: bisque;
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
    }
    .loginBtn{
        margin-top: 10px;
        width: 240px;
    }
    .line {
        margin-top: 5px;
    }
    .line span {
        display: inline-block;
        width: 100px;
    }
    .backlogin {
        position: relative;
        left: -6px;
    }
</style>
