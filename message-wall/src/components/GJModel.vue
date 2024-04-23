<template>
    <transition name="model">
        <div class="model-container" v-if="isModel">
            <div class="box">
                <div class="top">
                <span>{{ props.title }}</span>
                <span @click="closeModel" class="close">关闭</span>
            </div>
            <div class="model-content">
                <slot></slot>
            </div>
            </div>
        </div>

    </transition>
</template>

<script setup>
import { defineEmits, reactive,getCurrentInstance } from "vue"

const props = defineProps({

    isModel: {
        default:false
    },
    title: {
        default:'留言'
    },

})

const emits = defineEmits(['closeModel'])
function closeModel() {

    emits('closeModel','123123')
}

</script>

<style lang="less" scoped>
.close{
    cursor: pointer;
}
.box{
    position: relative;
    height: calc(100% - 52px);
    
}
@keyframes EnterModel {
    0% {
        transform: translateX(360px);
    }

    50% {
        transform: translateX(180px);
    }

    100% {
        transform: translateX(0px);
    }
}

@keyframes LeaveModel {
    0% {
        transform: translateX(0px);
    }

    50% {
        transform: translateX(180px);
    }

    100% {
        transform: translateX(360px);
    }
}

.model-enter-active {
    animation: EnterModel .3s linear;

}

.model-leave-active {
    animation: LeaveModel .3s linear;
}

.model-container {
    position: fixed;
    top: 52px;
    right: 0;
    width: 360px;
    height: 100%;
    padding: 20px;
    background: var(--other1,hsla(0,0%,100%,.8));
    backdrop-filter: blur(20px);
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, .08);
    z-index: 100;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
        font-weight: 600;
    }
}

.sort {
    height: 500px;
    padding-top: 10px;
    background: #e4c1c1;
}

.model-content {
    height: 700px;
    padding: 20px 0;
    box-sizing: border-box;
    overflow-y: auto;
}

// .footer {
//     position: absolute;
//     bottom: 0;
// }
</style>
