import { defineStore } from 'pinia';
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
import { LoginApi, userInfoApi, updateAvatarApi,updateCMTAvatarApi } from '@/api/index'

//创建用户小仓库
let useUserStore = defineStore('User', {
    //小仓库存储数据地方
    state: () => {
        return {
            token: GET_TOKEN(),//用户唯一标识token
            username: '',
            avatar: '',
            userId: '"test"'
        }
    },
    //异步|逻辑的地方
    actions: {
        getUserId(id) {
            this.userId = id
        },
        //用户登录的方法
        async userLogin(data) {
            //登录请求
            let result = await LoginApi(data);
            //登录请求:成功200->token 
            //登录请求:失败201->登录失败错误的信息
            if (result.code == 200) {
                console.log(result);
                this.username = result.data.username;
                //本地存储持久化存储一份
                this.token = result.data.token;
                this.avatar = result.data.avatar
                SET_TOKEN(result.data.token);
                //能保证当前async函数返回一个成功的promise
                return 'ok';
            } else {
                return Promise.reject(new Error(result.data));
            }
        },
        //获取用户信息方法
        async userInfo() {
            let data = {
                token: this.token
            }
            //获取用户信息进行存储仓库当中[用户头像、名字]
            let result = await userInfoApi(data);
            //如果获取用户信息成功，存储一下用户信息
            switch (result.code) {
                case 200:
                    this.username = result.userName;
                    this.avatar = result.avatar

                    break;

                case 401:
                    this.token = REMOVE_TOKEN()
                    alert("Token已过期，请重新登录！");
                    break;
            }
            // if (result.code == 200) {
            //     this.username = result.userName;
            //     console.log(result);
            //     return 'ok';
            // } else {
            //     return Promise.reject(new Error(result.message));
            // }
        },
        //退出登录
        async userLogout() {
            //退出登录请求
            this.token = '';
            this.username = '';
            this.avatar = '';
            REMOVE_TOKEN();
            return 'ok';
            // let result= await reqLogout();

            // if (result.code == 200) {
            //     //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
            //     this.token = '';
            //     this.username = '';
            //     this.avatar = '';
            //     REMOVE_TOKEN();
            //     return 'ok';
            // } else {
            //     return Promise.reject(new Error(result.message));
            // }

        },
        updateAvatar(data,url) {
            this.avatar=url
            updateAvatarApi(data)
            updateCMTAvatarApi(data)
            return 'ok';
        }

    },
    getters: {

    }

})
//对外暴露获取小仓库方法
export default useUserStore;