import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-fb-chat',
  templateUrl: './fb-chat.component.html',
  styleUrls: ['./fb-chat.component.css']
})
export class FbChatComponent implements OnInit {
  @ViewChild('chat_message', {static: false}) chat_message : ElementRef;
	@ViewChild('chat_detail_id', {static: false}) chat_detail_id : ElementRef; 
  uadmin_id;
  loginUser;
  chat_panel_list;
  search_list;
	chat_panel_details;
	chat_panel_detail_type = "chat_screen";
  chat_detail_key;
  first_name;
  last_name;
  profile_pic;
  page_name;
  page_pic;
  param1;
  callonce;
  temp_list;
  departments;

  constructor(private serverService: ServerService,private route: ActivatedRoute) {
     
  this.param1 = this.route.snapshot.queryParamMap.get('c');
  
  this.serverService.changeDetectionEmitter.subscribe(
		($event) => {
	
		  let mData = JSON.parse($event);
		  var pagefor = mData.pagefor;
		  var pageid = mData.id;
		   
	
		  if(pagefor == 'fb'){
			// this.chatPanelDetail(pageid);			
      // this.chatPanelView(pageid);
        // this.chatPanelView2(pageid);
        
        
        if(this.chat_detail_key==pageid)	
        this.chatPanelDetail2(pageid);
        else
        this.chatPanelView2("all");

			// setTimeout(()=>{ 
			//   $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
			//   }, 4000);
		  }
		  
		},
		(err) => {
		}
	  );


   }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.loginUser = localStorage.getItem('userId');

    if(this.param1){
      this.param1 = atob(this.param1);
      // console.log(this.param1);
      this.chatPanelView(this.param1);
      // this.chatPanelView("all");
			// this.chatPanelDetail(this.param1);
		  } else {
			this.chatPanelView("all");
		  }
// alert("tes");
    // this.chatPanelView("all");
    
      this.get_temps();
      
   }
  ngOnDestroy() {
    clearTimeout(this.callonce);
     
  }
   sendChatMessageData(){
  
   
    var chat_message=  this.chat_message.nativeElement.value;
    chat_message = chat_message.trim();
   if (chat_message.length > 0) {

   console.log(chat_message);
       let api_req:any = new Object();
      let chat_req:any = new Object();
      chat_req.action="fb_reply_message";
      chat_req.chat_id=this.chat_detail_id.nativeElement.value;
      chat_req.user_id=this.loginUser;
      chat_req.admin_id=this.uadmin_id;
      chat_req.sender_id=this.chat_detail_id.nativeElement.value;
      chat_req.chat_message=chat_message;
      api_req.operation="wpchat";
      api_req.moduleType="wpchat";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      
            this.serverService.sendServer(api_req).subscribe((response:any) => {
  
              if(response.result.data==1){

                 this.chatautoScroll();
                 this.chatPanelDetail(this.chat_detail_id.nativeElement.value);
                 $('#chat_msg').val('');
              }
                else{
                  iziToast.warning({
                    message:'Sorry,Chat was Closed. You have to respond to your customer`s message within 24 hours.',
                    position:'topRight'
                   });
                }
            }, 
            (error)=>{
                console.log(error);
            });

   }

  }

  oncemore(){
    // alert("all");
    clearTimeout(this.callonce);

      this.chatPanelViewoncemore(this.chat_detail_key);
    }

    chatPanelViewoncemore(chat_id){
  
  
      let api_req:any = new Object();
      let chat_req:any = new Object();
      chat_req.action="fb_message_panel";
      
      chat_req.user_id=this.loginUser;
      api_req.operation="wpchat";
      api_req.moduleType="wpchat";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      
            this.serverService.sendServer(api_req).subscribe((response:any) => {
              console.log(response);
              if(response.status == true){
                   
                   this.chat_panel_list = response.result.data;
                   this.search_list = response.result.data;
    
                   if(chat_id == "all" || chat_id == "" || chat_id == 0){
                     this.chat_panel_detail_type = "chat_screen";
                   }
                   else{
                     this.chat_panel_details = response.result.data.chat_detail_list;
                     this.chat_panel_detail_type = "chat_detail";
                     this.chatPanelDetailoncemore(chat_id);
                   }
    
                   
                   this.chatautoScroll();
                   this.chat_detail_key = chat_id;
                  //  alert("callerd");
 
                  //  this.callonce = setTimeout(() => {
                  //    this.chatPanelViewoncemore(this.chat_detail_key);
                  //  alert("callerd");
                  //  }, 15000);
              }
              
            }, 
            (error)=>{
              iziToast.warning({
                message:'Sorry,server not respond',
                position:'topRight'
               });
                console.log(error);
            });
    
    
      }

      chatPanelDetailoncemore(chat_id){
        let api_req:any = new Object();
      let chat_req:any = new Object();
      chat_req.action="fb_single_chat";
      chat_req.sender_id=chat_id;
      chat_req.user_id=this.loginUser;
      api_req.operation="wpchat";
      api_req.moduleType="wpchat";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      
            this.serverService.sendServer(api_req).subscribe((response:any) => {
             
              if(response.status == true){
                console.log(response.status);
             //$('#chat_msg').val('Hello before we proceed kindly read through this informed consent.\nReply "Agree" if you accept the terms of the consent. \nThank you');

                   this.chat_panel_detail_type = "chat_detail";
                   this.chat_panel_details = response.result.data;
                   let last:any = this.chat_panel_details[this.chat_panel_details.length-1];
      console.log(last.id);
                   this.first_name = response.result.data[0].first_name;
                   this.last_name = response.result.data[0].last_name;
                   this.profile_pic= response.result.data[this.chat_panel_details.length-1].profile_pic;
                   this.page_name= response.result.data[0].page_name;
                  //  this.page_pic=response.result.data[0].page_picture;
                   this.page_pic=response.result.data[0].profile_pic;
      
                   this.chatautoScroll(); 
                   this.chat_detail_key = chat_id;
              }
                
              // clearTimeout(this.callonce);
       
              // $("#calloncemore").click();  
            }, 
            (error)=>{
                console.log(error);
            });
      
      
      }


  chatPanelView(chat_id){
  
  
  let api_req:any = new Object();
  let chat_req:any = new Object();
  chat_req.action="fb_message_panel";
  
  chat_req.user_id=this.loginUser;
  api_req.operation="wpchat";
  api_req.moduleType="wpchat";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = chat_req;
  
        this.serverService.sendServer(api_req).subscribe((response:any) => {
          console.log(response);
          if(response.status == true){
               
               this.chat_panel_list = response.result.data;
               this.search_list = response.result.data;

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


//   chatPanelList(search_text){
  
  
  
//     let api_req:any = new Object();
//   let chat_req:any = new Object();
//   chat_req.action="get_queue_chat_list";
//   chat_req.search_text=search_text;
//   chat_req.user_id=this.loginUser;
//   api_req.operation="wpchat";
//   api_req.moduleType="wpchat";
//   api_req.api_type="web";
//   api_req.access_token=localStorage.getItem('access_token');
//   api_req.element_data = chat_req;
  
//         this.serverService.sendServer(api_req).subscribe((response:any) => {
          
//           if(response.result.status==1){
//                this.chat_panel_list = response.result.data.chat_list;
       
//           }
            
//         }, 
//         (error)=>{
//             console.log(error);
//         });


// }


chatPanelList(search_text){
  console.log(search_text);


    const lcText = search_text.toString().toLowerCase(); // calculate this once
    this.chat_panel_list = this.search_list.filter(
      e => (
        // Added initial opening brace
        (e.first_name.toLowerCase().indexOf(lcText) === 0) ||
        (e.last_name.toLowerCase().indexOf(lcText) === 0)         
      )// added closing brace
    );
        console.log(this.chat_panel_list);
  
}


chatautoScroll(){   
  setTimeout(()=>{ 
    $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
 
    }, 10);
  }

chatPanelDetail(chat_id){
$('#chat_msg').val('');
let api_req:any = new Object();
let chat_req:any = new Object();
chat_req.action="fb_single_chat";
chat_req.sender_id=chat_id;
chat_req.user_id=this.loginUser;
api_req.operation="wpchat";
api_req.moduleType="wpchat";
api_req.api_type="web";
api_req.access_token=localStorage.getItem('access_token');
api_req.element_data = chat_req;

      this.serverService.sendServer(api_req).subscribe((response:any) => {
       
        if(response.status == true){
          console.log(response.status);
             this.chat_panel_detail_type = "chat_detail"; 
          if(this.uadmin_id=='821')
           $('#chat_msg').val('Hello before we proceed kindly read through this informed consent.\nReply "Agree" if you accept the terms of the consent. \nThank you');
             this.chat_panel_details = response.result.data;
             let last:any = this.chat_panel_details[this.chat_panel_details.length-1];
console.log(last.id);
             this.first_name = response.result.data[0].first_name;
             this.last_name = response.result.data[0].last_name;
             this.profile_pic= response.result.data[this.chat_panel_details.length-1].profile_pic;
             this.page_name= response.result.data[0].page_name;
            //  this.page_pic=response.result.data[0].page_picture;
             this.page_pic=response.result.data[0].profile_pic;

            //  this.chatautoScroll(); 
             this.chat_detail_key = chat_id;
        }
          
        clearTimeout(this.callonce);
 
        $("#calloncemore").click();  
      }, 
      (error)=>{
          console.log(error);
      });


}

onMessageSend($event){
  
  if($event.keyCode == 13 && !$event.shiftKey){

// alert("sdjs");
          this.sendChatMessageData();
          $event.stopPropagation();
        return false;
        }


  }

addWhatsappMedia(){ 
  let access_token: any=localStorage.getItem('access_token');
  // let chat_id: any=this.chat_detail_id.nativeElement.value;
    var formData = new FormData();
    formData.append('operation', 'wpchat');
    formData.append('moduleType', 'wpchat');
    formData.append('api_type', 'web');
    // formData.append('api_type', 'web');
    formData.append('action', 'fb_reply_media_upload');
    formData.append('access_token', access_token);
    formData.append('facebook_media', $('#whatsapp_media')[0].files[0]);
    formData.append('user_id', this.loginUser);
    formData.append('chat_id', this.chat_detail_id.nativeElement.value);
    formData.append('sender_id',this.chat_detail_id.nativeElement.value);
    console.log(formData);
   
  $.ajax({  
    url:"https://omni.mconnectapps.com/api/v1.0/index_new.php",  
    // url:"https://omni.mconnectapps.com/api/v1.0/index_new.php",  
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
        $('#chat_details_call').click();
        this.chatPanelDetail(this.chat_detail_id.nativeElement.value);

      } else {
        iziToast.warning({
          message:'Sorry, you have to respond to your customer`s message within 24 hours.',
          position:'topRight'
         });
        $('#createNewWidget').modal('hide');

      }
    }  
});  

  }


  get_temps(){
    let access_token: any=localStorage.getItem('access_token');
    
    let api_req:any = '{"operation":"template", "moduleType":"template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"listTemplateByUSer","admin_id":"'+this.uadmin_id+'","user_id":"'+this.loginUser+'"}}';
    
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
       
      this.temp_list = response.result.data;
      console.log(this.temp_list);
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
        console.log(options);
        console.log(this.temp_list);
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


  chatPanelView2(chat_id){
  
  
    let api_req:any = new Object();
    let chat_req:any = new Object();
    chat_req.action="fb_message_panel";
    
    chat_req.user_id=this.loginUser;
    api_req.operation="wpchat";
    api_req.moduleType="wpchat";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            console.log(response);
            console.log(chat_id);
            console.log(this.chat_detail_key);
            if(response.status == true){
                 
                 this.chat_panel_list = response.result.data;
 
                 if(chat_id == this.chat_detail_key){
              
                   this.chat_panel_details = response.result.data.chat_detail_list;
                   this.chat_panel_detail_type = "chat_detail";
                   this.chatPanelDetail2(chat_id);
                  // this.chatPanelDetail(chat_id);
                 }
  
                 
                //  this.chatautoScroll();
                //  this.chat_detail_key = chat_id;
            }
              
          }, 
          (error)=>{
              console.log(error);
          });
  
  
    }



chatPanelDetail2(chat_id){ 

  let api_req:any = new Object();
  let chat_req:any = new Object();
  chat_req.action="fb_single_chat";
  chat_req.sender_id=chat_id;
  chat_req.user_id=this.loginUser;
  api_req.operation="wpchat";
  api_req.moduleType="wpchat";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = chat_req;
  
        this.serverService.sendServer(api_req).subscribe((response:any) => {      
          if(response.status == true){ 
            setTimeout(()=>{ 
              // alert('rolled')
			  $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
			  }, 1500);           
            console.log(response.status);
               this.chat_panel_detail_type = "chat_detail"; 
          
               this.chat_panel_details = response.result.data;
               let last:any = this.chat_panel_details[this.chat_panel_details.length-1];
  console.log(last.id);
               this.first_name = response.result.data[0].first_name;
               this.last_name = response.result.data[0].last_name;
               this.profile_pic= response.result.data[this.chat_panel_details.length-1].profile_pic;
               this.page_name= response.result.data[0].page_name;
               this.page_pic=response.result.data[0].page_picture;
  
              //  this.chatautoScroll(); 
               this.chat_detail_key = chat_id;
          }
            
        
        }, 
        (error)=>{
            console.log(error);
        });
  
  
  }


}
