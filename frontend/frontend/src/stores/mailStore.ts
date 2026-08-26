import { defineStore } from "pinia";
// 第一个参数是id 最好和文件名字一致
export const use_mailStore = defineStore('mailStore',{
    // 真正存储数据的地方
    state(){
        return{
            mailID:""
        }
    },

})