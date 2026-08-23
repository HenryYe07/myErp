<template>
    <div class="outer">
        <div class="title">创建新的待办</div>
        <div class="todoTitleOuter">
            <div>待办事项标题</div>
            <el-input v-model="todoTitle" style="width: 240px" placeholder="请输入标题" />
        </div>

        <div class="chooseTime">
            <div>开始时间</div>
            <el-date-picker v-model="startTime" type="datetime" placeholder="" />
            <div>结束时间</div>
            <el-date-picker v-model="endTime" type="datetime" placeholder="" />
        </div>
        <div>选择参与的人</div>
        <choose-user v-model="memList" />

        <el-button type="success" class="!ml-0 submit" plain @click="submit">
            提交
        </el-button>

        <el-alert :title="alert_content" :type="alert_type" v-if="alert_isShow" />

    </div>
</template>

<script lang="ts" setup name="newTodo">
    import { ref, watch } from 'vue';
    import {postJSON} from '@/modules/fetch'
    const todoTitle = ref("")
    const startTime = ref()
    const endTime = ref()
    const memList = ref([])

    import { use_todoStore } from '@/stores/todoStore';
    const todoStore = use_todoStore()
    watch(memList,()=>{
        console.log(memList.value)
    },{deep:true})

    import chooseUser from '@/components/chooseUser.vue';

    // 提交
    function submit(){
        const submitObj = {
            content: todoTitle.value,
            startTime: String(startTime.value),
            endTime: String(endTime.value),
            memList:memList.value.map(item => item._id)
        }

        // 检测一些问题阻止提交
        // 阻止不完整的
        if( submitObj.content=="" || submitObj.startTime=="" || submitObj.endTime=="" || submitObj.memList.length==0 ){
            alert("warning","填写不完整")
            return
        }
        if (startTime.value > endTime.value) {
            alert("warning", "开始时间不能晚于结束时间")
            return
        }
        postJSON("/api/todo/",submitObj).then((res)=>{
            if(res.status == 200){
                alert("success","创建成功")
                todoStore.refresh()
                
            }else{
                alert("warning","创建失败，服务器通信问题")
            }
            
        })

    }

    // 提示相关
    const alert_isShow = ref(false)
    const alert_type = ref("")
    const alert_content = ref("")
    function alert(type:string,content:string){
        alert_isShow.value=true
        alert_type.value = type
        alert_content.value = content
    }
    


</script>

<style scoped>
.outer {
    display: flex;
    align-items: center;
    flex-direction: column;
}
.outer>* {
    margin: 5px;
}
.chooseTime>* {
    width: 240px;


}

:deep(.el-input__wrapper) {
    background-color: #10101078;
    border: 1px rgba(255, 255, 255, 0.615) solid;
}

.submit {
    width: 70%;
    margin-top: 40px;
}



</style>