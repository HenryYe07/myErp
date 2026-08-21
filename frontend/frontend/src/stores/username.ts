import { defineStore } from "pinia";
// 第一个参数是id 最好和文件名字一致
export const use_username = defineStore('username',{
    // 真正存储数据的地方
    state(){
        return{
            value:""
        }
    }
})