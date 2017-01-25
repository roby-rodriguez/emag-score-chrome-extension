import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "./store"
import App from "./components/App"
import Home from "./pages/Home"
import Product from "./pages/Product"

Vue.use(VueRouter)

const router = new VueRouter({
    //mode: 'history',
    //base: __dirname,
    routes: [
        { path: '/', component: Home },
        { path: '/product', component: Product }
    ]
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
