<template>
<div class="container" :class="{loadingItem: isProductLoading}">
  <div class="row text-center loadingImage">
    <rotate-loader :loading="isImageLoading || isProductLoading" :color="loaderColor" :size="loaderSize"></rotate-loader>
  </div>
  <div class="row" v-if="!isProductLoading">
    <button class="ui small primary button right floated" v-on:click="backToList()">
      <v-icon name="arrow-left" />
      <span style="vertical-align: middle;font-size: 16px;">&nbsp;  返回列表</span>
    </button>
    <button class="ui violet button right floated" v-on:click="seeInstruction()"  >
      <v-icon name="edit" />
      <span style="vertical-align: middle;font-size: 16px;">&nbsp;  評分操作說明</span>
    </button>
    <button class="ui green button right floated" v-on:click="showReviewResult()"><span style="vertical-align: middle;font-size: 16px;">查看其他評分</span></button>
  </div>
  <div style="margin-top: 15px">
    <div v-if="!isProductLoading">
      <h3> 編號: {{ssData.key}}, 姓名: {{ssData.name}}</h3>
      <h5 style="color: red">組別: {{ssData.group}} </h5>
    </div>
    <div class="col-md-5">
      <img :key="ssData.key" class="card-img p-3" style="margin-left: -20px"
         @click="showLightbox()"  
         :src="ssData.pic" @load="loaded" />
      <div class="lightbox" v-if="showLightBox" @click="closeLightbox()"  >
        <img class="lightbox-image" @load="loaded" :src="ssData.pic" />
      </div>
    </div>
    <div class="col-md-7" style="border: 1px white solid" v-if="!isProductLoading">
      <!-- Auto -->
      <div class="row" style="margin-bottom: 20px">
        <div class="form-group">
          <p class="manuTitle">自動配分</p>
          <div class="ui buttons" style="height: 50px">
            <button class="ui button wide" @click="autoScore(0.18)">低</button>
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
          <textarea class="form-control" rows="4" v-model="remark"/>
        </div>
        <div class="col-md-2 col-md-offset-3" style="padding-left: 5px;">
          <p class="manuTitle" >總分</p>
          <input class="ui input massive" style="width: 50px" v-model="getTotal" disabled>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <button class="ui green button pull-right" v-on:click="submit()" v-if="!isRenewScore" style="height: 35px; margin-left: 20px" >送出</button>
          <button class="ui violet button pull-right" v-on:click="resubmit()" v-if="isRenewScore" style="height: 35px; margin-left: 20px" >更新分數</button>
          <button class="ui red button pull-right" v-on:click="clear()" style="height: 35px;" >重置</button>
        </div>
      </div>
      <div class="row"></div>
      <div class="row"></div>
    </div>
  </div>

<SweetModal ref="reviewResult">
    <div class="ui centered">
      <div v-if="ssData.scoreMap && ssData.reviewersScore">
        <h2 class="percentText">{{ssData.reviewersScore.toFixed(2)}} / 70 %</h2>
        <br>
        <h4 style="margin-top: 20px">已有 {{Object.keys(ssData.scoreMap).length}} / 3位評審給分</h4>
        <div v-for="(value, name, index) in ssData.scoreMap">
          <p>評審: <span style="color: purple">{{name}}</span>, 評分:
            <br>
            <span v-for="(sv, sn, si) in value.obj">
              <span style="color: green">{{sn}}</span> - <span style="color: red">{{sv}}</span>,
            </span>
            <hr>
          </p>
        </div>
      </div>
      <div v-if="!ssData.scoreMap">
        <h2>尚未有其他評審評分!!</h2>
      </div>
    </div></SweetModal>

<SweetModal ref="modal">
    <div class="ui centered">
      <h2 class="ui green button" style="font-size: 20px; cursor: auto">評分說明</h2>
      <div class="ui ordered list" style="margin-top: 60px">
        <div class="item">建議在電腦螢幕前操作評分系統 手機在顯示橫版圖片會比較模糊 </div>
        <div class="item">點一次圖片會放大 圖片再點一次會縮小 </div>
        <div class="item">有些圖片可能會有自轉90度的狀況 可以右鍵點圖片[在新分頁中開啟]即可解決 </div>
        <div class="item">各個組別所顯示的評分標準不一樣 但加總起來都會是70分 </div>
        <div class="item">按下[送出]即完成該張照片的評分 評分可以日後回頭修改</div>
        <div class="item">送出完成後 畫面會顯示成功 並且自動跳到下一張照片繼續評分</div>
        <div class="item">如果功能有問題 請嘗試重新整理頁面</div>
        <div class="item">如果還是有問題 請畫面截圖聯絡<a target="_blank" href="https://www.facebook.com/profile.php?id=100012111157041">主辦人</a>
        </div>
      </div>
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
import scoreOrder from '../../../data/order.json'


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
};

let sendOutResult = function(data) {
  let url = "/api/updateOneScore/1e30519bb0748efe2f50ec1f89cf9ebceff9e76260737c9ab44ff54e0509f47b8af3d1e5a4b8b07f012ffd18e9013cf09nN58BBpxis8RLEsAu7zZA==";
  axios.post(url, data).then(res => {
    alert("評分成功!!")
    let nextKey = scoreOrder.indexOf(data["key"]) + 1;
    location.href = "/scoreOne/" + scoreOrder[nextKey];
  }).catch(err => {
    alert("送出結果失敗!");
  });
};

let calculateTotal = function(data) {
  data.reviewersScore = 0;
  let keys = Object.keys(data.scoreMap);
  let validCount = 0;
  keys.forEach(key => {
    if(data.scoreMap[key].total && data.scoreMap[key].total != 0) {
      validCount += 1;
      data.reviewersScore += data.scoreMap[key].total;
    }
  });

  data.reviewersScore = data.reviewersScore / validCount;
}

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
      reviewer: "林妤綾",
      reviewStanadard: reviewStanadards["2"],
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
    const _reviewer = window.$cookies.get("reviewer");
    if(_reviewer) {
      this.reviewer = _reviewer ? _reviewer : this.reviewer;
    } else {
      location.href = "/"
    }

    this.targetId = this.$route.params.key;
    let url = "/api/getScore" + (this.targetId ? "/" + this.targetId : "");
    axios.get(url).then(res => {
      if(res && res.data ) {
        this.ssData = res.data;
      }

      // Get Score result if have
      if(this.ssData.scoreMap && this.ssData.scoreMap[this.reviewer] != null) {
        this.isRenewScore = true;
        this.valuesObj = this.ssData.scoreMap[this.reviewer].obj;   
        this.remark = this.ssData.scoreMap[this.reviewer].remark;
      }
      // Get Group and ReviewStandard
      let standardGroup = this.ssData.group.indexOf("Cosplay") == -1 ? "1" : "2";
      this.reviewStanadard = reviewStanadards[standardGroup];
    }).catch(err => {
      console.log("取得資料失敗，請回報主辦單位: " + err)
    })

    this.$events.$on('image-open', eventData => this.openLoading(eventData));
  },
  methods: {
    showReviewResult() {
      this.$refs.reviewResult.open();
    },
    backToList() {
      location.href = "/scoreList";
    },seeInstruction() {
      this.$refs.modal.open();
    },
    changeDisplay(isList) {
      this.displayList = isList;
    },openLoading(eventData) {
      this.isImageLoading = eventData;
    },seeInstruction() {
      this.$refs.modal.open();
    },showLightbox() {
      this.isImageLoading = true;
      this.showLightBox = true;
    },loaded() {
      this.isProductLoading = false;
      this.isImageLoading = false;
    },closeLightbox() {
      this.showLightBox = false;
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
      if(!this.totalScore) { alert("請確認給予分數後再按送出"); return;}

      let thisScoreMap = {
        "obj": this.valuesObj,
        "remark": this.remark,
        "total": this.totalScore
      }

      this.ssData.scoreMap = this.ssData.scoreMap ? this.ssData.scoreMap : {};
      this.ssData.scoreMap[this.reviewer] = thisScoreMap;
      this.ssData.lastScorer = this.reviewer;

      // calculate total
      calculateTotal(this.ssData);
      sendOutResult(this.ssData);
    },resubmit() {
      if(!this.totalScore) { alert("請確認給予分數後再按送出"); return;}

      if(window.confirm("您即將覆蓋上次的評分，是否確認?")) {
        let thisScoreMap = {
          "obj": this.valuesObj,
          "remark": this.remark,
          "total": this.totalScore
        }
        this.ssData.scoreMap[this.reviewer] = thisScoreMap;
        this.ssData.lastScorer = this.reviewer;

        // calculate total
        calculateTotal(this.ssData);
        sendOutResult(this.ssData);
      }
    }
  }
}
</script>

<style src="vue-pure-lightbox/dist/VuePureLightbox.css"></style>
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
