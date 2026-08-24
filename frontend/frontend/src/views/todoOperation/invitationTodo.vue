<template>
    <div class="outer">

        <div class="invBox" v-for="item in invList" :key="item._id">
            <div class="invTitle">{{item.content}}</div>
            <div class="invCreater">{{item.creatorName}}</div>
            <div class="invDur">
                <span>从：</span>
                <span>{{removeTimezone(item.startTime)}}</span>
            </div>
            <div class="invDur">
                <span>到：</span>
                <span>{{removeTimezone(item.endTime)}}</span>
                
            </div>
            <div class="invMember">
                <span v-for="(memb,index) in item.member" :key="index">{{memb.userName}}</span>
            </div>
            <div class="operate">
                <el-button type="success" plain round @click="processInv(item._id,'accept')">接受</el-button>
                <el-button type="danger" plain round @click="processInv(item._id,'reject')">拒绝</el-button>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup name="invitationTodo">
    import {ref} from 'vue'
    const invList = ref([])
    import { getUsername } from '@/modules/getUsernameById'

    
    let refresh_inv = async()=>{
        const result = await fetch("/api/todo/waiting").then(res => res.json())
        // 如果不一样，把新的结果替换上去，免得老跳
        if(JSON.stringify(invList.value) != JSON.stringify(result)){
            for(let index in result){
                result[index].creatorName = await getUsername(result[index].creatorID)
                
                for(let index_mem in result[index].member){
                    result[index].member[index_mem].userName = await getUsername(result[index].member[index_mem].userID)
                }
            }
            invList.value = result

        }

    }

    import { onMounted } from 'vue'
    onMounted(()=>{
        refresh_inv()
    })

    setInterval(refresh_inv,2000)

    function removeTimezone(time: string) {
        return time.replace(/ GMT.*$/, "")
    }

    import {postJSON} from '../../modules/fetch'
    function processInv(id:string,atti:string){
        postJSON('/api/todo/attitude',{
            todoID:id,
            attitude:atti
        })
    }

    
</script>
    
<style scoped>
    .outer{
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .invBox{
        width: 80%;
        background-color: rgba(0, 0, 0, 0.218);
        padding: 20px;
        margin-top: 10px;
        border-radius: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .invTitle {
        border-bottom: 1px white solid;
    }
    .invDur{
        font-size: 12px;
    }
    .invMember{
        display: flex;
        margin-top: 5px;
    }
    .invMember>*{
        display: inline-block;
        background-color: rgba(20, 19, 19, 0.265);
        padding: 2px 8px;
        margin-left: 3px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        flex-direction: column-reverse;
    }
    .operate {
        float:right
    }

    
</style>