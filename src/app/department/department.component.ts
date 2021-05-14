import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
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
  doc_link;

  constructor(private serverService: ServerService) { }


  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
    this.addDept = new FormGroup({
     'department_name' : new FormControl(null,Validators.required),
     'status' : new FormControl(null)
    });
 
     this.editDept = new FormGroup({
      'department_name' : new FormControl(null,Validators.required),
      'status' : new FormControl(null)
    });
    this.dept_settings();
    this.user_lists();
   }

dept_settings(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
     
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
      let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"user_list","user_id":"'+this.uadmin_id+'","search_text":"","order_by_name":"user.user_id","order_by_type":"desc","limit":100,"offset":0}}';

  	                this.serverService.sendServer(api_req).subscribe((response:any) => {
                    
                        if(response.result.status==1){
                    
                        	this.agents_list=response.result.data.list_data;
                          
                        }
                        

                    }, 
                    (error)=>{
                        console.log(error);
                    });

}



editDepartmentSettings(id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_department","dept_id":"'+id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      var agent_data = response.result.data;
      this.editDept.setValue({
         'department_name' : agent_data.department_name,
         'status' : agent_data.status,
     });
     this.dep_id = response.result.data.dept_id;


     

     this.userchecked = agent_data.department_users.split(",");
     console.log(this.userchecked)
     if(agent_data.status == 1){
      $('#status').prop('checked', true);
     } else {
      $('#status').prop('checked', false);
     }

     $('#edit_deptform').modal('show');
     this.dept_settings();
    }   else{
            
      iziToast.warning({
          message: "Department count not retrive. Please try again",
          position: 'topRight'
      });
  
}
  }, 
  (error)=>{
      console.log(error);
  });
}

addDepartment(){
  $('#add_deptform').modal('show');
}


editDepartment(id){
  var department_userss = $('.ads_Checkbox:checked').map(function(){
    return this.value;
}).get();
var department_users = department_userss.join();
console.log(department_users);
  let agent_req:any = this.editDept.value;
  let access_token: any=localStorage.getItem('access_token');
  if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
  let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_department","department_name":"'+agent_req.department_name+'","department_users":"'+department_users+'","status":"'+this.dep_status +'","dept_id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
              $('#edit_deptform').modal('hide');
              this.dept_settings();
              iziToast.success({
                  message: "Department updated successfully",
                  position: 'topRight'
              });
          } else {
          
              iziToast.warning({
                  message: "Department not updated. Please try again",
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
var department_users = $('.add_Checkbox:checked').map(function(){
    return this.value;
}).get();

var department_users = department_users.join();

let agent_req:any = this.addDept.value;
if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_department","department_name":"'+agent_req.department_name+'","department_users":"'+department_users+'","status":"'+this.dep_status +'","admin_id":"'+this.uadmin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#add_deptform').modal('hide');
                iziToast.success({
                    message: "Department added successfully",
                    position: 'topRight'
                });
                this.dept_settings();
            }
            else if (response.result.data == 2) {
              iziToast.warning({
                  message: "Department name already inserted",
                  position: 'topRight'
              });
          }
        else{
            
                iziToast.error({
                    message: "Department not added. Please try again",
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
  let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_department","department_id":"'+id+'","admin_id":"'+admin_id+'"}}';

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
    this.doc_link=link;
   $("#document_model").modal('show');   
  }

}
