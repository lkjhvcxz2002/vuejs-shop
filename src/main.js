import Vue from 'vue';
import VueRouter from 'vue-router';
import VueEvents from 'vue-events'
import VueCookies from 'vue-cookies'

import { routes } from './routes';
import store from './stores/store';
import { firebaseListener } from './config/firebaseConfig';
import './assets/styles/app.scss'

import App from './App.vue';

var key = process.env.SECRET_KEY || '4879121248791212';
 
// Create an encryptor:
window.encryptor = require('simple-encryptor')(key);

Vue.use(VueRouter);
Vue.use(VueEvents);
Vue.use(VueCookies)

firebaseListener(authStatusChange);

const router = new VueRouter({
	mode: 'history',
	routes
});

// router.beforeEach((to, from, next) => {
//     if (to.onlyReviewer && window.$cookies.get("reviewer") == null) {
//         next('/');
//     } else {
//         next();
//     }
// });


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

function authStatusChange(loggedIn, user) {
	if (store) {
		store.commit('AUTH_STATUS_CHANGE');
		if (user) {
			store.dispatch('getShoppingCart', {uid: user.uid, currentCart: store.getters.cartItemList});
		}
	}

}
