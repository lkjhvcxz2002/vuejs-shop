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

        <lightbox :id="'mylightbox'+key" 
            ref="lightbox"
            :images="[item]"
            :directory="thumbnailDir"
            :timeoutDuration="5000"
        ></lightbox>
    </div>

    <div class="card-body">
      <h6 class="card-title" style="color: green; font-size: 26px"><a>{{ item.userName }}</a></h6>
      <h6 class="card-subtitle mb-2 remain">
        <a :href="item.fb" target="_blank" style="color: #0054d6; font-size: 20px;" v-if="item.fb">臉書連結</a>
      </h6>
      <div class="row" style="height: 40px;">
        <p class="col-12 lead">投稿組別: {{item.group}}</p>
      </div>
      <div class="row" style="height: 20px;"></div>
      <div class="row" v-if="open">
        <p class="col-6"></p>
        <p class="col-6">
          <button class="btn btn-success pull-right" :disabled="item.quantity === 0" @click="addItem" v-if="!liked">
            <v-icon name="plus"/>
            我喜歡
          </button>
          <button class="btn btn-danger pull-right" :disabled="item.quantity === 0" @click="delItem" v-if="liked == true">
            <v-icon name="heart"/>
            已喜歡
          </button>
        </p>
      </div>
      <div class="row" v-if="open">
        <h2 class="picVoteCount">已經獲得 {{count}} 票</h2>
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
      thumbnailDir: ""
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
      this.$refs.lightbox.show(src);
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
