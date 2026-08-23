import { defineStore } from "pinia";
// 第一个参数是id 最好和文件名字一致
export const use_todoStore = defineStore('todoStore',{
    // 真正存储数据的地方
    state(){
        return{
            findingUserID:"",
            appendIDlist:[],
            showingTODOlist:[]
        }
    },

    actions:{
        appendTODOlist(appending_list){
            for(const todo of appending_list){
                const index = this.showingTODOlist.findIndex(item => item._id == todo._id)
                if(index === -1){
                    // 没有，就添加
                    this.showingTODOlist.push(todo)
                }else{
                    // 已经有了，就覆盖
                    this.showingTODOlist[index] = todo
                }
            }
    
}
    }
})