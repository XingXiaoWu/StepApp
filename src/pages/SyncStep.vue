<template>
    <van-nav-bar title="同步步数" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div>
        <h1 class="m-30px">一.绑定手机号和授权码（已绑定可跳过）</h1>
        <van-cell-group inset>
            <!-- 输入手机号，调起手机号键盘 -->
            <van-field v-model="tel" type="tel" label="手机号" />
            <!-- 输入任意文本 -->
            <van-field v-model="code" label="授权码" />
        </van-cell-group>
        <p class="m-30px">如果你是第一次使用，下面是一个有效期为今天的激活码</p>
        <p class="m-30px">可以供你测试一天</p>
        <p class="m-30px">b51f6279c86ac7d48aef4add21e3388c</p>
        <van-button type="primary" :loading="loading1" size="large" @click="regist">注册</van-button>
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
        <van-button type="primary" :loading="loading2" size="large" @click="syncStep" class="mt-60px">同步</van-button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from "vant";
import axios from '../utils/http'



const router = useRouter();

/**
* 数据部分
*/
const code = ref('');
const tel = ref('');
const account = ref('');
const password = ref('');
const step = ref('');
const loading1 = ref(false);
const loading2 = ref(false);

const onClickLeft = () => {
    router.back()
}
const regist = () => {
    loading1.value = true
    axios.POSTJSON('/regist/', {
        phone: tel.value.trim(),
        code: code.value.trim()
    }).then((response) => {
        Toast.success(response.message)
    }).finally(() => {
        loading1.value = false
    })
}

const syncStep = () => {
    loading2.value = true
    axios.POSTJSON('/sync/', {
        phone: account.value.trim(),
        password: password.value.trim(),
        step: step.value
    }).then((response) => {
        Toast.success(response.message)
    }).finally(() => {
        loading2.value = false
    })
}
</script>
<style scoped lang='less'>

</style>