<template>

<div class="filter-outer">
        <!-- 选 收件箱还是已发送 -->
        <el-select v-model="box" placeholder="Select" style="width: 90px" @change="getList" >
            <el-option v-for="item in options_box" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <div class="opt-snt" v-if="box!='snt'">
            <!-- 选 主送还是抄送 -->
            <el-select v-model="roll" placeholder="Select" style="width: 80px" @change="getList">
                <el-option v-for="item in options_roll" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

            <!-- 选 已读未读 -->
            <el-select v-model="isread" placeholder="Select" style="width: 80px" @change="getList">
                <el-option v-for="item in options_isread" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>


        </div>

        <!-- 选类型 -->
        <el-select v-model="type" placeholder="Select" style="width: 80px" @change="getList">
            <el-option v-for="item in options_type" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        

</div>

    <div class="listOuter">
        <div class="a-mailBox" v-for="item in showingMailList" :key="item._id" @click="showBtn(item._id)">
            <div class="info">
                <div :class="item.is_read ? 'is-read' : 'unread'">
                    {{ item.I_isRead ? '已读' : '未读' }}
                </div>

                <div class="type">
                    {{ item.type === 'notice' ? '通知' :
                        item.type === 'discuss' ? '讨论' :
                            item.type === 'asking' ? '询问' : '未知' }}
                </div>

                <div class="sender">
                    <span>发件人：</span>
                    {{ item.senderUserName }}
                </div>
            </div>

            <div class="title">
                {{ item.title }}
            </div>
        </div>
    </div>

<div class="new_outer">
    <div class="newBtn" @click="sendMail">发邮件</div>
</div>
    

</template>

<script lang="ts" setup name="chatList">

    import { ref } from 'vue'

    // 选 收件箱还是已发送
    const box = ref('')

    const options_box = [
        {
            value: 'rcv',
            label: '收件箱',
        },
        {
            value: 'snt',
            label: '已发送',
        },
    ]

    // 选 roll
    const roll = ref('')

    const options_roll = [
        {
            value: 'main',
            label: '主送',
        },
        {
            value: 'copy',
            label: '抄送',
        },
        {
            value: 'all',
            label: '全部',
        },
    ]

    // 已读未读
    const isread = ref('')

    const options_isread = [
        {
            value: "true",
            label: '已读',
        },
        {
            value: "false",
            label: '未读',
        },
        {
            value: 'all',
            label: '全部',
        },
    ]

    // 选择类型   notice discuss asking uncertain
    const type = ref('')

    const options_type = [
        {
            value: "all",
            label: '全部',
        },
        {
            value: "notice",
            label: '通知',
        },
        {
            value: "discuss",
            label: '讨论',
        },
        {
            value: 'asking',
            label: '询问',
        },
        {
            value: 'uncertain',
            label: '未知',
        },
    ]

    // 设置默认
    import { onMounted } from 'vue'
    onMounted(()=>{
        box.value = 'rcv',
        roll.value = 'all',
        type.value = 'all',
        isread.value = 'false'
        getList()
    })
    import {getUsername} from "../../modules/getUsernameById"
    async function getList() {
        const params = new URLSearchParams()

        // 发件箱 / 收件箱
        params.set('box', box.value)

        // 收件箱才需要 roll 和 isread
        if (box.value !== 'snt') {
            params.set('roll', roll.value)
            params.set('isread', String(isread.value))
        }

        // type=all 时也传给后端
        params.set('type', type.value)

        const response = await fetch(`/api/mail/list?${params.toString()}`, {
            method: 'GET',
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error(`获取邮件列表失败：${response.status}`)
        }

        const data = await response.json()
        // 把发件人的ID转换成名字
        for(const index in data){
            data[index].senderUserName = await getUsername(data[index].senderUserID)
        }

        
        showingMailList.value = data


    }

    const showingMailList = ref({})

    import { watch } from 'vue'
    watch(showingMailList,()=>{
        console.log(showingMailList.value)
    })

    import { use_mailStore } from '@/stores/mailStore'
    const mailStore = use_mailStore()

    function showBtn(id:String){
        mailStore.mailID = id
    }

    import { onUnmounted } from 'vue'
    onUnmounted(()=>{
        mailStore.mailID = ""
    })

    function sendMail(){
        mailStore.mailID = ""
    }

    

</script>

<style lang="css" scoped>
    .a-mailBox {
        background-color: rgba(255, 255, 255, 0.139);
        padding: 20px;
        margin-bottom:5px ;
        cursor: pointer;
        
    }
    .a-mailBox .info {
        display: flex;
    }
    .a-mailBox>.info>div {
        margin: 2px;
        font-size: 16px;
        line-height: 100%;
        padding: 2px 10px;
        height: 17px;
    }
 
    .a-mailBox>.info>.read {
        background-color: rgba(255, 255, 255, 0.07);
        border: 2px solid rgba(255, 255, 255, 0.679);

    }
    .a-mailBox>.info>.type {
        background-color: rgba(255, 255, 255, 0.07);
        border: 2px solid rgba(255, 255, 255, 0.679);
    }
    .a-mailBox>.info>.sender {
        background-color: rgba(255, 255, 255, 0.07);
        border: 2px solid rgba(255, 255, 255, 0.679);
    }
    .a-mailBox>.info>.is-read{
        background-color: rgba(132, 42, 42, 0.07);
        border: 2px solid rgba(255, 255, 255, 0.679);
    }
    .a-mailBox>.info>.unread{
        background-color: rgba(46, 7, 240, 0.727);
        border: 2px solid rgba(255, 255, 255, 0.679);
    }

    .a-mailBox > .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    

    .opt-snt{
        display: inline-block;
    }

    .new_outer{
        position: fixed;
        bottom: 10px;


    }
    .newBtn {
        background-color: rgba(240, 248, 255, 0.092);
        border: 0.3px solid white;
        padding: 5px ;
        box-sizing: border-box;
        width: 330px;
        margin-left: 10px;
        text-align: center;   
        cursor: pointer;
    }
    .newBtn:hover{
        background-color: rgba(240, 248, 255, 0.181)
    }
    .newBtn:active{
        background-color: rgba(0, 2, 3, 0.303)
    }
</style>