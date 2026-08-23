<template>
    <div class="outer">
        <RouterLink to="/mainWorkPage/todo/newTodo">创建</RouterLink>
        <RouterLink to="/mainWorkPage/todo/invitationTodo">邀我</RouterLink>
        <RouterLink to="/mainWorkPage/todo/findingTodo">找人</RouterLink>
    </div>
</template>

<script lang="ts" setup name="calendar">
    import { useRouter } from 'vue-router';
    const router = useRouter()


</script>
    
<style scoped>
    .outer>* {
        width: 33.333%;
        text-align: center;
        padding: 5px;
        margin: 4px;

        background-color: rgba(3, 2, 2, 0.167);
        box-sizing: border-box;
        border: .5px rgba(255, 255, 255, 0.451) solid;
        border-bottom:2px rgba(255, 255, 255, 0.469) solid ;

        color: white;
        text-decoration: none;
    }
    .outer>*:hover {
        background-color: rgba(2, 1, 1, 0.297);
        cursor: pointer;
        border: .5px rgba(255, 255, 255, 0.737) solid;
        border-bottom:2px rgba(255, 255, 255, 0.737) solid ;
    }

    .outer .router-link-active {
        background-color: rgba(163, 163, 163, 0.297);
        border: .5px rgba(255, 255, 255, 0.737) solid;
        border-bottom:2px rgba(255, 255, 255, 0.737) solid ;
    }

</style>