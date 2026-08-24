<template>
    <div class="outer">
        <div>选中的一天要做的</div>
        <div class="invBox" v-for="item in todayList" :key="item._id">
            
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
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="dayTodo">
    import { use_todoStore } from '@/stores/todoStore';
    const todoStore = use_todoStore()
    import { watch } from 'vue'
    import { ref } from 'vue';
    const todayList = ref([])
    function isSameDay(date1: Date, date2: Date) { // 是同一天返回true 不是返回false
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }
    import { getUsername } from '@/modules/getUsernameById'
    watch(()=>todoStore.selected_date,async()=>{
        todayList.value=[]
        for(const item of todoStore.showingTODOlist){
            if(isSameDay(new Date(item.startTime),new Date(todoStore.selected_date))){
                todayList.value.push(item)
                for(let index_mem in item.member){
                    item.member[index_mem].userName = await getUsername(item.member[index_mem].userID)
                }
            }
            
        }

        
    },{immediate:true})

    function removeTimezone(time: string) {
        return time.replace(/ GMT.*$/, "")
    }
    
</script>

<style scoped>

.outer{
        display: flex;
        align-items: center;
        flex-direction: column;
        height: calc(100vh - 40px - 50px);
        overflow: scroll;
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

        margin-top: 5px;
    }
    .invMember>*{
        display: inline-block;
        background-color: rgba(20, 19, 19, 0.265);
        padding: 2px 8px;
        margin-left: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

    }
</style>