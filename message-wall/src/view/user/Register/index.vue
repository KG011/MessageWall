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
            <el-form-item prop="confirmPassword">
                <el-input type="password" :prefix-icon="Lock" v-model="loginForm.confirmPassword" show-password placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" class="login_btn" type="primary" size="default"
                    @click="register">注册</el-button>
            </el-form-item>
            <el-form-item>
                <span style="color: #fff;">已有账号？点此</span><router-link to="/Login">登录</router-link>
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
import {RegisterApi}from '@/api/index'
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
    password: '',
    confirmPassword:'',
    isLogin:false
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
const validatorconfirmPassword = (ruley, value, callback) => {
  if (value==loginForm.password) {
    callback();
  } else {
    callback(new Error('密码与确认密码不匹配'));
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
  ],
  confirmPassword:[
     { trigger: 'change', validator: validatorconfirmPassword }
  ]
}
function changeType(bol) {
    loginForm.isLogin = bol
    loginForm.username = ''
    loginForm.password = ''
    if(loginForm.isLogin){
        $router.push({path:'/Login'})
    }
}
function register() {
    if (loginForm.username != ""&& loginForm.password != ""&& loginForm.password == loginForm.confirmPassword) {
        let data = {
            username: loginForm.username,
            password: loginForm.password
        }
        RegisterApi(data).then(res => {
            switch (res.code) {
                case 0:
                    alert("注册失败，用户名重复！");
                    changeType(false)
                    break;
                case 1:
                    alert("注册成功");
                    changeType(true)
                    break;
            }
        }).catch(err => {
            console.log(err);
        })
    } else {
        alert("填写不能为空！");
    }
}

</script>

<style lang="less" scoped>
@import '../style.less';
</style>
