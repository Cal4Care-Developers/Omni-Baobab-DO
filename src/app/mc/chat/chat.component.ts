import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { NgZone } from '@angular/core';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
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
	param1
	c_status;
	public is_chat_closed = false;
	widget_name = 'OmniChat';
	temp_list;
	adminid;
	doc_link;
  constructor(public serverService: ServerService,private _ngZone: NgZone,private route: ActivatedRoute) {

	this.param1 = this.route.snapshot.queryParamMap.get('c');
	
   }

  ngOnInit() {
		  this.loginUser = localStorage.getItem('userId');
		  this.adminid = localStorage.getItem('admin_id');
		  if(this.param1){
			this.param1 = atob(this.param1);
			this.chatPanelView(this.param1);
			// this.chatPanelDetail(this.param1,this.c_status)
		  } else {
			this.chatPanelView("all");
		  }
  		
	//this.websocket = new WebSocket("wss://cal4care.info:8089/"); 
	this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4004"); 


    this.websocket.onopen = function(event) { 
        console.log('socket chat connected');
        
    }

    this.websocket.onmessage = function(event) {


	  this.socketData = JSON.parse(event.data);
	  
      if(this.socketData.message_type == "chat"){
		

		 if(this.socketData.message_status == "end"){
			 if(this.socketData.message_info.chat_id == $('#chat_detail_id').val()){
			let chatToClose ='chat_'+this.socketData.message_info.chat_id;
				
				iziToast.error({
					message: "Sorry, Chat has been closed by customer",
					position: 'topRight'
				});
				console.log('end')
				$('#chatPanelView').click();
				return false;
			 }
	  }
		
		if(this.socketData.message_info.chat_id == $('#chat_detail_id').val()){
			//this.chatPanelDetail(this.socketData.message_info.chat_id);
			$('#open_chat_detail_id').val(this.socketData.message_info.chat_id);
			$('#open_chat_detail_id').click();
			
		} else {
			$('#chatPanelView').click();
		}

      } 
    
    }
    this.websocket.onerror = function(event){
      console.log('error');
    }
    this.websocket.onclose = function(event){
      console.log('close');
    } 
this.get_temps();

  }

    ngAfterViewInit() {
   this.chatautoScroll();
}

chatautoScroll(){

	if($(".card-body.chat-content").length > 0){
	setTimeout(()=>{ 
	 $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);

	 }, 10);
	}

  }


  chatSearch(chatSearch){

  }

  sendChatMessageData(){

	this.profile_image = localStorage.getItem('profile_image');
   

	if( this.profile_image == null || this.profile_image == 'null' || this.profile_image == 'undefined'){
	  this.profile_image  = 'https://baobabgroup.mconnectapps.com/api/v1.0/profile_image/user.jpg';
	} else {
	  this.profile_image = localStorage.getItem('profile_image');
	}
  	var chat_message=  this.chat_message.nativeElement.value;
  	chat_message = chat_message.trim();
 	if (chat_message.length > 0) {



 	  		let api_req:any = new Object();
			let chat_req:any = new Object();
			chat_req.action="send_chat_message";
			chat_req.chat_type="webchat";
			chat_req.chat_id=this.chat_detail_id.nativeElement.value;
			chat_req.user_id=this.loginUser;
			chat_req.chat_message=chat_message;
			api_req.operation="chat";
			api_req.moduleType="chat";
			api_req.api_type="web";
			api_req.access_token=localStorage.getItem('access_token');
			api_req.element_data = chat_req;
			
            this.serverService.sendServer(api_req).subscribe((response:any) => {
  
	            if(response.result.status==1){

	            var chat_msg= response.result.data;
				let agent_name =localStorage.getItem('user_name');
	           var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1","agent_aviator":"'+this.profile_image+'","agent_name":"'+agent_name+'"}}';

	           this.websocket.send(socket_message);

	           				
	           		this.chat_panel_details.push(chat_msg);
	           		this.chatautoScroll();
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
			chat_req.chat_type="webchat";
			chat_req.chat_id=chat_id;
			chat_req.user_id=this.loginUser;
			api_req.operation="chat";
			api_req.moduleType="chat";
			api_req.api_type="web";
			api_req.access_token=localStorage.getItem('access_token');
			api_req.element_data = chat_req;
			
            this.serverService.sendServer(api_req).subscribe((response:any) => {
	            if(response.result.status==1){
	           			
						   this.chat_panel_list = response.result.data.chat_list;
						   this.c_status=response.result.data.chat_list[0].chat_status;

	           			if(chat_id == "all" || chat_id == "" || chat_id == 0){
	           				this.chat_panel_detail_type = "chat_screen";
	           			}
	           			else{
	           				this.chat_panel_details = response.result.data.chat_detail_list;
							   this.chat_panel_detail_type = "chat_detail";
							   this.chatPanelDetail(chat_id,this.c_status)
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

  chatPanelDetail(chat_id,c_status){
	 $('#chat_msg').val('');
    		let api_req:any = new Object();
			let chat_req:any = new Object();
			chat_req.action="chat_detail_list";
			chat_req.chat_type="webchat";
			chat_req.chat_id=chat_id;
			chat_req.user_id=this.loginUser;
			api_req.operation="chat";
			api_req.moduleType="chat";
			api_req.api_type="web";
			api_req.access_token=localStorage.getItem('access_token');
			api_req.element_data = chat_req;
			
            this.serverService.sendServer(api_req).subscribe((response:any) => {
	            if(response.result.status==1){

					if(c_status == '2'){
						this.chat_status_detail_id = 'closed';
						this.is_chat_closed = true;
					} else {
						this.is_chat_closed = false;
					}
	           			
	           			this.chat_panel_detail_type = "chat_detail";
	           			this.chat_panel_details = response.result.data.chat_detail_list;
						   this.customer_name = response.result.data.chat_detail_list[0].customer_name;
						   this.widget_name= response.result.data.chat_detail_list[0].widget_name;

	           			this.chatautoScroll(); 
	           			this.chat_detail_key = chat_id;
	            }
                
            }, 
            (error)=>{
                console.log(error);
            });


  }



  deletedata(id){

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'END Chat!'
    }).then((result) => {
      if (result.value) {
        let access_token: any=localStorage.getItem('access_token');
        let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_details","chat_id":"'+id+'","user_id":"'+admin_id+'","widget_name":"'+this.widget_name+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status==true){
      Swal.fire(
        'Deleted!',
        'success'
      );
	  this.chatPanelView("all");
    }

  }, 
  (error)=>{
      console.log(error);
  });
      }
    })
  }

  get_temps(){
    let access_token: any=localStorage.getItem('access_token');
    
    let api_req:any = '{"operation":"template", "moduleType":"template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"listTemplateByUSer","admin_id":"'+this.adminid+'","user_id":"'+this.loginUser+'"}}';
    
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
       
      this.temp_list = response.result.data;
    //   console.log(this.temp_list);
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

  showdoc(link){   
    //   this.doc_link=link;
    //  $("#document_model").modal('show');   
    var url= link.split('/');
    // alert(url)
    this.doc_link="https://www.youtube.com/embed/"+url[3];
    // alert(this.doc_link)
  
    $("#video_play").modal('show');
  
   }stop(){
	var el_src = $('.myvideo').attr("src");
		  $('.myvideo').attr("src",el_src);
	}

}
