<template>
    <div class="outer">
        <div class="left">
            <div class="filter1">
                <div @click="myCreate()">我发起的</div>
                <div @click="waitingMe()">等我操作</div>
                <div @click="aboutMe()">与我有关</div>
            </div>
            <div class="filter2">
                <div @click="flt_all()">全部</div>
                <div @click="flt_ongoing()">进行中</div>
                <div @click="flt_finished()">已完成</div>
                <div @click="flt_rejected()">已拒绝</div>
            </div>
            <div class="approvalPreview">
                <div  v-for="item in approvalList" :key="item._id" @click="approvalDetail(item._id)">
                    <div class="a_approval" v-if="item.isShow">
                        <div class="title">{{item.title}}</div>
                        <hr>
                        <div class="contentPreview">{{item.content}}</div>
                        <div class="users">
                            <span  v-for="(timenode, index) in item.timeline" :key="index">{{ timenode.username }}</span>
                        </div>
                        <div class="status">{{item.status_CN}}</div>
                    </div>
                </div>
            </div>


            <div class="func">
                <div @click="refresh_btn">刷新</div>
                <div @click="create">创建</div>
            </div>

        </div>



        <div class="right">
            <viewApproval :approvalID="readingApproval" :refresh_func="refresh_btn" :create_ref="create_ref" />
        </div>

    </div>
</template>
<script lang="ts" setup name="approvalPage">
/* eslint-disable @typescript-eslint/no-explicit-any */

const readingApproval = ref("")
import viewApproval from "@/components/viewApproval.vue"
import { ref } from 'vue';
    let stopWatch = function(){}
    const approvalList:any = ref([])
    const filter_status = ref("all")
    import { onMounted } from 'vue'



    onMounted(() => {
        myCreate()
    })

    function unSelected_flt2(){
        const filter2_obj = document.querySelectorAll(".filter2>*")
        for(const i of filter2_obj){
            i.classList.remove("flt2_selected")
        }
    }

    function unSelected_flt1(){
        const filter1_obj = document.querySelectorAll(".filter1>*")
        for(const i of filter1_obj){
            i.classList.remove("flt1_selected")
        }
    }

    // #region 四个filter
    function flt_all(){
        unSelected_flt2()
        const element = document.querySelector(".filter2>*:nth-child(1)")
        element.classList.add("flt2_selected")
        filter_status.value = "all"
        now_flt2.value="all"

    }
    function flt_finished(){
        unSelected_flt2()
        const element = document.querySelector(".filter2>*:nth-child(3)")
        element.classList.add("flt2_selected")
        filter_status.value = "finished"
        now_flt2.value="finished"
    }
    function flt_ongoing(){
        unSelected_flt2()
        const element = document.querySelector(".filter2>*:nth-child(2)")
        element.classList.add("flt2_selected")
        filter_status.value = "ongoing"
        now_flt2.value="ongoing"
    }
    function flt_rejected(){
        unSelected_flt2()
        const element = document.querySelector(".filter2>*:nth-child(4)")
        element.classList.add("flt2_selected")
        filter_status.value = "rejected"
        now_flt2.value="rejected"
    }
    // #endregion

import { watch } from 'vue'
    // #region 我创建的
    async function myCreate(){
        now_flt1.value = "myCreate"
        unSelected_flt1()
        unSelected_flt2()

        const element1 = document.querySelector(".filter1 :nth-child(1)")
        element1.classList.add("flt1_selected")

        const approvalList_ori = await fetch("/api/approval/myApprovals").then((data)=>{return data.json()})
        approvalList.value = [...approvalList_ori]
        approvalList.value.reverse()

        // 默认选中全部
        flt_all()
        
        stopWatch()
        for(const indexAp in approvalList.value){
            stopWatch = watch(filter_status,()=>{
                if(filter_status.value == "all"){
                approvalList.value[indexAp].isShow=true
                }else if(filter_status.value == "ongoing"){
                if(approvalList.value[indexAp].status == "ongoing"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
                }else if(filter_status.value == "finished"){
                if(approvalList.value[indexAp].status == "finished"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
                }else if(filter_status.value == "rejected"){
                if(approvalList.value[indexAp].status == "rejected"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
            }
            },{ immediate: true })
            
            switch(approvalList.value[indexAp].status){
                case "ongoing": approvalList.value[indexAp].status_CN="进行中";break;
                case "finished": approvalList.value[indexAp].status_CN="已结束";break;
                case "rejected": approvalList.value[indexAp].status_CN="已拒绝";break;
                case "recalled": approvalList.value[indexAp].status_CN="已撤回";break;
            }
            for(const indexTimeline in approvalList.value[indexAp].timeline){
                approvalList.value[indexAp].timeline[indexTimeline].username = await fetch(`/api/tools/getUsername?id=${approvalList.value[indexAp].timeline[indexTimeline].nodeUserID}`).then((res)=>{return res.text()})
            }
        }   
    }
    // #endregion

    // #region 等我操作
    async function waitingMe(){
        now_flt1.value="waitingMe"
        unSelected_flt1()
        unSelected_flt2()

        const element1 = document.querySelector(".filter1 :nth-child(2)")
        element1.classList.add("flt1_selected")

        const approvalList_ori = await fetch("/api/approval/waitingMe").then((data)=>{return data.json()})
        approvalList.value = [...approvalList_ori]
        approvalList.value.reverse()

        // 默认选中全部
        
        flt_all()
        
        stopWatch()
        for(const indexAp in approvalList.value){
            stopWatch = watch(filter_status,()=>{
                if(filter_status.value == "all"){
                approvalList.value[indexAp].isShow=true
                }else if(filter_status.value == "ongoing"){
                if(approvalList.value[indexAp].status == "ongoing"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
                }else if(filter_status.value == "finished"){
                if(approvalList.value[indexAp].status == "finished"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
                }else if(filter_status.value == "rejected"){
                if(approvalList.value[indexAp].status == "rejected"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
            }
            },{ immediate: true })
            
            switch(approvalList.value[indexAp].status){
                case "ongoing": approvalList.value[indexAp].status_CN="进行中";break;
                case "finished": approvalList.value[indexAp].status_CN="已结束";break;
                case "rejected": approvalList.value[indexAp].status_CN="已拒绝";break;
                case "recalled": approvalList.value[indexAp].status_CN="已撤回";break;
            }
            for(const indexTimeline in approvalList.value[indexAp].timeline){
                approvalList.value[indexAp].timeline[indexTimeline].username = await fetch(`/api/tools/getUsername?id=${approvalList.value[indexAp].timeline[indexTimeline].nodeUserID}`).then((res)=>{return res.text()})
            }
        }   
    }
    // #endregion

    // #region 与我有关
    async function aboutMe(){
        now_flt1.value="aboutMe"
        unSelected_flt1()
        unSelected_flt2()

        const element1 =  document.querySelector(".filter1 :nth-child(3)")
        element1.classList.add("flt1_selected")
        const approvalList_ori = await fetch("/api/approval/throughApproval").then((data)=>{return data.json()})
        
        approvalList.value = [...approvalList_ori]
        approvalList.value.reverse()

        // 默认选中全部
        flt_all()
        
        stopWatch()
        for(const indexAp in approvalList.value){
            stopWatch = watch(filter_status,()=>{
                if(filter_status.value == "all"){
                approvalList.value[indexAp].isShow=true
                }else if(filter_status.value == "ongoing"){
                if(approvalList.value[indexAp].status == "ongoing"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
                }else if(filter_status.value == "finished"){
                if(approvalList.value[indexAp].status == "finished"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
                }else if(filter_status.value == "rejected"){
                if(approvalList.value[indexAp].status == "rejected"){approvalList.value[indexAp].isShow=true}
                else{approvalList.value[indexAp].isShow=false}
            }
            },{ immediate: true })
            
            switch(approvalList.value[indexAp].status){
                case "ongoing": approvalList.value[indexAp].status_CN="进行中";break;
                case "finished": approvalList.value[indexAp].status_CN="已结束";break;
                case "rejected": approvalList.value[indexAp].status_CN="已拒绝";break;
                case "recalled": approvalList.value[indexAp].status_CN="已撤回";break;
            }
            for(const indexTimeline in approvalList.value[indexAp].timeline){
                approvalList.value[indexAp].timeline[indexTimeline].username = await fetch(`/api/tools/getUsername?id=${approvalList.value[indexAp].timeline[indexTimeline].nodeUserID}`).then((res)=>{return res.text()})
            }
        }   
    }
    // #endregion
    
    // #region 打开内容
    function approvalDetail(approvalID:string){
        readingApproval.value = approvalID

    }
    // #endregion

    // #region 刷新功能
    const now_flt1=ref("")// myCreate waitingMe aboutMe
    const now_flt2=ref("") // all finished ongoing rejected
    
    async function refresh_btn(){
        const before_flt1_change_nowFlt2 = now_flt2.value
        
        switch(now_flt1.value){
            case "myCreate": await myCreate();break;
            case "waitingMe": await waitingMe();break;
            case "aboutMe": await aboutMe();break;
        }


        switch(before_flt1_change_nowFlt2){
            case "all":  flt_all();break;
            case "finished": flt_finished();break;
            case "ongoing": flt_ongoing();break;
            case "rejected": flt_rejected();break;
        }
    }
    // #endregion

    // #region 创建按钮
    const create_ref = ref(0)
    function create(){
        create_ref.value+=1
        readingApproval.value = ""
    }
    // #endregion
</script>
<style scoped>
    .outer{
        display: flex;
        color:white
    }
    .outer>*{
        height: calc(100vh - 50px);
    }
    .left{
        background-color:rgba(1, 6, 6, 0.269);
        width: 400px;
        
    }
    .right{

        width: calc(100vw - 400px - 230px);
    }

    .left>.filter1{
        display: flex;
        width: 400px;
        color:whitesmoke
    }
    .left>.filter1>div{
        width: 100px;
        margin: auto;
        padding: 7px;
        margin-bottom: 10px;
        text-align: center;
        background-color: rgba(2, 2, 3, 0.311);
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        margin-top:5px ;

    }


    .left>.filter2{
        display: flex;
        width: 400px;
        color: white;

    }
    .left>.filter2>div{

        width: 60px;
        margin: auto;
        margin-top: 5px;
        margin-bottom: 5px;
        padding: 2px 7px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.134);
        


    }

    .approvalPreview{
        height: calc(100vh - 50px - 40px - 40px - 10px - 40px);
        overflow-y: scroll;
        color:whitesmoke
    }

    /* 列表里每个盒子的样式 */
    .approvalPreview .a_approval{
        width: 380px;
        margin: 10px;
        height: auto;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.366);
        box-shadow: 2px 2px 10px rgba(234, 231, 231, 0.359);
        padding: 20px;
        border-radius: 20px;
        transition: 0.1s;
        
    }

    .approvalPreview .a_approval:hover{
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
    }
            
    .approvalPreview .a_approval .title {
        font-size: 18px;
        font-weight: bold;
    }
    .approvalPreview .a_approval .contentPreview{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

    overflow: hidden;
    }
    .approvalPreview .a_approval .users span{
        display: inline-block;
        border: 0.5px solid gray;
        box-shadow: 0 4px 5px rgba(246, 246, 246, 0.2);
        border-radius: 10px;
        padding: 1px 5px;
        margin: 5px 8px;
    }

    .flt2_selected{
        background-color: rgba(173, 172, 172, 0.432) !important;
    }

    .flt1_selected{
        background-color: rgba(173, 172, 172, 0.433) !important;
    }
    
    .func{
        height: 40px;

        display: flex;
    }
    .func>div{
        height: 40px;
        background-color: rgba(148, 148, 148, 0.12);
        text-align: center;

        width: 200px;
        box-sizing: border-box;
        border: 2px solid rgba(255, 255, 255, 0.274);
        line-height: 30px;
        border-bottom: 5px solid rgba(235, 232, 232, 0.595);
    }
    .func>div:hover{
        background-color: rgba(148, 148, 148, 0.46);
    }
    .func>div:active{
        background-color: rgba(10, 7, 7, 0.46);
    }
</style>