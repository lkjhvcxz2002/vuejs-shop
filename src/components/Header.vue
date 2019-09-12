<template>
<nav class="navbar navbar-expand-sm navbar-dark bg-pink" role="navigation">
  <div class="container">
    <li v-on:click="toHome()" class="navbar-brand mr-auto webTitle">2020 偽娘桌曆徵選 </li>
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
        <router-link to="/list" tag="li" class="nav-item" active-class="active">
          <a class="nav-link">參加者列表</a>
        </router-link>
        <li v-on:click="toDetail()" tag="li" style="cursor:pointer" class="nav-item" active-class="active">
          <a class="nav-link">活動細節</a>
        </li>
        <li v-on:click="toBuy()" tag="li" style="cursor:pointer" class="nav-item" active-class="active">
          <a class="nav-link" style="color: #0e00c7;font-weight: bold;">桌曆預購</a>
        </li>
        <router-link :to="voteLink" tag="li" v-if="isOpen && !avail" class="nav-item" style="padding: 2px;">
          <a class="nav-link" style="color: blue">投票登入</a>
        </router-link>
        <li v-on:click="toResult()" v-if="isResult" style="cursor:pointer" class="nav-item">
          <a class="nav-link">評選結果</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
const isOpen = new Date().getTime() > 1567267200000 && new Date().getTime() < 1567871999000
const isResult = new Date().getTime() > 1567871999000;
const avail = window.$cookies.get("fbId") != null;
import {
  mapActions, mapGetters
} from 'vuex';
export default {
  data() {
    return {
      isNavOpen: false,
      isOpen: isOpen,
      targetId: '',
      voteLink: "/vote",
      avail: avail,
      isResult: isResult
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
  mounted() {
    this.targetId = this.$route.query.id;
    if(this.targetId) this.voteLink = "/vote/" + this.targetId;
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
        let registerUrl ="https://docs.google.com/forms/d/1LRwxeKCBumzFuQ-lOlxYJbMdBCvSSB2EbgV_WDJshiw/edit";
        window.open(registerUrl, "_blank");
    },
    toBuy() {
        let registerUrl ="https://forms.gle/mDDaKYgeqT1mMbFm6";
        window.open(registerUrl, "_blank");
    },
    toResult() {
      location.href = "/resultPage"
    },
    toHome() {
      location.href = "/main"
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
  cursor: pointer;
}

.bg-pink {
  background-color: rgba(243, 103, 131, 0.753);
}

.nav-link {
  font-size: 16px;
  padding-left: 20px;
}
</style>
