<template>
    <div class="outer">
        <div class="left"><mailList /></div>
        <div class="right" v-if="mailStore.mailID !='' "><showMail /></div>
        <div class = "right" v-if="mailStore.mailID =='' " ><sendMail /></div>

    </div>

</template>
<script lang="ts" setup name="messagePage">
    import mailList from '@/components/forMail/mailList.vue';
    import showMail from '@/components/forMail/showMail.vue';
    import {use_mailStore} from "@/stores/mailStore.ts";
    const mailStore = use_mailStore();
    import sendMail from '@/components/forMail/sendMail.vue'
</script>
<style scoped>
    .outer{

    }
    .left {
        width: 350px;
        background-color: rgba(0, 0, 0, 0.32);
        height: calc(100vh - 50px);
        float:left;
    }
    .right {
        width: calc(100vw - 350px - 230px);
        height: calc(100vh - 50px);
        float:right
    }
</style>
