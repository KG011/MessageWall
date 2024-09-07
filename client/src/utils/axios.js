import axios from "axios";
import { baseUrL } from "../utils/env";
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
const API=axios.create({
    baseURL:baseUrL,
    timeout:5000
})
// 添加请求拦截器
API.interceptors.request.use(
    // 在发送请求前需要做什么
    config=>{
        // if(state.token){
        //     config.headers.token=state.token
        // }
        // let useStore=useUserStore()
        // if(useStore.token){
        //     config.headers.token =useStore.token
        // }
        return config
    },
    // 对请求错误做些什么
    error=>{
        console.log(error);
        return Promise.reject();
    }
)
API.interceptors.response.use(
    // 对响应数据需要做什么
    response=>{
        if(response.status==200){
            return response.data
        }else{
            Promise.reject()
        }
    },
    // 对请求错误做些什么
    error=>{
        console.log(error);
        return Promise.reject();
    }
)
export default API;