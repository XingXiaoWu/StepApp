<template>
    <van-nav-bar title="同步步数" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div>
        <h1 class="m-30px">一.绑定手机号和授权码（已绑定可跳过）</h1>
        <van-cell-group inset>
            <!-- 输入手机号，调起手机号键盘 -->
            <van-field v-model="tel" type="tel" label="手机号" />
            <!-- 输入任意文本 -->
            <van-field v-model="text" label="授权码" />
        </van-cell-group>
        <p class="m-30px">如果你是第一次使用，下面是一个一次性的激活码</p>
        <p class="m-30px">可以供你测试一次</p>
        <p class="m-30px">b51f6279c86ac7d48aef4add21e3388c</p>
        <van-button type="primary" size="large" @click="regist">注册</van-button>
    </div>

    <div>
        <h1 class="m-30px">二.同步微信步数，请输入ZeppLife注册的手机号和ZeppLife设置的密码</h1>
        <van-cell-group inset>
            <!-- 输入手机号，调起手机号键盘 -->
            <van-field v-model="account" type="tel" label="手机号" />
            <van-field v-model="password" type="password" label="ZeppLife密码" />
            <!-- 输入任意文本 -->
            <van-field v-model="step" label="微信步数" />
        </van-cell-group>
        <van-button type="primary" size="large" @click="syncStep" class="mt-60px">同步</van-button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
* 数据部分
*/
const text = ref('');
const tel = ref('');
const account = ref('');
const password = ref('');
const step = ref('');

const onClickLeft = () => {
    router.back()
}
const regist = () => {
    
}

const syncStep = () => {

}
</script>
<style scoped lang='less'>

</style>