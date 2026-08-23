<template>
    <div class="chooseOuter">
        <div class="tip">请选择要呈现的</div>
        <el-checkbox-group class="optionGroup" v-model="choosedList" @change="changeCnt">
            <el-checkbox label="我要做的" value="myTodo" />
            <el-checkbox label="等我确认的" value="waitingCfm" />
            <el-checkbox label="我已经拒绝的" value="iRejected" />
            <el-checkbox label="正在查找的人的" value="finding" />

        </el-checkbox-group>
    </div>

</template>

<script lang="ts" setup name="choose_visual">
    import {useRouter} from 'vue-router'
    const router = useRouter()
    router.push("/mainWorkPage/todo/newTodo")

    import {ref} from 'vue'
    const choosedList = ref([])

    // 把todoStore弄来
    import { use_todoStore } from '@/stores/todoStore'
    const todoStore = use_todoStore()


    // 读取cnt里的value
    function changeCnt(){
        todoStore.showingTODOlist = []
        for(const item of choosedList.value){

            // 我要做的（已经确认了的）
            if(item == "myTodo"){
                fetch("/api/todo/confirm").then(res => res.json()).then((res:Array<Object>)=>{
                    todoStore.appendTODOlist(res)
                })
            }

            // 等我确认的
            if(item == "waitingCfm"){
                fetch("/api/todo/waiting").then(res => res.json()).then((res:Array<Object>)=>{
                    todoStore.appendTODOlist(res)

                })
            }

            // 我已经拒绝的
            if(item == "iRejected"){
                fetch("/api/todo/iRejected").then(res => res.json()).then((res:Array<Object>)=>{
                    todoStore.appendTODOlist(res)

                })
            }

            if(item == "finding"){ // 注意这个后续要用pinia传进来在找的人的id
                fetch(`/api/todo/others?id=${todoStore.findingUserID}`).then(res => res.json()).then((res:Array<Object>)=>{
                    todoStore.appendTODOlist(res)

                })
            }


        }
        
    }


</script>

<style scoped>
    .tip{
        margin-left: 5px;
        font-size: 18px;
    }
    .chooseOuter{
        box-sizing: border-box;
   
        width: 200px;
    }
    .chooseOuter .optionGroup>*{
        background-color: rgba(0, 0, 0, 0.251);
        padding: 0px 5px;
        margin-top: 5px;
        box-sizing: border-box;
        width: 100%;
        color: white;
    }
    .chooseOuter .optionGroup>*:hover{
        background-color: rgba(22, 22, 22, 0.472);
    }

    .chooseOuter .optionGroup>*:active{
        background-color: rgba(249, 249, 249, 0.175);
    }

</style>