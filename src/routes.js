import IdolList from './components/IdolList.vue';
import Store from './components/Store.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ProductDetails from './components/ProductDetails.vue';
import Register from './components/auth/Register.vue';

export const routes = [
	{path: '/', component: Store, name: 'mainpage'},
	{path: '/product/:id', component: ProductDetails, name: 'product'},
	{path: '/cart', component: ShoppingCart, name: 'shoppingcart'},
	{path: '/list', component: IdolList, name: 'list' },
	{path: '/login', component: IdolList, name: 'login' },
	{path: '/register', component: Register, name: 'register', onlyGuest: true},
	{path: '*', redirect: '/' }
];