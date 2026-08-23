import { defineStore } from "pinia";
// 第一个参数是id 最好和文件名字一致
export const use_todoStore = defineStore('todoStore',{
    // 真正存储数据的地方
    state(){
        return{
            findingUserID:"",
            appendIDlist:[],
            showingTODOlist:[],
            selected_date:"",
            refresh:()=>{}
        }
    },

    actions:{
        appendTODOlist(appending_list){
            for(const todo of appending_list){
                this.showingTODOlist.push(todo)
            }
        }
    }
})