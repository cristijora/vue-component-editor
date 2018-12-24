import Vue from 'vue'
import ElementUI from "element-ui";
import App from "./App.vue";
import locale from 'element-ui/lib/locale/lang/en'
import router from './router'
import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
