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
            console.log("Hi this is response!!" + JSON.stringify(response));
            let fbId = null;

            if(response.status == "connected") {
              let authResponse = response.authResponse;
              console.log(authResponse);
              fbId = authResponse.userID;
            } 
            else {
              console.log("Call FB login");
              FB.login(function(response){
                  console.log(JSON.stringify(response));
                  if (response.status === 'connected') {
                    let authResponse = response.authResponse;
                    console.log(authResponse);
                    fbId = authResponse.userID;

                    window.$cookies.config('14d');
                    window.$cookies.set("fbId", fbId);
                    location.href = "/main" + (targetId ? "?id=" + targetId : '')
                  } else {
                    alert("請按下同意才能同票喔~ 錯誤訊息: " + JSON.stringify(response));
                  }
              }, {scope: 'public_profile'});
            }

            if (fbId) {
              window.$cookies.config('14d');
              window.$cookies.set("fbId", fbId);
              location.href = "/main" + (targetId ? "?id=" + targetId : '')
            } 
        });  
      }
    }
  }
</script>
