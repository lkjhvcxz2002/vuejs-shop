<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center" v-if="isProductLoading">
    <grid-loader :loading="isProductLoading" :color="loaderColor" :size="loaderSize"></grid-loader>
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

export default {
  data() {
    return {
      loaderColor: "#5cb85c",
      loaderSize: "50px",
      displayList: true,
      products: []
    }
  },
  components: {
    appProductItem: ProductItem,
    GridLoader,
    'filter-bar': FilterBar
  },  
  mounted() {
    setTimeout(() =>{
      let targetId = this.$route.query.id;
      if(!targetId) this.products = jsonArr
      else this.products = jsonArr.filter(o => o.id == targetId);
    }, 500)
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList;
    },onFilterSet (filterText) {
      if(filterText) this.products = jsonArr.filter(o => o.name.toLowerCase().indexOf(filterText) != -1);
      else this.products = jsonArr;
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
