import { ref, firebaseAuth } from '../config/firebaseConfig';
import axios from 'axios';
const http = require("http")

let addScore = function(key, fbId) {
	var url = "/api/addScore/" + key + "/" + fbId;
	http.get(url, (res) => {
		console.log(`Got response: ${res.statusCode}`);
	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});
}

let delScore = function(key, fbId) {
	var url = "/api/delScore/" + key + "/" + fbId;
	http.get(url, (res) => {
		console.log(`Got response: ${res.statusCode}`);
	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});
}

export const updateCart = ({
  commit
}, {item, isAdd}) => {
	// TODO
	var fbId = "testFB";

  // TODO: Call service
	commit('UPDATE_CART', {item, isAdd});
	let message_obj = {};
  if (isAdd) {
    message_obj = {
      message: `你喜歡 ${item.name} 的照片!!`,
      messageClass: "success",
      autoClose: true
		}

		addScore(item.key, fbId);
  } else {
		message_obj = {
			message: `你取消喜歡 ${item.name} 的照片!!`,
      messageClass: "danger",
      autoClose: true
		}
		
		delScore(item.key, fbId);
	}
	commit('ADD_MESSAGE', message_obj);
}

export const removeItemInCart = ({commit}, {item}) => {
	commit('REMOVE_CART_ITEM', {item});
}

export const registerByEmail = (_, {email, password}) => {
	return firebaseAuth().createUserWithEmailAndPassword(email, password);
}

export const logout = ({commit}) => {
  commit('SET_CART', []); // clear current cart
  return firebaseAuth().signOut();
}

export function loginWithEmail (_, {email, password}) {
  return firebaseAuth().signInWithEmailAndPassword(email, password);
}

export function listenToProductList({commit}) {
	return ref.child("products").on('value', (products) => {
		commit('UPDATE_PRODUCT_LIST', products.val());
	});
}

export function getShoppingCart({commit}, {uid, currentCart}) {
	if (uid) {
		return ref.child("cart/" + uid).once('value').then((cart) => {
			// console.log(cart.val());
			if (cart.val() && (!currentCart || currentCart.length == 0)) {
				commit('SET_CART', cart.val());
			}
		});
	} else {
		// console.log("User has not logged in");
	}
}

export function saveShoppingCart(_, {uid, cartItemList}) {
	// console.log("ACTIONS saveShoppingCart");
	// console.log("CART DATA", cartItemList);
	return ref.child("cart/" + uid).set(cartItemList);
}

export function saveToTransaction(_, {uid, cartItemList}) {
	let newTransactionKey = ref.child("transactions").push().key;
	var newTransaction = {}
	newTransaction['/transactions/' + uid + '/' + newTransactionKey] = cartItemList;
	return ref.update(newTransaction);
}
