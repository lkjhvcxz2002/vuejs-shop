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
    <app-product-item v-for="prod in products" :item="prod" :key="prod.key" :displayList="displayList"></app-product-item>
  </div>

</div>
</template>

<script>
import pJson from '../../data/simIdols.json'
import ProductItem from './product/ProductItem.vue';
import GridLoader from 'vue-spinner/src/GridLoader.vue';
import shuffle from './helper/shuffle';
import FilterBar from './product/FilterBar'

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

let filterLikedArr = function(likeds) {
  jsonArr.forEach((ele) => {
    if(likeds.indexOf(ele.key) != -1) {
      ele.liked = true;
    } else { ele.liked = false; }
  });
}

export default {
  data() {
    return {
      loaderColor: "#5cb85c",
      loaderSize: "50px",
      displayList: true,
      targetId: "",
      products: [],
      likedList: []
    }
  },
  components: {
    appProductItem: ProductItem,
    GridLoader,
    'filter-bar': FilterBar
  },  
  mounted() {
    setTimeout(() =>{
      this.targetId = this.$route.query.id;
      if(!this.targetId) this.products = jsonArr
      else this.products = jsonArr.filter(o => o.id == this.targetId);

      this.likedList = ["761","762"];
      filterLikedArr(this.likedList);
    }, 500)
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList;
    },onFilterSet (filterText) {
      if(filterText) this.products = jsonArr.filter(o => o.name.toLowerCase().indexOf(filterText) != -1);
      else this.products = jsonArr;
    },seeAll() {
      this.products = jsonArr;
      this.targetId = "";
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
