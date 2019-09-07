<template>
<div class="container">
  <filter-bar></filter-bar>
  <div style="margin-top: 20px" class="col-md-12 col-sm-12">

    <table class="table table-striped table-bordered table-hover table-responsive" >
      <thead>
        <tr>
          <th>評選結果</th>
          <th>獲得分數</th>
          <th>報名序號</th>
          <th>照片編號</th>
          <th style="width: 10%">姓名</th>
          <th>報名組別</th>
          <th>照片</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(idol, index) in idols" v-if="idol.userName">
          <td>
            尚未公布
          </td>
          <td v-on:click="showDetail(idol, index)" style="cursor: pointer">
            <p class="resultTest">網路投票: <span class="redText">{{idol.countScore}}</span> / 30% <span class="tinyText">票數: {{idol.count}}, 排名: {{idol.countOrder}}</span></p>
            <p class="resultTest">評審評分: <span class="redText">(尚未完成))</span> / 70%</p>
            <div v-if="idol.isShowDetail">
              <div v-for="(value, name, index) in idol.scoreMap">
                <p>評審: <span style="color: purple">{{name}}</span>, 評分: <span style="color: red">{{value.total}}</span>
                  <br>
                  <span v-if="value.total > 0">
                    <span v-for="(sv, sn, si) in value.obj">
                      <span style="color: green">{{sn}}</span> - <span style="color: red">{{sv}}</span>,
                    </span>
                  </span>
                  <span v-if="value.total == 0" style="color: red">(該評審未給分數)</span>
                  <hr>
                </p>
              </div>
            </div>
            <p class="resultTest">獲得總分: <span class="redText">(尚未完成))</span> / 100%</p>
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
      this.reviewer = _reviewer ? _reviewer : this.reviewer;
    } else {
      location.href = "/"
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

            // get count score
            ele.countScore = ((292 - ele.countOrder) / 291 * 30).toFixed(2);
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
.tinyText {
  color: #d17581;
  font-size: 12px;
}

.redText {
  color: red;
}

.resultTest {
  font-size: 16px
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
