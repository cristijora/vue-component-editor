import Vue from 'vue'
import ElementUI from "element-ui";
import App from "./App.vue";
Vue.use(ElementUI);
import router from './router'
import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
