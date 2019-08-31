<template>
<div class="col-sm-5 col-md-4" :class="{'list-group-item': displayList}">
  <div class="thumbnail card">
    <div class="img-event intrinsic">
      <!-- <img :src="item.pic" class="thumbnail-image card-img-top intrinsic-item p-3" v-if="item.pic.indexOf('?v') != -1"/> -->
      <!-- <VuePureLightbox class="thumbnail-image card-img-top intrinsic-item p-3" v-if="item.pic.indexOf('?v') == -1"
          :thumbnail="item.thumb"
          :images="[item.pic]"
        />  -->
       <img :key="item.key" class="thumbnail-image card-img-top intrinsic-item p-3"
         @click="showLightbox(item.name)"  
         :src="item.thumb"  />

        <!-- <lightbox :id="'mylightbox'+item.key" 
            ref="lightbox"
            :images="[item]"
            :directory="thumbnailDir"
            :timeoutDuration="5000"
        ></lightbox> -->
        <div class="lightbox" v-if="show" @click="closeLightbox(item.name)"  >
          <img class="lightbox-image" @load="loaded" :src="item.pic" />
        </div>
    </div>

    <div class="card-body">
      <div class="row"> 
        <p class="col-xs-12" style="color: green; font-size: 26px"><a :href="directLink">{{ item.userName }}</a></p>
        <br>
        
      </div>
      <div class="row">
        <p class="col-xs-12">
          <a :href="item.fb" target="_blank" style="color: #0054d6; font-size: 20px;" v-if="item.fb && item.fb.indexOf('http') != -1">臉書連結</a>
        </p>
      </div>
      <div class="row" >
        <p class="col-xs-12 lead">投稿組別: {{item.group}}</p>
      </div>
      <div class="row" v-if="open" style="padding-top: 20px">
        <p class="col-xl-12">
          <button class="btn btn-success btn-lg" :disabled="item.quantity === 0" @click="addItem" v-if="!liked">
            <v-icon name="plus"/>
            我喜歡
          </button>
          <button class="btn btn-danger btn-lg" :disabled="item.quantity === 0" @click="delItem" v-if="liked == true">
            <v-icon name="heart"/>
            已喜歡
          </button>
        </p>
      </div>
      <div class="row" v-if="open">
        <span class="picVoteCount">已經獲得 {{count}} 票 </span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapActions
} from 'vuex';
import Icon from 'vue-awesome'
import VuePureLightbox from 'vue-pure-lightbox'
import Lightbox from 'vue-my-photos'

export default {
  components: {
    'v-icon': Icon,
    'VuePureLightbox': VuePureLightbox,
    'Lightbox': Lightbox,
  },
  data() {
    return {
      liked: this.item.liked,
      count: this.item.count,
      thumbnailDir: "",
      show: false,
      directLink: "/main?id=" + this.item.accountId
    }
  },
  props: ['item', 'displayList', 'open'],
  methods: {
    ...mapActions(['updateCart']),
    addItem() {
      this.liked = true;
      this.count++;
      const order = {
        item: Object.assign({}, this.item),
        isAdd: true
      };
      this.updateCart(order);
    },
    delItem() {
      this.liked = false;
      this.count--;
      const order = {
        item: Object.assign({}, this.item),
        isAdd: false
      };
      this.updateCart(order);
    },
    showLightbox(src) {
      this.$events.fire('image-open', true)
      this.show = true;
    },
    closeLightbox() {
      this.show = false;
    },
    loaded() {
      this.$events.fire('image-open', false)
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

.lead {
  font-size: 1.5em;
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

.grow {
  transition: all .2s ease-in-out;
}

.grow:hover {
  transform: scale(1.1);
}

.picVoteCount {
  color: purple;
  font-size: 24px;
  margin-left: 20px;
  margin-top: 20px;
  text-align: right;
}

.list-group-item {
  background-color: #fff;
  margin-bottom: 30px;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  padding: 0 1rem;
  border: 0;
  .thumbnail {
    display: inline-block;
    width: 100%;
  }
  .img-event {
    width: 100%;
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
    width: 100%;
    margin: 0;
  }

  @media (max-width: 767.98px) {
    .img-event {
      width: 65%;
      float: left;
      padding: 0 !important;
      margin: 0;
    }

    .card-body {
      float: left;
      width: 35%;
      margin: 0;
    }

    .picVoteCount {
      margin-top: 40px;
      font-size: 18px;
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
