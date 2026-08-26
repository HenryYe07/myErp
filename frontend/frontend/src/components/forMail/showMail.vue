<template>
    <div class="outer">

        <div class="title">{{ mailObj.title }}</div>

        <div class="infoOuter">

            <span>发件人: </span>
            <div class="sender">
                {{ mailObj.senderName }}
            </div>

            <div>主送: 
                <span class="mainBox">
                    <span v-for="(item, index) in mailObj.mainRcv" :key="index">
                        {{ item }}
                        <span v-if="index < mailObj.mainRcv.length - 1">、</span>
                    </span>
                </span>
            </div>
            
            <div>抄送:
                <span class="copyBox">
                    <span v-for="(item, index) in mailObj.copyRcv" :key="index">
                        {{ item }}
                        <span v-if="index < mailObj.copyRcv.length - 1">、</span>
                    </span>
                </span>
            </div>
            

            <div class="type">
                <span>类型: </span>
                {{ mailObj.type }}
            </div>

            <div class="time">
                <span>发送时间：</span>
                {{ mailObj.time }}
            </div>
        </div>

        <div class="bodyOuter">
            <div class="boxInner" v-html="mailObj.content"></div>
        </div>

    </div>
</template>

<script lang="ts" setup name="chatList">
    import { use_mailStore } from '@/stores/mailStore';
    import {ref} from 'vue'
    import { getUsername } from '@/modules/getUsernameById';
    const mailObj = ref({})
    
    
    const mailStore = use_mailStore()

    function getMailContent(){
        if(mailStore.mailID == ""){
            return
        }
        fetch(`/api/mail?mailID=${mailStore.mailID}`).then(res=>res.json()).then((res)=>{
            mailObj.value = res

            mailObj.value["mainRcv"] = []
            mailObj.value["copyRcv"] = []

            getUsername(res.senderUserID).then((res)=>{
                mailObj.value.senderName = res
            })
            for(const index in res.receivers){
                if(res.receivers[index].type == "main"){
                    getUsername(res.receivers[index].userID).then((res)=>{
                        mailObj.value.mainRcv.push( res )
                    })
                }else{
                    getUsername(res.receivers[index].userID).then((res)=>{
                        mailObj.value.copyRcv.push( res )
                    })
                }
            }
        })
    }
    import {watch} from 'vue'
    watch(()=>mailStore.mailID,async ()=>{
        getMailContent()

        
    })
</script>
    
<style lang="css" scoped>
.outer {
    display: block;
}
.title {
    font-size: 30px;
    text-align: center;
}
.infoOuter {
    border: solid rgba(255, 255, 255, 0.69) 0.4px;
    margin: 10px;
    padding: 10px;
}
.bodyOuter {
    margin: 10px;
    padding: 10px;
    border: solid rgba(255, 255, 255, 0.69) 0.4px;
    display: flex;

    
}
.boxInner {
    width: 1000px;
    height: 100px;
    border: 1px solid white;
    margin-left: auto;
    margin-right: auto;
}
.sender {
    display: inline-block;
}
</style>