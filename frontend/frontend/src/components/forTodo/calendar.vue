<template>
    <el-calendar v-model="choosingDay" class="cal" controller-type="select">
        <template #date-cell="{ data }">
            <div>
                <div class="dayNum">{{ data.date.getDate() }}</div>
                
                <!-- 在这个地方给每一天塞日程 -->
                <div v-for="(item,index) in todoStore.showingTODOlist" :key="index">
                    <div class="todoInDay" v-if="data.day== get_if_Date(item.startTime) ">
                        {{ item.content }}
                    </div>
                </div>
                

            </div>
        </template>
    </el-calendar>
</template>

<script lang="ts" setup name="calendar">
import { ref } from 'vue'
const choosingDay = ref(new Date())

import { use_todoStore } from '@/stores/todoStore';
const todoStore = use_todoStore()

// 把时间对象的字符串转换成YYYY-MM-DD的格式
function get_if_Date(date) {
    console.log(date)
    date = new Date(date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}
</script>

<style scoped>
    /* 日历本身的样式 */
    .cal {
        background-color: rgba(0, 0, 0, 0.302);
        height: calc(100vh - 50px);

        
    }

    :deep(.el-calendar-table .is-selected) {
        background-color: #dedede3c;
        color: white;
    }
    :deep(.el-calendar-table .el-calendar-day:hover) {
        background-color: #100c0c13;
    }
    :deep(.el-calendar-table .el-calendar-day) {
        height: calc((100vh - 50px - 80px - 70px) / 6);
        padding: 0;
        
    }
    .dayNum {
        margin-left: 5px;

        box-sizing: border-box;
        padding: 4px;

        border-radius: 25px;

    }

    /* 日历里面todo的样式 */
    .todoInDay {
        color: white;
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        background-color: rgba(3, 13, 23, 0.465);
        padding: 0px 10px 0px 10px;
        border-radius: 10px;
        margin-bottom: 2px;
        
    }


.todoColor-red {
    background-color: rgba(88, 19, 19, 0.626);
}

.todoColor-orange {
    background-color: rgba(88, 49, 15, 0.639);
}

.todoColor-yellow {
    background-color: rgba(82, 77, 15, 0.638);
}

.todoColor-green {
    background-color: rgba(20, 72, 36, 0.641);
}

.todoColor-cyan {
    background-color: rgba(15, 72, 78, 0.572);
}

.todoColor-blue {
    background-color: rgba(20, 43, 82, 0.625);
}

.todoColor-purple {
    background-color: rgba(58, 25, 76, 0.589);
}

.todoColor-black {
    background-color: rgba(20, 20, 20, 0.557);
}
</style>