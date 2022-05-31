import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';


import { NgZone } from '@angular/core';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild('chat_message', {static: false}) chat_message : ElementRef;
  @ViewChild('chat_detail_id', {static: false}) chat_detail_id : ElementRef;


	chat_panel_list;
	chat_panel_details;
	chat_panel_detail_type = "chat_screen";
	loginUser;
	chat_detail_key;
	customer_name;
	socketData;
	websocket;
	profile_image;
	chat_id;
	chat_status_detail_id;
	param1;
	agent_list
	a_profile_image;
  admin_list;
  showMyChats = false;
  showMyContacts = false;
  public is_chat_closed = false;
  showChatDetails = false;
  showChatPannels= false;
  name;
  userType;
  almychat
  agent_image;
  login_status
  ext_int_status = true;
 user_type
 showvifeo = false;
 encUser;
 dialerUrl;
 url: SafeResourceUrl;
 constructor(public serverService: ServerService,private _ngZone: NgZone,private route: ActivatedRoute,public sanitizer:DomSanitizer) {

  this.param1 = this.route.snapshot.queryParamMap.get('c');
  this.serverService.showvedioDialer.subscribe( (val:any) =>
  {
     console.log(val);
     var dpContent = JSON.parse(val);
        if(dpContent.type == "showDialer"){
          this.showvifeo = true;
        } else {
          this.showvifeo = false;
        }
   }
  );

   }

   ngOnInit() {
    this.loginUser = localStorage.getItem('userId');
    this.name = localStorage.getItem('user_name');
    this.userType = localStorage.getItem('user_type');
    this.agent_image = localStorage.getItem('profile_image');
    this.encUser= localStorage.getItem('encUser');
    this.dialerUrl= "https://omni.mconnectapps.com/dialer-v2/?login="+this.encUser;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.dialerUrl);

    if(localStorage.getItem('ext_int_status') == '1' || localStorage.getItem('ext_int_status') == '0'){
      this.ext_int_status = false;
    };

    if(this.param1){
    this.param1 = atob(this.param1);
    this.chatPanelViewF(this.param1);
    } else {
    this.chatPanelViewF("all");
    }
    this.getAgentsListF();
//this.websocket = new WebSocket("wss://cal4care.info:8089/");
this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4004");


  this.websocket.onopen = function(event) {
      console.log('socket chat connected');
  }

  this.websocket.onmessage = function(event) {
  this.socketData = JSON.parse(event.data);
  console.log(this.socketData);

    if(this.socketData.message_type == "chat"){
  if(this.socketData.message_info.chat_receiver_id == localStorage.getItem('userId')){
    // iziToast.success({
    //   message: "New chat Message",
    //   position: 'topRight'
    // });
  }

  if(this.socketData.message_info.chat_receiver_id == localStorage.getItem('userId')){
    console.log($('#chat_detail_id').val());
    //this.chatPanelDetailF(this.socketData.message_info.chat_id);

    $('#open_chat_detail_id').val(this.socketData.message_info.chat_sender_id);
    $('#open_chat_detail_id').click();

  }

    }

  }
  this.websocket.onerror = function(event){
    console.log('error');
  }
  this.websocket.onclose = function(event){
    console.log('close');
  }


}

getAgentsListF(){
  let admin_id: any=localStorage.getItem('admin_id');
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"chatinternal", "moduleType":"chatinternal", "api_type": "web", "access_token":"'+access_token+'","element_data":{"action":"dept_agent_list","admin_id":"'+admin_id+'","user_id":"'+this.loginUser+'"}}';
  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      this.agent_list = response.result.data.agent_list;
     this.admin_list = response.result.data.admin_list;
    } else {

    }
  },
  (error)=>{
      console.log(error);
  });
}



setDefaultPic() {
console.log("assets/images/my-image.png")
}





ngAfterViewInit() {
 this.chatautoScroll();
}

chatautoScroll(){

if($(".inner-chat-body").length > 0){


setTimeout(()=>{
 // $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);

 $(".inner-chat-body").scrollTop($(".inner-chat-body")[0].scrollHeight);
 }, 10);
}

}
chatautoScroll2(){
  setTimeout(()=>{
   // $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);

   $("#inner-chat").scrollTop($("#inner-chat")[0].scrollHeight);
   }, 10);


  }

chatSearch(chatSearch){
console.log(chatSearch);

}

sendChatMessageData(){

this.profile_image = localStorage.getItem('profile_image');


if( this.profile_image == null || this.profile_image == 'null' || this.profile_image == 'undefined'){
  this.profile_image  = 'https://baobabgroup.mconnectapps.com/api/v1.0/profile_image/user.jpg';
} else {
  this.profile_image = localStorage.getItem('profile_image');
}
  var chat_message= $('#chat_msg').val();


  console.log(chat_message);

  chat_message = chat_message.trim();
 if (chat_message.length > 0) {


 console.log(chat_message);

       let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="send_internal_chat_message";
    chat_req.chat_type="webchat";
    chat_req.chat_receiver_id=this.chat_detail_key;
    chat_req.chat_sender_id=this.loginUser;
    chat_req.chat_msg=chat_message;
    api_req.operation="chatinternal";
    api_req.moduleType="chatinternal";
    api_req.api_type="web";
    chat_req.admin_id=localStorage.getItem('admin_id');
    api_req.timezone_id=localStorage.getItem('timezone_id');
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;

          this.serverService.sendServer(api_req).subscribe((response:any) => {

            if(response.result.status==true){

            var chat_msg= response.result.data;
      let agent_name =localStorage.getItem('user_name');
           var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1","agent_aviator":"'+this.profile_image+'","agent_name":"'+agent_name+'","chat_receiver_id":"'+this.chat_detail_key+'","chat_sender_id":"'+this.loginUser+'","sender_name":"'+agent_name+'","sender_image":"'+this.profile_image+'"}}';

           this.websocket.send(socket_message);
               this.chat_panel_details.push(chat_msg);
               this.chatautoScroll();
               this.chatautoScroll2();
               $('#chat_msg').val('');
            }

          },
          (error)=>{
              console.log(error);
          });

 }

}

onMessageSend($event){

if($event.keyCode == 13){


this.sendChatMessageData();
        $event.stopPropagation();
        return false;
      }


}

chatPanelViewF(chat_id){


      let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="chat_message_panel";
    chat_req.chat_type="webchat";
    chat_req.chat_id=chat_id;
    chat_req.user_id=this.loginUser;
    api_req.operation="chat";
    api_req.moduleType="chat";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;

          this.serverService.sendServer(api_req).subscribe((response:any) => {
            console.log(response);
            if(response.result.status==1){

                 this.chat_panel_list = response.result.data.chat_list;

                 if(chat_id == "all" || chat_id == "" || chat_id == 0){
                   this.chat_panel_detail_type = "chat_screen";
                 }
                 else{
                   this.chat_panel_details = response.result.data.chat_detail_list;
                   this.chat_panel_detail_type = "chat_detail";
                 this.chatautoScroll();

                 }



                 this.chatautoScroll();
                 this.chat_detail_key = chat_id;
            }

          },
          (error)=>{
              console.log(error);
          });


}



 chatPanelList(search_text){
      let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="get_queue_chat_list";
    chat_req.chat_type="webchat";
    chat_req.search_text=search_text;
    chat_req.user_id=this.loginUser;
    api_req.operation="chat";
    api_req.moduleType="chat";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;

          this.serverService.sendServer(api_req).subscribe((response:any) => {

    if(response.result.status==1){
        this.chat_panel_list = response.result.data.chat_list;
    }
          },
          (error)=>{
              console.log(error);
          });


}

chatPanelDetailF(agent_id){
      let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="get_by_id";
    chat_req.chat_type="webchat";
    chat_req.agent_id=agent_id;
    chat_req.admin_id=localStorage.getItem('admin_id');
    chat_req.user_id=this.loginUser;
    api_req.operation="chatinternal";
    api_req.moduleType="chatinternal";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.chat_detail_key = agent_id;
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            console.log(response);
            if(response.result.status==true){
              // this.chatautoScroll();

        // if(c_status == '2'){
        // 	this.chat_status_detail_id = 'closed';
        // 	this.is_chat_closed = true;
        // } else {
        // 	this.is_chat_closed = false;
        // }
        this.showChatDetails = true;
                 this.chat_panel_details = response.result.data.chat_detail_list;
                  this.customer_name = response.result.data.agent_name;
                  this.a_profile_image = response.result.data.agent_profile_image;
                  this.login_status = response.result.data.login_status;
                  this.user_type = response.result.data.user_type;
                  if(response.result.data.user_type == '4'){
                    this.user_type = 'Employee';
                  } else {
                    this.user_type = 'Admin';
                  }
                 console.log(this.chat_panel_details);
             this.chatautoScroll2();
            //  this.chatautoScroll();
            }

          },
          (error)=>{
              console.log(error);
          });


}




closealldisp(data){
  if(data == 'innerChat'){
    this.showChatDetails = false;
  } else {
    this.showMyChats = false;
    this.showMyContacts = false;
    this.showChatDetails = false;
    this.showChatPannels = false;
  }

}


showChats(data){
if(data == 'chats'){
  this.showMyChats = true;
  this.showMyContacts = false;
  this.showChatPannels = true;
  this.getActiveChats();
} else {
  this.showMyChats = false;
  this.showMyContacts = true;
  this.showChatPannels = true;
}
}




getActiveChats(){
  let admin_id: any=localStorage.getItem('admin_id');
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"chatinternal", "moduleType":"chatinternal", "api_type": "web", "access_token":"'+access_token+'","element_data":{"action":"user_last_chat","admin_id":"'+admin_id+'","user_id":"'+this.loginUser+'"}}';
  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
           //  this.chatautoScroll();

     this.almychat =response.result.data.chat_detail_list
    } else {

    }
  },
  (error)=>{
      console.log(error);
  });
}








}


