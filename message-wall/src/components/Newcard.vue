<template>
  <div class="newCard-container">
    <div class="colorList" v-show="props.id == 0">
      <div class="colorItem" v-for="(item, index) in state.cardColor" :key="index" :style="{ background: item }"
        @click="turnCardColor(index)"></div>
    </div>
    <div class="add-photo" v-if="props.id == 1">
      <input type="file" id="file" multiple="multiple" @change="showPhoto">
      <div class="file-bf" v-if="state.url == ''">
        <span class="icon-tianjia"></span>
      </div>
      <div class="change-bf" v-if="state.url != ''">
        <span class="icon-xiugai"></span>
      </div>
      <div class="photo-detail"><img :src="state.url"></div>
    </div>
    <div class="wall-text" :style="{ background: props.id == 0 ? cardColor[state.ColorIndex] : cardColor[6] }">
      <textarea class="userInput" placeholder="留言..." maxlength="96" v-model="state.message"></textarea>
      <input type="text" class="userName" placeholder="签名" placeholder-class="qmpl" v-model="state.name">
    </div>
    <div class="title">选择标签</div>
    <div class="labels">
      <div class="label" v-for="(item, index) in state.labels" :key="index"
        :class="{ 'label-active': state.labelIndex == index }" @click="turnLabel(index)">{{ item }}</div>
    </div>
    <div>
      <div class="title">免责声明</div>
      <p>1.你好，请遵守文明规范，合理发墙</p>
      <br>
      <p>2.禁止出现不好影响的言论</p>
      <br>
      <p>3.文明墙，靠大家</p>
    </div>
    <div class="footBt">
      <button>放弃</button>
      <button @click="sumbit">确认</button>
    </div>
  </div>
</template>

<script setup>
import deepcopy from "deepcopy"
import { computed, reactive, getCurrentInstance } from "vue"
import { insertWallApi, profileApi } from "../api";
import { cardColor, data } from "../utils/data"
import { getObjectUrl } from "../utils/photo";
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
const { userId, username } = storeToRefs(useStore)
const { proxy } = getCurrentInstance()

const props = defineProps({
  id: { typeof: Number },
})
const emits = defineEmits(['clickCloseBt'])

const state = reactive({
  cardColor: cardColor,
  ColorIndex: 0,
  labels: deepcopy(data[props.id].list),
  labelIndex: 0,
  url: '',
  name: '',
  message: '',
  imurl: '',
})
function turnCardColor(index) {
  state.ColorIndex = index
}
function turnLabel(index) {
  state.labelIndex = index
}
function updatePhoto(data) {
  let file = document.getElementById('file')
  if (file.files.length > 0) {
    let formData = new FormData()
    formData.append('image', file.files[0])
    profileApi(formData).then((res) => {
      data.imgurl = res
      insertWallApi(data).then((result) => {
        let cardItem = {
          type: props.id,
          message: state.message,
          name: data.name,
          userId: userId,
          moment: new Date(),
          label: state.labelIndex,
          color: state.ColorIndex,
          imgurl: data.imgurl,
          id: result.message.insertId,
          islike: [{ count: 0 }],
          like: [{ count: 0 }],
          comcount: [{ count: 0 }],
          report: [{ count: 0 }],
          revoke: [{ count: 0 }],
          avatar:useStore.avatar
        }
        emits('clickCloseBt', cardItem, 1)
        state.message = ''
        proxy.$message({ type: 'success', message: '感谢你的记录！' })
      })
    })
  }
}
function sumbit() {
  let name = '匿名'
  if (useStore.username) {
    name = useStore.username
  }
  let data = {
    type: props.id,
    message: state.message,
    name: name,
    userId: useStore.userId,
    moment: new Date(),
    label: state.labelIndex,
    color: state.ColorIndex,
    imgurl: state.url,
    avatar:useStore.avatar
  }
  if (state.message && props.id == 0) {
    insertWallApi(data).then((res) => {
      let cardItem = {
        type: props.id,
        message: state.message,
        name: name,
        userId: userId,
        moment: new Date(),
        label: state.labelIndex,
        color: state.ColorIndex,
        imgurl: state.url,
        id: res.message.insertId,
        islike: [{ count: 0 }],
        like: [{ count: 0 }],
        comcount: [{ count: 0 }],
        report: [{ count: 0 }],
        revoke: [{ count: 0 }],
        avatar:useStore.avatar
      }
      emits('clickCloseBt', cardItem, 0)
      state.message = ''
      proxy.$message({ type: 'success', message: '感谢你的记录！' })
    })
  } else if (props.id == 1 && state.url) {
    updatePhoto(data)
  }
}
function showPhoto() {
  let item = getObjectUrl(document.getElementById('file').files[0])
  state.url = item
}
</script>

<style lang="less" scoped>
.newCard-container {
  width: 100%;

  .colorList {
    display: flex;
  }

  .colorItem {

    width: 30px;
    height: 30px;
    margin-right: 5px;
  }

  .add-photo {
    position: relative;

    #file {
      position: absolute;
      left: 0;
      top: 0;
      width: 64px;
      height: 64px;
      z-index: 10;
      opacity: 0;
      cursor: pointer;
    }

    .file-bf {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      border: 1px solid #949494;
      border-radius: 50%;
      color: #000;
    }

    .change-bf {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 0, 0, .3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .photo-detail {
      width: 100%;
      max-height: 200px;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
  }

  .labels {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .label {
      margin: 8px 2px;
      padding: 0 10px;
      border-radius: 15px;
      font-size: 14px;
      cursor: pointer;
    }

    .label-active {
      font-weight: 600;
      color: #202020;
      background: #ebebeb;
    }
  }

  .wall-text {
    width: 100%;
    height: 200px;
    margin-top: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    background: #000;
  }


  .userInput {
    border: none;
    outline: none;
    background: none;
    resize: none;
  }

  .userInput {
    width: 100%;
    height: 150px;
  }

  .userName {
    height: 32px;
    padding: 4px;
    text-align: right;
    outline: none;
    border: 1px hsla(0, 100%, 91%, 0.6) solid;
    font-size: 16px;
    font-family: serif;
    box-sizing: border-box;
    background: none;
  }

  .title {
    width: 100%;
    margin-top: 15px;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Courier New', Courier, monospace;
  }

  .footBt {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 48px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    button {
      width: 115px;
      height: 45px;
      padding: auto;
      background: #b4b4b4;
      border: none;
    }
  }
}
</style>
