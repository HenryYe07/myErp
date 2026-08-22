<template>
    <div class="outer">
        <div class="new" @click="newBtn">创建</div>
        <div class="inviteMe" @click="inviteMeBtn">邀我</div>
        <div class="findOth" @click="findOthBtn">找人</div>
    </div>
</template>

<script lang="ts" setup name="calendar">
    import { useRouter } from 'vue-router';
    const router = useRouter()

    function newBtn(){
        router.push("/mainWorkPage/todo/newTodo")
    }
    function inviteMeBtn(){
        router.push("/mainWorkPage/todo/invitationTodo")
    }
    function findOthBtn(){
        router.push("/mainWorkPage/todo/dayTodo")
    }

</script>
    
<style scoped>
    .outer>* {
        width: 33.333%;
        text-align: center;
        padding: 5px;
        margin: 4px;
        background-color: rgba(3, 2, 2, 0.167);
    }
    .outer>*:hover {
        background-color: rgba(2, 1, 1, 0.297);
        cursor: pointer;
    }
    .outer>*:active {
        background-color: rgba(243, 243, 243, 0.297);
        cursor: pointer;
    }

</style>