// 创建一个路由器 并暴露出去
// 引入createRouter
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入所有要呈现的组件
import loginPage from '@/views/loginPage.vue'
import mainWorkPage from '@/views/mainWorkPage.vue'
import registerPage from '@/views/registerPage.vue'

import adminPage from '@/views/workspace/adminPage.vue'
import approvalPage from '@/views/workspace/approvalPage.vue'
import displayPage from '@/views/workspace/displayPage.vue'
import managementPage from '@/views/workspace/managementPage.vue'
import messagePage from '@/views/workspace/messagePage.vue'
import orderPage from '@/views/workspace/orderPage.vue'
import todoPage from '@/views/workspace/todoPage.vue'
import welcomePage from '@/views/workspace/welcomePage.vue'

// 创建一个路由器 要传入一个配置项
const router = createRouter({
    history:createWebHashHistory(),  // 路由器的工作模式，后面会讲
    // History 模式 界面美观 没有# 看上去像Url 
    // 但是要后端配合，否则刷新会404
    // createWebHashHistory() // Hash 模式 url有#界面不美观，但是刷新不会404 SEO优化不好
    routes:[{       // 这里面写一个一个的路由
        path:'/login',
        component:loginPage,
    },{       
        path:'/register',
        component: registerPage,
    },{      
        path:'/mainWorkPage',
        component: mainWorkPage,
        children:[
            {path:'admin',component:adminPage},
            {path:'approval',component:approvalPage},
            {path:'display',component:displayPage},
            {path:'management',component:managementPage},
            {path:'message',component:messagePage},
            {path:'order',component:orderPage},
            {path:'todo',component:todoPage},
            {path:'welcome',component:welcomePage}
        ]
    },
]
})

// 把路由器导出去
export default router