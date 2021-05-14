import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { NgZone } from '@angular/core';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-whatsapp-chat',
  templateUrl: './whatsapp-chat.component.html',
  styleUrls: ['./whatsapp-chat.component.css']
})
export class WhatsappChatComponent implements OnInit {
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
	phone_num;
	uadmin_id;
  departments;
  param1;
  param2;
  constructor(private serverService: ServerService,private _ngZone: NgZone,private route: ActivatedRoute) { 
    this.param1 = this.route.snapshot.queryParamMap.get('c');
    this.param2 = this.route.snapshot.queryParamMap.get('page_id'); 

    this.serverService.changeDetectionEmitter.subscribe(
      ($event) => {

        let mData = JSON.parse($event);
        var pagefor = mData.pagefor;
        var pageid = mData.id;

        if(pagefor == 'whatsapp'){
          this.chatPanelDetail(pageid);
          setTimeout(()=>{ 
            $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
            }, 4000);
        }
        
      },
      (err) => {
      }
    );


  }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
        this.loginUser = localStorage.getItem('userId');

        if(this.param1){
          this.param1 = atob(this.param1);
          this.chatPanelView("all");
          this.chatPanelDetail(this.param1);

          } else if(this.param2){
            this.param2 = atob(this.param2);
            this.chatPanelView(this.param2);
            this.chatPanelDetail(this.param2);
            } else {
            this.chatPanelView("all");
          }
  
            this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4004"); 
  
      this.websocket.onopen = function(event) { 
          console.log('socket chat connected');
          
      }
  
      this.websocket.onmessage = function(event) {
  
  
        this.socketData = JSON.parse(event.data);
  
        if(this.socketData.message_type == "chat"){
        
  
      if(this.socketData.message_info.chat_id == $('#chat_detail_id').val()){
  
        //this.chatPanelDetail(this.socketData.message_info.chat_id);
        $('#open_chat_detail_id').val(this.socketData.message_info.chat_id);
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
  
      ngAfterViewInit() {
     this.chatautoScroll();
  }
  
  chatautoScroll(){   

    setTimeout(()=>{ 
      $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
      }, 10);
     
    }
  
  
    chatSearch(chatSearch){
    console.log(chatSearch);
  
    }
  
sendChatMessageData(){

      var chat_message=  this.chat_message.nativeElement.value;
      chat_message = chat_message.trim();
     if (chat_message.length > 0) {
  
     console.log(chat_message);
         let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="send_chat_message";
        chat_req.chat_id=this.chat_detail_id.nativeElement.value;
        chat_req.user_id=this.loginUser;
        chat_req.chat_message=chat_message;
        api_req.operation="wpchat";
        api_req.moduleType="wpchat";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;
      
        
              this.serverService.sendServer(api_req).subscribe((response:any) => {
    
                if(response.result.status==1){
  
                var chat_msg= response.result.data;
  console.log(response);
               var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1"}}';
  
               this.websocket.send(socket_message);
  
               console.log(socket_message);
                       
                   this.chat_panel_details.push(chat_msg);
                   
                   this.chatautoScroll();
                   this.chatPanelDetail(this.chat_detail_id.nativeElement.value)
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
  
    chatPanelView(chat_id){
  
  
          let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_message_panel";
        chat_req.chat_id=chat_id;
        chat_req.user_id=this.loginUser;
        api_req.operation="wpchat";
        api_req.moduleType="wpchat";
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
        chat_req.search_text=search_text;
        chat_req.user_id=this.loginUser;
        api_req.operation="wpchat";
        api_req.moduleType="wpchat";
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
  
    chatPanelDetail(chat_id){
          let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_detail_list";
        chat_req.chat_id=chat_id;
        chat_req.user_id=this.loginUser;
        api_req.operation="wpchat";
        api_req.moduleType="wpchat";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        
              this.serverService.sendServer(api_req).subscribe((response:any) => {
               
                if(response.result.status == true){
                  console.log(response.result.status);
                     this.chat_panel_detail_type = "chat_detail";
                     this.chat_panel_details = response.result.data.chat_detail_list;
                     this.customer_name = response.result.data.chat_detail_list[0].customer_name;
  
                     this.chatautoScroll(); 
                     this.chat_detail_key = chat_id;
                     setTimeout(()=>{ 
                      $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
                      }, 10);
                }
                  
              }, 
              (error)=>{
                  console.log(error);
              });
  
  
    }
  
  
  
  
  
  
  
  
  
    genTicket(phone_num){ 
    this.phone_num = phone_num; 
    this.getDepartments();
      $('#assign_ticket').modal('show');
    }
    
  
  
    assignTicket(phone_num){  
    let assigned_department_id: any= $('#departments').val();
    console.log(assigned_department_id);
      if(assigned_department_id == '0'){
        iziToast.warning({
        message: "Please select department",
        position: 'topRight'
      });
      return false;
      }
    
      let access_token: any=localStorage.getItem('access_token');
      let admin_id: any=localStorage.getItem('admin_id');
      let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"generate_wp_ticket","user_id":"'+this.uadmin_id+'","department_id":"'+assigned_department_id+'","phone_num":"'+phone_num+'","admin_id":"'+admin_id+'"}}';
      
      this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
            iziToast.success({
              message: "Ticket Assigned Successfully",
              position: 'topRight'
            });
            $('#assign_ticket').modal('hide');
          } else {
          
            iziToast.warning({
              message: "Ticket Not Assigned. Please try again",
              position: 'topRight'
            });
          
        }
    
      },
      (error) => {
         iziToast.error({
          message: "Sorry, some server issue occur. Please contact admin",
          position: 'topRight'
        });
        console.log(error);
      });
    }
  
  
  
  
  
    getDepartments(){
    let access_token: any=localStorage.getItem('access_token');
    
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.uadmin_id+'"}}';
    
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
      this.departments = response.result.data;
      } else {
      }
    }, 
    (error)=>{
      console.log(error);
    });
    }
  
  
addWhatsappMedia(){ 
  let access_token: any=localStorage.getItem('access_token');
  let user_id: any =  localStorage.getItem('userId'); 
  let chat_id: any=this.chat_detail_id.nativeElement.value;
    var formData = new FormData();
    formData.append('operation', 'agents');
    formData.append('moduleType', 'agents');
    formData.append('api_type', 'web');
    formData.append('api_type', 'web');
    formData.append('action', 'whatsapp_media_upload');
    formData.append('access_token', access_token);
    formData.append('whatsapp_media', $('#whatsapp_media')[0].files[0]);
    formData.append('user_id', user_id);
    formData.append('chat_id', chat_id);


    console.log(formData);
  
  $.ajax({  
    url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",  
    type : 'POST',
    data : formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false, 
    success:function(data){ 
      this.parsed_data = JSON.parse(data);
      console.log(this.parsed_data );
      if(this.parsed_data.status == 'true'){  
        $('#whatsapp_media_url').val(this.parsed_data.url);
        $('#createNewWidget').modal('hide');
        $('#whatsapp_media').val('');
        $('#hit_image').click();
      } else {
        iziToast.error({
          message: "Sorry, Some Error Occured",
          position: 'topRight'
      });
      }
    }  
});  

  }





  
  sendChatMediaData(){

    var chat_message=  this.chat_message.nativeElement.value;
    chat_message = chat_message.trim();

   console.log(chat_message);
       let api_req:any = new Object();
      let chat_req:any = new Object();
      chat_req.action="send_chat_message";
      chat_req.chat_id=this.chat_detail_id.nativeElement.value;
      chat_req.user_id=this.loginUser;
      chat_req.chat_message=chat_message;
      api_req.operation="wpchat";
      api_req.moduleType="wpchat";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      chat_req.whatsapp_media_url= $('#whatsapp_media_url').val();
      api_req.element_data = chat_req;
    
      
            this.serverService.sendServer(api_req).subscribe((response:any) => {
  
              if(response.result.status==1){

              var chat_msg= response.result.data;

             var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1"}}';

             this.websocket.send(socket_message);

             console.log(socket_message);
                     
                 this.chat_panel_details.push(chat_msg);
                 
                 this.chatautoScroll();
                 this.chatPanelDetail(this.chat_detail_id.nativeElement.value)
                 $('#chat_msg').val('');
              }
                
            }, 
            (error)=>{
                console.log(error);
            });

  

  }





  }
  