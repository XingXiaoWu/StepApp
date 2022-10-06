import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "../pages/Home.vue";
import ZeppLife from "../pages/ZeppLife.vue";
import SyncStep from "../pages/SyncStep.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/installZepp', component: ZeppLife },
    { path: '/SyncStep', component: SyncStep },
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


export { router } 


