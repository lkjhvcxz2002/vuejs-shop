<template>
<div class="container">
  <filter-bar></filter-bar>
  <div style="margin-top: 20px" class="col-md-12 col-sm-12">
    <table class="table table-striped table-bordered table-hover table-responsive" >
      <thead>
        <tr>
            <th style="width: 25%" v-if="openResult">評分結果</th>
            <th>報名序號</th>
            <th>照片編號</th>
            <th style="width: 5%">姓名</th>
            <th>報名組別</th>
            <th style="width: 20%">照片</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(idol, index) in idols" v-if="idol.userName">
          <td @click="showDetail(idol, index)" style="cursor: pointer" v-if="openResult">
            <p class="resultTest">網路投票: <span class="redText">{{idol.countScore.toFixed(2)}}</span> / 30%</p>
            <p class="tinyText">票數: {{idol.count}}, 排名: {{idol.countOrder}}</p>
            <p class="resultTest">評審評分: <span class="redText">{{idol.reviewersScore.toFixed(2)}}</span> / 70%</p>
            <p class="tinyText">(點我看細節)</p>
            <p class="resultTest">獲得總分: <span class="redText">{{idol.totalScore.toFixed(2)}}</span> / 100%</p>
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
          </td>
          <td>
            {{idol.accountId}}
          </td>
          <td>
            {{idol.key}}
          </td>
          <td>{{idol.userName}}</td>
          <td>{{idol.group}}</td>
          <td style="text-align: center" v-if="openResult">
              <span class="ui pink label lableText" v-if="idol.isEnRolled">恭喜獲選，第 {{resultJ['enroll'].indexOf(parseInt(idol.key)) + 1}} 位</span> 
              <span class="ui orange label lableText" v-if="idol.isExcluded">重複獲選，資格遞延</span> 
              <a :href="'/resultPage/' + idol.key"><img :src="idol.thumb" class="card-img p-3"/></a>
          </td>
          <td v-if="!openResult">
            <img :src="idol.thumb" class="card-img p-3"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import FilterBar from '../product/FilterBar'
import axios from 'axios';
import result from '../../../data/result.json'
import { SweetModal } from 'sweet-modal-vue'

export default {
    data() {
        return {
          openResult: false,
          storeIdols: [],
          idols: [],
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
    'filter-bar': FilterBar,
  },
  mounted() {
    this.openResult = new Date().getTime() > 1568304000000;

    let url = "/api/getScoreList";
    axios.get(url, {timeout: 10000}).then(res => {
      if(res && res.data && res.data.length > 0) {
        this.storeIdols = res.data;
        
        this.resultJ = result;
        this.storeIdols.forEach(ele => {
          // get count score
          ele.countScore = ((292 - ele.countOrder) / 291 * 30);
          ele.totalScore = ele.countScore + ele.reviewersScore;
          ele.isEnRolled = this.resultJ['enroll'].indexOf(parseInt(ele.key)) != -1;
          ele.isExcluded = this.resultJ['exclude'].indexOf(parseInt(ele.key)) != -1;
        });

        this.isLoading = false;
        this.idols = this.storeIdols;
        // this.$refs.modal.open();    // popup information dialog
        if(this.openResult) this.orderByScore();
        else this.storeIdols.sort((a, b) => { return a.accountId - b.accountId})
      }
    }).catch(err => {
      alert("取得資料失敗，請回報主辦單位: " + err)
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
    },
    orderByScore() {
       this.storeIdols.sort((a, b) => {return b.totalScore - a.totalScore});
      this.idols.sort((a, b) => {return b.totalScore - a.totalScore});
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
