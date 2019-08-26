<template>
  <div class="row">
    <div class="col-md-6 offset-md-3 col-sm-10 offset-sm-1">
     <form id="register-form" role="form">
        <h3 class="text-center">Facebook登入</h3>
        <div class="form-group" style="height: 100px"></div>
        <div class="form-group" style="text-align: center">
            <!-- <button class="btn btn-success" style="width: 100%" @click="FBLogin" :disabled="isLoading">
              <i v-if="isLoading" class="fa fa-spinner fa-spin" />
              Register
            </button> -->
            <div class="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" @click="FBLogin"
               data-auto-logout-link="false" data-use-continue-as="false"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  function statusChangeCallback(response) {
    console.log(response);
    html = "";

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
        isLoading: false
      }
    },
    methods: {
       ...mapActions(['clearMessage', 'addMessage', 'registerByEmail']),
      FBLogin() {
        FB.getLoginStatus(function(response) {
            console.log("Hi this is response!!" + response);
            let fbId = "testFB";
            statusChangeCallback(response);
            // if(response.status == "connected") {
            //   let authResponse = response.authResponse;
            //   console.log(authResponse);
            //   fbId = authResponse.userID;
            // } else {
            //   alert("請先登入FB~ 否則無法投票喔")
            // }

            // this.$cookies.config('14d');
            // this.$cookies.set("fbId", fbId);

            // if (fbId) {
            //   location.href = "/main"
            // }
        });  
      }
    }
  }




  FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});
};

// 處理各種登入身份
function statusChangeCallback(response) {
console.log(response);
var target = document.getElementById("FB_STATUS_1"),
html = "";

// 登入 FB 且已加入會員
if (response.status === 'connected') {
html = "已登入 FB，並加入 WFU BLOG DEMO 應用程式<br/>";

FB.api('/me?fields=id,name,email', function(response) {
console.log(response);
html += "會員暱稱：" + response.name + "<br/>";
html += "會員 email：" + response.email;
target.innerHTML = html;
});
}

// 登入 FB, 未偵測到加入會員
else if (response.status === "not_authorized") {
target.innerHTML = "已登入 FB，但未加入 WFU BLOG DEMO 應用程式";
}

// 未登入 FB
else {
target.innerHTML = "未登入 FB";
}
}

function checkLoginState() {
FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});
}
</script>
