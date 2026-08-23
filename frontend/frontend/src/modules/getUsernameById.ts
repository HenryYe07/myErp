async function getUsername(id:string){
    return (await fetch(`/api/tools/getUsername?id=${id}`).then(res=>res.text()))
}
export {getUsername}