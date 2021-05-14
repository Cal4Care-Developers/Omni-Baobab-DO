// $('[data-toggle="tooltip"]').tooltip();

// $(".dialpad-close").click(function () {
//     $(".dialpad-container").hide();
//     $('.circle-plus.view-dialpad').show();
// });

// $(".circle-plus.view-dialpad").click(function () {
//     $('.circle-plus.view-dialpad').hide();
//     $(".dialpad-container").show();

// });

$(".circle-plus.dialpad-refresh").click(function () {

    location.reload();


});

function validateActiveTab() {

    if (!$('#dialpad-refresh').length) {
      //  console.log('update_refresh');
        var sip_local_time = $('#sip_local_time').val();
        var current_browser_time = localStorage.getItem('local_time');
        if (sip_local_time != "" && current_browser_time != sip_local_time) {
            $('.circle-plus.view-dialpad').hide();
            $(".dialpad-container").hide();
            $('.circle-plus.dialpad-refresh').show();
            $('.circle-plus.dialpad-refresh').attr('id', 'dialpad-refresh');
        }

    }


}


// function dialCall() {

//     var dialpad_number = $('#dialpad_number').val();

//     if (dialpad_number.length > 2) {
//         webMakeCall(dialpad_number);

//     }



// }

// function webMakeCall(number) {

//     number = clean_number(number);
// if (!$('#dialpad-refresh').length) {
//     $(".dialpad-container").show();
//      $('.circle-plus.view-dialpad').hide();
// }

//     if (number.length > 2) {

//         $('#make_call_number').val(number);

//         call();
//         dialPadDetailView('outgoing_call_inprogess', number);

//         $('#dialpad_number').val('');

//     }


// }

// function outgoingCallEnd() {
//     $("#makecallHanupBtn").click();
//     clearTimeout(callduration_timer);
//     dialPadDetailView('call_history_detail', call_history_id);

// }

// function incomingCallAccept() {

//     $("#incomingCallAnswerBtn").click();
//     dialPadDetailView('incoming_call_inprogess', call_history_id);
//     callDuration();


// }


// function incomingCallDecline() {

//     $("#incomingCallHangupBtn").click();
//     dialPadDetailView('call_history_detail', call_history_id);
// }

// function incomingCallEndByCustomer() {

//     clearTimeout(callduration_timer);
//     dialPadDetailView('call_history_detail', call_history_id);

// }

// function incomingCallEnd() {


//     $("#incomingCallHangupBtn").click();
//     clearTimeout(callduration_timer);
//     dialPadDetailView('call_history_detail', call_history_id);
// }

// function timer(){


// }

// callDuration();
var totalSeconds;
var callduration_timer;

function callDuration() {
    totalSeconds = 0;

    callduration_timer = setInterval(countown, 1000);
}

function countown(secondsLabel, minutesLabel) {
    totalSeconds = totalSeconds+1;
    
    $(".call_seconds").html(timeFormat(totalSeconds % 60));
    $(".call_minutes").html(timeFormat(parseInt(totalSeconds / 60)));
}

function timeFormat(time) {

    var time_str = time + "";
    if (time_str.length < 2) {
        return "0" + time_str;
    } else {
        return time_str;
    }

}

// function dialPadview(view_type) {
//     $.ajax({
//         type: 'POST',
//         url: 'get_data.php?data_page=dialpad',
//         data: {

//             action: 'dialpad_main',
//             view_type: view_type,
//             detail_id: null,

//         },
//         success: function (data) {


//             $('#dialpad_layout').html(data);

//         }
//     });
// }

// function dialPadDetailView(view_type, detail_id) {

//     if(detail_id == '' || detail_id == undefined){
        
//         detail_id = null;
//     }
    
//     console.log(detail_id);
    
    
//     $.ajax({
//         type: 'POST',
//         url: 'get_data.php?data_page=dialpad',
//         data: {

//             action: 'dialpad_main',
//             view_type: view_type,
//             detail_id: detail_id

//         },
//         success: function (data) {
            
//             console.log(data);

//             $('#dialpad_layout').html(data);
			
// 			if(view_type == 'outgoing_call_inprogess' || view_type == 'call_incoming'){
                
// //                var customer_id = $('#call_customer_key').val();
// //				$('#assign_status_frm').trigger("reset");
// //                assignedStatus(customer_id);
                
//             }

//             call_history_id = $('#call_history_id').val();

//         }
//     });

// }


// function contactListSearch(data) {

//     var search_txt = $(data).val().toLowerCase();

//     $("#contactList .contact-list-item").filter(function () {

//         $(this).toggle($(this).text().toLowerCase().indexOf(search_txt.toLowerCase()) !== -1);
//     });
// }

// function userListSearch(data) {

//     var search_txt = $(data).val().toLowerCase();

//     $("#userList .contact-list-item").filter(function () {

//         $(this).toggle($(this).text().toLowerCase().indexOf(search_txt.toLowerCase()) !== -1);
//     });

// }

// function recentCallSearch(data) {

//     var search_txt = $(data).val().toLowerCase();

//     $("#recentCalls .contact-list-item").filter(function () {

//         $(this).toggle($(this).text().toLowerCase().indexOf(search_txt.toLowerCase()) !== -1);
//     });

// }

// function dialPadbackSpace() {


//     // clearTimeout(callduration_timer);

//     var dialpad_number = $('#dialpad_number').val();
//     $('#dialpad_number').val(dialpad_number.substring(0, dialpad_number.length - 1));
// }

// function keyPad(key_data) {

//     var dailed_number = $('#dialpad_number').val();
//     $('#dialpad_number').val(dailed_number + key_data);

// }

// function clean_number(number) {
//     number = number.trim();
//     return number.replace(/[\s-/.\u00AD]/g, '');
// }

function q_login(){
    
        $.ajax({
        type: 'POST',
        url: 'updateSipToken.php',
        data: {

            action: 'update_queue'

        },
        success: function (data) {
            
            
            if(data.trim() =='queue_red'){
                
               $('#make_call_number').val('*63');
            }
            else{
                $('#make_call_number').val('*62');
            }
            
            
        call('queue_call');
        $('.queue_login').attr('id',data.trim());

            

        }
    });

}
							
function custommuteCall(){
    
    
    if(($('#mute_btn').length) > 0){
            mute();
        $('.mute-btn').attr('id','muted_btn');

    }

        else if(($('#muted_btn').length) > 0){
            unmute();
        $('.mute-btn').attr('id','mute_btn');

    }
    
    
}


function customgholdCall(){
    
    
    if(($('#hold_btn').length) > 0){
        holdCall();
        $('.hold_btn').attr('id','resume_btn');
        $('#hold_btn').css('display','none');
        $('#resume_btn').css('display','block');
    }

        else if(($('#resume_btn').length) > 0){
            resumeCall();
        $('.hold_btn').attr('id','hold_btn');
        $('#hold_btn').css('display','block');
        $('#resume_btn').css('display','none');
    }
    
    
}



function inProgressdialPad(action,type){
    
    if(action == 'close'){
        
        $('.call_inproress_dialpad').css('display','none');
        $('.call-screen-panel').css('display','block');
    }
    else if(action == 'open'){
        
        if(type == 'call_tranfer'){
            
            $('.inprogress_call_btn').attr('id','call_tranfer');
        }
        else if(type == 'dtmf'){
                
            $('.inprogress_call_btn').attr('id','call_send_dtmf');
        }
        
        $('.call-screen-panel').css('display','none');
        $('.call_inproress_dialpad').css('display','block');
        
    } 
    
}

function customtransferCall(){
    
   
    var dialpad_number = $('#dialpad_number').val();

    
    if (currentCall) {
 		 $('.inprogress_call_btn').attr('id','call_tranfer_hold');
        currentCall.transfer(dialpad_number);
    }
    
    $('#dialpad_number').val('');
    
}

function transferFailed(){
$('.inprogress_call_btn').attr('id','call_tranfer');
}

function customsendDTMF(){
    
    var dialpad_number = $('#dialpad_number').val();
    if (currentCall) {
        currentCall.sendDTMF(dialpad_number,'');
    }
     $('#dialpad_number').val('');
    
}
// 	function proactiveCallMonitorData(){

//         var active_cmpid = $('#active_cmpid').val();
        
//         if(active_cmpid=='402'){
//         console.log(active_cmpid);
//             proactiveCallMonitor();
        
//         }
		
// 	}
// proactiveCallMonitorData();
        
//         function proactiveCallMonitor() {
            
//              proactiveCallDetails();
//              setTimeout(proactiveCallMonitor, 30000);

//          }

//          function proactiveCallDetails(){
         
//           var active_login_userid = $('#active_login_userid').val();
         
//                 $.ajax({
//                     type: 'POST',
//                     url: 'dailer_call_queue.php',
//                     data: {

//                         action: 'proactive_callqueue',
//                         user_id: active_login_userid

//                     },
//                     success: function (data) {
// 					 var customer_id = data.trim();
// 					 console.log(customer_id);	
// 						if(customer_id != 0){
                            
//                             if (!currentCall) {

//                                	 dialPadDetailView('contact_detail_proactive_dialer',customer_id);

//                                 }
							
// 						}
                       

//                     }
//                 });
     
//          }

// function assignedStatus(cus_id){
//        $('#customer_id').val(cus_id)
//        $('#assign-number-popup').modal('show');    
// }


// function formCommandsValidation(){
//     var assign_status_id = document.getElementById('assign_status_id')['value'];
//     var next_schedule_dt = document.getElementById('next_schedule_dt')['value'];
//     var contact_commands = document.getElementById('contact_commands')['value'];
    
//     if(assign_status_id==''){
//         alert('Select the assign status');
//         document.getElementById('assign_status_id').facus();
//         return false;
//     }
    
//     if(assign_status_id=='3' && next_schedule_dt==''){
//         alert('Select the schedule date time');
//         document.getElementById('next_schedule_dt').facus();
//         return false;
//     }
    
//     /*if(assign_status_id=='3' && contact_commands==''){
//         alert('Enter the commands');
//         document.getElementById('contact_commands').facus();
//         return false;
//     }*/
    
//     var follower_user_val = $('#assign_status_frm').serialize();
    
//     $('#command_save').attr('disabled', 'disabled');
    
//     $.ajax({
//             type: 'POST',
//             url: 'ajax_data.php',
//             data: follower_user_val,
//             success: function(data){
//                     var data_val = data.trim();
//                     $('#assign-number-popup').modal('hide'); 
//                     $('#row_id_'+data_val).fadeOut('slow'); 
//                     $('#command_save').removeAttr('disabled');  
//             }
//     });
    
// }
//             $('#assign_status_id').change(function(){
//                 var stat_val =  $(this).val();
//                 if(stat_val==3){
//                     $('#schedule_date_row').fadeIn('slow');
//                 }else{
//                     $('#schedule_date_row').fadeOut('slow');
//                 }   
//             });
