<template>
    <div class="login_container">
        <!-- 登录的表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
            <h1>Hello</h1>
            <h2>欢迎来到GJ留言墙</h2>
            <el-form-item prop="username">
                <el-input :prefix-icon="User" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" class="login_btn" type="primary" size="default"
                    @click="login">登录</el-button>
            </el-form-item>
            <el-form-item>
                <span style="color: #fff;">还没账号？点此</span><router-link to="/Register">注册</router-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive,ref } from "vue"
import { User, Lock } from '@element-plus/icons-vue';
//引入用户相关的小仓库
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
import { useRouter, useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
let useStore = useUserStore();
//获取路由器
let $router = useRouter();
//获取对象
let $route = useRoute();
//获取el-form组件
let loginForms = ref();
//定义变量控制按钮加载效果
let loading = ref(false);
const loginForm = reactive({
    username: '',
    password: ''
})
//自定义校验规则函数
const validatorUserName = (rule, value, callback) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //函数:如果符合条件callBack放行通过即为
  //如果不符合条件callBack方法,注入错误提示信息
  if (typeof value === 'string' && value.length >= 3 && value.length <= 8) {
    callback();
  } else {
    callback(new Error('用户名为3到8位的字母或文字'));
  }
}

const validatorPassword = (ruley, value, callback) => {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error('密码长度至少六位'));
  }
}
const rules = {
    //规则对象属性:
    //required,代表这个字段务必要校验的
    //min:文本长度至少多少位
    //max:文本长度最多多少位
    //message:错误的提示信息
    //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
    username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName }
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword }
  ]
}
async function login() {
    await loginForms.value.validate();
    //加载效果:开始加载
    loading.value = true;
    try {
        await useStore.userLogin(loginForm);
        //编程式导航跳转到展示数据首页
        //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
        let redirect = $route.query.redirect;
        $router.push({ path: redirect || '/' });
        //登录成功提示信息
        ElNotification({
            type: 'success',
            message: '欢迎回来',
            title: `HI,${getTime()}好`
        });
        //登录成功加载效果也消失
        loading.value = false;

    } catch (error) {
        //登录失败加载效果消息
        loading.value = false;
        //登录失败的提示信息
        ElNotification({
            type: 'error',
            message: (error).message
        })
    }

}

</script>

<style lang="less" scoped>
@import '../style.less';
</style>
