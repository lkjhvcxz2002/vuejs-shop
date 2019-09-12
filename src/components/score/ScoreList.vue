<template>
<div class="container">
  <div class="row text-center loadingImage">
    <rotate-loader :loading="isLoading" :color="loaderColor" :size="loaderSize"></rotate-loader>
  </div>
  <div v-if="!isLoading">
    <filter-bar></filter-bar>
    <div style="margin-top: 20px" class="col-md-12 col-sm-12">

      <table class="table table-striped table-bordered table-hover table-responsive" >
        <thead>
          <tr>
            <th v-if="reviewer">操作</th>
            <th v-if="reviewer" style="width: 10%">狀態</th>
            <th style="width: 25%">評分結果</th>
            <th>報名序號</th>
            <th>照片編號</th>
            <th style="width: 5%">姓名</th>
            <th>報名組別</th>
            <th style="width: 20%">照片</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(idol, index) in idols" v-if="idol.userName">
            <td v-if="reviewer">

            </td>
            <td v-if="reviewer" style="padding-top: 20px">
              <span class="bg-primary text-white" v-if="idol.isReviewed">
                您以評分完成
                <span class="bg-danger text-white" v-if="idol.scoreMap[reviewer].total == 0">，但給予的總分為0</span>
              </span>
              <span class="bg-secondary  text-white" v-if="!idol.isReviewed">尚未評分</span>
            </td>
            <td v-on:click="showDetail(idol, index)" style="cursor: pointer">
              <div v-if="idol.scoreMap && idol.reviewersScore">
                <h2>總分: {{idol.totalScore.toFixed(2)}} / 100 % </h2>
                <h4 class="percentText">網路投票: {{idol.countScore.toFixed(2)}} / 30 %</h4>
                <h4 class="percentText">評審給分: {{idol.reviewersScore.toFixed(2)}} / 70 %</h4>
                <h4>已有 {{Object.keys(idol.scoreMap).length}} / 3位評審給分</h4>
                <div v-if="idol.isShowDetail">
                  <div v-for="(value, name) in idol.scoreMap">
                    <div>評審: <span style="color: purple">{{name}}</span>, 評分: <span style="color: red">{{value.total}}</span>
                      <br>
                      <span v-if="value.total > 0">
                        <span v-for="(sv, sn) in value.obj">
                          <span style="color: green">{{sn}}</span> - <span style="color: red">{{sv}}</span>,
                        </span>
                      </span>
                      <span v-if="value.total == 0" style="color: red">(該評審未給分數)</span>
                      <hr>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!idol.scoreMap" style="width: 100px">
                <h2>尚未有評審評分</h2>
              </div>
            </td>
            <td>
              {{idol.accountId}}
            </td>
            <td>
              {{idol.key}}
            </td>
            <td style="width: 10%">{{idol.userName}}</td>
            <td>{{idol.group}}</td>
            <td style="text-align: center">
              <span class="ui pink label lableText" v-if="idol.isEnRolled">恭喜獲選，第 {{resultJ['enroll'].indexOf(parseInt(idol.key)) + 1}} 位</span> 
              <span class="ui orange label lableText" v-if="idol.isExcluded">重複獲選，資格遞延</span> 
              <a :href="'/resultPage/' + idol.key"><img :src="idol.thumb" class="card-img p-3"/></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <SweetModal ref="modal">
    <div class="ui centered">
      <h2 class="ui green button" style="font-size: 20px; cursor: auto; margin-bottom: 20px">操作說明</h2>
      <h2>歡迎來到評分系統，{{reviewer}} 老師~</h2>
      <div class="ui ordered list" style="margin-top: 30px">
        <div class="item" v-if="isMobile">建議在電腦螢幕前操作評分系統 手機在顯示橫版圖片會比較模糊 </div>
        <div class="item" v-if="isMobile">左右滑動列表可以觀看更多資訊</div>
        <div class="item">點擊[前往評分]就可以開始評分</div>
        <div class="item">點擊[評分結果]就可以看到其他評審的分數</div>
        <div class="item">評分沒有時間限制 也可以隨時中斷</div>
        <div class="item">只要有送出分數就算完成一張照片的評分 不會重複評分</div>
        <div class="item">如果有任何問題 請立刻與韋晞聯繫!!!</div>
      </div>
    </div>
  </SweetModal>
</div>
</template>

<script>
import FilterBar from '../product/FilterBar'
import sampleData from '../../../data/mockScoreList.json'
import result from '../../../data/result.json'
import axios from 'axios';
import { SweetModal } from 'sweet-modal-vue';
import RotateLoader from 'vue-spinner/src/RotateLoader.vue';

export default {
    data() {
        return {
            isLoading: true,
            loaderColor: "rgba(243, 103, 131, 0.753)",
            loaderSize: "50px",
            isReviewer: true,
            storeIdols: [],
            idols: [],
            reviewer: "",
            css: {
              table: {
                tableClass: 'table table-striped table-bordered table-hover',
                loadingClass: 'loading',
              }
            },
            resultJ: {}
        }
    },
  components: {
    'SweetModal': SweetModal,
    RotateLoader,
    'filter-bar': FilterBar,
  },
  mounted() {
    const _reviewer = window.$cookies.get("reviewer");
    if(_reviewer) {
      this.reviewer = _reviewer ? _reviewer : this.reviewer;
    }

    let url = "/api/getScoreList";
    axios.get(url, {timeout: 10000}).then(res => {
      if(res && res.data && res.data.length > 0) {
        this.storeIdols = res.data;

        // If reviewer, test if reviewed already
        this.resultJ = result;
        if(this.isReviewer) {
          this.storeIdols.forEach(ele => {
            if(ele.scoreMap && ele.scoreMap[this.reviewer] != null) { 
              ele.isReviewed = true; 
            }

            // get count score
            ele.countScore = ((292 - ele.countOrder) / 291 * 30);
            ele.totalScore = ele.countScore + ele.reviewersScore;
            ele.isEnRolled = this.resultJ['enroll'].indexOf(parseInt(ele.key)) != -1;
            ele.isExcluded = this.resultJ['exclude'].indexOf(parseInt(ele.key)) != -1;
          });
        }

        this.isLoading = false;
        this.idols = this.storeIdols;
        // this.$refs.modal.open();    // popup information dialog
        this.orderByScore();
      }
    }).catch(err => {
      this.resultJ = result;
      this.isLoading = false;
      alert("取得資料失敗，請回報主辦單位: " + err)
      this.storeIdols = sampleData;

      this.storeIdols.forEach(ele => {
        ele.isEnRolled = this.resultJ['enroll'].indexOf(parseInt(ele.key)) != -1;
        ele.isExcluded = this.resultJ['exclude'].indexOf(parseInt(ele.key)) != -1;

        // get count score
        ele.countScore = 0;
        ele.totalScore = 0;
      });
      this.storeIdols.sort((a, b) => {return a.accountId - b.accountId});
      this.idols = this.storeIdols;
    })

    // show information dialog
    if($(window).width() < 600) {
      this.isMobile = true;
    }

    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
  },
  methods: {
    toScore(key) {
      location.href = "/scoreOne/" + key;
    },
    showDetail(data, index) {
      data.isShowDetail = !data.isShowDetail;
      this.idols.splice(index, 1, data);
    },
    onFilterSet(filterText) {
      if(filterText) this.idols = this.storeIdols.filter(o => o.userName && o.userName.toLowerCase().indexOf(filterText) != -1);
      else this.idols = this.storeIdols;
    },
    orderByScore() {
      this.idols.sort((a, b) => {return b.totalScore - a.totalScore});
    }
  },
}
</script>

<style src="vue-pure-lightbox/dist/VuePureLightbox.css"></style>
<style lang="scss" scoped>
.lableText {
  font-size: 12px;
}

div.card {
  height: 100%;
}

.card-text {
  font-size: 0.875rem;
}

.thumbImg {
  cursor: pointer;
  max-height: 120px;
}

.remain {
  color: #d17581;
}

.footer {
    height: 50px;
}

.grow {
  transition: all .2s ease-in-out;
}

.grow:hover {
  transform: scale(1.1);
}

.list-group-item {
  float: none;
  width: 100%;
  background-color: #fff;
  margin-bottom: 30px;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 1rem;
  border: 0;
  .thumbnail {
    display: inline-block;
    width: 100%;
  }
  .img-event {
    width: 20%;
    float: left;
    padding: 0 !important;
    margin: 0;
    height: auto;
  }

  .thumbnail-image {
    position: static;
  }

  .card-body {
    float: left;
    width: 80%;
    margin: 0;
  }


  @media (max-width: 767.98px) {
    .percentText {
      font-size: 20px !important;
    }

    .img-event {
      width: 30%;
      float: left;
      padding: 0 !important;
      margin: 0;
    }

    .card-body {
      float: left;
      width: 70%;
      margin: 0;
    }

    .btn-small {
      max-width: 35px !important;
    }
  }
}




.item.list-group-item:before, .item.list-group-item:after
{
    display: table;
    content: " ";
}

.item.list-group-item:after {
  clear: both;
}
</style>
