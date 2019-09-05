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
              <button class="btn btn-success" v-on:click="toScore(idol.key)">修改分數</button>
            </div>
            <div v-if="!idol.isReviewed"> 
              <button class="btn btn-primary" v-on:click="toScore(idol.key)">前往評分</button>
            </div>
          </td>
          <td style="padding-top: 20px">
            <span class="bg-primary text-white" v-if="idol.isReviewed">評分完成</span>
            <span class="bg-secondary  text-white" v-if="!idol.isReviewed">尚未評分</span>
          </td>
          <td>
            <div v-if="idol.scoreMap && idol.reviewersScore" @mouseover="showDetail = true" @mouseleave="showDetail = false">
              <h2>{{idol.reviewersScore.toFixed(2)}} / 70 %</h2>
              <h4 v-on:click="idol.showDetail = true">已有 {{Object.keys(idol.scoreMap).length}} / 3位評審給分</h4>
              <div v-if="idol.showDetail">
                <div v-for="(value, name, index) in idol.scoreMap">
                  <span>評審: {{name}}, 給予 {{value.total}} 分</span>
                </div>
              </div>
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
  <div class="footer"></div>
</div>
</template>

<script>
import Vuetable from 'vuetable-2'
import FilterBar from '../product/FilterBar'
import sampleData from '../../../data/mockScoreList.json'
import axios from 'axios';

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
    Vuetable,
    'filter-bar': FilterBar,
  },
  mounted() {
    const _reviewer = window.$cookies.get("reviewer");
    if(_reviewer) {
      alert("歡迎來到評分系統，" + _reviewer);
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

    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData));
  },
  methods: {
    toScore(key) {
      location.href = "/scoreOne/" + key;
    },
    showDetail() {
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
