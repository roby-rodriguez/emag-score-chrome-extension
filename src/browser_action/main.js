import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "./store"
import App from "./components/App"
import Home from "./pages/Home"
import Product from "./pages/Product"
import Settings from "./pages/Settings"
import General from "./pages/Settings/General"
import Notifications from "./pages/Settings/Notifications"
import Scan from "./pages/Settings/Scan"

Vue.use(VueRouter)

const router = new VueRouter({
    //mode: 'history',
    //base: __dirname,
    routes: [
        { path: '/', component: Home },
        // TODO add pid in link to make bookmarkable
        { path: '/product', component: Product },
        {
            path: '/settings',
            components: {
                default: Settings
            },
            children: [
                {
                    path: '',
                    components: {
                        settings: General
                    }
                },
                {
                    path: 'notifications',
                    components: {
                        settings: Notifications
                    }
                },
                {
                    path: 'scan',
                    components: {
                        settings: Scan
                    }
                }
            ]
        }
    ]
})

store
    .dispatch('loadSettings')
    .then(() => new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
    }))
