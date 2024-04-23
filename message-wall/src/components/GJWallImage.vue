<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {data} from "../utils/data"
import { baseUrL } from '../utils/env';
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
const {username}=useStore
const props=defineProps({
  PhotoData:{type:Object}
})
computed({
  card(){
    return props.PhotoData
  }
})
const state=reactive({
  baseUrL:baseUrL
})

</script>

<template>
  <div class="photo-card">
    <div class="me" v-if="props.PhotoData.name==username">我</div>
    <div class="photo-bg"></div>
    <img :src="baseUrL+props.PhotoData.imgurl">
  </div>
</template>



<style lang="less" scoped>
.photo-card{
  position: relative;
  cursor: pointer;
  .me{
    position: absolute;
    left:0;
    top: 0;
    width: 20px;
    height: 20px;
    font-size: 12px;
    background: #fff;
    color: #9c5050;
    opacity: .4;
    border-radius: 0 0 12px 0 ;
  }
  .photo-bg{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .2);
    transition: .2s;
    opacity: 0;
  }
  img{
    width: 100%;
  }
  &:hover{
    .photo-bg{
      opacity: 1;
    }
  }
}

</style>
