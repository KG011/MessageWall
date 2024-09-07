<script setup>
import { onMounted,getCurrentInstance } from "vue";
import {signIpApi} from '../api/index'
import useUserStore from "@/store/modules/user";

let useStore = useUserStore();
function getUser(){
    signIpApi().then((res)=>{
        useStore.getUserId(res.ip)
        useStore.userInfo()
    })
}
onMounted(()=>{
    getUser()
})
</script>
<template>
    <router-view></router-view>
</template>



<style lang="less" scoped></style>
