<template>
<div >
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
  {name: 'accountId', title: '編號'},  
  {name: 'name', title: '姓名'},
  {name: 'fb', title: '臉書網址', callback: showLink},
  {name: 'group', title: '報名組別'},
  {name: 'key', title: '照片編號'},
  {name: 'pic', title: '照片', callback: showImage}
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
    Vuetable,
    'filter-bar': FilterBar,
  },
  props: ['filter', 'displayList'],
  mounted() {
  },
  methods: {
    toDetail() {
        let detailUrl = "https://docs.google.com/document/d/1xwfDpqRQRX6Q4Hze4SVLbhuNQF4K1Z0rl30cIk2Cb7c/edit?usp=sharing";
        window.open(detailUrl, "_blank");
    },
    toRegister() {
        var ret = window.confirm("報名前請先確認閱讀過活動細節~") ;
        if(ret == true) {let registerUrl ="https://docs.google.com/forms/d/1LRwxeKCBumzFuQ-lOlxYJbMdBCvSSB2EbgV_WDJshiw/edit";
            window.open(registerUrl, "_blank");}
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
