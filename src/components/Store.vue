<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center" v-if="isProductLoading">
    <grid-loader :loading="isProductLoading" :color="loaderColor" :size="loaderSize"></grid-loader>
  </div>
  <div class="row text-center loadingImage">
    <rotate-loader :loading="isImageLoading" :color="loaderColor" :size="loaderSize"></rotate-loader>
  </div>
  <div  v-if="!isProductLoading">
      <!-- Sort by -->
      <div class="row" v-if="!targetId">
        <div class="col-md-4 col-md-offset-4 btn-group btn-group-toggle">
          <button type="radio" class="btn btn-secondary" :class="{'active': sortBy == 'random'}" v-on:click="sortByRandom()">隨機排序</button>
          <button type="radio" class="btn btn-secondary" :class="{'active': sortBy == 'seq'}" v-on:click="sortBySeq()">報名順序</button>
          <button type="radio" class="btn btn-secondary" :class="{'active': sortBy == 'count'}" v-on:click="sortByCount()">人氣排序</button>
        </div>
      </div>

      <!-- Filter & See All -->
      <div class="row" style="margin-left: 10px; margin-bottom: 20px">
          <button class="ui small primary button right floated" style="margin-top:15px" v-on:click="seeAll()" v-if="targetId">查看全部</button>
      </div>
      <filter-bar v-if="!targetId"></filter-bar>

      <div class="row">
          <app-product-item v-for="prod in products" :item="prod" :key="prod.key" :displayList="displayList" :open="available"></app-product-item>

      </div>
  </div>

</div>
</template>

<script>
import pJson from '../../data/simIdols.json'
import ProductItem from './product/ProductItem.vue';
import GridLoader from 'vue-spinner/src/GridLoader.vue';
import RotateLoader from 'vue-spinner/src/RotateLoader.vue';
import shuffle from './helper/shuffle';
import FilterBar from './product/FilterBar'
import axios from 'axios';
import { setTimeout } from 'timers';

// const isOpen = new Date().getTime() > 1567267200000;
const isOpen = new Date().getTime() > 156726720;
const avail = window.$cookies.get("fbId") != null;

let indexArr = [1, 2];
let jsonArr = [];
pJson.forEach((element) => {
  if(element["name"]) {
    indexArr.forEach((num) => {
      let imageK = "pic" + num;
      let thumbK = "thumb" + num;
      if(element[imageK]) {
        jsonArr.push({
          "id" : element["id"],
          "key": element["id"].toString() + num.toString(),
          "userName": element["name"],
          "fb": element["fb"],
          "group": element["Group"],
          "pic": element[imageK],
          "thumb": element[thumbK],
          "name": element[imageK]
        });
      }
    })
  }
});

jsonArr = shuffle(jsonArr);

export default {
  data() {
    return {
      loaderColor: "rgba(243, 103, 131, 0.753)",
      loaderSize: "50px",
      isImageLoading: false,
      displayList: true,
      targetId: "",
      storeProducts: [],
      products: [],
      likedList: [],
      available: avail && isOpen,
      isProductLoading: true,
      sortBy: 'random'
    }
  },
  components: {
    appProductItem: ProductItem,
    GridLoader,
    RotateLoader,
    'filter-bar': FilterBar
  }, 
  mounted() {
    // TODO
    let fbId = window.$cookies.get("fbId");
    console.log("FB ID is : " + JSON.stringify(fbId));
    if(!fbId && avail) location.href="/";
    this.targetId = this.$route.query.id;
    let url = "/api/getAll" + (this.targetId ? "/" + this.targetId : "");
    axios.get(url).then(res => {
      if(res && res.data && res.data.length > 0) {
        this.storeProducts = shuffle(res.data);
        this.products = this.storeProducts;
        this.products.forEach((ele) => {
          ele.liked = ele.likedList.indexOf(fbId) != -1
          ele.count = ele.count ? ele.count : 0;
          ele.name = ele.pic;
        })
      }

      this.isProductLoading = false;
    }).catch(err => {
      this.storeProducts = jsonArr;
      this.products = jsonArr;
      alert("取得資料失敗，請回報主辦單位: " + err)
      this.isProductLoading = false;
    })

    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
    this.$events.$on('image-open', eventData => this.openLoading(eventData));
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList;
    },onFilterSet (filterText) {
      if(filterText) this.products = this.storeProducts.filter(o => o.userName.toLowerCase().indexOf(filterText) != -1);
      else this.products = this.storeProducts;
    },seeAll() {
      location.href = "/main";
    },sortByRandom() {
      this.sortBy = 'random';
      this.products = shuffle(this.products);
    },sortByCount() {
      this.sortBy = 'count';
      this.products.sort(function(a, b) {
        return b["count"] - a["count"];
      });
    },sortBySeq() {
      this.sortBy = 'seq';
      this.products.sort((a, b) => { return a.accountId - b.accountId;})
    },openLoading(eventData) {
      this.isImageLoading = eventData;
    }
  }
}
</script>

<style>
.loadingItem {
  align-items: center;
  justify-content: center;
  display: flex;
}

.loadingImage {
  align-items: center;
  justify-content: center;
  display: flex;
      position: fixed;
    left: 50%;
    top: 48%;
    z-index: 300;
}

.action-panel {
  margin-bottom: 10px;
  margin-right: 5px;
}
</style>
