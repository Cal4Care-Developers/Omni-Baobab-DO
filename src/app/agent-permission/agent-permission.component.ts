import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-agent-permission',
  templateUrl: './agent-permission.component.html',
  styleUrls: ['./agent-permission.component.css']
})
export class AgentPermissionComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addAadmin: FormGroup;
  editAdmin: FormGroup;
  old_sip_url;
  admins;
  admin_id;
  has_contacts;
  admin_statuss;
  agents_list; 
  pageLimit = 5;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  agent_count;
  has_smss;
  has_chats;
  has_whatsapps;
  has_chatbots;
  selected = 1;
  device_type = [{'status':'1'},{'status':'0'}]
  constructor(private serverService: ServerService) { }

  ngOnInit() {
     this.agentsList({});
  }
  // admin_settings(){
  //   let access_token: any=localStorage.getItem('access_token');
  //   let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"get_admin_settings"}}';
  
  //   this.serverService.sendServer(api_req).subscribe((response:any) => {
  //     if(response.result.status==true){
  //       this.admins= response.result.data;
  //     } else {
  //       this.recordNotFound = true;
  //     }
  //   }, 
  //   (error)=>{
  //       console.log(error);
  //   });
  // }


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
    
          this.admins=response.result.data.list_data;
            this.offset_count = list_data.offset;
            this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
            this.recordNotFound = this.agents_list.length == 0 ? true : false;
        }
        

    }, 
    (error)=>{
        console.log(error);
    });

}














  addadmin(){
    $('#add_adminform').modal('show');
  }


    actCamp(to_per,id){
      let agent_req:any = this.addAadmin.value;
      let access_token: any=localStorage.getItem('access_token');
      let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"change_agent_permission","keyword":"'+to_per+'","id":"'+id+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.data == 1){
       }
      }, 
      (error)=>{
          console.log(error);
      });
    }  
    
}



