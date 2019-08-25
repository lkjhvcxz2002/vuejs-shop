<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center" v-if="isProductLoading">
    <grid-loader :loading="isProductLoading" :color="loaderColor" :size="loaderSize"></grid-loader>
  </div>

  <div class="ui">
      <button class="ui small primary button right floated" style="margin-top:15px" v-on:click="seeAll()" v-if="targetId">查看全部</button>
  </div>
      <filter-bar></filter-bar>

  <div class="row" v-if="!isProductLoading">
    <app-product-item v-for="prod in products" :item="prod" :key="prod.key" :displayList="displayList" :open="available"></app-product-item>
  </div>

</div>
</template>

<script>
import { mapActions } from 'vuex';
import pJson from '../../data/simIdols.json'
import ProductItem from './product/ProductItem.vue';
import GridLoader from 'vue-spinner/src/GridLoader.vue';
import shuffle from './helper/shuffle';
import FilterBar from './product/FilterBar'
import { setTimeout } from 'timers';
import axios from 'axios';
import { Promise } from 'q';

const avail = false;

let indexArr = [1, 2];
let jsonArr = [];
pJson.forEach((element) => {
  if(element["name"]) {
    indexArr.forEach((num) => {
      let imageK = "pic" + num;
      if(element[imageK]) {
        jsonArr.push({
          "id" : element["id"],
          "key": element["id"].toString() + num.toString(),
          "name": element["name"],
          "fb": element["fb"],
          "group": element["Group"],
          "pic": element[imageK]
        });
      }
    })
  }
});

jsonArr = shuffle(jsonArr);

export default {
  data() {
    return {
      loaderColor: "#5cb85c",
      loaderSize: "50px",
      displayList: true,
      targetId: "",
      storeProducts: [],
      products: [],
      likedList: [],
      available: avail
    }
  },
  components: {
    appProductItem: ProductItem,
    GridLoader,
    'filter-bar': FilterBar
  }, 
  mounted() {
    // TODO
    let fbId = "testFB"
    this.targetId = this.$route.query.id;
    let url = "/api/getAll" + (this.targetId ? "/" + this.targetId : "");
    axios.get(url).then(res => {
      if(res && res.data && res.data.length > 0) {
        this.storeProducts = shuffle(res.data);
        this.products = this.storeProducts;
        this.products.forEach((ele) => {
          ele.liked = ele.likedList.indexOf(fbId) != -1
          ele.count = ele.count ? ele.count : 0;
        })
      }
    }).catch(err => {
      alert("取得資料失敗，請回報主辦單位")
    })

    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList;
    },onFilterSet (filterText) {
      if(filterText) this.products = this.storeProducts.filter(o => o.name.toLowerCase().indexOf(filterText) != -1);
      else this.products = this.storeProducts;
    },seeAll() {
      location.href = "/main";
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

.action-panel {
  margin-bottom: 10px;
  margin-right: 5px;
}
</style>
