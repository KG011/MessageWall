<template>
    <transition name="message" v-if="isShow">
        <div class="GJ-message">
            <div class="message-content">
                <i :class="style[type].icon"></i>
                <span class="text">{{ message }}</span>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { onMounted,ref } from "vue"
const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'warn'
    }
})
const style = {
    warn: {
        icon: '.icon-tianjia'
    },
    error: {
        icon: '.icon-tianjia'
    },
    success: {
        icon: '.icon-tianjia'
    },
}
const isShow = ref(true)
onMounted(() => {
    isShow.value = true
    setTimeout(() => {
        isShow.value = false
    }, 1000)
})
</script>

<style lang="less" scoped>
.message{
    &-enter{
        &-from{
            transform: translateY(-30px);
            opacity: 0;
        }
        &-active{
            transition: all 0.3s;
        }
        &-to{
            transform: translateY(0px);
            opacity: 1;
        }
    }
    &-leave{
        &-from{
            transform: translateY(0px);
            opacity: 1;
        }
        &-active{
            transition: all 0.3s;
        }
        &-to{
            transform: translateY(-30px);
            opacity: 0;
        }
    }
}
.GJ-message{
    width: 100%;
    height: 40px;
    position: fixed;
    z-index: 9999;
    top: 20px;
    line-height: 40px;
    display: flex;
    justify-content: center;
    .message-content{
        padding: 0 20px;
        border-radius: 6px;
        color: #000;
        background: #fff;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    i{
        margin-right: 6px;
        vertical-align: middle;
    }
    .text{
        vertical-align: middle;
    }
}
</style>
