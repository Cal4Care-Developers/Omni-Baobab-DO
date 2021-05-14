import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-agent-groups',
  templateUrl: './agent-groups.component.html',
  styleUrls: ['./agent-groups.component.css']
})
export class AgentGroupsComponent implements OnInit {

  constructor(private serverService: ServerService) { }
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  editDept: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  agents_list;
  userchecked=0;
  pageLimit = 25;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  agent_count;
  hide_admin_sett = true;
  user_type; 
  doc_link;
  ngOnInit(): void {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.addDept = new FormGroup({
     'group_name' : new FormControl(null,Validators.required)
    });
    this.user_type = localStorage.getItem('user_type');
    if(this.user_type == 'Employee'){
      this.hide_admin_sett = false;
    }
     this.editDept = new FormGroup({
      'group_name' : new FormControl(null,Validators.required)    });
    this.dept_settings();
    this.contactsList({});
  }

  dept_settings(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"view_agent_group","admin_id":"'+this.uadmin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
       
        this.queue_list = response.result.data;
        console.log(this.queue_list);
      } else {
        this.recordNotFound = true;
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  contactsList(data){
    var list_data= this.listDataInfo(data);
    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="user_list";
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.admin_id=localStorage.getItem('admin_id');
   // alert(agents_req.admin_id);
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


closeLoading(){
Swal.close();
}


addGroup(){
  $('#add_deptform').modal('show');
}

 
editGroup(id){
  
  var group_userss = $('.ads_Checkbox:checked').map(function(){
    return this.value;
}).get();
var group_users = group_userss.join();
// alert(group_users);
  let agent_req:any = this.editDept.value;
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_agent_group","group_name":"'+agent_req.group_name+'","agents":"'+group_users+'","id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
              $('#edit_deptform').modal('hide');
 this.editDept.reset();

              this.dept_settings();
              iziToast.success({
                  message: "Group updated successfully",
                  position: 'topRight'
              });
          } else {
          
              iziToast.warning({
                  message: "Group not updated. Please try again",
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



addDeptData(){
var group_users = $('.add_Checkbox:checked').map(function(){
    return this.value;
}).get();

var group_users = group_users.join();

let agent_req:any = this.addDept.value;
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"agent_group","group_name":"'+agent_req.group_name+'","agents":"'+group_users+'","admin_id":"'+this.uadmin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#add_deptform').modal('hide');
                iziToast.success({
                    message: "Group added successfully",
                    position: 'topRight'
                });
                this.dept_settings();
            }
            else if (response.result.data == 2) {
              iziToast.warning({
                  message: "Group name already inserted",
                  position: 'topRight'
              });
          }
        else{
            
                iziToast.error({
                    message: "Group not added. Please try again",
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
  

editGroupSettings(id){
 // alert(id);
//  return false;
// $('.add_Checkbox:checked').prop('checked',false);
$('.add_Checkbox').prop('checked', false); // Unchecks it
  let access_token: any=localStorage.getItem('access_token');
  let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"ed_agent_group","id":"'+id+'","admin_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    // alert(response);
    if(response.status == true){
      var agent_data = response.result.data[0];
      this.editDept.setValue({
         'group_name' : agent_data.group_name
     });
     this.dep_id = agent_data.id;

     this.userchecked = agent_data.agents.split(",");
  // alert(this.userchecked);
  // this.editDept.reset();
  // $('.add_Checkbox:checked').prop('checked', false); 
     $('#edit_deptform').modal('show');
    }   else{
            
      iziToast.warning({
          message: "Group count not retrive. Please try again",
          position: 'topRight'
      });
  
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
  let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"del_agent_group","id":"'+id+'","admin_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.dept_settings();
    }

  }, 
  (error)=>{
      console.log(error);
  });
      }
    })
  }


  showdoc(link){   
  var url= link.split('/');
  this.doc_link="https://www.youtube.com/embed/"+url[3];
  $("#video_play").modal('show');
 }stop(){
  var el_src = $('.myvideo').attr("src");
        $('.myvideo').attr("src",el_src);
  }

}
