async function postJSON(url:string,obj:Object){  // 返回的是响应对象，还没有转换成text或者json
    const result = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(obj)
        })
    return result
}
export { postJSON }