<script setup>
import axios from 'axios'
import GJFooter from "./components/GJFooter.vue"
import GJHeader from "./components/GJHeader.vue"
import GJIndex from './view/GJIndex.vue';
import { useRoute } from 'vue-router'
let router=useRoute()

</script>

<template>
  <GJHeader></GJHeader>
  <GJIndex></GJIndex>
  <GJFooter v-if="router.fullPath!='/Register'&&router.fullPath!='/Login'"></GJFooter>
</template>

<style lang="less">
@import url(./style.css);
</style>
