<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center" v-if="isProductLoading">
    <grid-loader :loading="isProductLoading" :color="loaderColor" :size="loaderSize"></grid-loader>
  </div>

  <idolTable :filter="filter" :display-list="PPJson"></idolTable>
  <!-- <filter-bar></filter-bar>
  <Vuetable ref="vuetable"
    :data="products"
    :fields="fields"
  ></Vuetable> -->
  <!-- <div class="row" v-if="!isProductLoading">
    <app-product-item v-for="prod in products" :item="prod" :key="prod.id" :displayList="displayList"></app-product-item>
  </div> -->
    <!-- <img :src="props.rowData.thumbnail_url" slot="_image" slot-scope="props"/> -->
</div>
</template>

<script>
import pJson from '../../data/simIdols.json'
import { mapGetters } from 'vuex'
import idolTable from './product/IdolTable.vue';
import GridLoader from 'vue-spinner/src/GridLoader.vue';
import axios from 'axios';

export default {
  data() {
    return {
      loaderColor: "#5cb85c",
      loaderSize: "50px",
      filter: "",
      PPJson: [],
      storeProducts: []
    }
  },
  computed: {
    ...mapGetters(['products', 'isProductLoading'])
  },
  components: {
    GridLoader,
    idolTable
  },
  mounted() {
    let fbId = "testFB"
    this.targetId = this.$route.query.id;
    let url = "/api/getAll" + (this.targetId ? "/" + this.targetId : "");
    axios.get(url).then(res => {
      if(res && res.data && res.data.length > 0) {
        res.data.sort((a, b) => a.accountId - b.accountId);
        this.storeProducts = res.data;
        this.PPJson = this.storeProducts;
        this.PPJson.forEach((ele) => {
          ele.liked = ele.likedList.indexOf(fbId) != -1
          ele.count = ele.count ? ele.count : 0;
        })
      }
    }).catch(err => {
      this.storeProducts = pJson;
      this.PPJson = pJson;
      alert("取得資料失敗，請回報主辦單位: " + err)
    })

    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
  },
  methods: {
    onFilterSet (filterText) {
      if(filterText) this.PPJson = this.storeProducts.filter(o => o.userName.toLowerCase().indexOf(filterText) != -1);
      else this.PPJson = this.storeProducts;
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
