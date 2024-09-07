<template>
    <header>
        <div class="head">
            <div class="logo">Logo</div>
            <div class="list">
                <router-link :to="{ path: 'Wall', query: { id: 0 } }" class="button"
                    :class="{ 'router-link-actives': id == 0 }">留言墙</router-link>
                <router-link :to="{ path: 'Wall', query: { id: 1 } }" class="button"
                    :class="{ 'router-link-actives': id == 1 }">照片墙</router-link>
                <!-- <router-link @click="changeWall(0)" class="button" :class="{'router-link-actives':id==0}">留言墙</router-link>
                <router-link @click="changeWall(1)"  class="button" :class="{'router-link-actives':id==1}">照片墙</router-link> -->
            </div>
            <div class="right">
                <div class="icon-yueliang"></div>
                <router-link :to="{ path: 'Login' }" class="user" :style="!useStore.avatar?`background: ${headImg[Math.floor(Math.random() * 5)]}`:''">
                    <img :src="baseUrL + useStore.avatar" v-if="useStore.avatar"></router-link>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        {{ username ? username : '未登录' }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown v-if="username">
                        <el-dropdown-menu>
                            <el-dropdown-item>更换头像
                                <input type="file" id="file" multiple="multiple" class="inputfile" @change="showPhoto">
                            </el-dropdown-item>
                            <el-dropdown-item @click="LogOut()">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { computed, getCurrentInstance, reactive } from 'vue'
import { getObjectUrl } from "../utils/photo";
import { baseUrL } from '../utils/env';
import { data, headImg } from '../utils/data'
import { updateAvatarApi,profileApi } from "../api";
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import useUserStore from "@/store/modules/user";
let useStore = useUserStore();
const { proxy } = getCurrentInstance()
const state = reactive({
    url: useStore.avatar
})
const id = computed(() => {
    return useRoute().query.id
})
const { username } = storeToRefs(useStore)
function LogOut() {
    useStore.userLogout()
}
function showPhoto() {
    let item = getObjectUrl(document.getElementById('file').files[0])
    let file = document.getElementById('file')
    if (file.files.length > 0) {
        let formData = new FormData()
        formData.append('image', file.files[0])
        let data = {
            imgurl: '',
            username: useStore.username
        }
        profileApi(formData).then((res) => {
            data.imgurl = res
            useStore.updateAvatar(data,res)
        })
    }
}

</script>

<style lang="less" scoped>
.head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    box-sizing: border-box;
    background-color: var(--el-bg-color);
    backdrop-filter: blur(20px);
    box-shadow: 0 0 4px 0 #000;
    z-index: 999;

    .right {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;

        .user {
            width: 40px;
            height: 40px;
            margin-left: 15px;
            margin-right: 10px;
            border-radius: 50%;
            // background:url('@/assets/images/login_form.jpg') no-repeat;
            // background-size: cover;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }


    }

    .list {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);

        .button {
            padding: 10px 15px;
            margin: 5px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            color: rgb(33, 33, 33);

        }

        .router-link-actives {
            background: #038fcb;
            color: rgb(255, 255, 255);
        }
    }
}

.icon-yueliang {
    font-size: 30px;
    color: #ffcc58;
}

.inputfile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 50%;
    z-index: 10;
    opacity: 0;
    cursor: pointer;
}
</style>
