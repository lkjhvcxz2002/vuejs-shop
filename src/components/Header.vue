<template>
<nav class="navbar navbar-expand-sm navbar-dark bg-pink" role="navigation">
  <div class="container">
    <router-link to="/" class="navbar-brand mr-auto webTitle">2020 偽娘桌曆徵選 </router-link>
    <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTop"
        aria-controls="navbarTop"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTop" :class="{show: isNavOpen}">
      <ul class="navbar-nav mr-auto">

      </ul>
      <ul class="nav navbar-nav">
        <router-link to="/list" tag="li" v-if="!isLoggedIn" class="nav-item" active-class="active">
          <a class="nav-link">參加者列表</a>
        </router-link>
        <li v-on:click="toDetail()" tag="li" v-if="!isLoggedIn" style="cursor:pointer" class="nav-item" active-class="active">
          <a class="nav-link">活動細節</a>
        </li>
        <li v-on:click="toRegister()" tag="li" v-if="!isLoggedIn" style="cursor:pointer" class="nav-item" active-class="active">
          <a class="nav-link">報名參加 <span class="span-remark">(08/31截止)</span></a>
        </li>
        <!-- <router-link to="/main" tag="li" v-if="!isLoggedIn" class="nav-item" disabled>
          <a class="nav-link">投票(09/01開放)</a>
        </router-link> -->
        <li class="nav-item">
          <a class="nav-link" style="color: #5f5f5f">投票區(09/01開放)</a>
        </li>
      </ul>
    </div>
  </div>
  <!-- /.container -->
</nav>
</template>

<script>
import {
  mapActions, mapGetters
} from 'vuex';
export default {
  data() {
    return {
      isNavOpen: false
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'cartValue', 'currentUser', 'cartItemList']),
    numItems() {
      return this.cartItemList.reduce((total, item) => {
        total += item.quantity;
        return total
      }, 0);
    },
    userEmail() {
      return this.isLoggedIn ? this.currentUser.email : ''
    }
  },
  methods: {
    ...mapActions(['logout']),
    toggleNavbar() {
      this.isNavOpen = !this.isNavOpen
    },    
    toDetail() {
        let detailUrl = "https://docs.google.com/document/d/1xwfDpqRQRX6Q4Hze4SVLbhuNQF4K1Z0rl30cIk2Cb7c/edit?usp=sharing";
        window.open(detailUrl, "_blank");
    },
    toRegister() {
        var ret = window.confirm("報名前請先確認閱讀過活動細節~") ;
        if(ret == true) {let registerUrl ="https://docs.google.com/forms/d/1LRwxeKCBumzFuQ-lOlxYJbMdBCvSSB2EbgV_WDJshiw/edit";
            window.open(registerUrl, "_blank");}
    }
  }
}
</script>


<style scoped lange="sass">
.span-remark {
  color: blue;
}

.navbar-btn a {
  color: white;
}

.li-pointer {
  cursor: pointer;
}

.li-pointer:hover {
  cursor: pointer;
}

.webTitle {
  font-size: 18pt;
  font-size: bold;
}

.bg-pink {
  background-color: rgba(243, 103, 131, 0.753);
}

.nav-link {
  font-size: 16px;
  padding-left: 20px;
}
</style>
