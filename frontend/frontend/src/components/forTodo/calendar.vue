<template>
    <el-calendar v-model="choosingDay" class="cal" controller-type="select">
        <template #date-cell="{ data }">
            <div>
                <div class="dayNum">{{ data.date.getDate() }}</div>
                
                <!-- 在这个地方给每一天塞日程 -->
                <div class="todoInDay" v-if="data.day=='2026-08-23'">
                    试试试试
                </div>
                <div class="todoInDay" v-if="data.day=='2026-08-23'">
                    试试试试2
                </div>
                <div class="todoInDay" v-if="data.day=='2026-08-23'">
                    试试试试333333333333
                </div>

            </div>
        </template>
    </el-calendar>
</template>

<script lang="ts" setup name="calendar">
import { ref } from 'vue'
const choosingDay = ref(new Date())
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
</style>