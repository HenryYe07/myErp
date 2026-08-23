<template>
    <div>创建新的待办</div>
    <div class="todoTitleOuter">
        <div>待办事项标题</div>
        <el-input v-model="todoTitle" style="width: 240px" placeholder="请输入标题" />
    </div>

    <div class="chooseTime">
        <div>开始时间</div>
        <el-date-picker v-model="startTime" type="datetime" placeholder="Select date and time"/>
        <div>结束时间</div>
        <el-date-picker v-model="endTime" type="datetime" placeholder="Select date and time"/>
    </div>
    <div>选择参与的人</div>
    <choose-user v-model="memList"/>

    <el-button type="success" class="!ml-0 findBtn" plain @click="1">
            提交
    </el-button>


</template>

<script lang="ts" setup name="newTodo">
    import { ref, watch } from 'vue';

    const todoTitle = ref("")
    const startTime = ref()
    const endTime = ref()
    const memList = ref([])

    watch(memList,()=>{
        console.log(memList.value)
    },{deep:true})

    import chooseUser from '@/components/chooseUser.vue';
    


</script>

<style scoped>
.chooseTime>* {
    width: 70%;
    background-color: ;

    
}


</style>