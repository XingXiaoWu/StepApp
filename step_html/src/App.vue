<script setup lang="ts">
import { ref } from 'vue';
const productList = [{
  icon: '',
  title: '我的博客',
  link: 'https://blog.xingxiaowu.cn/',
  text: '大概是记录了我这些年来荒废的技术，如果你有兴趣，可以联系我能留个友链'
}, {
  icon: '',
  title: '@xing.wu/form',
  link: 'https://github.com/XingXiaoWu/xing.wu-form',
  text: '我根据element封装的json驱动表单，当然也有基于element-plus的vue3版本'
},
{
  icon: '',
  title: '阿星的electron打包页面',
  link: 'https://blog.xingxiaowu.cn/electron/',
  text: '已经有网页，想打包桌面客户端？可以试试阿星的打包页面'
},
{
  icon: '',
  title: '信息系统管理师学习笔记',
  link: 'https://blog.xingxiaowu.cn/SystemManagerExam/',
  text: '阿星也曾想考软考，但是失败了，因为懒。。。。'
},]

const goToUrl = (url: string) => { window.open(url) }
</script>

<template>
  <!--  -->
  <img src="./assets/imgs/ChatHead.jpeg" alt="头像" class="self-center h-[180px] self-center mt-50px">
  <div class="self-center mt-20px">这是阿星的首页，可能会用来放一些奇奇怪怪的东西</div>

  <n-grid :cols="4" x-gap="8" y-gap="8">
    <n-gi v-for="(item,i) in productList" :key="i">
      <n-card :title="item.title" :class="i % 2 ? 'bg-light-200' : 'bg-light-800'" class="hover:bg-light-blue-300 cursor-pointer"
        @click="()=>goToUrl(item.link)">
        {{item.text}}
      </n-card>
    </n-gi>
  </n-grid>
</template>

<style scoped>

</style>
