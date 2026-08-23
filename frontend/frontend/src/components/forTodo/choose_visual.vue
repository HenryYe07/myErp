<template>
    <div class="chooseOuter">
        <div class="tip">请选择要呈现的</div>
        <el-checkbox-group class="optionGroup" v-model="choosedList" @change="changeCnt">
            <el-checkbox v-for="(item,index) in show_options" :key="index" :label="item.tip" :value="item.value" />

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

    // 要呈现的选项

    // 默认
    // 颜色:todoColor-green
    const show_options_default = [
        {
            tip:"我要做的",
            value:"myTodo",
            color_class:"todoColor-green",
            is_choosed:false
        },
        {
            tip:"等我确认的",
            value:"waitingCfm",
            color_class:"todoColor-blue",
            is_choosed:false
        },
        {
            tip:"我已经拒绝的",
            value:"iRejected",
            color_clas:"todoColor-red",
            is_choosed:false
        },
        {
            tip:"要别人做的(不含自己做的)",
            value:"callOther",
            color_class:"todoColor-yellow",
            is_choosed:false
        },
        {
            tip:"正在查找的人的",
            value:"finding",
            color_class:"todoColor-yellow",
            is_choosed:false
        },
    ]
    const show_options = ref<Array<Object>>([])
    show_options.value = JSON.parse(localStorage.getItem("show_options") || JSON.stringify(show_options_default))


    // 读取cnt里的value
    function changeCnt(){
        console.log(choosedList.value)
        todoStore.showingTODOlist = []

        for(const item of choosedList.value){

            // 我要做的（已经确认了的）
            if(item == "myTodo"){
                fetch("/api/todo/confirm").then(res => res.json()).then((res:Array<Object>)=>{
                    res.forEach((item)=>{
                        item["type"] = "myTodo"
                    })
                    todoStore.appendTODOlist(res)
                })
            }

            // 等我确认的
            if(item == "waitingCfm"){
                fetch("/api/todo/waiting").then(res => res.json()).then((res:Array<Object>)=>{
                    res.forEach((item)=>{
                        item["type"] = "waitingCfm"
                    })
                    todoStore.appendTODOlist(res)

                })
            }

            // 我要别人做的
            if(item == "callOther"){
                fetch("/api/todo/callOther").then(res => res.json()).then((res:Array<Object>)=>{
                    res.forEach((item)=>{
                        item["type"] = "callOther"
                    })
                    todoStore.appendTODOlist(res)

                })
            }

            // 我已经拒绝的
            if(item == "iRejected"){
                fetch("/api/todo/iRejected").then(res => res.json()).then((res:Array<Object>)=>{
                    res.forEach((item)=>{
                        item["type"] = "iRejected"
                    })
                    todoStore.appendTODOlist(res)

                })
            }

            if(item == "finding"){ // 注意这个后续要用pinia传进来在找的人的id
                fetch(`/api/todo/others?id=${todoStore.findingUserID}`).then(res => res.json()).then((res:Array<Object>)=>{
                    res.forEach((item)=>{
                        item["type"] = "finding"
                    })
                    todoStore.appendTODOlist(res)

                })
            }
        }
    }

    function saveOption(){
        localStorage.setItem("show_options",JSON.stringify(show_options.value))
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