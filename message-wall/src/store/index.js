//仓库大仓库
import { createPinia } from 'pinia';
//创建大仓库
let pinia = createPinia();
//对外暴露：入口文件需要安装仓库
export default pinia;



// import Vuex from 'vuex'
// const state = {
//     userId: "test",
//     username:"匿名",
//     token: localStorage.getItem('TOKEN'),
//     isLogin:false
// }
// const mutations = {
//     getUser(state,id){
//         state.userId=id
//     },
//     getUsername(state,username){
//         state.username=username
//         console.log(state.username);
//     },
//     getToken(state,token){
//         console.log(333);
//         localStorage.setItem('TOKEN',token)
//     },
//     changeLogin(state,bol){
//         state.isLogin=bol
//     }
// }
// const getters = {
// }
// export default new Vuex.Store({
//     state,
//     mutations,
//     getters
// })
