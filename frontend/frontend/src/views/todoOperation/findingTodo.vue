<template>
    <div>呈现在找的人</div>
    <choose-user v-model="memList" />
</template>

<script lang="ts" setup name="findingTodo">
    import chooseUser from '@/components/chooseUser.vue';
    import {ref,watch} from 'vue'
    import { use_todoStore } from '@/stores/todoStore';
    const todoStore = use_todoStore()
    const memList = ref()
    watch(memList,()=>{
        todoStore.findingUsersID = memList.value
    })
</script>

<style scoped></style>