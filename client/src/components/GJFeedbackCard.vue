<template>
    <div class="card"
      :style="{ background: cardColor[NoteData.color],width:props.width }"
      >
      <!-- @click="changeSelectModel(NoteData.id)" -->
      <div class="box">
        <div class="card-top">
          <div class="time">{{ dateTime(NoteData.moment) }}</div>
          <div class="card-label">{{ data[NoteData.type].list[NoteData.label] }}</div>
        </div>
        <p class="card-text">{{ NoteData.message }}</p>
      </div>
      <div class="card-footer">
        <div class="footer-left">
          <div class="icon-xiai" :class="{isLike:NoteData.islike[0].count>0}"></div>&nbsp;{{NoteData.like[0].count}}
          <div class="icon-chat-full">&nbsp;{{ NoteData.comcount[0].count }}</div>
        </div>
        <div class="user" :class="NoteData.name==username?'nameActive':''">
          <!-- <div class="user_img"> -->
            <!-- <img :src="baseUrL + NoteData.avatar" v-if="NoteData.name"></div> -->
          {{ NoteData.name }}
        </div>
      </div>
    </div>
</template>

<script setup>
import { reactive, ref,defineExpose } from "vue"
import { DataCard } from '../mock/index'
import { data, cardColor } from '../utils/data'
import { baseUrL } from '../utils/env';
import { dateTime } from '../utils/time'
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
const {username}=useStore
const props = defineProps({
  NoteData:Object,
  width:{
    default:'100%',
  }
})
const state = reactive({
  
})
// const emits = defineEmits(['changeSelectModel'])
// function changeSelectModel(index) {
//   emits('changeSelectModel', index)
// }

</script>

<style lang="less" scoped>
.nameActive{
  color:#e02f2f
}
.cardAct {
  border: 1px solid #00afd2;
}



.footer-left {
  display: flex;
  align-items: center;
}

.card-text {
  padding-top: 10px;
  font-family: serif;
  font-size: 14px;
  cursor: pointer;

}

.icon-xiai {
  font-size: 14px;
  color: #949494;
  cursor: pointer;
}
.isLike{
  color: #e02f2f;
}

.icon-chat-full {
  margin-left: 10px;
  color: #949494;
}

.icon-xiai:hover {
  color: red;
}

.user {
  display: flex;
  align-items: center;
  font-family: '宋体';
  .user_img{
    width: 25px;
    height: 25px;
    margin-right: 5px;
    img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  }
}
</style>
