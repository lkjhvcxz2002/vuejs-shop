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
          <button class="ui small primary button right floated" style="margin-top:15px" v-on:click="seeAll()" v-if="targetId">
            <v-icon name="arrow-left" />
            <span style="vertical-align: middle;font-size: 16px;">&nbsp;  查看全部</span>
          </button>

      </div>
      <div class="row" style="margin-bottom: 10px">
        <div class="col-md-6 col-sm-5">
          <filter-bar v-if="!targetId"></filter-bar>
        </div>
        <div class="col-md-6 col-sm-7">
              <button class="ui violet button pull-right" v-on:click="seeInstruction()" style="height: 35px;" >
              <v-icon name="edit" />
              <span style="vertical-align: middle;font-size: 16px;">&nbsp;  投票說明</span>
            </button>
        </div>
      </div>

      <div class="row">
          <app-product-item v-for="prod in products" :item="prod" :key="prod.key" :displayList="displayList" :open="available"></app-product-item>
      </div>
  </div>
  <SweetModal ref="modal">
    <div class="ui centered">
      <h2 class="ui green button" style="font-size: 20px; cursor: auto">投票說明</h2>
      <div class="ui ordered list" style="margin-top: 60px">
        <div class="item">必須先登入Facebook帳號後才能進行投票 <span class="tiny"> 右上角那個按鈕點下去!</span></div>
        <div class="item">每人投票數量無上限 <span class="tiny"> 歡迎當個狂讚士(ﾟ∀ﾟ)))</span></div>
        <div class="item">按一次[我喜歡]是投票 按兩次[我喜歡]是取消投票 <span class="tiny">這應該不用特別說明... 吧?</span></div>
        <div class="item">點一次圖片會放大 圖片再點一次會縮小  <span class="tiny"> 我忘記幫圖片留邊了 (｡A｡)</span></div>
        <div class="item">如果功能有問題 請嘗試重新整理頁面  <span class="tiny"> 或是走去客廳燒炷香...</span></div>
        <div class="item">如果還是有問題 請畫面截圖聯絡<a target="_blank" href="https://www.facebook.com/profile.php?id=100012111157041">主辦人</a>
          <span class="tiny"> 並且祈禱我沒在上班或睡覺QQ</span>
        </div>
      </div>
    </div>
  </SweetModal>
</div>
</template>

<script>
import Icon from 'vue-awesome'
import { SweetModal } from 'sweet-modal-vue'
import pJson from '../../data/simIdols.json'
import ProductItem from './product/ProductItem.vue';
import GridLoader from 'vue-spinner/src/GridLoader.vue';
import RotateLoader from 'vue-spinner/src/RotateLoader.vue';
import shuffle from './helper/shuffle';
import FilterBar from './product/FilterBar'
import axios from 'axios';
import { setTimeout } from 'timers';

const isOpen = new Date().getTime() > 1567267200000;
// const isOpen = new Date().getTime() > 1567261500000;
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
          "accountId" : element["id"],
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
    'SweetModal': SweetModal,
    'v-icon': Icon,
    appProductItem: ProductItem,
    GridLoader,
    RotateLoader,
    'filter-bar': FilterBar,
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
    },seeInstruction() {
      this.$refs.modal.open();
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

  .tiny {
    font-size: 14px;
    color: cornflowerblue;
  }
</style>
