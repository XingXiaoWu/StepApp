<template>
  <van-nav-bar title="准备工作" left-text="返回" left-arrow @click-left="onClickLeft" />
  <h1 class="m-50px">1.应用商店搜索并安装“Zepp Life”，如下图</h1>
  <img src="../assets/imgs/ZeppLife1.jpg" alt="ZeppLife">

  <h1 class="m-50px">2.使用手机号注册登录（不要使用其他方式）</h1>

  <h1 class="m-50px">3.登录以后-我的-第三方接入</h1>

  <img src="../assets/imgs/ZeppLife2.jpg" alt="ZeppLife">

  <h1 class="m-50px">4.选择微信-并保存二维码到微信扫码绑定</h1>

  <h1 class="m-50px">5.扫码后会跳转到“Amazfit 跃我”公众号，点击关注，然后点击发消息</h1>
  <img src="../assets/imgs/ZeppLife3.jpg" alt="ZeppLife">
  <img src="../assets/imgs/ZeppLife4.jpg" alt="ZeppLife">

  <h1 class="m-50px">6.如上图，当看到提示：微信绑定成功。则代表绑定完成</h1>

  <h1 class="m-50px">至此，准备工作完成</h1>


</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
/**
* 仓库
*/
/**
* 路由对象
*/
const route = useRoute();
/**
* 路由实例
*/
const router = useRouter();
//console.log('1-开始创建组件-setup')
/**
* 数据部分
*/
const data = reactive({})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {
})
const onClickLeft = () => {
  router.back()
}
// 使用toRefs解构
// let { } = { ...toRefs(data) } 
defineExpose({
  ...toRefs(data)
})

</script>
<style scoped lang='less'>

</style>