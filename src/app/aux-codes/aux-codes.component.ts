import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-aux-codes',
  templateUrl: './aux-codes.component.html',
  styleUrls: ['./aux-codes.component.css']
})
export class AuxCodesComponent implements OnInit {
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
    });
 
     this.editDept = new FormGroup({
      'department_name' : new FormControl(null,Validators.required),
    });
    this.dept_settings();
   }

dept_settings(){
  let access_token: any=localStorage.getItem('access_token');
  let admini: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"auxcode", "moduleType":"auxcode", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_auxcode","admin_id":"'+admini+'"}}';

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






editDepartmentSettings(id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"auxcode", "moduleType": "auxcode", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_auxcode","auxcode_id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      var agent_data = response.result.data;
      this.editDept.setValue({
         'department_name' : agent_data.auxcode_name,
     });
     this.dep_id = response.result.data.id;

 

     $('#edit_deptform').modal('show');
     this.dept_settings();
    }   else{
            
      iziToast.warning({
          message: "Auxcode not retrive. Please try again",
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


  let agent_req:any = this.editDept.value;
  let access_token: any=localStorage.getItem('access_token');
  if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
  let api_req:any = '{"operation":"auxcode", "moduleType": "auxcode", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_auxcode","auxcode_name":"'+agent_req.department_name+'","auxcode_id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
              $('#edit_deptform').modal('hide');
              this.dept_settings();
              iziToast.success({
                  message: "Aux Code successfully",
                  position: 'topRight'
              });
          } else {
          
              iziToast.warning({
                  message: "Aux Code not updated. Please try again",
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


let agent_req:any = this.addDept.value;
if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"auxcode", "moduleType": "auxcode", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_auxcode","auxcode_name":"'+agent_req.department_name+'","status":"'+this.dep_status +'","admin_id":"'+this.uadmin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#add_deptform').modal('hide');
                iziToast.success({
                    message: "AUX Code added successfully",
                    position: 'topRight'
                });
                this.dept_settings();
            }
            else if (response.result.data == 2) {
              iziToast.warning({
                  message: "AUX Code name already inserted",
                  position: 'topRight'
              });
          }
        else{
            
                iziToast.error({
                    message: "AUX Code not added. Please try again",
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
  let api_req:any = '{"operation":"auxcode", "moduleType": "auxcode", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_aux","id":"'+id+'","admin_id":"'+admin_id+'"}}';

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

