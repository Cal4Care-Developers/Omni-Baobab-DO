// $(".add_queue").click(function () {
//   iziToast.info({
//     title: 'Hello, world!',
//     message: 'This awesome plugin is made iziToast toastr',
//     position: 'topRight'
//   });
// });

function changeIncomingCall(data) {
    var incoming_call;
    if ($(data).is(':checked')) {

        var incoming_call = "1";
    } else {

        incoming_call = "2";
    }

    $.ajax({
        type: 'POST',
        url: 'get_data.php?data_page=dialpad',
        data: {

            action: 'dialpad_main',
            view_type: 'incoming_call_request',
            incoming_call: incoming_call,
            detail_id: null,

        },
        success: function (data) {

            if (data == 1) {

                $('#incoming_call_request_data').val(incoming_call);

            }


        }
    });
}

var websocket = new WebSocket("wss://cal4care.info:8089/"); 

websocket.onopen = function(event) { 

    console.log('open');
}

websocket.onmessage = function(event) {


if(event.data != null && event.data != ""){
    var chat_message_data, message_data, chat_id;
    
    console.log(event.data);
     chatListRefresh();
     message_data = JSON.parse(event.data);

    if(message_data.message_type == "chat"){
        
//        chatListRefresh();
         chat_id = $('#chat_id').val();
        if(message_data.message_info.chat_id == chat_id && chat_id != ""){

            if(message_data.message_info.msg_user_type == "1"){

                chat_message_data = '<div class="chat-item chat-left" style=""><img src="assets/img/users/user-2.png"><div class="chat-details"><div class="chat-text">'+message_data.message_info.message+'</div></div></div>';

            }
            else{
                chat_message_data = '<div class="chat-item chat-right" style=""><img src="assets/img/users/user-1.png"><div class="chat-details"><div class="chat-text">'+message_data.message_info.message+'</div></div></div>';
                
                
            }
                
                $(".card-body.chat-content").append(chat_message_data);
                    chatautoScroll();

        }

    }
    
  }

};

websocket.onerror = function(event){
    console.log('error');
};
websocket.onclose = function(event){
    console.log('close');
}; 



//function chatautoScroll() {
//
//    $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
//}
//
//
//
//function onMessageSend(event_data) {
//
//    if ((event_data.keyCode || event_data.which) == 13) {
//
//        sendChatMessageData();
//        event_data.preventDefault();
//        return false;
//
//    }
//
//}
//
//
//function sendChatMessageData() {
//
//    var chat_message = $("#chat_msg").val();
//    chat_message = chat_message.trim();
//// console.log(chat_message);
//    var chat_id = $("#chat_id").val();
//    var user_id = $("#chat_user_id").val();
//    if (chat_message.length > 0) {
//       
//        $.ajax({
//            type: "POST",
//            url: 'get_data.php?data_page=mc-dashboard',
//            data: {
//                action: "send_chat_message",
//                chat_id: chat_id,
//                chat_message: chat_message
//
//            },
//            success: function (data) {
//
////              console.log(data);
//                chatListRefresh();
//               var chat_msg_id =  data.trim();
//                
//               if(chat_msg_id != "" && chat_msg_id != 0){
//                   
//           
//var chat_message_data = '{"message_type":"chat","message_info":{"chat_id":"'+chat_id+'","msg_user_id":"'+user_id+'","msg_user_type":"2","msg_type":"text","message":"'+chat_message+'"}}';
//                   
//                   websocket.send(chat_message_data);
//                    
//                    var chat_message_data ='<div class="chat-item chat-right" style=""><img src="assets/img/users/user-1.png"><div class="chat-details"><div class="chat-text">'+chat_message+'</div></div></div>';
//
//
//                    $(".card-body.chat-content").append(chat_message_data);
//                  
//                    chatautoScroll();
//                   
//               }
//
//            }
//
//        });
//    }
//    $("#chat_msg").val("");
//
//}
//
//
//
//function chatPanelView(id, view_type) {
//
//
//        $.ajax({
//        type: 'POST',
//        url: 'get_data.php?data_page=mc-dashboard',
//        data: {
//
//            action: view_type,
//            id: id
//
//        },
//        success: function (data) {
//
//            console.log(data);
// 
//            if(view_type == "chat_queue_list"){
//
//                if(data != ""){
//                    $('#message_panel_block').html(data);
//                   
//                }
//
//
//            }
//            else if(view_type == "chat_detail_view"){
//
//                if(data != ""){
//                    $('#chat_details_view').html(data);
//                     chatautoScroll();
//                   
//                }
//
//
//            }
//            
//
//
//        }
//    });
//
//}
//
//
//function chatListRefresh(){
//    
//    
//        $.ajax({
//        type: 'POST',
//        url: 'get_data.php?data_page=mc-dashboard',
//        data: {
//
//            action: 'chat_list_search'
//
//        },
//        success: function (data) {
////            console.log(data);
// if(data != ""){
//            $('.chat_list_data').html(data);
//     
// }
//            
//        }
//    });
//    
//    
//}
//
//function mailPanelView() {
//
//
//
//}
