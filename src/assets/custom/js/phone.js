//         var incomingcallAudio = new Audio('assets/images/incomingcall.mp3');
//         var outgoingcallAudio = new Audio('assets/images/ringbacktone.mp3');
    
//         function playAudio(call_audio) {
       
//             call_audio.addEventListener('ended', function () {
//                 this.currentTime = 0;
//                 this.play();
//             }, false);
//             call_audio.play();

//         }

//         function pauseAudio(call_audio) {
//             call_audio.pause();
//         }

//         function sipTokenupdate(sip_token, local_time) {

//             $.ajax({
//                 type: 'POST',
//                 url: 'updateSipToken.php',
//                 data: {
//                     action: 'update_sip_token',
//                     sip_token: sip_token,
//                     local_time: local_time
//                 },
//                 success: function (data) {

//                 }
//             });

//         }

//         var SESSION_STATUS = MRVOIP.constants.SESSION_STATUS;
//         var CALL_STATUS = MRVOIP.constants.CALL_STATUS;
//         var localDisplay;
//         var remoteDisplay;
//         var currentCall;
//         var pbxSettingsStatus = 'NULL';

//         function init_page(sip_login, sip_authentication, sip_password, sip_port, sip_url, sip_token) {
//             try {
//                 MRVOIP.init({
//                     flashMediaProviderSwfLocation: 'media-provider.swf'
//                 });
//             } catch (e) {
//                 console.log("Your browser doesn't support Flash or WebRTC technology necessary for work of an example")
//                 return;
//             }
//             localDisplay = document.getElementById("localDisplay");
//             remoteDisplay = document.getElementById("remoteDisplay");
//             showOutgoing();
//             onHangupOutgoing();
//             autoconnected(sip_login, sip_authentication, sip_password, sip_port, sip_url, sip_token);


//         }


//         function connect(sip_login, sip_authentication, sip_password, sip_port, sip_url, sip_token) {

//             MRVOIP.playFirstVideo(localDisplay, true);
//             MRVOIP.playFirstVideo(remoteDisplay, true);
//             var url = 'wss://webrtc.mrvoip.com:8443';
// 			// var url = 'wss://sg.mrvoip.com:8443';
// 			//var url = 'wss://stun2.mrvoip.com/mfstwebsock';
//             var sipLogin = sip_login;
//             var sipauthenticationName = sip_authentication;
//             var sippassword = sip_password;
//             var sipOptions = {
//                 login: sipLogin,
//                 authenticationName: sipauthenticationName,
//                 password: sippassword,
//                 domain: sip_url,
//                 outboundProxy: sip_url,
//                 port: sip_port
//             };
//             if (sip_token) {
//                 connectionOptions = {
//                     urlServer: url,
//                     authToken: sip_token,
//                     keepAlive: true
//                 };
//             } else {
//                 connectionOptions = {
//                     urlServer: url,
//                     sipOptions: sipOptions,
//                     keepAlive: true
//                 };
//             }


//            // console.log(connectionOptions);


//             //create session
//            // console.log("Create new session with url " + url);
//             MRVOIP.createSession(connectionOptions).on(SESSION_STATUS.ESTABLISHED, function (session, connection) {
//                 setStatus(SESSION_STATUS.ESTABLISHED);
//                 pbxSettingsStatus = 'ESTABLISHED';
//                 onConnected(session);
//                 local_time = Date.now();
//                 $('#sip_local_time').val(local_time);
//                 localStorage.setItem('local_time', local_time);
//                 // sipTokenupdate(connection.authToken, local_time);

//             }).on(SESSION_STATUS.REGISTERED, function (session) {
//                 setStatus(SESSION_STATUS.REGISTERED);
//                 pbxSettingsStatus = 'REGISTERED';
//                 onConnected(session);
//                 $('#outgoingCall').show();
//             }).on(SESSION_STATUS.DISCONNECTED, function () {
//                 setStatus(SESSION_STATUS.DISCONNECTED);
//                 pbxSettingsStatus = 'DISCONNECTED';
//                 onDisconnected();
//             }).on(SESSION_STATUS.FAILED, function () {
//                 setStatus(SESSION_STATUS.FAILED);
//                 pbxSettingsStatus = 'SESSION_STATUS';
//                 onDisconnected();
//             }).on(SESSION_STATUS.INCOMING_CALL, function (call) {
				
// 				// var active_cmpid = $('#active_cmpid').val();
//     //             console.log(active_cmpid);
//     //             if(active_cmpid == '400' || active_cmpid == '404'){
//     //                console.log('incoming_blocked');
//     //                     return false;
                   
//     //              }
// // console.log(JSON.parse(call)+"   1111");

//                 var incoming_call_request_data = $('#incoming_call_request_data').val();
//                 //console.log(incoming_call_request_data);
//                 if(incoming_call_request_data != '1'){
//                    console.log('incoming_blocked');
//                         return false;
                   
//                  }
				
//                 call.on(CALL_STATUS.RING, function () {
//                     setStatus(CALL_STATUS.RING);
//                     playAudio(incomingcallAudio);
//                 }).on(CALL_STATUS.ESTABLISHED, function () {
//                     setStatus(CALL_STATUS.ESTABLISHED);
//                     callDuration();
//                     pauseAudio(incomingcallAudio);
//                 }).on(CALL_STATUS.HOLD, function () {}).on(CALL_STATUS.FINISH, function () {
//                     setStatus(CALL_STATUS.FINISH);
//                     pauseAudio(incomingcallAudio);
//                     clearTimeout(callduration_timer);
//                     totalSeconds =0;
//                     onHangupIncoming();
//                     currentCall = null;
//                 }).on(CALL_STATUS.FAILED, function () {
//                     setStatus(CALL_STATUS.FAILED);
//                     pauseAudio(incomingcallAudio);
//                     onHangupIncoming();
//                     clearTimeout(callduration_timer);
//                     totalSeconds =0;
//                     currentCall = null;
//                 });


        
//                 onIncomingCall(call);
//             });
//         }

//         function call(queue_call) {
//             var session = MRVOIP.getSessions()[0];
            
//             if(queue_call == 'queue_call'){
                
//                 var constraints = {
//                 audio: true,
//                 video: false
//             };
                
//             }
            
//             else{
//                 var constraints = {
//                 audio: true,
//                 video: false
//             };
                
//             }

//             var make_call_number_data = $("#make_call_number").val();

//             //prepare outgoing call 
//             var outCall = session.createCall({
//                 callee: make_call_number_data,
//                 visibleName: make_call_number_data,
//                 localVideoDisplay: localDisplay,
//                 remoteVideoDisplay: remoteDisplay,
//                 constraints: constraints,
//                 receiveAudio: true,
//                 receiveVideo: false,
//                 stripCodecs: "SILK"
//             }).on(CALL_STATUS.RING, function () {
//                 setStatus(CALL_STATUS.RING);
//                 playAudio(outgoingcallAudio);
//             }).on(CALL_STATUS.ESTABLISHED, function () {
//                 setStatus(CALL_STATUS.ESTABLISHED);
//                 pauseAudio(outgoingcallAudio);
//                 // $('#CallToCut').click();
//                 // $('#outGongCallstatus').click();
//                 // $('#outGongCallstatus').val('inCall');
//                 $('.outgoing-call').hide();
//                 $('#call_duration').show();
//                 callDuration();
//                 }).on(CALL_STATUS.HOLD, function () {
//                 }).on(CALL_STATUS.FINISH, function () {
//                     setStatus(CALL_STATUS.FINISH);
//                     $('#outGongCallstatus').val('callEnd');
//                     pauseAudio(outgoingcallAudio);
//                     onHangupOutgoing();

//                     clearTimeout(callduration_timer);
//                     totalSeconds = 0;
//                     console.log(make_call_number_data);
//                     if(make_call_number_data == '*62' || make_call_number_data == '*63'){
//                        // dialPadview('recent_list');
//                     }
//                     else{
//                         console.log(call_history_id);
//                         $('#outgoing_call_end_trigger').click();
//                         //dialPadDetailView('call_history_detail', call_history_id);
//                     }
//                     currentCall = null;
//                 }).on(CALL_STATUS.FAILED, function () {
//                     setStatus(CALL_STATUS.FAILED);
//                     pauseAudio(outgoingcallAudio);
//                     onHangupIncoming();
//                     totalSeconds = 0;
//                     clearTimeout(callduration_timer);  
//                 if(make_call_number_data == '*62' || make_call_number_data == '*63'){
//                         //dialPadview('recent_list');
//                     }
//                 else{
//                      console.log(call_history_id);
//                      //dialPadDetailView('call_history_detail', call_history_id);
//                      $('#outgoing_call_end_trigger').click();
//                 }
//                     currentCall = null;
//                 });

//                 outCall.call();
//                 currentCall = outCall;

//                 $("#makecallHanupBtn").text("Hangup").off('click').click(function () {
//                     outCall.hangup();
//                     console.log('Hangup');
//                 });
//         }



//         function onConnected(session) {
//             if (currentCall) {
//                 showOutgoing();
//                 // disableOutgoing(true);
//                 setStatus("");
//                 currentCall.hangup();
//             }
//         }

//         function onDisconnected() {
//             // disableOutgoing(true);
//             showOutgoing();
//             setStatus("");
//         }

//         function autoconnected(sip_login, sip_authentication, sip_password, sip_port, sip_url, sip_token) {
//             connect(sip_login, sip_authentication, sip_password, sip_port, sip_url, sip_token);
//             // disableOutgoing(true);
//             showOutgoing();
//             setStatus("");
//         }

//         function onHangupOutgoing() {

//             $("#makecallHanupBtn").text("Call").off('click').click(function () {
//                 console.log('Call');
//                 // disableOutgoing(true);
//                 call();

//             }).prop('disabled', false);

//             // disableOutgoing(false);
//         }

//         function onHangupOutgoingNew() {
//             // disableOutgoing(true);
//             call();

//         }

// //         function getServiceNowData(phone_number) {
// //     $.ajax({
// //         type: 'POST',
// //         url: 'get_data.php?data_page=dialpad',
// //         data: {

// //             action: 'getServiceNowData',
// //             phone_number: phone_number,
// //             view_type: null,
// //             detail_id: null,

// //         },
// //         success: function (data) {

// //             var result_data = data.split('^^^^');

// //             if(result_data[0] == 1){
// //             var service_url = "https://www.google.com/?"+result_data[1];
// //             var win =window.open(result_data[2], '_blank');
// //             win.focus();

// //                 // "https://dev.cal4care.com/erp/content.php?"+result_data[1];

// //                  // console.log("snow service "+data);

// //             }

           
// //             //$('#dialpad_layout').html(data);

// //         }
// //     });
// // }

//         function onIncomingCall(inCall) {

           
           



//             currentCall = inCall;
            



//             console.log("snow service22 "+inCall.caller());


            
//             // getServiceNowData(inCall.caller());
//             showIncoming(inCall.caller());
//             $("#incomingCallAnswerBtn").off('click').click(function () {

//                 var constraints = {
//                     audio: true,
//                     video: false
//                 };
//                 inCall.answer({
//                     localVideoDisplay: localDisplay,
//                     remoteVideoDisplay: remoteDisplay,
//                     receiveVideo: false,
//                     constraints: constraints,
//                     stripCodecs: "SILK"
//                 });
//                 showAnswered();
//             });
//             $("#incomingCallHangupBtn").off('click').click(function () {


//                 inCall.hangup();
//                 onHangupOutgoing();
//             });
//         }

//         function onHangupIncoming() {
//             showOutgoing();
//             // incomingCallEnd();
//             console.log("123-callend");
//             $('#incoming_call_end_trigger').click();
//         }

//         // Set connection and call status
//         function setStatus(status) {
//             console.log(status);
//             if(status == 'DISCONNECTED'){
//                 outCall.hangup();
//             }

//         }
//         function getinStatus() {
//             return pbxSettingsStatus;

//         }
//         // Display view for incoming call
//         function showIncoming(callerName) {
//             // $('.circle-plus.view-dialpad').hide();
//             // $(".dialpad-container").show();
//             //dialPadDetailView('call_incoming', callerName);
//             $('#call_incoming_number').val(callerName);
//             $('#incoming_call_trigger').click();

//             // $("#outgoingCall").hide();
//             // $("#incomingCall").show();
//             // $("#incomingCallAlert").show().text("You have a new call from " + callerName);
//             // $("#incomingCallAnswerBtn").show();
//         }

//         // Display view for outgoing call
//         function showOutgoing() {
//             // $("#incomingCall").hide();
//             // $("#incomingCallAlert").hide();
//             $("#outgoingCall").show();
//             onHangupOutgoing();
//         }

//         function disableOutgoing(disable) {
//             // $('#callee').prop('disabled', disable);
//             $("#makecallHanupBtn").prop('disabled', disable);
//         }

//         // Display view for answered call
//         function showAnswered() {
//             $("#incomingCallAnswerBtn").hide();
//             $("#incomingCallAlert").hide().text("");
//         }


//         function mute() {
//             if (currentCall) {
//                 currentCall.muteAudio();
//             }
//         }

//         // Unmute audio in the call
//         function unmute() {
//             if (currentCall) {
//                 currentCall.unmuteAudio();
//             }
//         }




//         function holdCall() {
//             if (currentCall) {
//                 currentCall.hold();
//             }
//             $('#hold_btn').css('display','none');
//             $('#resume_btn').css('display','block');
//         }

//         // Unmute audio in the call
//         function resumeCall() {
//             if (currentCall) {
//                 currentCall.unhold();
//             }
//             $('#hold_btn').css('display','block');
//             $('#resume_btn').css('display','none');
//         }



//         function transferCall(target) {
//             if (currentCall) {
//                 currentCall.transfer(target);
//                //$('#incoming_call_end_trigger').click();
//             }
//         }

//         function endCallAfterTransfer(){
//             currentCall.hangup();
//             $('#incoming_call_end_trigger').click();
//         }