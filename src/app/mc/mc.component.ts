
import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


import { Router } from '@angular/router';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-mc',
  templateUrl: './mc.component.html',
  styleUrls: ['./mc.component.css']
})
export class McComponent implements OnInit {
  mc_event_list;
  mc_queue_list;
  chatPageView = false;
  smsPageView = false;
  mailPageView= false;
  websocket;
  socketData;
  user_type;
  loginUser;
  admin_id;
  has_sms;
  has_chat;
  has_whatsapp;
  has_chatbot;
  has_e_ticket;
  has_i_ticket;
  has_fb;
  has_tele;
  has_line;
  chat_id;
  fb_sender_id;
  fb_chat_id;
  whatsapp_type;
  wp_unoff=false;
  wp_off=false;
  h_int_chat;
  inst_id;

  instance_value;i_id;
  doc_link;
  encAdmin;
  chatbotUrl;
  userID: any;
  list_wpinsts: any;
  has_admin_permission = false;
  newInstaRedirectNo;


  constructor(private serverService: ServerService, private router:Router, private _formBuilder: FormBuilder) {
    this.serverService.changeDetectionEmitter.subscribe(
      () => {
        this.mcInitialize("");
      },
      (err) => {
      }
    );

  }

  ngOnInit() {




    // if(localStorage.getItem('has_zoho_phonebridge')=='1')
    //      this.router.navigate(['/zoho-bridge']);

// this.hasContactAccess();
    this.mcInitialize("");

    this.user_type = localStorage.getItem('user_type');
    this.loginUser = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');
    this.has_sms = localStorage.getItem('has_sms');
    this.has_chat =localStorage.getItem('has_chat');
    this.has_whatsapp = localStorage.getItem('has_whatsapp');
    this.whatsapp_type=localStorage.getItem('whatsapp_type');
    this.has_chatbot = localStorage.getItem('has_chatbot');
    this.has_e_ticket = localStorage.getItem('has_e_ticket');
    this.has_i_ticket =  localStorage.getItem('has_i_ticket');
    this.has_fb =  localStorage.getItem('has_fb');
    this.has_tele =  localStorage.getItem('has_telegram');
    this.has_line =  localStorage.getItem('has_line');
    this.h_int_chat =  localStorage.getItem('has_int_chat');
    this.encAdmin = localStorage.getItem('encAdmin');
    this.chatbotUrl='https://'+window.location.hostname+'/chatbot/?url='+this.encAdmin;
 // if(this.user_type == 'Super Admin' || this.loginUser == '64'){
  this.getinstance();
    // } else if(this.admin_id == '203'){
    //   this.viewMC("chat_view");
    // } else {
    //   this.viewMC("sms_view");
    // }
    if( this.has_whatsapp=='1'){

   if(this.whatsapp_type=='0'){
   this.wp_unoff=true;
   }
   else{
   this.wp_off==true;
 this.getadmininstance();


   }
  }

  }
  getadmininstance(){
    let access_token: any=localStorage.getItem('access_token');

    let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getInstanceDetailsForAdmin","user_id":"'+this.loginUser+'","user_type":"'+this.user_type+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        if(response.result.data.length)
        this.instance_value = response.result.data[0].wp_inst_id;


        // this.routedept=response.result.data.dept;


      }
    },
    (error)=>{
        console.log(error);
    });
  }

  mcEventList(){

                let api_req:any = new Object();
                let mc_event_req:any = new Object();
                mc_event_req.action="mc_event_list";
                mc_event_req.user_id=localStorage.getItem('userId');
                api_req.operation="chat";
                api_req.moduleType="chat";
                api_req.api_type="web";
                api_req.access_token=localStorage.getItem('access_token');
                api_req.element_data = mc_event_req;

                    this.serverService.sendServer(api_req).subscribe((response:any) => {

                        if(response.result.status==1){

                          this.mc_event_list=response.result.data.mc_event_list;
                        }

                    },
                    (error)=>{
                        console.log(error);
                    });


  }

    mcInitialize(search_text){

					let api_req:any = new Object();
					let mc_event_req:any = new Object();
					mc_event_req.action="chat_initialize";
					mc_event_req.user_id=localStorage.getItem('userId');
					mc_event_req.limit="80";
					api_req.operation="chat";
					api_req.moduleType="chat";
					api_req.api_type="web";
					api_req.access_token=localStorage.getItem('access_token');
					api_req.element_data = mc_event_req;

  	                this.serverService.sendServer(api_req).subscribe((response:any) => {

                        if(response.result.status==1){

                        	this.mc_event_list=response.result.data.mc_event_list;
                        	this.mc_queue_list=response.result.data.user_access;
                        }

                    },
                    (error)=>{
                        console.log(error);
                    });

  }


  viewMC(mc_block){

      if(mc_block == "mail_view"){
        // this.mailPageView = true;
        // this.chatPageView = false;
        // this.smsPageView = false;
        this.router.navigate(['/ticketing-system-new']);
      }
      if(mc_block == "chat_view"){
        // this.chatPageView = true;
        // this.mailPageView = false;
        // this.smsPageView = false;

        this.router.navigate(['/chat']);
      }
      if(mc_block == "sms_view"){
        // this.chatPageView = false;
        // this.mailPageView = false;
        // this.smsPageView = true;
        this.router.navigate(['/sms']);
      }
      if(mc_block == "wp_view"){
        // this.chatPageView = false;
        // this.mailPageView = false;
        // this.smsPageView = true;
        if(this.wp_unoff){
          this.inst_id = btoa(this.newInstaRedirectNo);
          //alert(this.inst_id)
          this.router.navigate(['/wp-unoff'], { queryParams: { wp_id: this.inst_id} });

        }else{
          this.router.navigate(['/wp-chat']);
        }
      }
      if(mc_block == "fb_view"){
        // this.chatPageView = false;
        // this.mailPageView = false;
        // this.smsPageView = true;
        this.router.navigate(['/fb-chat']);
      }
      if(mc_block == "line_view"){
        // this.chatPageView = false;
        // this.mailPageView = false;
        // this.smsPageView = true;
        this.router.navigate(['/line-chat']);
      }
      if(mc_block == "tele_view"){
        // this.chatPageView = false;
        // this.mailPageView = false;
        // this.smsPageView = true;
        this.router.navigate(['/tele-chat']);
      }if(mc_block == "internal_chat"){
        // this.chatPageView = false;
        // this.mailPageView = false;
        // this.smsPageView = true;
        this.router.navigate(['/internal-chat']);
      }

  }


  ViewEventDetails(event_type,event_id,wp_id){
    if(event_type == 1){
      this.chat_id = btoa(event_id);
      this.router.navigate(['/chat'], { queryParams: { c: this.chat_id} });
    } else if(event_type == 7){
      this.fb_sender_id = btoa(event_id);
      this.router.navigate(['/fb-chat'], { queryParams: { c: this.fb_sender_id} });
    } else if(event_type == 5){
      this.chat_id = btoa(event_id);
       this.inst_id = btoa(wp_id);
      // this.i_id= btoa(this.instance_value);
      // alert(this.inst_id);

      // if()
      if(this.wp_unoff){
        this.router.navigate(['/wp-unoff'],{ queryParams: { c: this.chat_id ,wp_id: this.inst_id} });
        }else{
          this.router.navigate(['/wp-chat'],{ queryParams: { c: this.chat_id} });
        }

    } else if(event_type == 6){
      this.chat_id = btoa(event_id);

      this.router.navigate(['/sms'],{ queryParams: { c: this.chat_id} });
    }else if(event_type == 8){
      this.chat_id = btoa(event_id);
      this.router.navigate(['/internal-chat'],{ queryParams: { c: this.chat_id} });
    }else if(event_type == 9){
      this.chat_id = btoa(event_id);
      this.router.navigate(['/line-chat'],{ queryParams: { l: this.chat_id} });
    }else if(event_type == 10){
      this.chat_id = btoa(event_id);
      this.router.navigate(['/tele-chat'],{ queryParams: { c: this.chat_id} });
    }else if(event_type == 11){
      this.chat_id = btoa(event_id);
      if(this.chat_id != null &&this.chat_id != '')
      this.router.navigate(['/ticket-view-thread'],{ queryParams: { ticket_id: this.chat_id} });
    }
}



hasContactAccess(){
  let api_req:any = new Object();
  let conct_req:any = new Object();
  conct_req.action="has_contact_access";
  conct_req.user_id=localStorage.getItem('userId');
  api_req.operation="contact";
  api_req.moduleType="contact";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = conct_req;
  // console.log(api_req);
        this.serverService.sendServer(api_req).subscribe((response:any) => {

                  if( response.result.data.has_internal_chat == 1)
                  {
                        this.h_int_chat=true;
                  }







              },
              (error)=>{
                  console.log(error);
              });

}

showdoc(link){
  this.doc_link=link;
 $("#document_model").modal('show');
}


getinstance(){

  let admin_permisions = localStorage.getItem('admin_permision');

  if ( +admin_permisions == 1|| admin_permisions == '1') {
    this.has_admin_permission = true;
    // alert()
  }

  let access_token: any=localStorage.getItem('access_token');
  let userID=this.loginUser;
  let user_type=this.user_type;
if(this.has_admin_permission){
userID=this.admin_id;
user_type='Admin';
}
let api_req:any = '{"operation":"wp_instance", "moduleType":"wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getInstanceDetailsForAdmin","user_id":"'+userID+'","admin_id":"'+this.admin_id+'","user_type":"'+user_type+'"}}';


this.serverService.sendServer(api_req).subscribe((response:any) => {
  if(response.status==true){
    this.newInstaRedirectNo = response.result.data[0].wp_inst_id;

//  if(response.status)
  }
},
(error)=>{
    console.log(error);
});
}



}
