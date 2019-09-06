<template>
<div class="container">
  <filter-bar></filter-bar>
  <div style="margin-top: 20px" class="col-md-12 col-sm-12">

    <table class="table table-striped table-bordered table-hover table-responsive" >
      <thead>
        <tr>
          <th v-if="isReviewer">操作</th>
          <th style="width: 20%">狀態</th>
          <th>評分結果</th>
          <th>報名序號</th>
          <th>照片編號</th>
          <th style="width: 10%">姓名</th>
          <th>報名組別</th>
          <th>照片</th>
          <th v-if="!isReviewer">評選分數</th>
          <th v-if="!isReviewer">評選結果</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(idol, index) in idols" v-if="idol.userName">
          <td>
            <div v-if="idol.isReviewed">
              <button class="btn btn-success btn-small" v-on:click="toScore(idol.key)">修改分數</button>
            </div>
            <div v-if="!idol.isReviewed"> 
              <button class="btn btn-primary btn-small" v-on:click="toScore(idol.key)">前往評分</button>
            </div>
          </td>
          <td style="padding-top: 20px">
            <span class="bg-primary text-white" v-if="idol.isReviewed">您以評分完成</span>
            <span class="bg-secondary  text-white" v-if="!idol.isReviewed">尚未評分</span>
          </td>
          <td v-on:click="showDetail(idol, index)" style="cursor: pointer">
            <div v-if="idol.scoreMap && idol.reviewersScore" style="width: 120px">
              <h2 class="percentText">{{idol.reviewersScore.toFixed(2)}} / 70 %</h2>
              <h4>已有 {{Object.keys(idol.scoreMap).length}} / 3位評審給分</h4>
              <div v-if="idol.isShowDetail">
                <div v-for="(value, name, index) in idol.scoreMap">
                  <p>評審: <span style="color: purple">{{name}}</span>, 評分:
                    <br>
                    <span v-for="(sv, sn, si) in value.obj">
                      <span style="color: green">{{sn}}</span> - <span style="color: red">{{sv}}</span>,
                    </span>
                    <hr>
                  </p>
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
          <td style="width: 10%">
            <img :src="idol.thumb" class="thumbImg" v-on:click="toScore(idol.key)"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <SweetModal ref="modal">
    <div class="ui centered">
      <h2 class="ui green button" style="font-size: 20px; cursor: auto">操作說明</h2>
      <div class="ui ordered list" style="margin-top: 60px">
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
import Vuetable from 'vuetable-2'
import FilterBar from '../product/FilterBar'
import sampleData from '../../../data/mockScoreList.json'
import axios from 'axios';
import { SweetModal } from 'sweet-modal-vue'

export default {
    data() {
        return {
            isReviewer: true,
            storeIdols: [],
            idols: [],
            css: {
              table: {
                tableClass: 'table table-striped table-bordered table-hover',
                loadingClass: 'loading',
              }
            },
            reviewer: "林妤綾",
        }
    },
  components: {
    'SweetModal': SweetModal,
    Vuetable,
    'filter-bar': FilterBar,
  },
  mounted() {
    const _reviewer = window.$cookies.get("reviewer");
    if(_reviewer) {
      if(_reviewer.indexOf("十") != -1) {
        alert("歡迎來到評分系統，十九老師 ~");
      } else {
        alert("歡迎來到評分系統，" + _reviewer + "~");
      }
      this.reviewer = _reviewer ? _reviewer : this.reviewer;
    }

    let url = "/api/getScoreList";
    axios.get(url, {timeout: 10000}).then(res => {
      if(res && res.data && res.data.length > 0) {
        this.storeIdols = res.data;

        this.storeIdols.sort((a, b) => {return a.accountId - b.accountId});

        // If reviewer, test if reviewed already
        if(this.isReviewer) {
          this.storeIdols.forEach(ele => {
            if(ele.scoreMap && ele.scoreMap[this.reviewer] != null) { 
              ele.isReviewed = true; 
            }
          });
        }

        this.idols = this.storeIdols;
      }
    }).catch(err => {
      console.log("取得資料失敗，請回報主辦單位: " + err)
      this.storeIdols = sampleData;
      this.storeIdols.sort((a, b) => {return a.accountId - b.accountId});
      this.idols = this.storeIdols;
    })

    // show information dialog
    if($(window).width() < 600) {
      this.isMobile = true;
    }
    this.$refs.modal.open();
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
    }
  },
}
</script>

<style src="vue-pure-lightbox/dist/VuePureLightbox.css"></style>
<style lang="scss" scoped>
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
