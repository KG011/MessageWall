<template>
    <div class="ViewImage" v-show="props.isView">
        <div class="img">
            <img :src="baseUrL+props.photosArr[props.number]">
            <div class="switch swt-left" @click="swtLeft" v-show="props.number>0">
                <div class="iconfont icon-Arrow2-Left"></div>
            </div>
            <div class="switch swt-right" @click="swtRight" v-show="props.number<props.photosArr.length-1">
                <div class="iconfont icon-Arrow2-Right"></div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, reactive,onUpdated } from "vue"
import { baseUrL } from '../utils/env';

const props = defineProps({
    number: { typeof: Number },
    isView:{default:false},
    photosArr:{ typeof: Array },
})

// const state=reactive({
//     number:props.photoDetail,
// })
const emits = defineEmits(['swtLeft','swtRight'])
function swtLeft() {
    emits('swtLeft')
}
function swtRight() {
    emits('swtRight')
}

</script>

<style lang="less" scoped>
.ViewImage {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .8);
    backdrop-filter: blur(30px);
    z-index: 50;

    .img {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        padding: 82px 474px 0 96px;
        box-sizing: border-box;

        img {
            max-width: 100%;
        }
    }

    .switch {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        color: #ffffff;
        border-radius: 50%;
        background: #949494;
        opacity: .5;
        cursor: pointer;
        transition: all .3s;
        &:hover{
            opacity: 1;

        }
    }

    .swt-left {
        left: 32px;
    }

    .swt-right {
        right: 410px;
    }
}</style>
