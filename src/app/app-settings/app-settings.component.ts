import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import '../../assets/js/scripts.js';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
layout = '1';
theme = 'white';
access_token;
uadmin_id;
customHtml;
admin_id;
layoutM;
themeM;
chatBot;
senders_list;
user_type;
h_wp;
showfb = false;
showwp = false;
showchat = false;
showline = false;
showtele = false;
hide_admin_sett = true;

lineliveContent=false;
linedemoContent=true;

fb_status;
democontentFB=true;
liveContentFB=false;
fb_page_name;
fb_account_from;
has_fb_page=false;

liveContentWP = false;
democontentWP = true; 
whatsapp_account_from;

h_voice3cx=false;
h_wp_unoff=false;
h_wp_off =false;
wall_1=false;
wall_2=false;
wall_3=false;
wall_4=false;
h_contact=false;
h_dialer=false;
h_lead=false;
h_sms=false;
h_pred=false;
encAdmin;
sms_widget;
dialer_widget;
int_chat_widget;
h_webinar=false;
h_int_chat=false;
h_chat=false;
webinar_url;
allwidgets;
constructor(private serverService: ServerService,private router:Router) { }

  ngOnInit() {
    if (! localStorage.justOnces) {
      localStorage.setItem("justOnces", "true");
      window.location.reload();
    }
    this.layoutM = localStorage.getItem('layout');
    this.user_type = localStorage.getItem('user_type');
    this.themeM = localStorage.getItem('theme');
    this.admin_id = localStorage.getItem('admin_id');
    this.uadmin_id = localStorage.getItem('userId');
    this.encAdmin = localStorage.getItem('encAdmin');
    
    // this.h_fb = localStorage.getItem('has_fb');
    // this.h_line = localStorage.getItem('has_line');
    // this.h_tele = localStorage.getItem('has_telegram');
 

    
    


    if(localStorage.getItem('has_whatsapp') == '1' && this.user_type == 'Admin' ){
      this.showwp = true;
     
    }
      if(localStorage.getItem('has_fb') == '1'&& this.user_type == 'Admin'){
      this.showfb = true;
     
    } 
     if(localStorage.getItem('has_chatbot') == '1'&& this.user_type == 'Admin'){
      this.showchat = true;
    }
     if(localStorage.getItem('has_line') == '1'&& this.user_type == 'Admin'){
      this.showline = true;
    }
     if(localStorage.getItem('has_telegram') == '1'&& this.user_type == 'Admin'){
      this.showtele = true;
      
    }

    this.whatsapp_account_from = localStorage.getItem('whatsapp_account');
    $(":radio[name='wpDemoLive'][value='"+this.whatsapp_account_from +"']").attr('checked', 'checked');
    if(this.admin_id == '1') { this.admin_id = this.uadmin_id }
   
    this.fb_account_from = localStorage.getItem('fb_account');
    $(":radio[name='wpDemoLive'][value='"+this.fb_account_from +"']").attr('checked', 'checked');
    if(this.admin_id == '1') { this.admin_id = this.uadmin_id }
    
    if(this.user_type == 'Employee'){
      this.hide_admin_sett = false;
    }

    this.customHtml = 'https://'+window.location.hostname+'/webchat/?aid='+btoa(this.admin_id);
    this.webinar_url='https://'+window.location.hostname+'/webinar-template/webinar-list.php?meeting='+this.encAdmin;
    this.chatBot = 'https://'+window.location.hostname+'/chatbot/?url='+this.encAdmin;
    this.sms_widget = 'https://'+window.location.hostname+'/sms-widget/?login='+this.encAdmin;
    this.dialer_widget = 'https://'+window.location.hostname+'/mconnectDialer/?login='+this.encAdmin;
    this.int_chat_widget='https://'+window.location.hostname+'/internal-chat-widget/?login='+this.encAdmin;
    this.allwidgets='https://'+window.location.hostname+'/widget-CID/?login='+this.encAdmin;
    
    let access_token: any=localStorage.getItem('access_token');
    //$(".selectgroup-input[value|='2']").prop("checked", true);
      this.senders();
      this.initChatSettings();
      this.getfbAcc();
      this.getwpAcc();
      this.hasContactAccess();
  }

  getfbAcc(){
    if(localStorage.getItem('fb_account') == '0' || localStorage.getItem('fb_account') == ' ' ){
      this.liveContentFB = false;
      this.democontentFB = true; 
    } else {
      this.liveContentFB = true;
      this.democontentFB = false; 
    }

    let fb_account = localStorage.getItem('fb_account');
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('admin_id');
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"facebook_account_settings","user_id":"'+admin_id+'","facebook_account":"'+fb_account+'"}}';

     this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data.status=="true"){
        if(response.result.data.facebook_account == "1" && response.result.data.fb_page_name != null){
          this.has_fb_page = true;
            this.fb_page_name=response.result.data.fb_page_name.split(',');
            console.log(this.fb_page_name);
        }
      }
});
    
  }
  getwpAcc(){
    if(localStorage.getItem('whatsapp_account') == '0' || localStorage.getItem('whatsapp_account') == ' ' ){
        this.liveContentWP = false;
        this.democontentWP = true; 
      } else {
        this.liveContentWP = true;
        this.democontentWP = false; 
      }
  }

  myLayout(){
    this.layout = $('[name="value"]:checked').val();
  }
  mytheme(theme){
    this.theme = theme;
  }



    showDemoAccount(wpAcc){
      Swal.fire({
        title: 'Are you sure?',
        text: "You want change this settings",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.value) {
          var whatsapp_account = '0'; 
          if(wpAcc == 'default'){ whatsapp_account = '0';  } else {  whatsapp_account = '1';  }
          let access_token: any=localStorage.getItem('access_token');
          let admin_id: any=localStorage.getItem('admin_id');
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"whatsapp_account_settings","user_id":"'+admin_id+'","whatsapp_account":"'+whatsapp_account+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        Swal.fire(
          'Updated!',
          'success'
        );
        localStorage.setItem('whatsapp_account', whatsapp_account);
        this.getwpAcc();
      }
  
    }, 
    (error)=>{
        console.log(error);
    });
        } else {
          if( localStorage.getItem('whatsapp_account') == '0'){ whatsapp_account = '0';  } else {  whatsapp_account = '1';  }
          $(":radio[name='wpDemoLive'][value='"+whatsapp_account+"']").prop('checked', 'checked');
        }
      })
    }
  
    showfbDemoAccount(wpAcc){
      console.log(wpAcc);
      Swal.fire({
        title: 'Are you sure?',
        text: "You want change this settings",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.value) {
          var fb_account = '0'; 
          if(wpAcc == 'default'){ fb_account = '0';  } else {  fb_account = '1';  }
          let access_token: any=localStorage.getItem('access_token');
          let admin_id: any=localStorage.getItem('admin_id');
          let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"facebook_account_settings","user_id":"'+admin_id+'","facebook_account":"'+fb_account+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data.status=="true"){
        Swal.fire(
          'Updated!',
          'success'
        );
        // this.fb_page_name=response.result.data.fb_page_name;
        // console.log(this.fb_page_name);
        localStorage.setItem('fb_account', fb_account);
        this.getfbAcc();
        // if(wpAcc == 'default'){
        //   this.liveContentFB = false;
        //   console.log(this.liveContentFB);
        //   this.democontentFB = true; 
        //   console.log(this.democontentFB);

        // } else {
        //   this.liveContentFB = true;
        //   this.democontentFB = false; 
        // }
       
      }
  
    }, 
    (error)=>{
        console.log(error);
    });
        } else {
          if( localStorage.getItem('fb_account') == '0'){ fb_account = '0';  } else {  fb_account = '1';  }
          $(":radio[name='fbDemoLive'][value='"+fb_account+"']").prop('checked', 'checked');
          // if(wpAcc == 'default'){ fb_account = '0';  } else {  fb_account = '1';  }
          // $(":radio[name='fbDemoLive'][value='"+fb_account+"']").prop('checked', 'checked');
        }
      })
    }
  












  senders(){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"contact", "moduleType":"contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_senderid","admin_id":"'+this.admin_id +'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      this.senders_list = response.result.data.sender_id;
    }, 
    (error)=>{
        console.log(error);
    });
  }




appsettings(){
  console.log(this.layout + this.theme);
  if(this.layout == '1'){ this.layout ='light'; } else { this.layout ='dark'; }
  let access_token: any=localStorage.getItem('access_token');
this.uadmin_id = localStorage.getItem('userId');

let app_set:any = '{"operation":"updateSettings", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_settings","user_id":"'+this.uadmin_id+'","layout":"'+this.layout+'","theme":"'+this.theme+'"}}';
 
 this.serverService.sendServer(app_set).subscribe((response:any) => {
     console.log(response);
     if(response.status==true){

      localStorage.setItem('theme', this.theme);
      localStorage.setItem('layout', this.layout);
      iziToast.success({
        message: "Theme Updated Successfully.",
        position: 'topRight'
    });
     }
    });
}

copyClipboard(element){
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
  iziToast.success({
    message: "Script Copied",
    position: 'topRight'
});
}













addDepartment(){
  $('#add_deptform').modal('show');
}


addSender(){

      let access_token: any=localStorage.getItem('access_token');
    let senderid = $('#senderid').val();
      let api_req:any = '{"operation":"contact", "moduleType": "contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_senderid","senderid":"'+senderid+'","admin_id":"'+this.uadmin_id+'"}}';
    
          this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.data == 1) {
                  $('#add_deptform').modal('hide');
                  iziToast.success({
                      message: "Sender ID added successfully",
                      position: 'topRight'
                  });
                  this.senders();
              }
              else if (response.result.data == 2) {
                iziToast.warning({
                    message: "Sender ID already inserted",
                    position: 'topRight'
                });
            }
          else{
              
                  iziToast.error({
                      message: "Sender ID not added. Please try again",
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
  









    deletedata(id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          let access_token: any=localStorage.getItem('access_token');
          let admin_id: any=localStorage.getItem('admin_id');
    let api_req:any = '{"operation":"contact", "moduleType": "contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_senderid","id":"'+id+'","admin_id":"'+admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        Swal.fire(
          'Deleted!',
          'success'
        );
        this.senders();
      }
  
    }, 
    (error)=>{
        console.log(error);
    });
        }
      })
    }
  
  

    initChatSettings(){
      let access_token: any=localStorage.getItem('access_token');
      let user_id: any=localStorage.getItem('userId');
      let api_req:any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_chat_settings","user_id":"'+this.uadmin_id +'"}}';
    
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        let agent_data = response.result.data;
        $('#widget_position').val(agent_data.chat_place).prop('selected', true);
        $('#office_in_time').val( agent_data.office_in_time);
        $('#office_out_time').val( agent_data.office_out_time );
        $('#offline_email').val( agent_data.offline_email );
        
        if(agent_data.chat_aviator == 1){
          $('#chat_aviator').prop('checked', true);
         } else {
          $('#chat_aviator').prop('checked', false);
         }
         if(agent_data.chat_agent_name == 1){
          $('#chat_agent_name').prop('checked', true);
         } else {
          $('#chat_agent_name').prop('checked', false);
         }
      }, 
      (error)=>{
          console.log(error);
      });
    }
    
    updateChatSett(){
      let access_token: any=localStorage.getItem('access_token');
      let chat_place = $('#widget_position').val();
      let chat_aviator = $('#chat_aviator').is(':checked');
      let office_in_time = $('#office_in_time').val();
      let office_out_time = $('#office_out_time').val();
      let chat_agent_name = $('#chat_agent_name').is(':checked');
      let offline_email = $('#offline_email').val();
        let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_chat_settings","chat_place":"'+chat_place+'","office_out_time":"'+office_out_time+'","chat_aviator":"'+chat_aviator+'","office_in_time":"'+office_in_time+'","chat_agent_name":"'+chat_agent_name+'","offline_email":"'+offline_email+'","user_id":"'+this.uadmin_id+'"}}';
      
            this.serverService.sendServer(api_req).subscribe((response: any) => {
            if (response.result.data == 1) {
                    $('#add_deptform').modal('hide');
                    iziToast.success({
                        message: "Chat settings Updated successfully",
                        position: 'topRight'
                    });
                    this.senders();
                }
                
            else{
                
                    iziToast.error({
                        message: " Please try again",
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
      hideshowLinedetails(form){
        if(form == 'LineDemo'){
          this.lineliveContent = false;
          this.linedemoContent= true; 
        } else{
          this.lineliveContent = true;
          this.linedemoContent= false; 
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
            if(response.status==true){
         

              if(response.result.data.voice_3cx == 1){
                this.h_voice3cx= true;
            }
            if(response.result.data.has_whatsapp == 1){
                     
              if(response.result.data.whatsapp_type == 0){
                this.h_wp_unoff = true;
                this.h_wp_off = false;

              }
              else {
                this.h_wp_unoff = false;

                this.h_wp_off = true;
              }

            }
            if(response.result.data.wallboard_one == 1){
              this.wall_1 = true;
            }
            if(response.result.data.wallboard_two == 1){
              this.wall_2 = true;
            }
            if(response.result.data.wallboard_three == 1){
              this.wall_3 = true;
            }
            if(response.result.data.wallboard_four == 1){
              this.wall_4 = true;
            }
            
            if(response.result.data.ext_int_status == 2){
              this.h_dialer = true;
            }
            if(response.result.data.has_contact == 1){
              this.h_contact= true;
          }
          if(response.result.data.lead == 1){
            this.h_lead = true;
          }
          if(response.result.data.has_sms == 1){
            this.h_sms = true;
          }
          if(response.result.data.has_internal_chat == 1){
            this.h_int_chat = true;
          }
          if(response.result.data.predective_dialer == 1){
            this.h_pred = true;
          }
          if(response.result.data.has_webinar == 1){
            this.h_webinar = true;
          }
          if(response.result.data.has_chat == 1){
            this.h_chat = true;
          }
            } 
          }, 
          (error)=>{
              console.log(error);
          });

        } 
        
        // seevideos(){
        //   this.router.navigate(['/vid-blog']);

        // }
      
}