import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-agentsform',
  templateUrl: './agentsform.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsformComponent implements OnInit {
  addAgent: FormGroup;
  editAgent: FormGroup;
  agents_list; 
  recordNotFound = false;
  pageLimit = 5;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  agent_count;
  a_pass;
  h_con;
  h_fb;
  show_user_sett;
  h_sms;
  h_chat;
  h_wp;
  h_ticket;
  e_tic;
  i_tick;
  h_cbot;
  has_wechat;
  has_telegram;
  voice_3cx;
  H_PD;
  lead;
  cust_pbx;
  wall_1;
  wall_2;
  wall_3;
  wall_4;
  h_2fa;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
   this.addAgent = new FormGroup({
    'agent_name' : new FormControl(null,Validators.required),
    'emailid' : new FormControl(null,Validators.required),
    'phone_number' : new FormControl(null),
    'user_name' : new FormControl(null,Validators.required),
    'user_pwd' : new FormControl(null,Validators.required),
    'sip_login' : new FormControl(null,Validators.required),
    'sip_username' : new FormControl(null),
    'sip_password' : new FormControl(null),
    'has_contact' : new FormControl(0),
    'voice_3cx' : new FormControl(0),
    'predective_dialer' : new FormControl(0),
    'has_sms' : new FormControl(0),
    'has_chat' : new FormControl(0),
    'has_whatsapp' : new FormControl(0),
    'has_chatbot' : new FormControl(0),
    'has_fb' : new FormControl(0),
    'has_wechat' : new FormControl(0),
    'has_telegram' : new FormControl(0),
    'has_internal_ticket' : new FormControl(0),
    'has_external_ticket' : new FormControl(0),
    'wallboard_one' : new FormControl(0),
        'wallboard_two' : new FormControl(0),
        'wallboard_three' : new FormControl(0),
        'wallboard_four' : new FormControl(0),
        'two_factor' : new FormControl(0),
        'admin_permision' : new FormControl(0),
    'status' : new FormControl(0),
   });


    this.editAgent = new FormGroup({
    'user_name' : new FormControl(null,Validators.required),
    'email_id' : new FormControl(null,Validators.required),
    'agent_name' : new FormControl(null,Validators.required),
    'sip_login' : new FormControl(null,Validators.required),
    'sip_username' : new FormControl(null),
    'sip_password' : new FormControl(null),
    'phone_number' : new FormControl(null),
    'user_id' : new FormControl(null),
    'voice_3cx' : new FormControl(0),
    'predective_dialer' : new FormControl(0),
    'has_sms' : new FormControl(0),
    'lead': new FormControl(0),
    'has_contact' : new FormControl(0),
    'has_chat' : new FormControl(0),
    'has_whatsapp' : new FormControl(0),
    'has_chatbot' : new FormControl(0),
    'has_fb' : new FormControl(0),
    'has_wechat' : new FormControl(0),
    'has_telegram' : new FormControl(0),
    'has_internal_ticket' : new FormControl(0),
    'has_external_ticket' : new FormControl(0),
    'wallboard_one' : new FormControl(0),
        'wallboard_two' : new FormControl(0),
        'wallboard_three' : new FormControl(0),
        'wallboard_four' : new FormControl(0),
    'status' : new FormControl(0),
   });
   this.agentsList({});
  }

editAgentForm(id){
  this.editAgent.reset();
    let api_req:any = new Object();
    let get_agent_req:any = new Object();
    get_agent_req.user_id=id.value;
    get_agent_req.action='get_agent_data';
    api_req.operation="agents";
    api_req.moduleType="agents";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = get_agent_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
               
               var agent_data = response.result.data;
                 this.editAgent.setValue({
                    'user_name' : agent_data.user_name,
                    'email_id' : agent_data.email_id,
                    'sip_login' : agent_data.sip_login,
                    'sip_username' : agent_data.sip_username,
                    'sip_password' :agent_data.sip_password,
                    'agent_name' : agent_data.agent_name,
                    'phone_number' : agent_data.phone_number,
                    'user_id' : agent_data.user_id,
                    'voice_3cx' : agent_data.voice_3cx,
                    'has_contact' : agent_data.has_contact,
                    'predective_dialer' : agent_data.predective_dialer,
                    'lead' : agent_data.lead,
                    'has_sms' : agent_data.has_sms,
                    'has_chat' : agent_data.has_chat,
                    'has_whatsapp' : agent_data.has_whatsapp,
                    'has_chatbot' : agent_data.has_chatbot,
                    'has_fb' : agent_data.has_fb,
                    'has_wechat' : agent_data.has_wechat,
                    'has_telegram' : agent_data.has_telegram,
                    'has_internal_ticket' : agent_data.has_internal_ticket,
                    'has_external_ticket' : agent_data.has_external_ticket,
                    'wallboard_one' : agent_data.wallboard_one,
                    'wallboard_two' : agent_data.wallboard_two,
                    'wallboard_three' : agent_data.wallboard_three,
                   'wallboard_four' : agent_data.wallboard_four,
                 'status' : 1,
   
                });
                this.a_pass = agent_data.password;
               
                $('#edit_agents_form').modal('show');
            }
        else{
            
                iziToast.warning({
                    message: "Agent data could not retrive. Please try again",
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

  addAgentData(){


if(this.addAgent.value.user_name == '' || this.addAgent.value.user_name=='null' ){
    iziToast.warning({
        message: "Agent not added. Please try again",
        position: 'topRight'
    });
}



    let api_req:any = new Object();
    let add_agent_req:any = new Object();
    add_agent_req.admin_id=localStorage.getItem('admin_id');
    add_agent_req.agent_name=this.addAgent.value.agent_name;
    add_agent_req.email_id=this.addAgent.value.emailid;
    add_agent_req.phone_number=this.addAgent.value.phone_number;
    add_agent_req.user_name=this.addAgent.value.user_name;
    add_agent_req.user_pwd=this.addAgent.value.user_pwd;
    add_agent_req.sip_login=this.addAgent.value.sip_login;
    add_agent_req.sip_password=this.addAgent.value.sip_password;
    add_agent_req.sip_username=this.addAgent.value.sip_username;
    add_agent_req.voice_3cx=this.addAgent.value.voice_3cx;
    add_agent_req.predective_dialer=this.addAgent.value.predective_dialer;
    add_agent_req.has_contact=this.addAgent.value.has_contact;
    add_agent_req.has_sms=this.addAgent.value.has_sms;
    add_agent_req.has_whatsapp=this.addAgent.value.has_whatsapp;
    add_agent_req.has_chatbot=this.addAgent.value.has_chatbot;
    add_agent_req.has_fb=this.addAgent.value.has_fb;
    add_agent_req.has_wechat=this.addAgent.value.has_wechat;
    add_agent_req.has_telegram=this.addAgent.value.has_telegram;
    add_agent_req.has_internal_ticket=this.addAgent.value.has_internal_ticket;
    add_agent_req.has_external_ticket=this.addAgent.value.has_external_ticket;
    add_agent_req.wallboard_one=this.addAgent.value.wallboard_one;
    add_agent_req.wallboard_two=this.addAgent.value.wallboard_two;
    add_agent_req.wallboard_three=this.addAgent.value.wallboard_three;
    add_agent_req.wallboard_four=this.addAgent.value.wallboard_four;
    add_agent_req.two_factor=this.addAgent.value.two_factor;
    add_agent_req.admin_permision=this.addAgent.value.admin_permision;

    add_agent_req.status=this.addAgent.value.status;
    add_agent_req.action='add_agent';
    api_req.operation="agents";
    api_req.moduleType="agents";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = add_agent_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
            if (response.result.status == 1) {
                $('#add_agents_form').modal('hide');
                this.addAgent.reset();
                iziToast.success({
                    message: "Agent - "+response.result.data.agent_name+" added successfully",
                    position: 'topRight'
                });
                $('#add_agents_form').modal('hide');
                $('#agentsList').click();
            } 
        else{
            
                iziToast.warning({
                    message: "Agent not added. Please try again",
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



    editAgentData(){

    let api_req:any = new Object();
    let agent_req:any = this.editAgent.value;
    agent_req.action='update_agent';
    api_req.operation="agents";
    api_req.moduleType="agents";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = agent_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
                $('#edit_agents_form').modal('hide');
                this.editAgent.reset();
                iziToast.success({
                    message: "Agent - "+agent_req.agent_name+" updated successfully",
                    position: 'topRight'
                });
                $('#agentsList').click();
            }
        else{
            
                iziToast.warning({
                    message: "Agent data not updated. Please try again",
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
//   listDataInfo(list_data){

//     list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
//     list_data.order_by_name = list_data.order_by_name == undefined ? "user.user_id" : list_data.order_by_name;
//     list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
//     list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
//     list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
//     return list_data;
//   }
//   agentsList(data){
//     var list_data= this.listDataInfo(data);
//     let api_req:any = new Object();
//     let agents_req:any = new Object();
//     agents_req.action="user_list";
//     agents_req.user_id=localStorage.getItem('userId');
//     agents_req.search_text=list_data.search_text;
//     agents_req.order_by_name=list_data.order_by_name;
//     agents_req.order_by_type=list_data.order_by_type;
//     agents_req.limit=list_data.limit;
//     agents_req.offset=list_data.offset;
//     api_req.operation="agents";
//     api_req.moduleType="agents";
//     api_req.api_type="web";
//     api_req.access_token=localStorage.getItem('access_token');
//     api_req.element_data = agents_req;

//       this.serverService.sendServer(api_req).subscribe((response:any) => {
    
//         if(response.result.status==1){
    
//             this.agents_list=response.result.data.list_data;
//             this.offset_count = list_data.offset;
//             this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
//             this.recordNotFound = this.agents_list.length == 0 ? true : false;
//         }
        

//     }, 
//     (error)=>{
//         console.log(error);
//     });

// }


agentsList(data){

  let api_req:any = new Object();
  let agents_req:any = new Object();
  agents_req.action="user_list";
  agents_req.user_id=localStorage.getItem('userId');

  api_req.operation="agents";
  api_req.moduleType="agents";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = agents_req;
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
    
        if(response.result.status==1){
            
            if(response.result.data.user_permission.has_contact == '0'){
              this.h_con = 'diabled';
          }
  
          if(response.result.data.user_permission.has_fb == '0'){
       
            this.h_fb = 'disabled';
        }
          if(response.result.data.user_permission.has_sms == '0'){
            this.h_sms = 'disabled';
          }
          if(response.result.data.user_permission.has_chat == '0'){
            this.h_chat = 'disabled';
          }
          if(response.result.data.user_permission.has_whatsapp == '0'){
            this.h_wp = 'disabled';
          }
          if(response.result.data.user_permission.has_wechat == '0'){
            this.has_wechat = 'disabled';
          }
          if(response.result.data.user_permission.has_telegram == '0'){
            this.has_telegram = 'disabled';
          }
          if(response.result.data.user_permission.has_chatbot == '0'){
            this.h_cbot = 'disabled';
          }
          if(response.result.data.user_permission.has_external_ticket == '0'){
            this.e_tic = 'disabled';
          }
          if(response.result.data.user_permission.has_internal_ticket == '0'){
            this.i_tick = 'disabled';
          }
          if(response.result.data.user_permission.voice_3cx == '0'){
            this.voice_3cx = 'disabled';
          }
          if(response.result.data.user_permission.predective_dialer == '0'){
            this.H_PD = 'disabled';
          }
          if(response.result.data.user_permission.lead == '0'){
            this.lead = 'disabled';
          }
          if(response.result.data.user_permission.wallboard_one == '0'){
            this.wall_1 = 'disabled';
          }
          if(response.result.data.user_permission.wallboard_two == '0'){
            this.wall_2 = 'disabled';
          }
          if(response.result.data.user_permission.wallboard_three == '0'){
            this.wall_3 = 'disabled';
          }
          if(response.result.data.user_permission.wallboard_four == '0'){
            this.wall_4 = 'disabled';
          }
          if(response.result.data.user_permission.two_factor == '0'){
            this.h_2fa = 'disabled';
          } 
  
        }
        
  
    }, 
    (error)=>{
        console.log(error);
    });
  
  }
 

}
