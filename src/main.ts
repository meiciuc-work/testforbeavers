import Vue from 'vue'
import App from './App.vue'
import VKBridge from './vk/VKBridge';
import store from './vuex'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');

new VKBridge();
