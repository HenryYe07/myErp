<template>
    <!-- 显示审批的地方 -->
<div class="view-outer" v-if="is_show">
    <div class="title">{{ result.title }}</div>

    <!-- 步骤条 -->
    <div class="steps">
    <el-steps
    style="width: calc(100vw - 400px - 230px);"
    :align-center="true"
    :active="node_now"
    :finish-status="result.stpStatus"
    

    >
    <el-step v-for="(item,index) in result.timeline" :key="index" :title="item.nodeUsername" />


     </el-steps>
    </div>


  <el-dialog v-model="dialog_visible" :show-close="false" width="500">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">{{ tip_dialog }}</h4>
        <el-button type="primary" @click="close(); props.refresh_func()">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          好的
        </el-button>
      </div>
    </template>

  </el-dialog>



    <div class="content">
        <p v-for="(content, index) in result.content_sp" :key="index">{{ content }}</p>
    </div>

    <div class="operate">
        <el-button type="success" @click="accept">同意</el-button>
        <el-button type="danger" @click="reject">拒绝</el-button>
        <el-button type="warning" @click="recall">撤回</el-button>
    </div>


    <div class="commentOuter">

        <div class="a_box" v-for="item in all_comments" :key="item._id">
            <div class="info">
                <span class="cmt_user">{{ item.username }} <span>:</span></span>
                <span class="cmt_time">{{ item.time }}</span>
            </div>

            <div class="cmt_content">{{ item.content }}</div>
            <br>
        </div>


        <el-input class="cmtIpt" v-model="cmtContent" placeholder="说些什么呢" />

        <el-button type="primary" class="!ml-0 sendCmtBtn" plain @click="sendCmt">
                发表
        </el-button>




        </div>
    </div>




    <!-- 创建审批的地方 -->
<div class="view-outer createAp" v-if="!is_show">
    <div class="title">创建审批</div>

    <div class="createBox">
        <div class="titleTip">审批的标题：</div>
        <el-input class="titleIpt" v-model="crt_title" placeholder="关于xxx的xxx审批" />

        <div class="aboutMember">
            <div class="timelineMemList"></div>
            <div class="titleTip">流程：</div>
                <el-steps style="max-width: 100%" :active="0" align-center>
                    <el-step :title="myUsername.value" />
                    <el-step v-for="(item,index) in approvers" :key="index+1" :title="item.username" />
                </el-steps>
                <div class="flow-options">
                    <el-button type="danger" class="!ml-0 findBtn" plain @click="clear_all">
                        清空
                    </el-button>

                    <el-button type="warning" class="!ml-0 clear_last" plain @click="pop_one">
                        删除最后一个
                    </el-button>
                </div>

            <div class="titleTip">添加用户</div>
            <el-input class="findMemIpt" v-model="findingWords" placeholder="张三" />

            <el-button type="primary" class="!ml-0 findBtn" plain @click="findCard_vis = true;search()">
                查找
            </el-button>

            <div class="titleTip">正文：</div>
                <el-input v-model="mainContent" style="width: 100%" :rows="10" type="textarea"
                    placeholder="关于这次审批的具体说明..." />

                <el-dialog v-model="findCard_vis" title="选择要添加的人员" width="550" >
                    <el-table :data="foundUserData" @row-click="choseMem">
                        <el-table-column property="username" label="用户名" width="150" />
                        <el-table-column property="memID" label="工号" width="200" />
                        <el-table-column property="realName" label="姓名" width="200" />

                    </el-table>
                </el-dialog>

                <el-button type="success" class="!ml-0 submitBtn" plain @click="submit">
                        提交
                </el-button>


                <el-dialog v-model="submit_alert" :show-close="false" width="500">
                    <template #header="{ close, titleId, titleClass }">
                        <div class="my-header">
                            <h4 :id="titleId" :class="titleClass">{{submit_tip}}</h4>
                            <el-button type="primary" @click="close">
                                <el-icon class="el-icon--left">
                                    <CircleCloseFilled />
                                </el-icon>
                                知道了
                            </el-button>
                        </div>
                    </template>

                </el-dialog>


   
        </div>
    </div>
    
</div>



</template>

<script lang="ts" setup name="viewApproval">


    import { ref } from 'vue';
    const props = defineProps<{approvalID: string,refresh_func:Object,create_ref:number}>()
    const result = ref({
        title:'',
        
    })

    

    const is_show = ref(false)
    const node_now = ref(0)
    import { watch } from 'vue';

    //提示相关
    import { CircleCloseFilled } from '@element-plus/icons-vue'
    const dialog_visible = ref(false)
    const tip_dialog = ref("")
    const all_comments = ref([])
    
    async function rendApr(){node_now.value = 0
        is_show.value=true
        result.value = await fetch(`/api/approval?id=${props.approvalID}`).then((res)=>{return res.json()})
        
        // 给timeline里的人写上名字
        for(const i in result.value.timeline){
            result.value.timeline[i].nodeUsername = await fetch(`/api/tools/getUsername?id=${result.value.timeline[i].nodeUserID}`).then((res)=>{return res.text()})

            if(result.value.timeline[i].status != "waiting"){
                node_now.value+=1
            }
            
        }

        result.value.content_sp = result.value.content.split(/\n+/)
        console.log()

        // 把api的status翻译成elementPlus的
        switch(result.value.status){
            case "ongoing": result.value.stpStatus = "finish";break;
            case "recalled": result.value.stpStatus = "wait";break;
            case "rejected": result.value.stpStatus = "error";break;
            case "finished": result.value.stpStatus = "success";break;

        }

        // 获取这个审批的评论
        await fetch("/api/approval/commentOfApproval",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({approvalID:props.approvalID})
        }).then(res=>res.json()).then((res)=>{
            all_comments.value = res
        })
        // 给评论写上username
        for(const i in all_comments.value){
            console.log(all_comments.value[i].userID)
            const username = await fetch(`/api/tools/getUsername?id=${all_comments.value[i].userID}`).then(res=>res.text())
            all_comments.value[i].username = username
        }
        console.log(all_comments.value)}


    // 检测有没有审批被按下去
    watch(() =>props.approvalID,async()=>{
        rendApr()

    })

    function accept(){
        
        fetch("/api/approval/process",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                processID:props.approvalID,
                suggest:"accepted"
            })
        }).then((res)=>{
            if(res.status == 200){

                tip_dialog.value = "操作成功"
                dialog_visible.value = true
            }
            else{
                tip_dialog.value = "操作失败，目前不在您的流程"
                dialog_visible.value = true
            }
        })
    }


    function reject(){
        
        fetch("/api/approval/process",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                processID:props.approvalID,
                suggest:"rejected"
            })
        }).then((res)=>{
            if(res.status == 200){

                tip_dialog.value = "操作成功"
                dialog_visible.value = true
            }
            else{
                tip_dialog.value = "操作失败，目前不在您的流程"
                dialog_visible.value = true
            }
        })
    }

    function recall(){
        console.log(props.approvalID)
        fetch("/api/approval/recall",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                id:props.approvalID,
                
            })
            
        }).then((res)=>{
            if(res.status == 200){

                tip_dialog.value = "撤回成功"
                dialog_visible.value = true
            }
            else{
                tip_dialog.value = `操作失败，这不是您的审批或者审批已经有了结果${res.status}`
                dialog_visible.value = true
            }
        })
    }


    // 检测是否要呈现创建
    const findCard_vis = ref(false)
    watch(()=>props.create_ref,()=>{
        is_show.value = false
        console.log(props.create_ref)
    })
    const findingWords = ref("")
    const foundUserData = ref([])

    // 根据关键词获取可能的列表
    async function search(){
        await fetch(`/api/tools/getUserByAnyWord?find=${findingWords.value}`).then(res=>res.json()).then((res)=>{
            // 这里面的res是找到的
            foundUserData.value = res
        })
    }
    // #region 选择要添加的成员
    const approvers = ref([])
    function choseMem(row: any) {
        console.log(row)

        const index = approvers.value.findIndex((item: any) => item.memID === row.memID)

        if (index !== -1) {
        approvers.value.splice(index, 1)
        }

        approvers.value.push(row)
        console.log(approvers.value)
    }

    const crt_title = ref("")

    function clear_all(){
        approvers.value = []
    }
    function pop_one(){
        approvers.value.pop()
    }
    import { use_username } from '@/stores/username';
    const myUsername = use_username()
    

    // #endregion

    const mainContent = ref("")

    const submit_alert = ref(false)
    const submit_tip = ref("")
    async function submit(){
        const submitObj = {
            title:crt_title.value,
            approvers: approvers.value.map(item => item.memID),
            content:mainContent.value,
        }
        if(submitObj.title =="" || submitObj.content == "" || submitObj.approvers.length == 0){
            submit_alert.value = true;
            submit_tip.value = "请填写完整"
            return
        }

        fetch("/api/approval/new",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(submitObj)
        }).then(()=>{
            submit_alert.value = true;
            submit_tip.value = "提交成功"

            crt_title.value = ""
            approvers.value = []
            mainContent.value = ''
            findingWords.value =''
            props.refresh_func()



        })

        
    }

    const cmtContent = ref("")
    async function sendCmt(){
        if(cmtContent.value==""){
        return}
        await fetch("/api/approval/comment/",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content":cmtContent.value,
                'approvalID':props.approvalID
            })
        })
        cmtContent.value=""
        rendApr()
        
        
    
    }
</script>

<style scoped>
    .view-outer{
        background-color: rgba(0, 0, 0, 0.198);
        overflow-y: scroll;
        height: calc(100vh - 50px);
    }
    /* #region 预览区 */
    .title {
        margin: 0px 20px;
        font-size: 24px;
        background-color: rgba(0, 2, 2, 0.354);
        color: rgb(223, 223, 223);
        text-align: center;
        padding: 10px 0px;
        border-radius: 10px;
        margin-top: 5px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        
    }
    .steps{
        margin: 20px 0px;
    }

    .content {
        margin: 0px max(3vw,10px);
        color: whitesmoke;
        white-space: pre-line;
        text-indent: 2em;
        box-shadow: 5px 5px 10px rgba(123, 123, 123, 0.214);
        border-radius: 20px;
        padding: 30px;
        background-color: rgba(3, 2, 0, 0.724);
    }
    .content p {
        margin: 0 0 1em 0;
        text-indent: 2em;
    }   
    .operate{
        width: calc(100vw - 400px - 230px);
        text-align: right;
        margin-top: 60px;
        margin-bottom: 40px;
        position: relative;
        right: max(10vw,10px);
    }
    /* #endregion */

    /* 这是那个提示的样式 */
    .my-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px;
    }

    /* #region 创建区 */
    .createAp .titleIpt {
        width: 100%;
        
    }
    .createAp .titleTip {
        margin: 10px;
        
    }
    .createAp .createBox {
        margin: 10px max(3vw,10px);
        color: whitesmoke;
        box-shadow: 5px 5px 10px rgba(137, 137, 137, 0.317);
        border-radius: 20px;
        padding: 30px;
        background-color: rgba(3, 2, 0, 0.553);
    }
    .createAp .findMemIpt {
        width: 80%;
        
    }
    .createAp .findBtn {
        width: 15%;

        margin: 0;
        float: right
        
    }
    .createAp .clear_last{
        width: 120px;
    }
    .createAp .flow-options {
        display: flex;
        justify-content: flex-end;
        margin-top:20px;
    }
    
    .createAp .submitBtn {
        margin-top: 30px;
        width: 100%;
    }
    
    /* #endregion */
    
    /* #region 评论区 */
    .commentOuter {
        margin: 0px max(3vw,10px);
        color: whitesmoke;
        border-radius: 20px;
        padding: 40px;



    }

    .commentOuter .a_box{
        background-color: rgba(23, 23, 23, 0.463);
        margin: 10px;
        padding: 20px;
        border: rgba(255, 255, 255, 0.411) solid 0.5px;
        border-bottom:rgba(255, 255, 255, 0.58) solid 3px ;
        transition: 0.2s;


    }

    .commentOuter .a_box:hover{
        border: rgba(255, 255, 255, 0.637) solid 0.5px;
        border-bottom:rgb(255, 255, 255) solid 3px ;
        background-color: rgba(0, 0, 0, 0.57);
    }

    .commentOuter .cmt_user{
        margin-right:20px;
        font-size: 20px;
    }
    .commentOuter .cmt_time{
        font-size: small;
        color: rgb(225, 225, 225);
    }
    .commentOuter .sendCmtBtn{
        width: 100%;
        margin-top: 10px;
    }
    .commentOuter .info {
        border-bottom: solid rgba(255, 255, 255, 0.453) 1px;
        padding-bottom: 5px;
    }

    .commentOuter .cmt_content{
        margin-top: 5px;
    }


    /* #endregion */
</style>
