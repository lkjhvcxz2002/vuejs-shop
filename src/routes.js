import IdolList from './components/IdolList.vue';
import Store from './components/Store.vue';
import Login from './components/auth/Login.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import ProductDetails from './components/ProductDetails.vue';
import Register from './components/auth/Register.vue';
import FBLogin from './components/auth/Register.vue';
import ScoreOne from './components/score/ScoreOne.vue';
import ScoreList from './components/score/ScoreList.vue';
import ResultPage from './components/score/ResultPage.vue';
import ResultOne from './components/score/ResultOne.vue';

export const routes = [
	{path: '/', component: Store, name: 'mainpage'},
	{path: '/main', component: Store, name: 'main'},
	{path: '/product/:id', component: ProductDetails, name: 'product'},
	{path: '/cart', component: ShoppingCart, name: 'shoppingcart'},
	{path: '/list', component: IdolList, name: 'list' },
	{path: '/vote', component: FBLogin, name: 'vote' },
	{path: '/vote/:id', component: FBLogin, name: 'vote' },
	{path: '/login/:reviewer', component: Login, name: 'login' },
	{path: '/register', component: Register, name: 'register', onlyGuest: true},
	{path: '/scoreList', component: ScoreList, name: 'scoreList'},
	{path: '/scoreOne/:key', component: ScoreOne, name: 'scoreOne'},
	{path: '/resultPage', component: ResultPage, name: 'resultPage'},
	{path: '/resultPage/:key', component: ResultOne, name: 'resultPage'},
	{path: '*', redirect: '/' }
];