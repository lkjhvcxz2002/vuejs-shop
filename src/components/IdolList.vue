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
import pJson from '../../data/idols.json'
import { mapGetters } from 'vuex'
import idolTable from './product/IdolTable.vue';
import GridLoader from 'vue-spinner/src/GridLoader.vue';

pJson.forEach((element, index) => {
  element.id = index + 1;
});

export default {
  data() {
    return {
      loaderColor: "#5cb85c",
      loaderSize: "50px",
      filter: "",
      PPJson: []
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

    this.PPJson = pJson;
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
    this.$events.$on('filter-reset', e => this.onFilterReset());
  },
  methods: {
    onFilterSet (filterText) {
      if(filterText) this.PPJson = pJson.filter(o => o.name.toLowerCase().indexOf(filterText) != -1);
      else this.PPJson = pJson;
    },
    onFilterReset () {
      console.log('filter-reset')
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
