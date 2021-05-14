import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-tele-chat',
  templateUrl: './tele-chat.component.html',
  styleUrls: ['./tele-chat.component.css']
})
export class TeleChatComponent implements OnInit {
  @ViewChild('chat_message', {static: false}) chat_message : ElementRef;
	@ViewChild('chat_detail_id', {static: false}) chat_detail_id : ElementRef;

  constructor(private serverService: ServerService,private route: ActivatedRoute) {
    this.param1 = this.route.snapshot.queryParamMap.get('c');
   }

  uadmin_id;
  loginUser;
  chat_panel_list;
	chat_panel_details;
	chat_panel_detail_type = "chat_screen";
  chat_detail_key;
  displayName;
  recipient_id;
  sender_id;
  profile_pic;
  param1;
  temp_list;
  ngOnInit(): void {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.loginUser = localStorage.getItem('userId');


    if(this.param1){
      this.param1 = atob(this.param1);
      console.log(this.param1);
      this.chatPanelView(this.param1);
			// this.chatPanelDetail(this.param1);
		  } else {
			this.chatPanelView("all");
		  }
    // this.chatPanelView("all");
    this.get_temps();
  }


  sendChatMessageData(sender,receiver){
  
    var chat_message=  this.chat_message.nativeElement.value;
    chat_message = chat_message.trim();
   if (chat_message.length > 0) {

   console.log(chat_message);
       let api_req:any = new Object();
      let chat_req:any = new Object();
      chat_req.action="reply_message";
      chat_req.user_id=this.loginUser;
      chat_req.admin_id=this.uadmin_id;
      chat_req.chat_id=this.chat_detail_id.nativeElement.value;
      chat_req.sender_id=receiver;
      chat_req.recipient_id=sender;
      chat_req.chat_message=chat_message;
      api_req.operation="chat_telegram";
      api_req.moduleType="chat_telegram";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      
            this.serverService.sendServer(api_req).subscribe((response:any) => {
  
              if(response.status==true){

                 this.chatautoScroll();
                 this.chatPanelDetail(this.chat_detail_id.nativeElement.value);
                 $('#chat_msg').val('');
              }
                
            }, 
            (error)=>{
                console.log(error);
            });

   }

  }



  chatPanelView(chat_id){
  
  
    let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="telegram_message_panel";
    
    chat_req.user_id=this.loginUser;
    api_req.operation="chat_telegram";
    api_req.moduleType="chat_telegram";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            console.log(response);
            if(response.status == true){
                 
                 this.chat_panel_list = response.result.data;
  
                 if(chat_id == "all" || chat_id == "" || chat_id == 0){
                   this.chat_panel_detail_type = "chat_screen";
                 }
                 else{
                   this.chat_panel_details = response.result.data.chat_detail_list;
                   this.chat_panel_detail_type = "chat_detail";
                   this.chatPanelDetail(chat_id);
                 }
  
                 
                 this.chatautoScroll();
                 this.chat_detail_key = chat_id;
            }
              
          }, 
          (error)=>{
              console.log(error);
          });
  
  
    }


    chatPanelDetail(chat_id){
      $('#chat_msg').val('');
      let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="chat_detail_list";
    chat_req.chat_id=chat_id;
    chat_req.user_id=this.loginUser;
    api_req.operation="chat_telegram";
    api_req.moduleType="chat_telegram";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    
          this.serverService.sendServer(api_req).subscribe((response:any) => {
           
            if(response.status == true){
                 this.chat_panel_detail_type = "chat_detail";
                 this.chat_panel_details = response.result.data.chat_detail_list;
                 this.displayName = response.result.data.chat_detail_list[0].displayName;
                 this.recipient_id = response.result.data.chat_detail_list[0].recipient_id;
                 this.sender_id = response.result.data.chat_detail_list[0].sender_id;
                 
                 this.profile_pic= response.result.data.chat_detail_list[0].profile_picture;
                 
    
                 this.chatautoScroll(); 
                 this.chat_detail_key = chat_id;
            }
              
          }, 
          (error)=>{
              console.log(error);
          });
    
    
    }
  


    chatautoScroll(){   
      setTimeout(()=>{ 
        $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
     
        }, 10);
      }

      onMessageSend($event,recpid,senderid){

        if($event.keyCode == 13){
      
      
        this.sendChatMessageData(recpid,senderid);
                $event.stopPropagation();
              return false;
              }
      
      
        }

        get_temps(){
          let access_token: any=localStorage.getItem('access_token');
          
          let api_req:any = '{"operation":"template", "moduleType":"template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"listTemplateByUSer","admin_id":"'+this.uadmin_id+'","user_id":"'+this.loginUser+'"}}';
          
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            if(response.result.status==true){
             
            this.temp_list = response.result.data;
            // console.log(this.temp_list);
            } 
          }, 
          (error)=>{
            console.log(error);
          });
          }
        

        template(){
          var options = {};
                $.map(this.temp_list,
                    function(o) {
                        options[o.template_message] = o.template_name;
              });
              // console.log(options);
              // console.log(this.temp_list);
          const fruit =   Swal.fire({
            title: 'Select Template',
            input: 'select',
            inputOptions:options,
            inputPlaceholder: 'Select a Template',
            
            confirmButtonText: 'Pick out',
            showCancelButton: true,
            }).then(function (inputValue) {
            if (inputValue) {
              console.log(inputValue.value);
              console.log(fruit);
              $('#chat_msg').val(inputValue.value);
            }
          });
            
           
        }
}
