<template>

    <div class="outer">
        
        <div class="addedMember">
            <span class="member" v-for="(item, index) in approvers" :key="index" @click="removeMem(item)">{{ item.username }}</span>
        </div>

        <el-input class="findMemIpt" v-model="findingWords" placeholder="张三" />

        <el-button type="primary" class="!ml-0 findBtn" plain @click="findCard_vis = true; search()">
            查找
        </el-button>

        <el-dialog v-model="findCard_vis" title="选择要添加的人员" width="550">
            <el-table :data="foundUserData" @row-click="choseMem">
                <el-table-column property="username" label="用户名" width="150" />
                <el-table-column property="memID" label="工号" width="200" />
                <el-table-column property="realName" label="姓名" width="200" />
            </el-table>
        </el-dialog>
    </div>

</template>

<script lang="ts" setup name="chooseUser">
    import { ref } from 'vue'

    const approvers = ref([])
    const findingWords = ref("")
    const foundUserData = ref("")  
    const findCard_vis = ref(false)

    const memList = defineModel()
    import { watch } from 'vue'
    watch(approvers,()=>{
        memList.value = approvers.value
    },{deep:true})
    function choseMem(row: any){


        const index = approvers.value.findIndex((item: any) => item.memID === row.memID)

        if (index !== -1) {
        approvers.value.splice(index, 1)
        }

        approvers.value.push(row)

    }

    function clear_all(){
        approvers.value = []
    }

    function pop_one(){
        approvers.value.pop()
    }

    async function search(){
        await fetch(`/api/tools/getUserByAnyWord?find=${findingWords.value}`).then(res=>res.json()).then((res)=>{
            // 这里面的res是找到的
            foundUserData.value = res
        })
    }

    function removeMem(item){
        console.log(item)
        const index = approvers.value.findIndex(i=> i._id === item._id)
        if (index !== -1) {
            approvers.value.splice(index, 1)
        }       
    }
</script>

<style scoped>
.outer {
    min-height: 100px;
    border: 0.5px rgba(255, 255, 255, 0.562) solid;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    padding: 10px;
    margin: 10px;
    box-sizing: border-box;
    width: 98%;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

}
.addedMember>span {
    margin: 5px 5px;
    padding: 3px 10px;
    background-color: rgba(240, 248, 255, 0.213);
    display: inline-block;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 20px;

    cursor:pointer;
}
.addedMember {
    width: 100%;
    overflow:initial;
    display: inline-block;
    
}

.findMemIpt {
    width: 70%;
}
.findBtn {
    display: block;
    width: 70%;
}
</style>