<template>
<div class="row">
  <div class="col-md-6 offset-md-3 col-sm-12 offset-sm-1">
    <form id="login-form" role="form" style="display: block;">
      <h3 class="text-center">Login</h3>
      <div class="form-group">
        <input type="email" name="email" id="email" class="form-control" placeholder="Email Address" v-model="email">
      </div>
      <div class="form-group">
        <input type="password" name="password" id="password" class="form-control" placeholder="Password" v-model="password">
      </div>

      <div class="form-group">
        <button class="btn btn-success" style="width: 100%" @click.prevent="loginWithEmailLocal" :disabled="isLoading">
            <i v-if="isLoading" class="fa fa-spinner fa-spin" />
						Log in
					</button>
      </div>
      <div class="form-group">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <router-link to="/register"><a>Register</a></router-link>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import {
  mapActions
} from 'vuex';



export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    }
  },
  mounted() {
    let encryptor = window.encryptor;
    let _reviewer = this.$route.params.reviewer;

    if(!_reviewer) {
      alert("錯誤網址，請輸入正確評分網址")
    } else {
      let reviewer = encryptor.decrypt(_reviewer);
      window.$cookies.set("_oriReviewer", _reviewer);
      window.$cookies.set("reviewer", reviewer.trim());
      location.href = "/scoreList";
    }
  },
  methods: {
    ...mapActions(['addMessage', 'clearMessage', 'loginWithEmail']),
    loginWithEmailLocal() {
      this.isLoading = true
      let data = {
        email: this.email,
        password: this.password
      }
      this.loginWithEmail(data).then(() => {
        this.clearMessage();
        this.$router.push({
          name: 'mainpage'
        });
      }).catch((error) => {
        let message_obj = {
          message: error.message,
          messageClass: "danger",
          autoClose: true
        }
        this.addMessage(message_obj);
      }).then(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
