"use strict";


function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
      statusChangeCallback(response);
    });
  }



function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response['authResponse']['accessToken']);                   // The current login status of the person.
	  var fbaccessToken = response['authResponse']['accessToken'];
	  if(fbaccessToken){
	  		$('#fbLoginBut').hide();
	  }
	  console.log(fbaccessToken);
	  $('#fbaccessToken').val(fbaccessToken);
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      testAPI();  
    } else {                                 // Not logged into your webpage or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this webpage.';
    }
  }



  window.fbAsyncInit = function() {
    FB.init({
      appId      : '3123796277854749',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v12.0'           // Use this Graph API version for this call.
    });

	  FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
		  statusChangeCallback(response);        // Returns the login status.
	  });
  };
 
  function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
	 
	  FB.api('/me', function(response) {
		  var responses = JSON.stringify(response);
		  $('#fbname').val(response.name);
		  $('#fbId').val(response.id);
		  console.log('Successful login for: ' + response);
		  console.log('Successful login for: ' + response.name);
		  document.getElementById('status').innerHTML =
			  'Thanks for logging in, ' + response.name + '!';
	  });
	  
	  // list pages
	  FB.api('/me/accounts', function(response) {
		 
		
response = response.data;
		  console.log(response['data']);
		  
options = [];
options.push( '<option value="0">Select Your Facebook Page</option>');

for (let index = 0; index < response.length; index++) {
	var data = response[index];
	var dataValue = data.access_token+','+data.id;
 options.push( '<option value=' + dataValue+ ' >' + data.name + '</option>');
}
var selectBoxAux = '<select id="fbMainPages"  class="block p-2 w-full appearance-none focus:outline-none" name="auxCode">'+options+'</select>';



		  $('#fbPages').html(selectBoxAux);			
		  console.log('Successful login for: ' + response);
	  });
	  
	  

  }
	function subscribeApps (){


		var dt = new Date();
		var fbname = $('#fbname').val();
		var fbId = $('#fbId').val();
		var fbaccessToken = $('#fbaccessToken').val();
		var fbMainPages = $('#fbMainPages').val();




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
					alert('Page Subscribed Successfully');
				} else {
					alert('Page Not Subscribed');
				}

			}
		});     
	}