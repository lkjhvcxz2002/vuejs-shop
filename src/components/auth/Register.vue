<template>
  <div class="row">
    <div class="col-md-6 offset-md-3 col-sm-10 offset-sm-1">
     <form id="register-form" role="form">
        <h3 class="text-center">投票請登入</h3>
        <div class="form-group" style="height: 100px"></div>
        <div class="form-group" style="text-align: center">
            <div class="btn btn-primary btn-lg" data-width="" data-size="large" style="font-size: 36px" @click="FBLogin">
              Facebook登入</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  
  function statusChangeCallback(response) {
    console.log(response);

    // 登入 FB 且已加入會員
    if (response.status === 'connected') {
      console.log("已登入 FB，並加入 WFU BLOG DEMO 應用程式<br/>");

      FB.api('/me?fields=id,name,email', function(response) {
        console.log(response);
      });
    }
}

  export default {
    data() {
      return {
        email: '',
        password: '',
        isLoading: false,
        targetId: ''
      }
    },
    mounted() {
      this.targetId = this.$route.params.id;
    },
    methods: {
       ...mapActions(['clearMessage', 'addMessage', 'registerByEmail']),
      FBLogin() {
        console.log("Pre request");
        let targetId = this.targetId;
        FB.getLoginStatus(function(response) {
            console.log("Hi this is response!!" + response);
            let fbId = null;
            statusChangeCallback(response);
            if(response.status == "connected") {
              let authResponse = response.authResponse;
              console.log(authResponse);
              fbId = authResponse.userID;
            } else {
              alert("請先登入FB~ 否則無法投票喔")
            }

            if (fbId) {
              window.$cookies.config('14d');
              window.$cookies.set("fbId", fbId);
              location.href = "/main" + (targetId ? "?id=" + targetId : '')
            } else {
              location.href = "/main" + (targetId ? "?id=" + targetId : '')
            }
        });  
      }
    }
  }
</script>
