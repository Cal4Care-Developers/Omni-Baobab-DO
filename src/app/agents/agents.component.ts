import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
declare var $:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
agents_list; 
  recordNotFound = false;
  pageLimit = 5;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  agent_count;
  hideAddButt = true;
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
  constructor(private serverService: ServerService) { }

  ngOnInit() {
     
      this.pbc_details();
  }
    
pbc_details(){
  let access_token: any=localStorage.getItem('access_token');
  let uadmin_id: any=localStorage.getItem('userId');

  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_pbx_details","user_id":"'+uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      this.agent_count = response.result.data[0].agent_counts;
      this.agentsList({});
    } 
  }, 
  (error)=>{
      console.log(error);
  });
}
listDataInfo(list_data){

  list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
  list_data.order_by_name = list_data.order_by_name == undefined ? "user.user_id" : list_data.order_by_name;
  list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
  list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
  list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
  return list_data;
}  

agentsList(data){
  var list_data= this.listDataInfo(data);
let api_req:any = new Object();
let agents_req:any = new Object();
agents_req.action="user_list";
agents_req.user_id=localStorage.getItem('userId');
  agents_req.search_text=list_data.search_text;
  agents_req.order_by_name=list_data.order_by_name;
  agents_req.order_by_type=list_data.order_by_type;
  agents_req.limit=list_data.limit;
  agents_req.offset=list_data.offset;
api_req.operation="agents";
api_req.moduleType="agents";
api_req.api_type="web";
api_req.access_token=localStorage.getItem('access_token');
api_req.element_data = agents_req;

  this.serverService.sendServer(api_req).subscribe((response:any) => {
  
      if(response.result.status==1){
  
        this.agents_list=response.result.data.list_data;
          this.offset_count = list_data.offset;
          this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
          this.recordNotFound = this.agents_list.length == 0 ? true : false;




         
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
        



          if( this.agents_list.length == this.agent_count.length){
            
            this.hideAddButt = false;
          }



      }
      

  }, 
  (error)=>{
      console.log(error);
  });

}
  addAgent(){

      $('#add_agents_form').modal('show');
  }
  editAgent(id){
    $('#edit_agents_key').val(id);
    $('#edit_agents_button').click();
  }


  actCamp(to_per,id){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"change_agent_permission","keyword":"'+to_per+'","user_id":"'+id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data == 1){
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
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        let access_token: any=localStorage.getItem('access_token');
        let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_agent","user_id":"'+id+'","admin_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.agentsList({});
    }

  }, 
  (error)=>{
      console.log(error);
  });
      }
    })
  }



}
