import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-email-groups',
  templateUrl: './email-groups.component.html',
  styleUrls: ['./email-groups.component.css']
})
export class EmailGroupsComponent implements OnInit {
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
  userchecked;
  pageLimit = 25;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  agent_count;
  hide_admin_sett = true;
  user_type;
  constructor(private serverService: ServerService) { }


  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.addDept = new FormGroup({
     'group_name' : new FormControl(null,Validators.required)
    });
    this.user_type = localStorage.getItem('user_type');
    if(this.user_type == 'Employee'){
      this.hide_admin_sett = false;
    }
     this.editDept = new FormGroup({
      'group_name' : new FormControl(null,Validators.required)
    });
    this.dept_settings();
    this.contactsList({});


   }

dept_settings(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"email_blasting", "moduleType":"email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_emailgroup","admin_id":"'+this.uadmin_id+'"}}';


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


user_lists(){

      let access_token: any=localStorage.getItem('access_token');
      let admin_id: any = localStorage.getItem('admin_id');
      let api_req:any = '{"operation":"email_blasting", "moduleType":"email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_user_list","admin_id":"'+admin_id+'"}}';

  	                this.serverService.sendServer(api_req).subscribe((response:any) => {
                    
                        if(response.result.status==1){
                    
                        	this.agents_list=response.result.data.list_data;
                          
                        }
                        

                    }, 
                    (error)=>{
                        console.log(error);
                    });

}



editGroupSettings(id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"email_blasting", "moduleType": "email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_emailgroup","id":"'+id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      var agent_data = response.result.data[0];
      this.editDept.setValue({
         'group_name' : agent_data.group_name
     });
     this.dep_id = agent_data.id;

     this.userchecked = agent_data.group_users.split(",");
     console.log(this.userchecked)


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

addGroup(){
  $('#add_deptform').modal('show');
}


editGroup(id){
  
  var group_userss = $('.ads_Checkbox:checked').map(function(){
    return this.value;
}).get();
var group_users = group_userss.join();
  let agent_req:any = this.editDept.value;
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"email_blasting", "moduleType": "email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_emailgroup","group_name":"'+agent_req.group_name+'","group_users":"'+group_users+'","id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
              $('#edit_deptform').modal('hide');
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
   let api_req:any = '{"operation":"email_blasting", "moduleType": "email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_email_group","group_name":"'+agent_req.group_name+'","group_users":"'+group_users+'","admin_id":"'+this.uadmin_id+'"}}';
  
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
  let api_req:any = '{"operation":"email_blasting", "moduleType": "email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_emailgroup","id":"'+id+'","admin_id":"'+admin_id+'"}}';

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










  listDataInfo(list_data){

    list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
    list_data.order_by_name = list_data.order_by_name == undefined ? "contact.contact_id" : list_data.order_by_name;
    list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
    list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
    list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
    return list_data;
  }



  contactsList(data){
    var list_data= this.listDataInfo(data);
    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="contact_list";
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.search_text=list_data.search_text;
    agents_req.order_by_name=list_data.order_by_name;
    agents_req.order_by_type=list_data.order_by_type;
    agents_req.limit=list_data.limit;
    agents_req.offset=list_data.offset;
    api_req.operation="contact";
    api_req.moduleType="contact";
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
}


