import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

// declare function checkLoginState(): any;
declare var statusChangeCallback: any;
// declare var subscribeApps: any;
declare var FB: any;
declare var $: any;
declare var iziToast:any;

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.css']
})
export class FacebookLoginComponent implements OnInit {

  admin_id;
  fbconfig;
  singleconfig;
  selectedpageid;
  pageselection;
  facebook_page_id;
  long_lived_token;
  singleConfigForm: FormGroup;

  constructor(private serverService: ServerService, private router:Router) {
    // this.loadScript('https://connect.facebook.net/en_US/sdk.js');    
    //   setTimeout(() => {
    //     this.loadScript('../assets/js/webhookfb.js');    

    //     console.log('after 5 sec')
    //   }, 5000);

  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit(): void {

    this.singleConfigForm = new FormGroup({
      'integrate_name' :new FormControl(null),
      'access_tokens' :new FormControl(null),
      'pages_id' :new FormControl(null),

    });
    this.admin_id = localStorage.getItem('admin_id');
    this.fetchForDB();
    var self = this;  
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '3123796277854749',
        cookie: true,                     // Enable cookies to allow the server to access the session.
        xfbml: true,                     // Parse social plugins on this webpage.
        version: 'v12.0'           // Use this Graph API version for this call.
      });

  
    };

    FB.getLoginStatus(function (response) {   // Called after the JS SDK has been initialized.
      self.statusChangeCallback(response);        // Returns the login status.
    });

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


  }



  statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response['authResponse']['accessToken']);                   // The current login status of the person.
    var fbaccessToken = response['authResponse']['accessToken'];
    if (fbaccessToken) {
      $('#fbLoginBut').hide();
    }
    console.log(fbaccessToken);
    $('#fbaccessToken').val(fbaccessToken);
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      // this.testAPI();
    } else {                                 // Not logged into your webpage or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this webpage.';
    }
  }




  submitLogin() {
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response) => {
      console.log('submitLogin', response);
      if (response.authResponse) {
        this.testAPI();
        console.log('login successful', 'Success!');
      }
      else {
        console.log('User login failed');
      }
    // }, { scope: 'email,manage_pages,pages_show_list,pages_messaging,pages_messaging_subscriptions,public_profile,pages_manage_metadata,pages_read_engagement' });
    }, { scope: 'email,pages_show_list,pages_messaging,pages_messaging_subscriptions,public_profile' });

  }


  testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    var self = this;
    FB.api('/me', function (response) {
      var responses = JSON.stringify(response);
      $('#fbname').val(response.name);
      $('#fbId').val(response.id);
      // console.log('Successful login for: ' + response);
      // console.log('Successful login for: ' + response.name);
      // document.getElementById('status').innerHTML =
      //   'Thanks for logging in, ' + response.name + '!';
    });

    // list pages
    FB.api('/me/accounts', function (response) {


     var response = response.data;
      // console.log(response['data']);

      // let options = [];
      // options.push('<option value="0">Select Your Facebook Page</option>');

      // for (let index = 0; index < response.length; index++) {
      //   var data = response[index];
      //   var dataValue = data.access_token + ',' + data.id;
      //   options.push('<option value=' + dataValue + ' >' + data.name + '</option>');
      // }
      // var selectBoxAux = '<select id="fbMainPages"  class="block p-2 w-full appearance-none focus:outline-none" name="auxCode">' + options + '</select>';

      // $('#fbPages').html(selectBoxAux);

      self.pageselection = response;
      console.log(self.pageselection);
 
      $('#page_subscription').modal('show');

      console.log('Successful login for: ' + response);
    });



	  
         // get long lived access token 




//   $.ajax({
//   type: "POST",
//   url: "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=3123796277854749&client_secret=8af53420d3e82a241b3258981a177b0d&fb_exchange_token="+this.singleConfigForm.value.access_tokens,
//   contentType: "application/json; charset=utf-8",
//   dataType: "json",
//   success: function (response) {
//     console.log(response);
//     self.singleConfigForm.value.access_tokens = response.access_token;
//     console.log('ajax get');
//     console.log(self.singleConfigForm.value.access_tokens);

//   }
// });  


// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=3123796277854749&client_secret=8af53420d3e82a241b3258981a177b0d&fb_exchange_token=",
//   "method": "GET",
//   "headers": {
//     "cache-control": "no-cache",
//     "postman-token": "ad96dadf-05b7-2b55-e3a6-d4828b4bb719"
//   }
// }

// $.ajax(settings).done(function (response) {
//     console.log(response);
//     self.singleConfigForm.value.access_tokens = response.access_token;
//     console.log('ajax get');
//     console.log(self.singleConfigForm.value.access_tokens);
// });



FB.api('/oauth/access_token', {   // get long lived access token
  grant_type : 'fb_exchange_token',
  client_id : '3123796277854749',
  client_secret : '8af53420d3e82a241b3258981a177b0d',
  fb_exchange_token : this.singleConfigForm.value.access_tokens
}, function(response) {
    console.log(response);
  //   self.singleConfigForm.patchValue({
  //   'access_tokens' :response.access_token
  // });

  self.long_lived_token = response.access_token;
});

  console.log(this.singleConfigForm);

  }


  clicktoSubcribe(){
    this.subscribeApps();
  }


  fetchForDB(){

  let access_token: any=localStorage.getItem('access_token');
    
  let api_req:any = '{"operation":"fb", "moduleType":"fb", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_fbdetails_inadmin","admin_id":"'+this.admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
   if(response.result.status == true){
    this.fbconfig = response.result.data;
    this.singleconfig = response.result.data[0];
    this.singleConfigForm.setValue({
      'integrate_name' : this.singleconfig.fb_page_name,
      'access_tokens' :this.singleconfig.fb_access_token,
      'pages_id' :this.singleconfig.fb_page_id,

    });
    this.long_lived_token = this.singleconfig.fb_access_token;
    this.facebook_page_id = this.singleconfig.fb_user_id;
   }
  }, 
  (error)=>{
      console.log(error);
  });
  }




onItemChange(events){
  console.log(events.target.value);
  this.selectedpageid = events.target.value;
}



 subscribeApps(){ 
  var self =this;
  let testpage =  this.pageselection.filter(a => a.id == this.selectedpageid);
  var selectedpage = testpage[0];
  console.log(selectedpage);
  var dt = new Date();
  var dataValue = selectedpage.access_token + ',' + selectedpage.id;

  // var fbname = $('#fbname').val();
  // var fbId = $('#fbId').val();
  // var fbaccessToken = $('#fbaccessToken').val();
  // var fbMainPages = $('#fbMainPages').val();


  FB.api('/oauth/access_token', {   // get long lived access token
    grant_type : 'fb_exchange_token',
    client_id : '3123796277854749',
    client_secret : '8af53420d3e82a241b3258981a177b0d',
    fb_exchange_token : selectedpage.access_token
  }, function(response) {
      console.log(response);
    //   self.singleConfigForm.patchValue({
    //   'access_tokens' :response.access_token
    // });
  
    self.long_lived_token = response.access_token;
  });

  var fbname = selectedpage.name;
  // var fbId = selectedpage.id;
  var fbId =  $('#fbId').val();
  var fbaccessToken = fbaccessToken;
  var fbMainPages =dataValue;
  this.facebook_page_id = selectedpage.id;


  var query = { operation: "subscribeApps", fbname: fbname, fbId: fbId, fbaccessToken:fbaccessToken, fbMainPages: fbMainPages };
  var data = JSON.stringify( query );
  console.log(data);
  $.ajax({
    type: "POST",
    url: "https://omni.mconnectapps.com/facebookTest/subApps.php",
    data: data,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      console.log(response);
      console.log(response.success);
      if(response.success == true){
        // alert('Page Subscribed Successfully');
        iziToast.success({
          message: "Page Subscribed Successfully",
          position: 'topRight'
        });
        $('#page_subscription').modal('hide');
        self.singleConfigForm.setValue({
          'integrate_name' : selectedpage.name,
          'access_tokens':selectedpage.access_token,
          // 'pages_id' :selectedpage.id
          'pages_id' :fbId
    
        });
  
      } else {
        // alert('Page Not Subscribed');
        iziToast.warning({
          message: "Page Not Subscribed",
          position: 'topRight'
        });
      }

    }
  });     
}


updatefbConfig(){

let access_token: any=localStorage.getItem('access_token');
// "fb_access_token":"'+this.singleConfigForm.value.access_tokens+'"
    
let api_req:any = '{"operation":"fb", "moduleType":"fb", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_fbdetails_inadmin","admin_id":"'+this.admin_id+'","fb_access_token":"'+this.long_lived_token+'","fb_user_id":"'+this.facebook_page_id+'","fb_page_id":"'+this.singleConfigForm.value.pages_id+'","fb_page_name":"'+this.singleConfigForm.value.integrate_name+'"}}';

this.serverService.sendServer(api_req).subscribe((response:any) => {
console.log(response);
console.log(response.result.status)

if(response.result.status == true){
  // alert('updated Sucessfully');
  iziToast.success({
    message: "Updated Sucessfully",
    position: 'topRight'
  });
}

});

}

}
