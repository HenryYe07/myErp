<template>
<div class="outer">

    <div class="chooseVisualOuter">
        <!-- 一个细长的选择要把哪些东西呈现在日历上的条条 -->
         <!-- 把经常看的人列表存到localStorage 总是偷偷看谁不会被服务端发现啦 -->
         <!-- 在这里获取数据 拿好后用pinia传给calendar -->
        <choose_visual  />
    </div>

    <div class="calendarOuter">
        <calendar />
    </div>  

    <div class="operationsOuter">
        <!-- 1.呈现创建日程（默认） 也可以通过创建按钮进去 -->
        <!-- 2.如果点一下日历里的东西，就按开始顺序呈现那一天的日程 默认今天 -->
        <!-- 3.待确认页面 -->
        <!-- 4.搜索一个人，并把他的日程呈现在总日历上 -->
        <chooseOpt class="opt" />
        <RouterView/>
    </div>

</div>
</template>

<script lang="ts" setup name="todoPage">
    import calendar from '@/components/forTodo/calendar.vue';
    import choose_visual from '@/components/forTodo/choose_visual.vue';
    import chooseOpt from '@/components/forTodo/chooseOpt.vue';
</script>

<style scoped>
.outer{
    display: flex;
}
.chooseVisualOuter{
    width: 200px;
    height: calc(100vh - 50px);
    background-color: rgba(240, 248, 255, 0.095);
}

.calendarOuter{
    background-color: rgba(240, 248, 255, 0.252);
    width: calc(100vw - 350px - 200px - 230px);
}
.operationsOuter {
    width: 350px;
    height: calc(100vh - 50px);
    background-color: rgba(240, 248, 255, 0.073);
    
}

.operationsOuter .opt {
    height: 40px;
    background-color: rgba(28, 28, 28, 0.254);
}


</style>