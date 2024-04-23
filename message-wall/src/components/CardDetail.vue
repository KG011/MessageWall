<template>
  <div class="">
    <div class="cardDetail-top">
      <p class="revoke">要求管理员删掉该标签</p>
      <p class="report">举报</p>
    </div>
    <GJFBCard :NoteData="props.NoteData"></GJFBCard>
    <div class="form">
      <textarea class="comment" placeholder="请输入..." maxlength="96" v-model="state.message"></textarea>
      <button class="primary" @click="sumbit" :class="state.message ? '' : 'no'">评论</button>
    </div>
    <p class="comment-title">评论</p>
    <div class="comment">
      <div class="comment-li" v-for="(item, index) in state.DataComment" :key="index">
        <div class="user" :style="item.imgurl?`background: ${headImg[Math.floor(Math.random() * 5)]}`:''">
          <img :src="baseUrL+item.imgurl" style="width: 100%;height: 100%;border-radius: 50%;" v-if="isNaN(item.imgurl)">
        </div>
        <div class="content">
          <div class="top">
            <!-- <span v-if="item.name==username" style="font-size: 12px; color: sienna;">(墙主)</span> -->
            <div class="name">{{ item.name }}</div>
            <div class="time">{{ dateTime(item.moment) }}</div>
          </div>
          <p class="message">{{ item.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineExpose, computed, getCurrentInstance, onMounted, watch } from "vue"
import GJFBCard from './GJFeedbackCard.vue'
import { DataCard, comment } from '../mock/index'
import { dateTime } from '../utils/time'
import { baseUrL } from '../utils/env';
import { data, headImg } from '../utils/data'
import { insertCommentApi, findCommentPageApi } from "../api";
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
const {username}=useStore
const { proxy } = getCurrentInstance()
const props = defineProps({
  NoteData: { typeof: Object }
})
const state = reactive({
  DataComment: [],
  name: useStore.username,
  message: '',
  page: 1,
  pageSize: 8,
})
function sumbit() {
  if (state.message != '') {
    let imgurl = Math.floor(Math.random() * 5)
    if(useStore.avatar){
      imgurl=useStore.avatar
    }
    let name = '匿名'
    if (useStore.username) {
      name = useStore.username
    }
    let data = {
      wallId: props.NoteData.id,
      userId: useStore.userId,
      imgurl: imgurl,
      comment: state.message,
      name: name,
      moment: new Date(),
    }
    insertCommentApi(data).then(() => {
      state.DataComment.unshift(data)
      // NoteData.comcount[0].count++
      state.message = ''
    })
  }

}
function getComments() {
  if (state.page > 0) {
    let data = {
      page: state.page,
      pagesize: state.pageSize,
      id: props.NoteData.id,
    }
    findCommentPageApi(data).then((res) => {
      console.log(res);
      state.DataComment = state.DataComment.concat(res.message)
    })
  }
}

onMounted(() => {
  getComments()
})

watch(() => props.NoteData, () => {
  state.page = 1
  state.DataComment = []
  getComments()

}, { immediate: true })

</script>

<style lang="less" scoped>
.form {
  height: 140px;
  margin-top: 15px;

  .comment {
    width: 100%;
    height: 80px;
    padding: 8px;
    resize: none;
    outline: none;
    box-sizing: border-box;
  }

  .primary {
    float: right;
    height: 40px;
    padding: 7px 21px;
    border: none;
    border-radius: 15px;
    font-size: 15px;
    background: #c4c4c4;
    outline: none;
  }

  .no {
    cursor: no-drop;
  }
}

.cardDetail-top {
  display: flex;
  margin-bottom: 5px;
  font-size: 14px;

  .revoke,
  .report {
    color: #037bcb;
    margin-right: 10px;
    cursor: pointer;
  }

  .report {
    color: #ff2121;
  }
}

.comment-title {
  margin-bottom: 5p;
  font-weight: bold;
  font-size: 15px;
}

.comment-li {
  display: flex;
  margin-bottom: 15px;

  .user {
    width: 38px;
    height: 38px;
    line-height: 38px;
    background: #000;
    border-radius: 50%;
    
  }

  .content {
    width: calc(100% - 38px);
    margin-left: 6px;

    .top {
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      font-size: 12px;

      .name {
        color: #61666d;
      }

      .time {
        margin-left: 6px;
        color: #949494;
      }
    }

    .message {
      width: calc(100% - 44px);
      flex-wrap: wrap;
      font-size: 14px;
    }
  }

}
</style>
