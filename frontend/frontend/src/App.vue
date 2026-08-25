
<template>
<Header />

    <RouterView/>

</template>

<script lang="ts" setup name="App">
    import {RouterView,RouterLink} from 'vue-router'
    import Header from "@/components/header.vue"
    import { useRouter } from 'vue-router'

    import 'element-plus/dist/index.css'

    import 'element-plus/theme-chalk/dark/css-vars.css'
    import { onMounted } from 'vue'
    // 开启暗黑模式
    onMounted(() => {
    document.documentElement.classList.add('dark')
})

    const router = useRouter()
    router.push('/login')


</script>

<style>
    *{
        margin: 0;
        padding: 0;
    }
    body {
    background-image: url("@/public/background.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    }
</style>
