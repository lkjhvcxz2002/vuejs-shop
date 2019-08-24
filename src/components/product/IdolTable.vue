<template>
<div >
    <div class="ui">
        <button class="ui small primary button right floated" v-on:click="toRegister()">報名參加</button>
        <button class="ui small positive button right floated" v-on:click="toDetail()">活動細節</button>
    </div>
  <filter-bar></filter-bar>
  <Vuetable ref="vuetable"
    :data="displayList"
    :fields="fields"
    :css="css.table"
  ></Vuetable>
  <div class="footer"></div>
</div>
</template>

<script>
import {
  mapActions, mapGetters
} from 'vuex';
import Icon from 'vue-awesome'
import VuePureLightbox from 'vue-pure-lightbox'

import Vuetable from 'vuetable-2'
import FilterBar from './FilterBar'

let showImage = function(value) {
  if(!value) return "<span>(無資料)</span>";
  return "<a href='" + value + "' target='_blank'>圖片連結</a>";
};
let showLink = function(value) {
  if(!value) return "<span>(無資料)</span>";
  if(value.indexOf("http") != -1) return "<a href='" + value + "' target='_blank'>臉書網址</a>";
  else return "<span>" + value + "</span>";
};

let fields = [
  {name: 'id', title: '序號'},  
  {name: 'name', title: '姓名'},
  {name: 'fb', title: '臉書網址', callback: showLink},
  {name: 'Group', title: '報名組別'},
  {name: 'pic1', title: '照片一', callback: showImage},
  {name: 'pic2', title: '照片二', callback: showImage},
]

export default {
    data() {
        return {
            fields: fields,
            css: {
              table: {
                tableClass: 'table table-striped table-bordered table-hover',
                loadingClass: 'loading',
              }
            }
        }
    },
  components: {
    'v-icon': Icon,
    'VuePureLightbox': VuePureLightbox,
    Vuetable,
    'filter-bar': FilterBar,
  },
  props: ['filter', 'displayList'],
  mounted() {
  },
  methods: {
    ...mapActions(['updateCart']),
    addItem() {
      const order = {
        item: Object.assign({}, this.item),
        quantity: 1,
        isAdd: true
      };
      this.updateCart(order);
    },
    toDetail() {
        let detailUrl = "https://docs.google.com/document/d/1xwfDpqRQRX6Q4Hze4SVLbhuNQF4K1Z0rl30cIk2Cb7c/edit?usp=sharing";
        window.open(detailUrl, "_blank");
    },
    toRegister() {
        window.confirm("報名前請先確認閱讀過活動細節~", function() {
            let registerUrl ="https://docs.google.com/forms/d/1LRwxeKCBumzFuQ-lOlxYJbMdBCvSSB2EbgV_WDJshiw/edit";
            window.open(registerUrl, "_blank");
        }, function(){}) ;
    }
  },
  filters: {
    shortDescription(value) {
      if (value && value.length > 100) {
        return value.substring(0, 100) + '...';
      } else {
        return value;
      }
    }
  }
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
