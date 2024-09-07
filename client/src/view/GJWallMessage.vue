<template>
  <div class="container">
    <div class="title">
      <p class="name">{{ state.data[state.id].name }}</p>
      <p class="design">{{ state.data[state.id].design }}</p>
    </div>
    <ul class="container-list">
      <li class="container-list-item" v-for="(item, index) in state.data[state.id].list" :key="index"
        :class="{ 'container-list-item-active': state.listItem == index }" @click="listItemActive(index)">
        <p class="name">{{ item }}</p>
      </li>
    </ul>
    <div class="card-content" :style="{ width: state.ContentWidth + 'px' }" v-show="state.id == 0">
      <GJFBCard v-for="(item, index) in state.DataCard" :key="index" :NoteData="item" :width="'288px'"
        @click="turnCardAct(index, e), changeSelectModel(index)" :class="{ cardAct: state.cardAct == index }">
      </GJFBCard>
    </div>
    <div class="photo-content" v-show="state.id == 1">
      <GJWallImage v-for="(item, index) in state.DataCard" :key="index" :PhotoData="item" :width="'288px'"
        class="photo-item" @click="turnPhotoAct(index, item), changeSelectModel(index)" v-show="item.imgurl">
      </GJWallImage>
    </div>
    <div class="none-item" v-show="state.isOk == 0">
      <p>{{ none[state.id].msg }}</p>
    </div>
    <div class="loading" v-show="state.isOk == -1">
      <div id="lottie"></div>
      <p>加载中</p>
    </div>
    <div class="add" :style="{ bottom: state.AddBottom + 'px' }" @click="changeModel">
      <div class="file-bf">
        <span class="icon-tianjia"></span>
      </div>
    </div>
    <GJModel @closeModel="closeModel" :isModel='state.modal' :title="state.title">
      <NewCard v-if="state.selectModel == -1" :id="state.id" @clickCloseBt="clickCloseBt"></NewCard>
      <cardDetail v-if="state.selectModel != -1" :NoteData="state.NodeData"> </cardDetail>
    </GJModel>
    <GJViewImage :number="number" :isView="state.isView" :photosArr="state.photosArr" @swtLeft="swtLeft"
      @swtRight="swtRight"></GJViewImage>
    <Message type="error" message="成功"></Message>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, proxyRefs, reactive, ref, watch, getCurrentInstance, onBeforeMount, onUpdated } from 'vue'
import GJModel from '../components/GJModel.vue'
import GJFBCard from '../components/GJFeedbackCard.vue'
import GJViewImage from '../components/GJViewImage.vue'
import { data, none } from "../utils/data"
import { photo } from '../mock/index'
import NewCard from '../components/Newcard.vue'
import cardDetail from '../components/CardDetail.vue'
import GJWallImage from '../components/GJWallImage.vue'
import { useRoute } from 'vue-router'
import Message from '../components/Message/Detail/GJMessage.vue'
import lottie from 'lottie-web'
import loading from '../assets/loading.json'
import { findWallPageApi } from '../api/index'
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
const { proxy } = getCurrentInstance()
const route = useRoute()
const number = ref(0)
const id = ref(route.query.id)
const state = reactive({
  id: computed(() => {
    return route.query.id
  }),
  listItem: 0,
  AddBottom: 30,
  data: data,
  DataCard: [],
  photosArr: [],
  photosArr2: [],
  modal: false,//是否调用弹窗
  isView: false,//图片预览
  selectModel: -2,//卡片详情默认状态
  ContentWidth: 1500,
  cardAct: -1,//卡片默认active状态
  NodeData: '',
  photoDetail: 0,
  title: "留言",
  isOk: -1,//是否加载
  page: 1,
  pageSize: 15
})


function swtLeft() {
  number.value--
  state.NodeData = state.DataCard[number.value]
}
function swtRight() {
  number.value++
  state.NodeData = state.DataCard[number.value]

}


// 监听留言墙容器宽度
function watchContentWidth() {
  let windowWidth = document.body.clientWidth
  state.ContentWidth = Math.floor((windowWidth - 120) / 300) * 300
}

// 监听留言墙容器
function WatchBodyHeight() {
  let ScrollTop = document.body.scrollTop || document.documentElement.scrollTop
  let HeightBody = document.documentElement.clientHeight
  let ScrollHeight = document.documentElement.scrollHeight
  if (ScrollTop + HeightBody + 260 >= ScrollHeight) {
    state.AddBottom = ScrollTop + HeightBody + 260 - ScrollHeight
  } else {
    state.AddBottom = 60
  }
  if (ScrollTop + HeightBody >= ScrollHeight) {
    getWallCard(state.id)
    document.documentElement.scrollTop = document.documentElement.scrollTop - 5
  }
}
function clickCloseBt(e, id) {
  state.DataCard.unshift(e)
  closeModel()
}
// 标签Active
function listItemActive(num, item) {
  state.listItem = num
  state.DataCard = []
  state.page = 1
  getWallCard(state.id)
}

// 清除留言卡片的active
function defaultWall() {
  state.cardAct = -1
  state.isView = false
}
// 关闭新建以及详细Model
function closeModel() {
  state.selectModel = -2
  state.modal = false
  defaultWall()
}
// 改变model
function changeModel(e) {
  state.selectModel = -1
  state.modal = !state.modal
  // 控制标签
  state.title = '留言'
}
// 控制留言卡片的active
function turnCardAct(index, e) {
  if (state.cardAct == index) {
    state.cardAct = -1
  } else {
    state.cardAct = index
  }
  // 控制留言卡片详细的获取
  state.NodeData = state.DataCard[index]
  // 控制标签
  state.title = '留言卡片详细'
}
function turnPhotoAct(index, e) {
  state.isView = !state.isView
  number.value = index
  // 控制留言卡片详细的获取
  state.NodeData = state.DataCard[index]
  // 控制标签
  state.title = '照片详细'

}

function changeSelectModel(index) {
  // 控制card的切换，只有重复点击，或者初次点击才显示
  if (state.selectModel == index) {
    state.modal = !state.modal
  } else if (state.selectModel == -2) {
    state.modal = !state.modal
  }
  if (state.selectModel == index) {
    state.selectModel = -2
  } else {
    state.selectModel = index
  }

}
function loadinger() {
  var container = document.getElementById('lottie')
  if (state.isOk == -1) {
    lottie.loadAnimation({
      container: container, // 需要渲染动画的dom元素
      animationData: loading, // 动画文件
      renderer: 'svg', // 渲染方式
      loop: true, // 是否循环播放
      autoplay: true, // 是否自动播放
      name: "New Year", // 动画参考名称
    })
  }
}
watch(() => proxy.$router.currentRoute.value, (newValue, oldValue) => {
  state.modal = false
  state.isView = false
  state.cardAct = -2
  state.selectModel = -2
  state.listItem = 0
  state.page = 1
  state.photosArr = []
  state.photosArr2 = []
  state.DataCard = []
  getWallCard(state.id)
})

// watch(() =>proxy.$router.currentRoute.value,(newValue,oldValue)=> {
//         console.log('watch',newValue);
// },{ immediate: true })
function getWallCard(id) {
  const { userId } = storeToRefs(useStore)
  if (state.page > 0) {
    state.isOk = -1
    let data = {
      type: id,
      page: state.page,
      pagesize: state.pageSize,
      userId: userId,
      label: state.listItem
    }

    findWallPageApi(data).then((res) => {
      state.DataCard = state.DataCard.concat(res.message)
      if (res.message.length) {
        state.page++
      } else {
        state.page = 0
      }
      setTimeout(() => {
        if (state.DataCard.length > 0) {
          state.isOk = 1
        } else {
          state.isOk = 0
        }
      }, 10)
      if (state.id == 1) {
        for (let i = 0; i < state.DataCard.length; i++) {
          state.photosArr2.push(state.DataCard[i].imgurl)
        }
        state.photosArr = [...new Set(state.photosArr2)];
        state.DataCard = [...new Set(state.DataCard)];
      }
    })
  }
}


onMounted(() => {
  window.addEventListener('resize', watchContentWidth)
  window.addEventListener('scroll', WatchBodyHeight)
  loadinger()
  getWallCard(state.id)
})
onUnmounted(() => {
  window.addEventListener('resize', watchContentWidth)
  window.addEventListener('scroll', WatchBodyHeight)
})
onUpdated(() => {
  window.addEventListener('scroll', WatchBodyHeight)
})
</script>


<style lang="less" scoped>

.loading {
  p {
    text-align: center;
    font-family: serif;
    font-size: 24px;

  }
}

.none-item {
  position: absolute;
  top: 480px;
  font-size: 24px;
  font-weight: 700;
  font-family: serif;
  color: #4f4f4f;
}

.photo-content {
  min-height: 620px;

  width: 88%;
  columns: 6;
  column-gap: 4px;

  .photo-item {
    margin-bottom: 4px;
    break-inside: avoid;
  }
}

.title {

  .name,
  .design {
    text-align: center;
  }
}

.title {

  width: 100%;
  min-height: 100px;

  .name {
    padding: 15px 0;
    font-size: 56px;
    font-weight: bold;
  }

  .design {
    font-size: 14px;
  }
}

.add {
  position: fixed;
  width: 56px;
  height: 56px;
  right: 30px;
  transition: .1s;
  background: #213547;
  border-radius: 28px;
  z-index: 99;
  cursor: pointer;
  .file-bf {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 28px;
      color: #fff;
    }

}

.card {
  margin: 5px;

}

.card:hover {
  transform: translateY(-5px);
  transition: .3s;
}
</style>
