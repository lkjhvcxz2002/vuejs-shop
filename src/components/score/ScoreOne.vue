<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center loadingImage">
    <rotate-loader :loading="isImageLoading || isProductLoading" :color="loaderColor" :size="loaderSize"></rotate-loader>
  </div>
  <div>
    <h1> <v-icon name="heart"/> 編號: {{ssData.key}}, 姓名: {{ssData.name}}</h1>
    <div class="col-md-5">
      <img :key="ssData.key" class="thumbnail-image card-img intrinsic-item p-3"
         @click="showLightbox()"  
         :src="ssData.pic" @load="loaded" />
      <div class="lightbox" v-if="show" @click="closeLightbox()"  >
        <img class="lightbox-image" @load="loaded" :src="ssData.pic" />
      </div>
    </div>
    <div class="col-md-7" style="border: 1px white solid">
      <!-- Auto -->
      <div class="row" style="margin-bottom: 20px">
        <div class="form-group">
          <p class="manuTitle">自動配分</p>
          <div class="ui buttons">
            <button class="ui button wide" @click="autoScore(0.2)">低</button>
            <button class="ui button wide" @click="autoScore(0.35)">中低</button>
            <button class="ui button wide" @click="autoScore(0.5)">普通</button>
            <button class="ui button wide" @click="autoScore(0.65)">中高</button>
            <button class="ui button wide" @click="autoScore(0.8)">高</button>
          </div>
        </div>
      </div>

      <div class="row" v-for="(value, name, index)  in reviewStanadard">
        <p class="manuTitle">{{name}} <span class="lead">(總分佔比: {{value}}%)</span></p>
        <div style="width: 70%">
          <vue-slider v-model="valuesObj[name]" :dotSize="30" :max="value"/>
        </div>
        <div style="width: 30%">
          <input class="ui input massive scoreNumInput" v-model="valuesObj[name]" disabled>
        </div>
      </div>
      <div class="row" style="margin-bottom: 20px;">
        <p class="manuTitle col-md-12" style="margin-left: -15px">評審講評 <span class="lead">(非必填)</span></p>
        <div class="col-md-7">
          <textarea class="form-control" rows="4"/>
        </div>
        <div class="col-md-2 col-md-offset-3">
          <p class="manuTitle" >總分</p>
          <input class="ui input massive" style="width: 50px" v-model="getTotal" disabled>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <button class="ui green button pull-right" v-on:click="submit()" style="height: 35px; margin-left: 20px" >送出</button>
          <button class="ui red button pull-right" v-on:click="clear()" style="height: 35px;" >重置</button>
        </div>
      </div>
      <div class="row"></div>
      <div class="row"></div>
    </div>
  </div>

  <SweetModal ref="modal">
    <div class="ui centered">
      <h2 class="ui green button" style="font-size: 20px; cursor: auto">投票說明</h2>

    </div>
  </SweetModal>
</div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import Icon from 'vue-awesome'
import { SweetModal } from 'sweet-modal-vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue';
import axios from 'axios';

// const avail = window.$cookies.get("fbId") != null;

let reviewStanadards = {
  "1": {
    "視覺美感": 20,
    "妝容造型": 15,
    "服裝風格": 15,
    "照片清晰 & 印刷適切": 20
  }, 
  "2": {
    "視覺美感": 20,
    "畫面構圖": 15,
    "妝容造型": 15,
    "服裝風格": 10,
    "主題性": 10
  }
}

let _data = {
    "id": "117",
    "key": "1172",
    "count": 114,
    "group": "日常生活組",
    "thumb": "https://drive.google.com/thumbnail?id=1P2VVOZfuF9rvJjZWEtcjQlBKX1CO3K02",
    "pic": "http://drive.google.com/uc?export=view&id=1P2VVOZfuF9rvJjZWEtcjQlBKX1CO3K02",
    "name": "林韋晞",
    "scoreMap": {},
    "total": 50
};

let randomNum = function(double) {
  return (Math.random() * 0.35 * double) + double;
}

export default {
  data() {
    return {
      loaderColor: "rgba(243, 103, 131, 0.753)",
      loaderSize: "50px",
      isImageLoading: false,
      isProductLoading: true,
      show: false,
      ssData: _data,
      reviewer: "林妤綾",
      reviewStanadard: reviewStanadards["1"],
      valuesObj: {},
      totalScore: 0
    }
  },
  components: {
    'SweetModal': SweetModal,
    'v-icon': Icon,
    RotateLoader,
    VueSlider
  },
  computed: {
    getTotal: {
      set(newVal) {},
      get() {
        this.totalScore = 0;
        let okeys = Object.keys(this.valuesObj);
        if(okeys && okeys.length > 0) {
          okeys.forEach(o => {
            this.totalScore += this.valuesObj[o];
          })
        } 
        return this.totalScore;
      }
    }
  },
  mounted() {
    this.targetId = this.$route.params.key;
    let url = "/api/getScore" + (this.targetId ? "/" + this.targetId : "");
    axios.get(url).then(res => {
      if(res && res.data ) {
        this.ssData = res.data;
      }
      let standardGroup = this.ssData.group.indexOf("Cosplay") == -1 ? "1" : "2";
      this.reviewStanadard = reviewStanadards[standardGroup];
    }).catch(err => {
      console.log("取得資料失敗，請回報主辦單位: " + err)
    })

    this.$events.$on('image-open', eventData => this.openLoading(eventData));
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList;
    },openLoading(eventData) {
      this.isImageLoading = eventData;
    },seeInstruction() {
      this.$refs.modal.open();
    },showLightbox() {
      this.isImageLoading = true;
      this.show = true;
    },loaded() {
      this.isProductLoading = false;
      this.isImageLoading = false;
    },closeLightbox() {
      this.show = false;
    },autoScore(per) {
      let tempValuesObj = {};
      let okeys = Object.keys(this.reviewStanadard);
      console.log(okeys);
      if(okeys && okeys.length > 0) {
        okeys.forEach(o => {
          let _score = (this.reviewStanadard[o] * randomNum(per));
          tempValuesObj[o] = Math.round(_score > this.reviewStanadard[o] ? this.reviewStanadard[o] : _score);
          console.log(tempValuesObj[o]);
        });
      }
      
      this.valuesObj = tempValuesObj;
    },clear() {
      this.valuesObj = {};
    },submit() {
      let thisScoreMap = {
        "obj": this.valuesObj,
        "total": this.totalScore
      }

      this.ssData.scoreMap = this.ssData.scoreMap ? this.ssData.scoreMap : {};
      this.ssData.scoreMap[this.reviewer] = thisScoreMap;
      let url = "/api/updateOneScore/" + process.env.Pass_Word;
      axios.post(url, this.ssData).then(res => {
        alert("成功!!")
      }).catch(err => {
        alert("送出結果失敗!");
      })
    }
  }
}
</script>

<style>
.scoreNumInput {
  margin-left: 50%;
  width: 50px;
  font-size: 5em;
  text-align: right;
}

.lead {
  font-size: 2em;
}

.manuTitle{
  font-size: 24px;
  font-weight: bold;
}

button.wide {
  width: 35%;
}

.thumbnail-image {
  position: static;
}

.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .9);
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    color: rgba(255,255,255,0.8);
}

.lightbox-image {
    display: block;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

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

  @media (max-width: 500.98px) {
    button.wide {
      width: 25%;
    }
  }
</style>
