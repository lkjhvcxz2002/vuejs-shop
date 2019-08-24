<template>
<nav class="navbar navbar-expand-sm navbar-dark bg-dark" role="navigation">
  <div class="container">
    <!-- Brand and toggle get grouped for better mobile display -->
    <!-- <router-link to="/" class="navbar-brand mr-auto">2020 偽娘桌曆徵選 </router-link> -->
    <router-link to="/login" class="navbar-brand mr-auto webTitle">2020 偽娘桌曆徵選 </router-link>
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
        <router-link to="/login" tag="li" v-if="!isLoggedIn" class="nav-item" active-class="active">
          <a class="nav-link">參加者列表</a>
        </router-link>
        <li v-if="isLoggedIn" class="li-pointer nav-item">
          <a @click="logout" class="nav-link">Logout {{ userEmail }}</a>
        </li>
        <!-- <router-link to="/register" tag="li" v-if="!isLoggedIn" class="nav-item" disabled>
          <a class="nav-link">投票(09/01開放)</a>
        </router-link> -->
        <li class="nav-item">
          <a class="nav-link">投票區(09/01開放)</a>
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
    }
  }
}
</script>


<style scoped lange="sass">
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
</style>
