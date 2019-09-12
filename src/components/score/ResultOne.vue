<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center loadingImage">
    <rotate-loader :loading="isImageLoading || isProductLoading" :color="loaderColor" :size="loaderSize"></rotate-loader>
  </div>
  <div class="row" v-if="!isProductLoading">
    <button class="ui small primary button right floated" @click="$router.go(-1)">
      <v-icon name="arrow-left" />
      <span style="vertical-align: middle;font-size: 16px;">&nbsp;  返回列表</span>
    </button>
  </div>
  <div style="margin-top: 15px">
    <div v-if="!isProductLoading">
      <h3> 編號: {{ssData.key}}, 姓名: {{ssData.name}}</h3>
      <h5 style="color: red">組別: {{ssData.group}} </h5>
    </div>
    <div class="col-md-5 ui raised segment" style="padding-right: 0px">
      <span class="ui pink label ribbon" v-if="!isProductLoading">評審給分 <span style="font-size: 20px"> {{ssData.reviewersScore.toFixed(2)}}</span></span> 
      <img :key="ssData.key" class="card-img p-3" style="margin-left: -20px"
        @click="showLightbox()"  
        :src="ssData.pic" @load="loaded" />
      <div class="lightbox" v-if="showLightBox" @click="closeLightbox()"  >
        <img class="lightbox-image" @load="loaded" :src="ssData.pic" />
      </div>
    </div>
    <div class="col-md-7" v-if="!isProductLoading">
      <div v-for="(scorerResult, scoreName) in ssData.scoreMap">
        <div class="col-md-10" style="border: 1px white solid">
          <div class="row" style="margin-bottom: 10px">
            <span class="ui purple label">評審 </span> <span class="manuTitle">&nbsp; {{scoreName}}</span>
          </div>
          <div class="row" v-for="(value, name, index)  in reviewStanadard">
            <p class="manuTitle">{{name}} </p>
            <div style="margin-left: 12px">
              <h4> => 
                <span v-if="!scorerResult.obj[name]" class="scoreText">0 分</span>
                <span v-if="scorerResult.obj[name]" class="scoreText">{{scorerResult.obj[name]}} 分</span>
                <span class="lead"> &nbsp; (滿分: {{value}}分)</span>
              </h4>
            </div>
          </div>
          <!-- Remark -->
          <div class="row" style="margin-bottom: 20px;" v-if="scorerResult.remark">
            <p class="manuTitle col-md-12" style="margin-left: -15px">評審講評</p>
            <div class="col-md-12">
              <textarea class="form-control" rows="3" v-model="scorerResult.remark" disabled style="width: 60%" resizable/>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="row">
            <p class="ui olive label">總分</p>
            <input class="ui input massive totalinput" style="height: 30px; width: 40px;" v-model="scorerResult.total" disabled>
          </div>
        </div>
        <div class="col-md-12"><hr></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import 'vue-slider-component/theme/antd.css'
import Icon from 'vue-awesome'
import { SweetModal } from 'sweet-modal-vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue';
import axios from 'axios';

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
    "主題性　": 10
  }
}

let _data = {
    "id": "1",
    "key": "11",
    "count": 24,
    "group": "日常生活組",
    "thumb": "https://drive.google.com/thumbnail?id=1xlUOTWBVfPlGGXYC58eU7pU0j2dqSwvK",
    "pic": "http://drive.google.com/uc?export=view&id=1xlUOTWBVfPlGGXYC58eU7pU0j2dqSwvK",
    "name": "吳承勳/小薰",
    "scoreMap": {
        "十九": {
            "obj": {
                "服裝風格": 1
            },
            "remark": "",
            "total": 1
        },
        "Alice": {
            "obj": {
                "視覺美感": 8,
                "妝容造型": 7,
                "服裝風格": 6,
                "照片清晰 & 印刷適切": 8
            },
            "remark": "",
            "total": 29
        },
        "林妤綾": {
            "obj": {
                "視覺美感": 3,
                "妝容造型": 5,
                "服裝風格": 5,
                "照片清晰 & 印刷適切": 10
            },
            "remark": "想做出吐舌頭可愛的感覺這個表情NG，但是動作是沒問題的！髮型和妝容有點不搭~",
            "total": 23
        }
    },
    "reviewersScore": 17.666666666666668
};

export default {
  data() {
    return {
      loaderColor: "rgba(243, 103, 131, 0.753)",
      loaderSize: "50px",
      isImageLoading: false,
      isProductLoading: true,
      showLightBox: false,
      isRenewScore: false,
      remark: "",
      ssData: _data,
      reviewStanadard: reviewStanadards["1"],
      valuesObj: {},
      totalScore: 0
    }
  },
  components: {
    'SweetModal': SweetModal,
    'v-icon': Icon,
    RotateLoader
  },
  computed: {
  },
  mounted() {
    this.targetId = this.$route.params.key;
    let url = "/api/getScore" + (this.targetId ? "/" + this.targetId : "");
    axios.get(url).then(res => {
      if(res && res.data ) {
        this.ssData = res.data;

        // Get Group and ReviewStandard
        let standardGroup = this.ssData.group.indexOf("Cosplay") == -1 ? "1" : "2";
        this.reviewStanadard = reviewStanadards[standardGroup];
      }
    }).catch(err => {
      console.log(err);
    })

    this.$events.$on('image-open', eventData => this.openLoading(eventData));
  },
  methods: {
    showReviewResult() {
      this.$refs.reviewResult.open();
    },
    backToList() {
      location.href = "/resultPage";
    },
    changeDisplay(isList) {
      this.displayList = isList;
    },openLoading(eventData) {
      this.isImageLoading = eventData;
    },showLightbox() {
      this.isImageLoading = true;
      this.showLightBox = true;
    },loaded() {
      this.isProductLoading = false;
      this.isImageLoading = false;
    },closeLightbox() {
      this.showLightBox = false;
    }
  }
}
</script>

<style src="vue-pure-lightbox/dist/VuePureLightbox.css"></style>
<style>
.scoreText {
  color: red;
}

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
  font-size: 18px;
  font-weight: bold;
}

button.wide {
  width: 35%;
  border: 1px black solid !important;
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
      border: 1px black solid;
    }

    .lightbox-image {
      display: block;
      height: auto;
      width: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
  }
</style>
