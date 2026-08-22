<template>
    <div class="chooseOuter">
        <div class="tip">请选择要呈现的</div>
        <el-checkbox-group class="optionGroup" v-model="choosedList">
            <el-checkbox label="我要做的" value="myTodo" />
            <el-checkbox label="等我确认的" value="waitingCfm" />
            <el-checkbox label="所有和我有关的" value="allAboutMe" />
            <el-checkbox label="正在查找的人的" value="findingOthers" />

        </el-checkbox-group>
    </div>

</template>

<script lang="ts" setup name="choose_visual">
    import {useRouter} from 'vue-router'
    const router = useRouter()
    router.push("/mainWorkPage/todo/newTodo")

    import {ref} from 'vue'
    const choosedList = ref([])


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
        background-color: rgba(24, 24, 24, 0.285);
        padding: 0px 5px;
        margin-top: 5px;
        box-sizing: border-box;
        width: 100%;
        color: white;
    }

</style>